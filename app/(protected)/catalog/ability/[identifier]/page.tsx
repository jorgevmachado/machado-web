import { AbilityDetails } from '@/app/ui';

type PokemonAbilityDetailPageProps = Readonly<{
  params: Promise<{
    identifier: string;
  }>;
  searchParams: Promise<{
    param?: string;
    origin?: string;
  }>;
}>;

export default async function AbilityDetailPage({ params, searchParams }: PokemonAbilityDetailPageProps) {

  const { identifier }  = await params;
  const { param, origin } = await searchParams;

  return (
    <AbilityDetails identifier={identifier} origin={origin} param={param} />
  );
}