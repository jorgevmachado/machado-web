'use client';
import { useEffect ,useMemo } from 'react';

import { useAppTranslation } from '@/app/i18n';
import {
  FiltersProps ,
  useAlert ,
} from '@/app/ds';
import {
  ListPage ,
  PokemonCard ,
  TOwnedPokemon ,
  TOwnedPokemonFilters ,
  trainerBffService ,
} from '@/app/ui';
import usePaginatedList from '@/app/ui/hooks/list';

const INITIAL_FILTERS: TOwnedPokemonFilters = {
  type: undefined ,
  order: undefined ,
  pokemon_name: undefined ,
};

const normalizeFilters = (filters: TOwnedPokemonFilters): TOwnedPokemonFilters => ({
  order: filters.order?.trim() || undefined ,
  type: filters.type?.trim() || undefined ,
  pokemon_name: filters.pokemon_name?.trim() || undefined ,
});

export default function PokemonPage() {
  const { t } = useAppTranslation();
  const { showAlert } = useAlert();
  const initialInputFilters = useMemo<FiltersProps['filters']>(() => [
    {
      name: 'pokemon_name' ,
      label: t('filters.name') ,
      type: 'text' ,
      value: '' ,
      placeholder: 'Pikachu' ,
    } ,
    {
      name: 'order' ,
      label: t('filters.order') ,
      type: 'text' ,
      value: '' ,
      placeholder: '25' ,
    } ,
    {
      name: 'type' ,
      label: t('filters.type') ,
      type: 'text' ,
      value: '' ,
      placeholder: 'electric' ,
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
  } = usePaginatedList<TOwnedPokemon ,TOwnedPokemonFilters>({
    fetchList: trainerBffService.ownedPokemon.fetchAll ,
    initialFilters: INITIAL_FILTERS ,
    initialInputFilters ,
    fetchErrorMessage: t('trainer.ownedPokemon.list.loadError') ,
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
      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        { items.map((ownedPokemon) => (
          <PokemonCard
            key={ ownedPokemon.id }
            pokemon={ ownedPokemon.pokemon }
            progressionAttributes={{
              hp: ownedPokemon.hp,
              level: ownedPokemon.level,
              speed: ownedPokemon.speed,
              max_hp: ownedPokemon.max_hp,
              attack: ownedPokemon.attack,
              defense: ownedPokemon.defense,
              experience: ownedPokemon.experience,
              special_attack: ownedPokemon.special_attack,
              special_defense: ownedPokemon.special_defense,
            }}/>
        )) }
      </section>
    </ListPage>
  );
}