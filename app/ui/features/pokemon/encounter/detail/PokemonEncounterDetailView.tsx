'use client';

import Link from 'next/link';
import { GiPositionMarker } from 'react-icons/gi';

import { Card, Text } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import { formatLabel, formatNumber, normalizedName } from '@/app/utils';

import { usePokemonEncounterDetail } from './usePokemonEncounterDetail';

type PokemonEncounterDetailViewProps = Readonly<{
  identifier: string;
}>;

const formatOrder = (order: number): string => `#${String(order).padStart(3, '0')}`;

export function PokemonEncounterDetailView({ identifier }: PokemonEncounterDetailViewProps) {
  const { data, isLoading, errorMessage } = usePokemonEncounterDetail(identifier);
  const { t } = useAppTranslation();

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <Card rounded="lg" className="mx-auto max-w-5xl text-center">
          <Text className="text-slate-600">{t('pokemon.encounter.detail.loading')}</Text>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <Card rounded="lg" className="mx-auto max-w-5xl text-center">
          <Text className="text-slate-600">{errorMessage || t('pokemon.encounter.detail.notFound')}</Text>
        </Card>
      </div>
    );
  }

  const attributes = [
    { id: 1, label: t('pokemon.encounter.detail.chance'), value: formatNumber(data.chance) },
    { id: 2, label: t('pokemon.encounter.detail.minLevel'), value: formatNumber(data.min_level) },
    { id: 3, label: t('pokemon.encounter.detail.maxLevel'), value: formatNumber(data.max_level) },
    { id: 4, label: t('pokemon.encounter.detail.maxChance'), value:  formatNumber(data.max_chance) },
    { id: 5, label: t('pokemon.encounter.detail.condition'), value: data.condition ? formatLabel(data.condition) : t('common.unknown') },
    { id: 6, label: t('pokemon.encounter.detail.method'), value: data.method ? formatLabel(data.method) : t('common.unknown') },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Link href="/pokemon/encounter" className="text-sm font-semibold text-blue-700">
          {t('pokemon.encounter.detail.back')}
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
                <Text as="small" color="text-slate-500" weight="semibold" className="uppercase tracking-[0.2em]">{item.label}</Text>
                <Text as="p" size="xl" weight="bold">{item.value}</Text>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
