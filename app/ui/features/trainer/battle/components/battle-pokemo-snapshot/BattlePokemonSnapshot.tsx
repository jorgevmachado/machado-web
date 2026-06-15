import { TTrainerBattlePokemonSnapshot } from '@/app/ui';
import { Badge ,Card ,Text } from '@/app/ds';
import { formatLabel ,joinClass } from '@/app/utils';
import { useCallback ,useMemo } from 'react';
import { useAppTranslation } from '@/app/i18n';
import { TBattleSessionStatus } from '@/app/ui';

type BattlePokemonSnapshotProps = {
  type: 'WILD_POKEMON' | 'TRAINER_POKEMON';
  status: TBattleSessionStatus
  snapshot: TTrainerBattlePokemonSnapshot;
};

const calculateHpPercent = (currentHp: number, maxHp: number): number => {
  if (maxHp <= 0) {
    return 0;
  }

  const normalized = Math.round((currentHp / maxHp) * 100);
  return Math.max(0, Math.min(100, normalized));
};

export default function BattlePokemonSnapshot({
  type,
  status,
  snapshot
}: BattlePokemonSnapshotProps) {
  const { t } = useAppTranslation();

  const executeMove = useCallback(async (moveId: string) => {
    console.log('# => executeMove => moveId => ', moveId);
  }, []);
  
  const displayName = useMemo(() => {
    return snapshot?.nickname ||  snapshot?.name || t('unknow');
  }, [snapshot.name, snapshot.nickname, t]);
  
  const classNameHp = useMemo(() => {
    return joinClass([
      'h-2',
      'rounded-full',
      'transition-all',
      type === 'TRAINER_POKEMON' ? 'bg-emerald-500' : 'bg-red-500'
    ]);
  }, [type]);
  
  const disabledMoveSelect = useMemo(() => {
    if (type === 'WILD_POKEMON') {
      return true;
    }
    return Boolean(status !== 'ACTIVE');
  }, [status, type]);
  
  const badgeLevelTone = useMemo(() => {
    if (type === 'TRAINER_POKEMON') {
      return 'primary';
    }
    return 'warning';
  }, [type]);
  
  return (
    <Card rounded='lg' variant='elevated'>
      <div className='mb-3 flex items-center justify-between'>
        <Text as='h2' className='text-lg font-semibold'>
          {formatLabel(displayName)}
        </Text>
        <Badge tone={badgeLevelTone} variant='soft'>Lv {snapshot.level}</Badge>
      </div>
      <Text className='text-sm text-slate-600'>
        HP {snapshot.hp}/{snapshot.max_hp}
      </Text>
      <div className='mt-2 h-2 rounded-full bg-slate-200'>
        <div className={classNameHp} style={{ width: `${calculateHpPercent(snapshot.hp, snapshot.max_hp)}%` }}
        />
      </div>
      <div className="mt-4">
        <div className='grid gap-3 sm:grid-cols-2'>
          {snapshot?.moves.map((move) => {
            const isDisabled = disabledMoveSelect || move.pp <= 0;
            return (
              <button
                key={move.id}
                type='button'
                disabled={isDisabled}
                onClick={() => void executeMove(move.id)}
                className='rounded-xl cursor-pointer border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-blue-300 disabled:cursor-not-allowed disabled:opacity-60'
              >
                <div className='flex items-start justify-between gap-2'>
                  <Text as='h4' className='font-semibold text-slate-900'>{formatLabel(move.name)}</Text>
                  <Badge tone={move.pp <= 0 ? 'danger' : badgeLevelTone} variant='soft'>
                    PP {move.pp}/{move.max_pp}
                  </Badge>
                </div>
                <Text className='mt-1 text-sm text-slate-600'>
                  {t('trainer.battle.moveMeta', { type: formatLabel(move.type), power: move.power, accuracy: move.accuracy })}
                </Text>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}