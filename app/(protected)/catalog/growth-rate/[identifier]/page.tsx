import { GrowthRateDetails } from '@/app/ui';

type PokemonGrowthRateDetailPageProps = Readonly<{
  params: Promise<{
    identifier: string;
  }>;
  searchParams: Promise<{
    param?: string;
    origin?: string;
  }>;
}>;

export default async function GrowthRateDetailPage({ params, searchParams }: PokemonGrowthRateDetailPageProps) {
  const { identifier } = await params;
  const { param ,origin } = await searchParams;
  
  return (
    <GrowthRateDetails identifier={identifier} origin={origin} param={param}/>
  );
}