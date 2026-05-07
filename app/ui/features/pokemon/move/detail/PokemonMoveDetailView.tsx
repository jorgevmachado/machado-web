'use client';

import Link from 'next/link';
import { GiPunchBlast } from 'react-icons/gi';

import { Badge, Card, Text } from '@/app/ds';

import { usePokemonMoveDetail } from './usePokemonMoveDetail';

type PokemonMoveDetailViewProps = {
  identifier: string;
};

const formatOrder = (order: number): string => `#${String(order).padStart(3, '0')}`;
const formatValue = (value: number | null | undefined): string => value === null || value === undefined ? '-' : String(value);

export function PokemonMoveDetailView({ identifier }: PokemonMoveDetailViewProps) {
  const { data, isLoading, errorMessage } = usePokemonMoveDetail(identifier);

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <Card rounded="lg" className="mx-auto max-w-5xl text-center">
          <Text className="text-slate-600">Loading Pokemon move...</Text>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <Card rounded="lg" className="mx-auto max-w-5xl text-center">
          <Text className="text-slate-600">{errorMessage || 'Pokemon move not found.'}</Text>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Link href="/pokemon/move" className="text-sm font-semibold text-blue-700">
          Back to Moves
        </Link>

        <Card rounded="lg" className="bg-white">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-700">
                <GiPunchBlast size={34} />
              </div>
              <div>
                <Text as="h1" className="text-3xl font-bold capitalize text-slate-950 sm:text-5xl">
                  {data.name}
                </Text>
                <Text className="mt-2 text-sm font-semibold text-slate-500">
                  {formatOrder(data.order)}
                </Text>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" variant="soft" size="lg">{data.type}</Badge>
              <Badge tone="warning" variant="soft" size="lg">{data.damage_class}</Badge>
            </div>
          </div>
        </Card>

        <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-6">
            <Card rounded="lg" className="bg-white">
              <Text as="h2" className="text-xl font-semibold text-slate-950">Short Effect</Text>
              <Text className="mt-3 text-slate-700">{data.short_effect || 'Short effect pending.'}</Text>
            </Card>

            <Card rounded="lg" className="bg-white">
              <Text as="h2" className="text-xl font-semibold text-slate-950">Effect</Text>
              <Text className="mt-3 whitespace-pre-line text-slate-700">{data.effect || 'Effect pending.'}</Text>
            </Card>
          </div>

          <Card rounded="lg" className="bg-white">
            <Text as="h2" className="text-xl font-semibold text-slate-950">Move Data</Text>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ['Power', formatValue(data.power)],
                ['Accuracy', formatValue(data.accuracy)],
                ['PP', formatValue(data.pp)],
                ['Chance', formatValue(data.effect_chance)],
                ['Target', data.target || '-'],
                ['Class', data.damage_class || '-'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-slate-200 p-3">
                  <Text className="text-xs font-semibold uppercase text-slate-500">{label}</Text>
                  <Text className="mt-1 break-words text-lg font-bold text-slate-950">{value}</Text>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
