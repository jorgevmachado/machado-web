'use client';

import {
  ListPage ,
  pokemonBffService ,
  TPokemonGrowthRate ,
  TPokemonGrowthRateFilters ,
} from '@/app/ui';
import { useAppTranslation } from '@/app/i18n';
import {
  Card ,
  FiltersProps ,
  Text ,
  useAlert ,
} from '@/app/ds';
import { useEffect ,useMemo } from 'react';
import usePaginatedList from '@/app/ui/hooks/list';
import Link from 'next/link';

import { GiStumpRegrowth } from 'react-icons/gi';

const INITIAL_FILTERS: TPokemonGrowthRateFilters = {
  name: undefined ,
};

const normalizeFilters = (filters: TPokemonGrowthRateFilters): TPokemonGrowthRateFilters => ({
  name: filters.name?.trim() || undefined ,
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
      placeholder: 'Mega Punch',
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
  } = usePaginatedList<TPokemonGrowthRate ,TPokemonGrowthRateFilters>({
    fetchList: pokemonBffService.growthRate.fetchAll ,
    initialFilters: INITIAL_FILTERS ,
    initialInputFilters ,
    fetchErrorMessage: t('pokemon.growthRate.list.loadError') ,
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
      domain="pokemon.growthRate"
      goToPage={goToPage}
      isLoading={isLoading}
      totalItems={items?.length}
      inputFilters={inputFilters}
      clearInputFilters={clearInputFilters}
      applyInputFilters={applyInputFilters}>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        { items.map((growthRate) => (
          <Link key={ growthRate.id } href={ `/catalog/growth-rate/${growthRate.name}` } className="block focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Card
              variant="elevated"
              rounded="lg"
              hoverEffect="lift"
              interactive
              className="flex h-full min-h-72 flex-col gap-4 border-slate-200 bg-white"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-700">
                <GiStumpRegrowth size={30} />
              </div>
              <div className="flex flex-1 flex-col gap-3">
                <div className="min-w-0">
                  <Text as="h2" className="truncate text-xl font-semibold capitalize text-slate-950">
                    {growthRate.name}
                  </Text>
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  <Text className="line-clamp-3 text-sm text-slate-700">
                    {growthRate.formula || t('pokemon.growthRate.formulaPending')}
                  </Text>
                </div>

              </div>
            </Card>
          </Link>
        )) }
      </section>
    </ListPage>
  );
}