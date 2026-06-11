'use client';
import { useDetail } from '@/app/ui/hooks/detail';
import { TPokedexEntry , PokemonDetail, trainerBffService } from '@/app/ui';
import { usePathname } from 'next/navigation';
import { buildDetailUrl } from '@/app/utils';

export default function OwnedPokemonDetailPage() {
  const pathname = usePathname();

  const identifier = buildDetailUrl(pathname);

  const { data ,isLoading ,errorMessage } = useDetail<TPokedexEntry>({
    identifier ,
    fetchDetail: trainerBffService.pokedex.fetchOne<TPokedexEntry>
  });

  return (
    <PokemonDetail
      hide={!data?.discovered}
      origin="pokedex"
      pokemon={ data?.pokemon }
      isLoading={ isLoading }
      errorMessage={ errorMessage }
      errorHideMessage="trainer.pokedex.notDiscovered"
      progressionAttributes={!data ? undefined :{
        hp: data?.hp,
        level: data.level,
        speed: data.speed,
        max_hp: data.max_hp,
        attack: data.attack,
        defense: data.defense,
        experience: data.experience,
        special_attack: data.special_attack,
        special_defense: data.special_defense
      }}
    />
  );
}
