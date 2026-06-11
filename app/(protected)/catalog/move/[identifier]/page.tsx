import { MoveDetails } from '@/app/ui';
type PokemonMoveDetailPageProps = Readonly<{
  params: Promise<{
    identifier: string;
  }>;
  searchParams: Promise<{
    param?: string;
    origin?: string;
  }>;
}>;
export default async function MoveDetailPage({ params, searchParams }: PokemonMoveDetailPageProps) {
  const { identifier } = await params;
  const { param ,origin } = await searchParams;

  return (
    <MoveDetails identifier={ identifier } origin={ origin } param={ param }/>
  );
}