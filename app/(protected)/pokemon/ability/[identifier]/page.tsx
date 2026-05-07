import { PokemonAbilityDetailView } from '@/app/ui/features/pokemon/ability';

type PokemonAbilityDetailPageProps = {
  params: Promise<{
    identifier: string;
  }>;
};

export default async function PokemonAbilityDetailPage({ params }: PokemonAbilityDetailPageProps) {
  const { identifier } = await params;

  return <PokemonAbilityDetailView identifier={identifier} />;
}
