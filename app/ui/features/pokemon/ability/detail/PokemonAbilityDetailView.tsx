'use client';

import Link from 'next/link';
import { MdAutoAwesome } from 'react-icons/md';

import { Badge, Card, Text } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';

import { usePokemonAbilityDetail } from './usePokemonAbilityDetail';

type PokemonAbilityDetailViewProps = Readonly<{
  identifier: string;
}>;

const formatOrder = (order: number): string => `#${String(order).padStart(3, '0')}`;

export function PokemonAbilityDetailView({ identifier }: PokemonAbilityDetailViewProps) {
  const { data, isLoading, errorMessage } = usePokemonAbilityDetail(identifier);
  const { t } = useAppTranslation();

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <Card rounded="lg" className="mx-auto max-w-5xl text-center">
          <Text className="text-slate-600">{t('pokemon.ability.detail.loading')}</Text>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <Card rounded="lg" className="mx-auto max-w-5xl text-center">
          <Text className="text-slate-600">{errorMessage || t('pokemon.ability.detail.notFound')}</Text>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <Link href="/pokemon/ability" className="text-sm font-semibold text-blue-700">
          {t('pokemon.ability.detail.back')}
        </Link>

        <Card rounded="lg" className="bg-white">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                <MdAutoAwesome size={32} />
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
              <Badge tone={data.is_hidden ? 'warning' : 'info'} variant="soft" size="lg">
                {data.is_hidden ? t('pokemon.ability.list.hidden') : t('pokemon.ability.list.standard')}
              </Badge>
              <Badge tone="neutral" variant="soft" size="lg">
                {t('pokemon.ability.list.slot', { value: data.slot })}
              </Badge>
            </div>
          </div>
        </Card>

        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-6">
            <Card rounded="lg" className="bg-white">
              <Text as="h2" className="text-xl font-semibold text-slate-950">{t('pokemon.ability.detail.shortEffect')}</Text>
              <Text className="mt-3 text-slate-700">{data.short_effect || t('pokemon.ability.detail.shortEffectPending')}</Text>
            </Card>

            <Card rounded="lg" className="bg-white">
              <Text as="h2" className="text-xl font-semibold text-slate-950">{t('pokemon.ability.detail.effect')}</Text>
              <Text className="mt-3 whitespace-pre-line text-slate-700">{data.effect || t('pokemon.ability.detail.effectPending')}</Text>
            </Card>
          </div>

          <Card rounded="lg" className="bg-white">
            <Text as="h2" className="text-xl font-semibold text-slate-950">{t('pokemon.ability.detail.flavorText')}</Text>
            <Text className="mt-3 text-sm italic text-slate-600">
              {data.flavor_text || t('pokemon.ability.detail.flavorTextPending')}
            </Text>
          </Card>
        </section>
      </div>
    </div>
  );
}
