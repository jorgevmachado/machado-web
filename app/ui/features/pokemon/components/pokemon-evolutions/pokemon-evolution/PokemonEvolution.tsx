import { Card ,Image ,Text } from '@/app/ds';

type PokemonEvolutionProps = {
  name: string;
  status: string;
  evolutionImage: string;
}

export default function PokemonEvolution({
  name,
  status,
  evolutionImage
}: PokemonEvolutionProps) {
  return (
    <div className="flex items-center gap-4">
      <Text as="span" color="text-slate-300" size="3xl">→</Text>
      <Card variant="tonal" rounded="xl" className="bg-slate-50">
        <div className="flex items-center gap-4">
          <Image src={evolutionImage} alt={name} size="sm" fit="contain" className="h-20 w-20"/>
          <div>
            <Text as="h4" className="capitalize">{name}</Text>
            <Text color="text-slate-500">{status}</Text>
          </div>
        </div>
      </Card>
    </div>
  );
}