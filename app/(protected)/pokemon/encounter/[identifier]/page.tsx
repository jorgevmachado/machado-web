import { PokemonEncounterDetailView } from '@/app/ui/features/pokemon/encounter';

type PokemonEncounterDetailPageProps = Readonly<{
  params: Promise<{
    identifier: string;
  }>;
}>;

export default async function PokemonEncounterDetailPage({ params }: PokemonEncounterDetailPageProps) {
  const { identifier } = await params;

  return <PokemonEncounterDetailView identifier={identifier} />;
}
