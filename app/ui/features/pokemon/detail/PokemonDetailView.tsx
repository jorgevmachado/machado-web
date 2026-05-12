'use client';

import Link from 'next/link';

import { Badge, BarChart, Card, Text } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import { translatePokemonTypeName } from '@/app/ui/features/pokemon/type';
import {formatLabel, formatNumber, normalizedName, uniqueById} from '@/app/utils';
import EvolutionTimeline from '../components/evolution-timeline';
import GalleryImage from '../components/gallery-image';
import MovesExpand from '../components/moves-expand';
import { usePokemonDetail } from './usePokemonDetail';

type PokemonDetailViewProps = Readonly<{
  identifier: string;
}>;

export function PokemonDetailView({ identifier }: PokemonDetailViewProps) {
  const { data, isLoading, errorMessage } = usePokemonDetail(identifier);
  const { t } = useAppTranslation();

  if (isLoading && !data) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <Card rounded="lg" className="mx-auto max-w-5xl text-center">
          <Text className="text-slate-600">{t('pokemon.detail.loading')}</Text>
        </Card>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <Card rounded="lg" className="mx-auto max-w-5xl text-center">
          <Text className="text-slate-600">{errorMessage || t('pokemon.detail.notFound')}</Text>
          <Link className="mt-4 inline-flex text-sm font-semibold text-blue-700" href="/pokemon">
            {t('pokemon.detail.back')}
          </Link>
        </Card>
      </main>
    );
  }

  const weaknesses = uniqueById(data.types.flatMap((type) => type.weaknesses ?? []));
  const strengths = uniqueById(data.types.flatMap((type) => type.strengths ?? []));

  const statItems = [
    { label: t('pokemon.detail.labels.hp'), value: data.hp ?? 0 },
    { label: t('pokemon.detail.labels.attack'), value: data.attack ?? 0 },
    { label: t('pokemon.detail.labels.defense'), value: data.defense ?? 0 },
    { label: t('pokemon.detail.labels.speed'), value: data.speed ?? 0 },
    { label: t('pokemon.detail.labels.specialAttack'), value: data.special_attack ?? 0 },
    { label: t('pokemon.detail.labels.specialDefense'), value: data.special_defense ?? 0 },
  ];

  const attributes = [
    { id: 1, label: t('pokemon.detail.labels.height'), value: formatNumber(data.height) },
    { id: 2, label: t('pokemon.detail.labels.weight'), value: formatNumber(data.weight) },
    { id: 3, label: t('pokemon.detail.labels.habitat'), value: data.habitat ? formatLabel(data.habitat.name) : t('common.unknown') },
    { id: 4, label: t('pokemon.detail.labels.shape'), value: data.shape ? formatLabel(data.shape.name) : t('common.unknown') },
    { id: 5, label: t('pokemon.detail.labels.hatchCounter'), value: formatNumber(data.hatch_counter) },
    { id: 6, label: t('pokemon.detail.labels.captureRate'), value: formatNumber(data.capture_rate) },
    { id: 7, label: t('pokemon.detail.labels.baseHappiness'), value: formatNumber(data.base_happiness) },
    { id: 8, label: t('pokemon.detail.labels.baseExperience'), value: formatNumber(data.base_experience) },
    { id: 9, label: t('pokemon.detail.labels.isBaby'), value: data.is_baby ? t('common.yes') : t('common.no') },
    { id: 10, label: t('pokemon.detail.labels.isMythical'), value: data.is_mythical ? t('common.yes') : t('common.no') },
    { id: 11, label: t('pokemon.detail.labels.isLegendary'), value: data.is_legendary ? t('common.yes') : t('common.no') },
    { id: 12, label: t('pokemon.detail.labels.hasGenderDifferences'), value: data.has_gender_differences ? t('common.yes') : t('common.no') },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#f8fafc_42%,#eef2ff_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <GalleryImage images={data.images} pokemon_name={data.name} external_image={data.external_image} types={data.types}/>

          <Card
            variant="elevated"
            rounded="2xl"
            className="border border-white/80 bg-white/90 shadow-xl shadow-slate-200/70"
          >
            <div className="flex h-full flex-col gap-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-3">
                  <Text as="small" color="text-slate-400" weight="semibold" className="uppercase tracking-[0.28em]">
                    {t('pokemon.detail.number', { value: String(data.order).padStart(3, '0') })}
                  </Text>
                  <Text as="h1" className="capitalize">
                    {data.name}
                  </Text>
                </div>

                <Badge tone="success" variant="soft" className="px-3 py-2">
                  {t(`pokemon.status.${data.status}`)}
                </Badge>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {attributes.map((item) => (
                  <Card key={item.id} variant="tonal" rounded="xl" className="bg-slate-50">
                    <Text as="small" color="text-slate-500" weight="semibold" className="uppercase tracking-[0.2em]">{item.label}</Text>
                    <Text as="p" size="xl" weight="bold">{item.value}</Text>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card variant="elevated" rounded="2xl" className="border border-white/80 bg-white/90">
            <div className="space-y-5">
              <Text as="h3">{t('pokemon.detail.statistics')}</Text>
              <div className="space-y-3">
                {statItems.map((item) => (
                  <BarChart
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    maxValue={255}
                    size="lg"
                  />
                ))}
              </div>
            </div>
          </Card>

          <Card variant="elevated" rounded="2xl" className="border border-white/80 bg-white/90">
            <div className="space-y-5">
              <Text as="h3">{t('pokemon.detail.abilities')}</Text>
              <div className="flex flex-wrap gap-2">
                {data.abilities.map((ability) => (
                  <Link key={ability.id} href={`/pokemon/ability/${ability.name}`} className="block focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <Badge tone={ability.is_hidden ? 'warning' : 'primary'}>
                      {formatLabel(ability.name)}
                    </Badge>
                  </Link>
                ))}
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-4">
                <Text as="h4">{t('pokemon.detail.growthRate')}</Text>
                {data.growth_rate ? (
                  <Link key={data.growth_rate.id} href={`/pokemon/growth-rate/${data.growth_rate.name}`} className="block focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <Text color="text-slate-700">
                      {formatLabel(data.growth_rate.name)}
                    </Text>
                  </Link>
                ) : (
                  <Text color="text-slate-700">
                    {t('common.unknown')}
                  </Text>
                )}

              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card rounded="lg" className="bg-white">
            <Text as="h2" className="text-xl font-semibold text-slate-950">{t('pokemon.detail.strengths')}</Text>
            <div className="mt-4 flex flex-wrap gap-2">
              {strengths.map((strength) => (
                <Link key={strength.id} href={`/pokemon/type/${strength.name}`} className="block focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <Badge
                    style={{
                      color: strength.text_color || undefined,
                      backgroundColor: strength.background_color || undefined,
                    }}
                  >
                    {translatePokemonTypeName(t, strength.name)}
                  </Badge>
                </Link>
              ))}
            </div>
          </Card>

          <Card rounded="lg" className="bg-white">
            <Text as="h2" className="text-xl font-semibold text-slate-950">{t('pokemon.detail.weaknesses')}</Text>
            <div className="mt-4 flex flex-wrap gap-2">
              {weaknesses.map((weakness) => (
                <Link key={weakness.id} href={`/pokemon/type/${weakness.name}`} className="block focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <Badge
                    style={{
                      color: weakness.text_color || undefined,
                      backgroundColor: weakness.background_color || undefined,
                    }}
                  >
                    {translatePokemonTypeName(t, weakness.name)}
                  </Badge>
                </Link>
              ))}
            </div>
          </Card>
        </section>

        <section className="flex flex-col gap-6">
          <MovesExpand moves={data.moves}/>

          <EvolutionTimeline pokemon={data}/>

          <Card variant="elevated" rounded="2xl" className="border border-white/80 bg-white/90">
            <Text as="h2" className="text-xl font-semibold text-slate-950">{t('pokemon.detail.found')}</Text>
            {data.encounters && data.encounters.length > 0
              ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {data.encounters.map((encounter) => (
                    <Link key={encounter.id} href={`/pokemon/encounter/${encounter.name}`} className="block focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <Badge random={true}>
                        {normalizedName(encounter.name)}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )
              : (
                <Text color="text-slate-700">
                  {t('common.unknown')}
                </Text>
              )
            }

          </Card>
        </section>
      </div>
    </main>
  );
}
