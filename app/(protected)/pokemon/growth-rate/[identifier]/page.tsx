import { PokemonGrowthRateDetailView } from '@/app/ui/features/pokemon/growth_rate';

type PokemonGrowthRateDetailPageProps = {
  params: Promise<{
    identifier: string;
  }>;
};

export default async function PokemonGrowthRateDetailPage({ params }: PokemonGrowthRateDetailPageProps) {
  const { identifier } = await params;

  return <PokemonGrowthRateDetailView identifier={identifier} />;
}
