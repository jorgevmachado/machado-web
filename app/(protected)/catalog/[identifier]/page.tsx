'use client';
import { useDetail } from '@/app/ui/hooks/detail';
import { pokemonBffService ,TPokemon, PokemonDetail } from '@/app/ui';
import { usePathname } from 'next/navigation';
import { buildDetailUrl } from '@/app/utils';


export default function PokemonDetailPage() {
  const pathname = usePathname();

  const identifier = buildDetailUrl(pathname);

  const { data ,isLoading ,errorMessage } = useDetail<TPokemon>(
    { identifier ,fetchDetail: pokemonBffService.fetchOne });
  
  return <PokemonDetail pokemon={ data } isLoading={ isLoading } errorMessage={ errorMessage }/>;
}
