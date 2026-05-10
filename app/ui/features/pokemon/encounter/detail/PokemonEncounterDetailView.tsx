'use client';

import Link from 'next/link';
import { GiPositionMarker } from 'react-icons/gi';

import { Card, Text } from '@/app/ds';

import { usePokemonEncounterDetail } from './usePokemonEncounterDetail';
import { formatLabel ,formatNumber ,normalizedName } from '@/app/utils';

type PokemonEncounterDetailViewProps = Readonly<{
  identifier: string;
}>;

const formatOrder = (order: number): string => `#${String(order).padStart(3, '0')}`;

export function PokemonEncounterDetailView({ identifier }: PokemonEncounterDetailViewProps) {
  const { data, isLoading, errorMessage } = usePokemonEncounterDetail(identifier);

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <Card rounded="lg" className="mx-auto max-w-5xl text-center">
          <Text className="text-slate-600">Loading Pokemon Encounter...</Text>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <Card rounded="lg" className="mx-auto max-w-5xl text-center">
          <Text className="text-slate-600">{errorMessage || 'Pokemon Encounter not found.'}</Text>
        </Card>
      </div>
    );
  }

  const attributes = [
    { id: 1, label: 'Chance', value: formatNumber(data.chance) },
    { id: 2, label: 'Min Level', value: formatNumber(data.min_level) },
    { id: 3, label: 'Max Level', value: formatNumber(data.max_level) },
    { id: 4, label: 'Max Chance', value:  formatNumber(data.max_chance) },
    { id: 5, label: 'Condition', value: data.condition ? formatLabel(data.condition) : 'Unknown' },
    { id: 6, label: 'Method', value: data.method ? formatLabel(data.method) : 'Unknown' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Link href="/pokemon/encounter" className="text-sm font-semibold text-blue-700">
          Back to Encounters
        </Link>

        <Card rounded="lg" className="bg-white">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                <GiPositionMarker size={34} />
              </div>
              <div>
                <Text as="h1" className="text-3xl font-bold capitalize text-slate-950 sm:text-5xl">
                  {normalizedName(data.name)}
                </Text>
                <Text className="mt-2 text-sm font-semibold text-slate-500">
                  {formatOrder(data.order)}
                </Text>

              </div>
            </div>
          </div>
        </Card>

        <Card
          variant="elevated"
          rounded="2xl"
          className="border border-white/80 bg-white/90 shadow-xl shadow-slate-200/70"
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {attributes.map((item) => (
              <Card key={item.id} variant="tonal" rounded="xl" className="bg-slate-50">
                <Text as="small" color="text-slate-500" weight="semibold"
                  className="uppercase tracking-[0.2em]">{item.label}</Text>
                <Text as="p" size="xl" weight="bold">{item.value}</Text>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
