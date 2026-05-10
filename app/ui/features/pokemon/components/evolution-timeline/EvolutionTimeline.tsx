import { Card, Image, Text } from '@/app/ds';
import { TPokemon } from '@/app/ui/features/pokemon/types';
import Link from 'next/link';

type EvolutionTimelineProps = Readonly<{
  pokemon: TPokemon;
}>;

export default function EvolutionTimeline({ pokemon }: EvolutionTimelineProps) {
  const imageSrc = pokemon?.external_image || pokemon.images?.front_image;
  return (
    <Card variant="elevated" rounded="2xl" className="border border-white/80 bg-white/90">
      <div className="space-y-4">
        <Text as="h3">Evolution Timeline</Text>
        <div className="flex flex-col gap-4 xl:flex-row xl:flex-wrap xl:items-center">
          <Card variant="tonal" rounded="xl" className="bg-sky-50 ring-2 ring-sky-200">
            <div className="flex items-center gap-4">
              <Image src={imageSrc} alt={pokemon.name} size="sm" fit="contain" className="h-20 w-20"/>
              <div>
                <Text as="h4" className="capitalize">{pokemon.name}</Text>
                <Text color="text-slate-500">Current Pokemon</Text>
              </div>
            </div>
          </Card>

          {pokemon.evolutions.map((evolution) => {
            const evolutionImage = evolution.external_image;
            return (
              <Link key={evolution.id} href={`/pokemon/${evolution.name}`}
                className="block focus:outline-none focus:ring-2 focus:ring-blue-500">
                <div className="flex items-center gap-4">
                  <Text as="span" color="text-slate-300" size="3xl">→</Text>
                  <Card variant="tonal" rounded="xl" className="bg-slate-50">
                    <div className="flex items-center gap-4">
                      <Image src={evolutionImage} alt={evolution.name} size="sm"
                        fit="contain" className="h-20 w-20"/>
                      <div>
                        <Text as="h4" className="capitalize">{evolution.name}</Text>
                        <Text color="text-slate-500">{evolution.status}</Text>
                      </div>
                    </div>
                  </Card>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
