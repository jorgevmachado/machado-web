'use client';
import { useDetail } from '@/app/ui/hooks/detail';
import { TOwnedPokemon , PokemonDetail, trainerBffService } from '@/app/ui';
import { usePathname } from 'next/navigation';

function buildDetailUrl(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  return segments[segments.length - 1];
}

export default function OwnedPokemonDetailPage() {
  const pathname = usePathname();

  const identifier = buildDetailUrl(pathname);

  const { data ,isLoading ,errorMessage } = useDetail<TOwnedPokemon>(
    { identifier ,fetchDetail: trainerBffService.ownedPokemon.fetchOne });

  return (
    <PokemonDetail
      origin="pokemon"
      pokemon={ data?.pokemon }
      isLoading={ isLoading }
      errorMessage={ errorMessage }
      ownedPokemonMove={ data?.moves }
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
