'use client';
import { useDetail } from '@/app/ui/hooks/detail';
import { DetailsPage ,pokemonBffService ,TPokemonAbility } from '@/app/ui';
import { useAppTranslation } from '@/app/i18n';
import { Badge ,Card ,Text } from '@/app/ds';
import { MdAutoAwesome } from 'react-icons/md';
import { formatOrder } from '@/app/utils';

type AbilityDetailsProps = {
  param?: string;
  origin?: string;
  identifier: string;
};
export default function AbilityDetails({ origin, param, identifier }: AbilityDetailsProps) {
  const { data ,isLoading ,errorMessage } = useDetail<TPokemonAbility>({ identifier ,fetchDetail: pokemonBffService.ability.fetchOne });
  const { t } = useAppTranslation();

  return (
    <DetailsPage
      origin={origin}
      domain="ability"
      param={param}
      hasData={ !!data }
      isLoading={ isLoading }
      originDomain="catalog"
      errorMessage={ errorMessage }>
      {data && (
        <>
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
        </>
      )}
    </DetailsPage>
  );
}