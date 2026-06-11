'use client';
import {
  ListPage ,PokemonCard ,
  TPokedexEntry ,
  TPokedexEntryFilters ,
  trainerBffService ,
} from '@/app/ui';
import { useAppTranslation } from '@/app/i18n';
import { FiltersProps ,useAlert } from '@/app/ds';
import { useEffect ,useMemo } from 'react';
import usePaginatedList from '@/app/ui/hooks/list';

const INITIAL_FILTERS: TPokedexEntryFilters = {
  nickname: undefined,
  discovered: undefined,
  pokemon_name: undefined,
};

const normalizeFilters = (filters: TPokedexEntryFilters): TPokedexEntryFilters => ({
  nickname: filters.nickname?.trim() || undefined ,
  discovered: filters.discovered?.trim()?.toLowerCase() || undefined ,
  pokemon_name: filters.pokemon_name?.trim() || undefined ,
});

export default function PokedexPage() {
  const { t } = useAppTranslation();
  const { showAlert } = useAlert();
  const initialInputFilters = useMemo<FiltersProps['filters']>(() => [
    {
      name: 'nickname' ,
      label: t('filters.nickname') ,
      type: 'text' ,
      value: '' ,
      placeholder: 'Catchau' ,
    } ,
    {
      name: 'pokemon_name' ,
      label: t('filters.name') ,
      type: 'text' ,
      value: '' ,
      placeholder: 'Pikachu' ,
    } ,
    {
      name: 'discovered' ,
      label: t('filters.discovered') ,
      type: 'text' ,
      value: '' ,
      placeholder: 'true / false' ,
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
  } = usePaginatedList<TPokedexEntry ,TPokedexEntryFilters>({
    fetchList: trainerBffService.pokedex.fetchAll<TPokedexEntry, TPokedexEntryFilters> ,
    initialFilters: INITIAL_FILTERS ,
    initialInputFilters ,
    fetchErrorMessage: t('trainer.pokedex.list.loadError') ,
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
      domain="trainer.pokedex"
      goToPage={goToPage}
      isLoading={isLoading}
      totalItems={items?.length}
      inputFilters={inputFilters}
      clearInputFilters={clearInputFilters}
      applyInputFilters={applyInputFilters}>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        { items.map((pokedex) => (
          <PokemonCard
            key={ pokedex.id }
            hide={!pokedex?.discovered}
            href="pokedex"
            pokemon={ pokedex.pokemon }
            progressionAttributes={{
              hp: pokedex.hp,
              level: pokedex.level,
              speed: pokedex.speed,
              max_hp: pokedex.max_hp,
              attack: pokedex.attack,
              defense: pokedex.defense,
              experience: pokedex.experience,
              special_attack: pokedex.special_attack,
              special_defense: pokedex.special_defense,
            }}/>
        )) }
      </section>
    </ListPage>
  );
}