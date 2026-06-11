'use client';

import {
  ListPage ,
  pokemonBffService ,
  TPokemonEncounter ,
  TPokemonEncounterFilters ,
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

import { GiPositionMarker } from 'react-icons/gi';
import { normalizedName } from '@/app/utils';

const INITIAL_FILTERS: TPokemonEncounterFilters = {
  name: undefined ,
};

const normalizeFilters = (filters: TPokemonEncounterFilters): TPokemonEncounterFilters => ({
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
      placeholder: 'Pallet',
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
  } = usePaginatedList<TPokemonEncounter ,TPokemonEncounterFilters>({
    fetchList: pokemonBffService.encounter.fetchAll ,
    initialFilters: INITIAL_FILTERS ,
    initialInputFilters ,
    fetchErrorMessage: t('pokemon.encounter.list.loadError') ,
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
      domain="pokemon.encounter"
      goToPage={goToPage}
      isLoading={isLoading}
      totalItems={items?.length}
      inputFilters={inputFilters}
      clearInputFilters={clearInputFilters}
      applyInputFilters={applyInputFilters}>
      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        { items.map((encounter) => (
          <Link key={ encounter.id } href={ `/catalog/encounter/${encounter.name}` } className="block focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Card
              variant="elevated"
              rounded="lg"
              hoverEffect="lift"
              interactive
              className="flex h-full min-h-72 flex-col gap-4 border-slate-200 bg-white"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                <GiPositionMarker size={30} />
              </div>
              <div className="flex flex-1 flex-col gap-3">
                <div className="min-w-0">
                  <Text as="h2" className="truncate text-xl font-semibold capitalize text-slate-950">
                    {encounter.name}
                  </Text>
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  <Text className="line-clamp-3 text-sm text-slate-700" data-testid="pokemon-encounter-list-method">
                    {t('pokemon.encounter.methodValue', {
                      value: encounter.method ? normalizedName(encounter.method) : t('pokemon.encounter.pending'),
                    })}
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