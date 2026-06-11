'use client';
import { useDetail } from '@/app/ui/hooks/detail';
import { DetailsPage ,pokemonBffService ,TPokemonEncounter } from '@/app/ui';
import { useAppTranslation } from '@/app/i18n';
import {
  formatLabel ,
  formatNumber ,
  formatOrder ,
  normalizedName,
} from '@/app/utils';
import { Card ,Text } from '@/app/ds';
import { GiPositionMarker } from 'react-icons/gi';

type EncounterDetailsProps = {
  param?: string;
  origin?: string;
  identifier: string;
};

export default function EncounterDetails({ origin, param, identifier }: EncounterDetailsProps) {
  const { data ,isLoading ,errorMessage } = useDetail<TPokemonEncounter>({ identifier ,fetchDetail: pokemonBffService.encounter.fetchOne });
  const { t } = useAppTranslation();

  const attributes = !data ? [] : [
    { id: 1, label: t('common.chance'), value: formatNumber(data.chance) },
    { id: 2, label: t('pokemon.encounter.minLevel'), value: formatNumber(data.min_level) },
    { id: 3, label: t('pokemon.encounter.maxLevel'), value: formatNumber(data.max_level) },
    { id: 4, label: t('pokemon.encounter.maxChance'), value: formatNumber(data.max_chance) },
    {
      id: 5,
      label: t('pokemon.encounter.condition'),
      value: data.condition ? formatLabel(data.condition) : t('common.unknown')
    },
    {
      id: 6,
      label: t('pokemon.encounter.method'),
      value: data.method ? formatLabel(data.method) : t('common.unknown')
    },
  ];

  return (
    <DetailsPage
      origin={origin}
      domain="encounter"
      param={param}
      hasData={ !!data }
      isLoading={ isLoading }
      originDomain="catalog"
      errorMessage={ errorMessage }
      domainTranslationKey="pokemon.encounter"
    >
      {data && (
        <>
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
        </>
      )}
    </DetailsPage>
  );
}