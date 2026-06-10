import { TPokemon } from '@/app/ui';
import { Badge ,Card ,Text } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import { formatLabel ,formatNumber } from '@/app/utils';

type PokemonFeaturesProps = Pick<
  TPokemon ,
  'name' |
  'order' |
  'shape' |
  'status' |
  'height' |
  'weight' |
  'habitat' |
  'is_baby' |
  'is_mythical' |
  'is_legendary' |
  'capture_rate' |
  'hatch_counter' |
  'base_happiness' |
  'base_experience' |
  'has_gender_differences'
> &
{
  nickname ? : string;
}
export default function PokemonFeatures({
  name,
  order,
  shape,
  status,
  height,
  weight,
  habitat,
  is_baby,
  is_mythical,
  is_legendary,
  capture_rate,
  hatch_counter,
  base_happiness,
  base_experience,
  has_gender_differences
}: PokemonFeaturesProps) {

  const { t } = useAppTranslation();

  const attributes = [
    { id: 1, label: t('pokemon.detail.labels.height'), value: formatNumber(height) },
    { id: 2, label: t('pokemon.detail.labels.weight'), value: formatNumber(weight) },
    { id: 3, label: t('pokemon.detail.labels.habitat'), value: habitat ? formatLabel(habitat.name) : t('common.unknown') },
    { id: 4, label: t('pokemon.detail.labels.shape'), value: shape ? formatLabel(shape.name) : t('common.unknown') },
    { id: 5, label: t('pokemon.detail.labels.hatchCounter'), value: formatNumber(hatch_counter) },
    { id: 6, label: t('pokemon.detail.labels.captureRate'), value: formatNumber(capture_rate) },
    { id: 7, label: t('pokemon.detail.labels.baseHappiness'), value: formatNumber(base_happiness) },
    { id: 8, label: t('pokemon.detail.labels.baseExperience'), value: formatNumber(base_experience) },
    { id: 9, label: t('pokemon.detail.labels.isBaby'), value: is_baby ? t('common.yes') : t('common.no') },
    { id: 10, label: t('pokemon.detail.labels.isMythical'), value: is_mythical ? t('common.yes') : t('common.no') },
    { id: 11, label: t('pokemon.detail.labels.isLegendary'), value: is_legendary ? t('common.yes') : t('common.no') },
    { id: 12, label: t('pokemon.detail.labels.hasGenderDifferences'), value: has_gender_differences ? t('common.yes') : t('common.no') },
  ];

  return (
    <Card
      variant="elevated"
      rounded="2xl"
      className="border border-white/80 bg-white/90 shadow-xl shadow-slate-200/70"
    >
      <div className="flex h-full flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <Text as="small" color="text-slate-400" weight="semibold" className="uppercase tracking-[0.28em]">
              {t('pokemon.detail.number', { value: String(order).padStart(3, '0') })}
            </Text>
            <Text as="h1" className="capitalize">
              {name}
            </Text>
          </div>

          <Badge tone="success" variant="soft" className="px-3 py-2">
            {t(`pokemon.status.${status}`)}
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
  );
}