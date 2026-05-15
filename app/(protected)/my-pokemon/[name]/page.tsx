import { MyPokemonDetailView } from '../../../ui/features/trainer/my_pokemon';

type MyPokemonDetailPageProps = Readonly<{
  params: Promise<{ name: string }>;
}>;

export default async function MyPokemonDetailPage({ params }: MyPokemonDetailPageProps) {
  const { name } = await params;

  return <MyPokemonDetailView name={name} />;
}
