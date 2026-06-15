import { BattleDetails } from '@/app/ui';

type TrainerBattleDetailPageProps = Readonly<{
  params: Promise<{
    identifier: string;
  }>;
}>;

export default async function BattleDetailPage({ params }: TrainerBattleDetailPageProps) {
  const { identifier }  = await params;

  return (
    <BattleDetails
      identifier={identifier}
    />
  );
}
