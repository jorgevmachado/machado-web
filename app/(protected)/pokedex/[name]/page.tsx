import { PokedexDetailView } from '@/app/ui/features/pokedex';

type PokedexDetailPageProps = Readonly<{
  params: Promise<{ name: string }>;
}>;

export default async function PokedexDetailPage({ params }: PokedexDetailPageProps) {
  const { name } = await params;

  return <PokedexDetailView name={name} />;
}
