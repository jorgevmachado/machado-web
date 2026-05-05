import { PokemonDetailView } from '@/app/ui/features/pokemon';

type PokemonDetailPageProps = {
  params: Promise<{
    identifier: string;
  }>;
};

export default async function PokemonDetailPage({ params }: PokemonDetailPageProps) {
  const { identifier } = await params;

  return <PokemonDetailView identifier={identifier} />;
}
