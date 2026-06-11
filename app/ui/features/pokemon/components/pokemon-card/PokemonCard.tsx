import { TPokemon ,TProgressionAttributes ,TypesBadge } from '@/app/ui';
import Link from 'next/link';
import { Card ,Image } from '@/app/ds';
import PokemonCardHeader from './pokemon-card-header';
import PokemonStats
  from '@/app/ui/features/pokemon/components/pokemon-stats/PokemonStats';
import { useMemo } from 'react';

type PokemonCardProps = {
  href?:string;
  hide?: boolean;
  pokemon: TPokemon;
  progressionAttributes?: TProgressionAttributes;
}
export default function PokemonCard({ href= 'pokemon', pokemon, hide, progressionAttributes }: PokemonCardProps) {
  const prePath = href.startsWith('/') ? href.substring(1) : href;
  const basePath = prePath.endsWith('/') ? prePath.substring(0, prePath.length - 1) : prePath;
  
  const hidePokemon = useMemo(() => {
    if (hide) {
      return true;
    }
    return pokemon.status === 'INCOMPLETE';
  }, [hide, pokemon.status]);

  const progression = useMemo(() => {
    if (!progressionAttributes) {
      return undefined;
    }
    if (!hidePokemon) {
      return progressionAttributes;
    }
    return Object.keys(progressionAttributes).reduce(
      (acc, key) => {
        acc[key as keyof TProgressionAttributes] = 0;
        return acc;
      },
      {} as TProgressionAttributes,
    );
  }, [hidePokemon, progressionAttributes]);

  return (
    <Link 
      key={ pokemon.id }
      href={ `/${basePath}/${ pokemon.name }` }
      aria-disabled={ hidePokemon }
      tabIndex={ hidePokemon ? -1 : undefined }
      onClick={(e) => {
        if (hidePokemon) {
          e.preventDefault();
        }
      }}
      className={ hidePokemon ? 'cursor-default' : 'block focus:outline-none focus:ring-2 focus:ring-blue-500'}>
      <Card
        variant="elevated"
        rounded="lg"
        hoverEffect="lift"
        interactive={ !hidePokemon }
        className="flex h-full flex-col gap-4 border-slate-200 bg-white"
      >
        <div
          className="flex min-h-44 items-center justify-center rounded-lg bg-slate-100">
          <Image
            src={ !hidePokemon ? pokemon.external_image : undefined }
            alt={ pokemon.name }
            size="md"
            fit="contain"
            className="p-4"
            fallbackSrcList={['/pokeball.svg']}
          />
        </div>
        <PokemonCardHeader hide={hidePokemon} order={ pokemon.order } status={ pokemon.status } name={ pokemon.name }/>
        <TypesBadge types={ pokemon.types }/>
        {progression && (
          <PokemonStats {...progression}/>
        )}
      </Card>
    </Link>
  );
}