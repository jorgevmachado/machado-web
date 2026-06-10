'use client';
import { useEffect ,useMemo } from 'react';

import { useAppTranslation } from '@/app/i18n';
import {
  FiltersProps ,
  useAlert ,
} from '@/app/ds';
import {
  pokemonBffService ,
  PokemonCard ,
  TPokemon ,
  TPokemonFilters ,
  ListPage
} from '@/app/ui';
import usePaginatedList from '@/app/ui/hooks/list';

const INITIAL_FILTERS: TPokemonFilters = {
  type: undefined ,
  name: undefined ,
  order: undefined ,
  status: undefined ,
};

const normalizeFilters = (filters: TPokemonFilters): TPokemonFilters => ({
  name: filters.name?.trim() || undefined ,
  order: filters.order?.trim() || undefined ,
  status: filters.status?.trim() || undefined ,
  type: filters.type?.trim() || undefined ,
});

export default function PokemonPage() {
  const { t } = useAppTranslation();
  const { showAlert } = useAlert();
  const initialInputFilters = useMemo<FiltersProps['filters']>(() => [
    {
      name: 'name' ,
      label: t('filters.name') ,
      type: 'text' ,
      value: '' ,
      placeholder: 'Pikachu',
    } ,
    {
      name: 'order' ,
      label: t('filters.order') ,
      type: 'text' ,
      value: '' ,
      placeholder: '25',
    } ,
    {
      name: 'type' ,
      label: t('filters.type') ,
      type: 'text' ,
      value: '' ,
      placeholder: 'electric',
    } ,
    {
      name: 'status' ,
      label: t('filters.status') ,
      type: 'text' ,
      value: '' ,
      placeholder: 'COMPLETE',
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
  } = usePaginatedList<TPokemon ,TPokemonFilters>({
    fetchList: pokemonBffService.fetchAll ,
    initialFilters: INITIAL_FILTERS ,
    initialInputFilters ,
    fetchErrorMessage: t('catalog.list.loadError') ,
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
      domain="catalog"
      goToPage={goToPage}
      isLoading={isLoading}
      totalItems={items?.length}
      inputFilters={inputFilters}
      clearInputFilters={clearInputFilters}
      applyInputFilters={applyInputFilters}
    >
      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        { items.map((pokemon) => (
          <PokemonCard key={ pokemon.id } href="catalog" pokemon={ pokemon }/>
        )) }
      </section>
    </ListPage>
  );
}