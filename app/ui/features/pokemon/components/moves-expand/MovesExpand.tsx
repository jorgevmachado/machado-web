'use client';

import { useState } from 'react';

import { Badge, Card, Text } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import type { TPokemonMove } from '@/app/ui/features/pokemon/move';
import { formatLabel } from '@/app/utils';

type MovesExpandProps = Readonly<{
  moves: Array<TPokemonMove>;
  page_size?: number;
}>;

export default function MovesExpand({
  moves,
  page_size = 2,
}: MovesExpandProps) {
  const [visibleMoves, setVisibleMoves] = useState<number>(page_size);
  const movesToRender = moves.slice(0, visibleMoves);
  const hasMoreMoves = visibleMoves < moves.length;
  const { t } = useAppTranslation();

  return (
    <Card variant="elevated" rounded="2xl" className="border border-white/80 bg-white/90">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <Text as="h3">{t('pokemon.movesExpand.title')}</Text>
            <Text color="text-slate-500">
              {t('pokemon.movesExpand.description')}
            </Text>
          </div>

          <Badge tone="secondary" variant="soft">
            {t('pokemon.movesExpand.total', { count: moves.length })}
          </Badge>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {movesToRender.map((move, index) => (
            <Card
              key={move.id}
              variant="tonal"
              rounded="xl"
              className={index % 2 === 0 ? 'bg-slate-50' : 'bg-sky-50/70'}
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <Text as="h4" className="capitalize">{formatLabel(move.name)}</Text>
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="secondary">{formatLabel(move.type)}</Badge>
                      <Badge tone="info">{formatLabel(move.damage_class)}</Badge>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/80 px-3 py-2 text-right shadow-sm">
                    <Text
                      as="small"
                      color="text-slate-400"
                      weight="semibold"
                      className="uppercase tracking-[0.16em]"
                    >
                      {t('pokemon.movesExpand.priority')}
                    </Text>
                    <Text as="p" weight="bold" color="text-slate-900">
                      {move.priority}
                    </Text>
                  </div>
                </div>

                <Text color="text-slate-500">
                  {t('pokemon.movesExpand.stats', { power: move.power, accuracy: move.accuracy, pp: move.pp })}
                </Text>
                <Text color="text-slate-600" lineClamp={2}>
                  {move.short_effect || move.effect}
                </Text>
              </div>
            </Card>
          ))}
        </div>

        {hasMoreMoves ? (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => {
                setVisibleMoves((currentValue) => {
                  return Math.min(currentValue + page_size, moves.length);
                });
              }}
              className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-800 transition-colors hover:bg-sky-100"
            >
              {t('pokemon.movesExpand.viewMore', { count: page_size })}
            </button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
