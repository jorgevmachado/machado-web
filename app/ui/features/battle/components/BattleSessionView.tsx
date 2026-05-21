'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';

import { Badge, Button, Card, Text, useAlert } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import { displayDate, formatLabel } from '@/app/utils';

import { useBattleSession } from '../hooks/useBattleSession';

const ACTIVE_STATUS = 'ACTIVE';

type BattleSessionViewProps = {
  variant?: 'page' | 'modal';
  onClose?: () => void;
};

const calculateHpPercent = (currentHp: number, maxHp: number): number => {
  if (maxHp <= 0) {
    return 0;
  }

  const normalized = Math.round((currentHp / maxHp) * 100);
  return Math.max(0, Math.min(100, normalized));
};

export function BattleSessionView({
  variant = 'page',
  onClose,
}: BattleSessionViewProps) {
  const {
    data,
    logs,
    isLoading,
    isActing,
    errorMessage,
    isTerminal,
    load,
    useMove: executeMove,
    switchPokemon,
    flee,
  } = useBattleSession();
  const { t } = useAppTranslation();
  const { showAlert } = useAlert();
  const isModal = variant === 'modal';

  useEffect(() => {
    if (errorMessage) {
      showAlert({ type: 'error', message: errorMessage });
    }
  }, [errorMessage, showAlert]);

  const availableSwitches = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.party.filter((partyMember) => {
      return Boolean(
        partyMember.my_pokemon_id
        && partyMember.my_pokemon_id !== data.trainer_active_my_pokemon_id
        && partyMember.current_hp > 0,
      );
    });
  }, [data]);

  const containerClassName = isModal
    ? 'flex flex-col gap-6'
    : 'mx-auto flex w-full max-w-7xl flex-col gap-6';

  const shellClassName = isModal
    ? 'bg-slate-50'
    : 'min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8';

  if (isLoading && !data) {
    return (
      <div className={shellClassName}>
        <Card rounded='lg' className='mx-auto max-w-6xl text-center'>
          <Text>{t('trainer.battle.loading')}</Text>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={shellClassName}>
        <Card rounded='lg' className='mx-auto max-w-4xl text-center'>
          <Text className='text-slate-600'>{errorMessage || t('trainer.battle.empty')}</Text>
          <div className='mt-4 flex justify-center gap-3'>
            <Button appearance='outline' tone='primary' onClick={() => void load()}>
              {t('trainer.battle.retry')}
            </Button>
            {isModal ? (
              <Button appearance='solid' tone='secondary' onClick={onClose}>
                {t('trainer.battle.close')}
              </Button>
            ) : (
              <Link href='/home' className='inline-flex'>
                <Button appearance='solid' tone='secondary'>{t('trainer.battle.backToHome')}</Button>
              </Link>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={shellClassName}>
      <div className={containerClassName}>
        <header className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <Text as='h1' className='text-3xl font-bold text-slate-950 sm:text-4xl'>
              {t('trainer.battle.title')}
            </Text>
            <Text className='text-sm text-slate-600'>
              {t('trainer.battle.turn', { value: data.turn_number })}
            </Text>
          </div>
          <Badge tone={data.status === ACTIVE_STATUS ? 'success' : 'warning'} variant='soft'>
            {t(`trainer.battle.status.${data.status}`)}
          </Badge>
        </header>

        {isTerminal ? (
          <Card rounded='lg' variant='outlined' className='border-amber-300 bg-amber-50'>
            <Text className='font-semibold text-amber-700'>{t('trainer.battle.finished')}</Text>
            <div className='mt-4 flex gap-3'>
              <Button appearance='outline' tone='primary' onClick={() => void load({ silent: true })}>
                {t('trainer.battle.refresh')}
              </Button>
              {isModal && onClose ? (
                <Button appearance='solid' tone='secondary' onClick={onClose}>
                  {t('trainer.battle.close')}
                </Button>
              ) : null}
            </div>
          </Card>
        ) : null}

        <section className='grid gap-4 lg:grid-cols-2'>
          <Card rounded='lg' variant='elevated'>
            <div className='mb-3 flex items-center justify-between'>
              <Text as='h2' className='text-lg font-semibold'>
                {data.trainer_side.nickname || formatLabel(data.trainer_side.name)}
              </Text>
              <Badge tone='info' variant='soft'>Lv {data.trainer_side.level}</Badge>
            </div>
            <Text className='text-sm text-slate-600'>
              HP {data.trainer_side.current_hp}/{data.trainer_side.max_hp}
            </Text>
            <div className='mt-2 h-2 rounded-full bg-slate-200'>
              <div
                className='h-2 rounded-full bg-emerald-500 transition-all'
                style={{ width: `${calculateHpPercent(data.trainer_side.current_hp, data.trainer_side.max_hp)}%` }}
              />
            </div>
          </Card>

          <Card rounded='lg' variant='elevated'>
            <div className='mb-3 flex items-center justify-between'>
              <Text as='h2' className='text-lg font-semibold'>
                {formatLabel(data.wild_side.name)}
              </Text>
              <Badge tone='warning' variant='soft'>Lv {data.wild_side.level}</Badge>
            </div>
            <Text className='text-sm text-slate-600'>
              HP {data.wild_side.current_hp}/{data.wild_side.max_hp}
            </Text>
            <div className='mt-2 h-2 rounded-full bg-slate-200'>
              <div
                className='h-2 rounded-full bg-rose-500 transition-all'
                style={{ width: `${calculateHpPercent(data.wild_side.current_hp, data.wild_side.max_hp)}%` }}
              />
            </div>
          </Card>
        </section>

        <section className='grid gap-6 xl:grid-cols-[1.15fr_1fr]'>
          <Card rounded='lg' variant='elevated'>
            <Text as='h3' className='mb-3 text-lg font-semibold'>
              {t('trainer.battle.moves')}
            </Text>
            <div className='grid gap-3 sm:grid-cols-2'>
              {data.trainer_side.moves.map((move) => {
                const isDisabled = isActing || isTerminal || move.pp <= 0;
                return (
                  <button
                    key={move.id}
                    type='button'
                    disabled={isDisabled}
                    onClick={() => void executeMove(move.id)}
                    className='rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-blue-300 disabled:cursor-not-allowed disabled:opacity-60'
                  >
                    <div className='flex items-start justify-between gap-2'>
                      <Text as='h4' className='font-semibold text-slate-900'>{formatLabel(move.name)}</Text>
                      <Badge tone={move.pp <= 0 ? 'danger' : 'primary'} variant='soft'>
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

            <div className='mt-6'>
              <Text as='h3' className='mb-3 text-lg font-semibold'>
                {t('trainer.battle.switchTitle')}
              </Text>
              {availableSwitches.length ? (
                <div className='grid gap-3 sm:grid-cols-2'>
                  {availableSwitches.map((partyMember) => (
                    <button
                      key={partyMember.my_pokemon_id}
                      type='button'
                      disabled={isActing || isTerminal || !partyMember.my_pokemon_id}
                      onClick={() => {
                        if (partyMember.my_pokemon_id) {
                          void switchPokemon(partyMember.my_pokemon_id);
                        }
                      }}
                      className='rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-emerald-300 disabled:cursor-not-allowed disabled:opacity-60'
                    >
                      <Text as='h4' className='font-semibold'>{partyMember.nickname || formatLabel(partyMember.name)}</Text>
                      <Text className='text-sm text-slate-600'>HP {partyMember.current_hp}/{partyMember.max_hp}</Text>
                    </button>
                  ))}
                </div>
              ) : (
                <Text className='text-sm text-slate-600'>{t('trainer.battle.noSwitchTargets')}</Text>
              )}
            </div>

            <div className='mt-6'>
              <Button
                tone='danger'
                appearance='outline'
                disabled={isActing || isTerminal}
                onClick={() => void flee()}
              >
                {t('trainer.battle.flee')}
              </Button>
            </div>
          </Card>

          <Card rounded='lg' variant='elevated'>
            <div className='mb-3 flex items-center justify-between'>
              <Text as='h3' className='text-lg font-semibold'>{t('trainer.battle.logs')}</Text>
              <Button appearance='outline' tone='primary' disabled={isActing} onClick={() => void load({ silent: true })}>
                {t('trainer.battle.refresh')}
              </Button>
            </div>
            <div className='max-h-[560px] space-y-3 overflow-auto pr-1'>
              {logs.length ? logs.map((log) => (
                <div key={log.id} className='rounded-xl border border-slate-200 bg-slate-50 px-4 py-3'>
                  <div className='mb-1 flex items-center justify-between gap-2'>
                    <Badge tone='info' variant='soft'>{formatLabel(log.log_type)}</Badge>
                    <Text className='text-xs text-slate-500'>{displayDate(log.created_at)}</Text>
                  </div>
                  <Text className='text-sm text-slate-800'>{log.message}</Text>
                </div>
              )) : (
                <Text className='text-sm text-slate-600'>{t('trainer.battle.noLogs')}</Text>
              )}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
