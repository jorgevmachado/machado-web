import { EncounterDetails } from '@/app/ui';

type PokemonEncounterDetailPageProps = Readonly<{
  params: Promise<{
    identifier: string;
  }>;
  searchParams: Promise<{
    param?: string;
    origin?: string;
  }>;
}>;

export default async function PokemonEncounterDetailPage({ params, searchParams }: PokemonEncounterDetailPageProps) {

  const { identifier } = await params;
  const { param ,origin } = await searchParams;
  
  return (
    <EncounterDetails identifier={identifier} origin={origin} param={param}/>
  );
}
