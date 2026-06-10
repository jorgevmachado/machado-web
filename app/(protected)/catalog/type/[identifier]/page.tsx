import { TypeDetails } from '@/app/ui';

type PokemonTypeDetailPageProps = Readonly<{
  params: Promise<{
    identifier: string;
  }>;
  searchParams: Promise<{
    param?: string;
    origin?: string;
  }>;
}>;
export default async function MoveDetailPage({ params, searchParams }: PokemonTypeDetailPageProps) {
  const { identifier } = await params;
  const { param ,origin } = await searchParams;

  return (
    <TypeDetails identifier={ identifier } origin={ origin } param={ param }/>
  );
}

  