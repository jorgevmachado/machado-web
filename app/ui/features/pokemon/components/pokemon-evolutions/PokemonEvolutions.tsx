import { Card, Image, Text } from '@/app/ds';
import { TPokemon } from '@/app/ui';
import Link from 'next/link';

type EvolutionTimelineProps = Readonly<{
  name: string;
  origin?: string;
  evolutions: TPokemon['evolutions'];
  external_image: string;
}>;

export default function PokemonEvolutions({ name, origin, evolutions, external_image }: EvolutionTimelineProps) {
  return (
    <Card variant="elevated" rounded="2xl" className="border border-white/80 bg-white/90">
      <div className="space-y-4">
        <Text as="h3">Evolution Timeline</Text>
        <div className="flex flex-col gap-4 xl:flex-row xl:flex-wrap xl:items-center">
          <Card variant="tonal" rounded="xl" className="bg-sky-50 ring-2 ring-sky-200">
            <div className="flex items-center gap-4">
              <Image src={external_image} alt={name} size="sm" fit="contain" className="h-20 w-20"/>
              <div>
                <Text as="h4" className="capitalize">{name}</Text>
                <Text color="text-slate-500">Current Pokemon</Text>
              </div>
            </div>
          </Card>

          {evolutions.map((evolution) => {
            const evolutionImage = evolution.external_image;
            const disabled = origin !== 'catalog';
            return (
              <Link 
                key={evolution.id}
                href={`/pokemon/${evolution.name}`}
                aria-disabled={disabled}
                tabIndex={disabled ? -1 : undefined}
                onClick={(e) => {
                  if (disabled) {
                    e.preventDefault();
                  }
                }}
                className={ disabled ? 'pointer-events-none opacity-50' : 'block focus:outline-none focus:ring-2 focus:ring-blue-500'}
              >
                <div className="flex items-center gap-4">
                  <Text as="span" color="text-slate-300" size="3xl">→</Text>
                  <Card variant="tonal" rounded="xl" className="bg-slate-50">
                    <div className="flex items-center gap-4">
                      <Image src={evolutionImage} alt={evolution.name} size="sm" fit="contain" className="h-20 w-20"/>
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
