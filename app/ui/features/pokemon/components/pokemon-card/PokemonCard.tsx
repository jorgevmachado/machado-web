import { TPokemon ,TProgressionAttributes ,TypesBadge } from '@/app/ui';
import Link from 'next/link';
import { Card ,Image } from '@/app/ds';
import PokemonCardHeader from './pokemon-card-header';
import PokemonStats
  from '@/app/ui/features/pokemon/components/pokemon-stats/PokemonStats';

type PokemonCardProps = {
  href?:string;
  pokemon: TPokemon;
  progressionAttributes?: TProgressionAttributes;
}
export default function PokemonCard({ href= 'pokemon', pokemon, progressionAttributes }: PokemonCardProps) {
  const prePath = href.startsWith('/') ? href.substring(1) : href;
  const basePath = prePath.endsWith('/') ? prePath.substring(0, prePath.length - 1) : prePath;
  return (
    <Link key={ pokemon.id } href={ `/${basePath}/${ pokemon.name }` } className="block focus:outline-none focus:ring-2 focus:ring-blue-500">
      <Card
        variant="elevated"
        rounded="lg"
        hoverEffect="lift"
        interactive
        className="flex h-full flex-col gap-4 border-slate-200 bg-white"
      >
        <div
          className="flex min-h-44 items-center justify-center rounded-lg bg-slate-100">
          <Image
            src={ pokemon.external_image }
            alt={ pokemon.name }
            size="md"
            fit="contain"
            className="p-4"
          />
        </div>
        <PokemonCardHeader order={ pokemon.order } status={ pokemon.status } name={ pokemon.name }/>
        <TypesBadge types={ pokemon.types }/>
        {progressionAttributes && (
          <PokemonStats {...progressionAttributes}/>
        )}
      </Card>
    </Link>
  );
}