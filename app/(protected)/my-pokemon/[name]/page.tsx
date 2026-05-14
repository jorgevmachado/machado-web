import { MyPokemonDetailView } from '@/app/ui/features/my_pokemon';

type MyPokemonDetailPageProps = Readonly<{
  params: Promise<{ name: string }>;
}>;

export default async function MyPokemonDetailPage({ params }: MyPokemonDetailPageProps) {
  const { name } = await params;

  return <MyPokemonDetailView name={name} />;
}
