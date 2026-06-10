'use client';

import {
  ListPage ,
  pokemonBffService ,
  TPokemonAbility ,
  TPokemonAbilityFilters ,
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
import { MdAutoAwesome } from 'react-icons/md';

const INITIAL_FILTERS: TPokemonAbilityFilters = {
  name: undefined ,
  order: undefined ,
};

const normalizeFilters = (filters: TPokemonAbilityFilters): TPokemonAbilityFilters => ({
  name: filters.name?.trim() || undefined ,
  order: filters.order?.trim() || undefined ,
});

export default function AbilityPage() {
  const { t } = useAppTranslation();
  const { showAlert } = useAlert();
  const initialInputFilters = useMemo<FiltersProps['filters']>(() => [
    {
      name: 'name' ,
      label: t('filters.name') ,
      type: 'text' ,
      value: '' ,
      placeholder: 'Blaze',
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
  } = usePaginatedList<TPokemonAbility ,TPokemonAbilityFilters>({
    fetchList: pokemonBffService.ability.fetchAll ,
    initialFilters: INITIAL_FILTERS ,
    initialInputFilters ,
    fetchErrorMessage: t('pokemon.ability.list.loadError') ,
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
      domain="pokemon.ability"
      goToPage={goToPage}
      isLoading={isLoading}
      totalItems={items?.length}
      inputFilters={inputFilters}
      clearInputFilters={clearInputFilters}
      applyInputFilters={applyInputFilters}>
      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        { items.map((ability) => (
          <Link key={ ability.id } href={ `/catalog/ability/${ability.name}` } className="block focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Card
              variant="elevated"
              rounded="lg"
              hoverEffect="lift"
              interactive
              className="flex h-full min-h-72 flex-col gap-4 border-slate-200 bg-white"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                <MdAutoAwesome size={30} />
              </div>
              <div className="flex flex-1 flex-col gap-3">
                <div className="min-w-0">
                  <Text as="h2" className="truncate text-xl font-semibold capitalize text-slate-950">
                    {ability.name}
                  </Text>
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  <Text className="line-clamp-3 text-sm text-slate-700">
                    {ability.short_effect || ability.effect || ability.flavor_text || t('pokemon.ability.list.effectPending')}
                  </Text>
                  {ability.flavor_text ? (
                    <Text className="line-clamp-2 text-xs italic text-slate-500">
                      {ability.flavor_text}
                    </Text>
                  ) : null}
                </div>
                <div className="mt-auto">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={ability.is_hidden ? 'warning' : 'info'} variant="soft">
                      {ability.is_hidden ? t('pokemon.ability.list.hidden') : t('pokemon.ability.list.standard')}
                    </Badge>
                    <Badge tone="neutral" variant="soft">{t('pokemon.ability.list.slot', { value: ability.slot })}</Badge>
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