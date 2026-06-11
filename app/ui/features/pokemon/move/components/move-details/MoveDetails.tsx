'use client';
import { useDetail } from '@/app/ui/hooks/detail';
import { DetailsPage ,pokemonBffService ,TPokemonMove } from '@/app/ui';
import { useAppTranslation } from '@/app/i18n';
import { Badge ,Card ,Text } from '@/app/ds';
import { GiPunchBlast } from 'react-icons/gi';
import { formatOrder ,formatValue } from '@/app/utils';

type MoveDetailsProps = {
  param?: string;
  origin?: string;
  identifier: string;
}

export default function MoveDetails({ origin, param, identifier }: MoveDetailsProps) {
  const { data ,isLoading ,errorMessage } = useDetail<TPokemonMove>({ identifier ,fetchDetail: pokemonBffService.move.fetchOne });
  const { t } = useAppTranslation();

  return (
    <DetailsPage
      origin={origin}
      domain="move"
      param={param}
      hasData={ !!data }
      isLoading={ isLoading }
      originDomain="catalog"
      errorMessage={ errorMessage }
      domainTranslationKey="pokemon.move"
    >
      {data && (
        <>
          <Card rounded="lg" className="bg-white">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="flex gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
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
                <Text as="h2" className="text-xl font-semibold text-slate-950">{t('pokemon.move.shortEffect')}</Text>
                <Text className="mt-3 text-slate-700">{data.short_effect || t('pokemon.move.shortEffectPending')}</Text>
              </Card>

              <Card rounded="lg" className="bg-white">
                <Text as="h2" className="text-xl font-semibold text-slate-950">{t('pokemon.move.effect')}</Text>
                <Text className="mt-3 whitespace-pre-line text-slate-700">{data.effect || t('pokemon.move.effectPending')}</Text>
              </Card>
            </div>

            <Card rounded="lg" className="bg-white">
              <Text as="h2" className="text-xl font-semibold text-slate-950">{t('pokemon.move.moveData')}</Text>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  [t('pokemon.move.power',), formatValue(data.power)],
                  [t('pokemon.move.accuracy'), formatValue(data.accuracy)],
                  [t('pokemon.move.pp'), formatValue(data.pp)],
                  [t('common.chance'), formatValue(data.effect_chance)],
                  [t('pokemon.move.target'), data.target || '-'],
                  [t('pokemon.move.class'), data.damage_class || '-'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-slate-200 p-3">
                    <Text className="text-xs font-semibold uppercase text-slate-500">{label}</Text>
                    <Text className="mt-1 break-words text-lg font-bold text-slate-950">{value}</Text>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </>
      )}
    </DetailsPage>
  );

}