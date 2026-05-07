import { PokemonMoveDetailView } from '@/app/ui/features/pokemon/move';

type PokemonMoveDetailPageProps = {
  params: Promise<{
    identifier: string;
  }>;
};

export default async function PokemonMoveDetailPage({ params }: PokemonMoveDetailPageProps) {
  const { identifier } = await params;

  return <PokemonMoveDetailView identifier={identifier} />;
}
