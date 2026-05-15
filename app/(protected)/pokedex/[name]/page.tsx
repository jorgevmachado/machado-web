import { PokedexDetailView } from '../../../ui/features/trainer/pokedex';

type PokedexDetailPageProps = Readonly<{
  params: Promise<{ name: string }>;
}>;

export default async function PokedexDetailPage({ params }: PokedexDetailPageProps) {
  const { name } = await params;

  return <PokedexDetailView name={name} />;
}
