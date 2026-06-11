'use client';

import {
  ListPage ,
  pokemonBffService ,
  TPokemonMove ,
  TPokemonMoveFilters ,
} from '@/app/ui';
import { useAppTranslation } from '@/app/i18n';
import {
  Badge ,
  Card ,
  FiltersProps ,
  Text ,
  useAlert ,
} from '@/app/ds';
import { useEffect ,useMemo } from 'react';
import usePaginatedList from '@/app/ui/hooks/list';
import Link from 'next/link';

import { GiPunchBlast } from 'react-icons/gi';
import { formatValue } from '@/app/utils';

const INITIAL_FILTERS: TPokemonMoveFilters = {
  name: undefined ,
  order: undefined ,
};

const normalizeFilters = (filters: TPokemonMoveFilters): TPokemonMoveFilters => ({
  name: filters.name?.trim() || undefined ,
  order: filters.order?.trim() || undefined ,
});

export default function MovePage() {
  const { t } = useAppTranslation();
  const { showAlert } = useAlert();
  const initialInputFilters = useMemo<FiltersProps['filters']>(() => [
    {
      name: 'name' ,
      label: t('filters.name') ,
      type: 'text' ,
      value: '' ,
      placeholder: 'Cut',
    } ,
    {
      name: 'order' ,
      label: t('filters.order') ,
      type: 'text' ,
      value: '' ,
      placeholder: '25',
    } ,
  ] ,[t]);
  const {
    items ,
    meta ,
    isLoading ,
    errorMessage ,
    inputFilters ,
    goToPage ,
    applyInputFilters ,
    clearInputFilters ,
  } = usePaginatedList<TPokemonMove ,TPokemonMoveFilters>({
    fetchList: pokemonBffService.move.fetchAll ,
    initialFilters: INITIAL_FILTERS ,
    initialInputFilters ,
    fetchErrorMessage: t('pokemon.move.list.loadError') ,
    normalizeFilters ,
  });

  useEffect(() => {
    if (errorMessage) {
      showAlert({ type: 'error' ,message: errorMessage });
    }
  } ,[errorMessage ,showAlert]);
  return (
    <ListPage
      meta={meta}
      domain="pokemon.move"
      goToPage={goToPage}
      isLoading={isLoading}
      totalItems={items?.length}
      inputFilters={inputFilters}
      clearInputFilters={clearInputFilters}
      applyInputFilters={applyInputFilters}>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        { items.map((move) => (
          <Link key={ move.id } href={ `/catalog/move/${move.name}` } className="block focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Card
              variant="elevated"
              rounded="lg"
              hoverEffect="lift"
              interactive
              className="flex h-full min-h-72 flex-col gap-4 border-slate-200 bg-white"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-700">
                <GiPunchBlast size={30} />
              </div>
              <div className="flex flex-1 flex-col gap-3">
                <div className="min-w-0">
                  <Text as="h2" className="truncate text-xl font-semibold capitalize text-slate-950">
                    {move.name}
                  </Text>
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  <Text className="line-clamp-3 text-sm text-slate-700">
                    {move.short_effect || move.effect || t('pokemon.move.effectPending')}
                  </Text>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="info" variant="soft">{move.type}</Badge>
                    <Badge tone="warning" variant="soft">{move.damage_class}</Badge>
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="neutral" variant="soft">{t('pokemon.move.power', { value: formatValue(move.power) })}</Badge>
                    <Badge tone="neutral" variant="soft">{t('pokemon.move.accuracy', { value: formatValue(move.accuracy) })}</Badge>
                    <Badge tone="neutral" variant="soft">{t('pokemon.move.pp', { value: formatValue(move.pp) })}</Badge>
                    <span className="text-sm font-semibold text-blue-700">{t('common.viewMore')}</span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        )) }
      </section>
    </ListPage>
  );
}