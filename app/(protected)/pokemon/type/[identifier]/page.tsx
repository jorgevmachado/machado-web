import { PokemonTypeDetailView } from '@/app/ui/features/pokemon/type';

type PokemonTypeDetailPageProps = Readonly<{
  params: Promise<{
    identifier: string;
  }>;
}>;

export default async function PokemonTypeDetailPage({ params }: PokemonTypeDetailPageProps) {
  const { identifier } = await params;

  return <PokemonTypeDetailView identifier={identifier} />;
}
