'use client';

import { useDetail } from '@/app/ui/hooks/detail';
import { DetailsPage ,pokemonBffService ,TPokemonGrowthRate } from '@/app/ui';
import { useAppTranslation } from '@/app/i18n';
import { useMemo ,useState } from 'react';
import { formatOrder ,formatValue } from '@/app/utils';
import { Button ,Card ,Text } from '@/app/ds';
import { GiStumpRegrowth } from 'react-icons/gi';
import {
  calculateExperience ,ITEM_SIZE ,MAX_LEVEL ,
  MIN_LEVEL ,
} from '@/app/ui/features/pokemon/growth_rate/business';

type TExperienceTableRow = {
  level: number;
  experience?: number;
};

type GrowthRateDetailsProps = {
  param?: string;
  origin?: string;
  identifier: string;
};

export default function GrowthRateDetails({ origin, param, identifier }: GrowthRateDetailsProps) {
  const { data ,isLoading ,errorMessage } = useDetail<TPokemonGrowthRate>({ identifier ,fetchDetail: pokemonBffService.growthRate.fetchOne });
  const { t } = useAppTranslation();

  const experienceTableRows: TExperienceTableRow[] = useMemo(() => (
    Array.from({ length: MAX_LEVEL }, (_, index) => {
      const level = index + MIN_LEVEL;
      return {
        level,
        experience: calculateExperience(level, data?.formula ?? ''),
      };
    })
  ), [data?.formula]);

  const [visibleExperiences, setVisibleExperiences] = useState<number>(ITEM_SIZE);
  const experienceToRender = experienceTableRows.slice(0, visibleExperiences);
  const hasMoreExperiences = experienceTableRows.length > visibleExperiences;

  return (
    <DetailsPage
      origin={origin}
      domain="growth-rate"
      param={param}
      hasData={ !!data }
      isLoading={ isLoading }
      originDomain="catalog"
      errorMessage={ errorMessage }
      domainTranslationKey="pokemon.growthRate"
    >
      {data && (
        <>
          <Card rounded="lg" className="bg-white">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="flex gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                  <GiStumpRegrowth size={34} />
                </div>
                <div>
                  <Text as="h1" className="text-3xl font-bold capitalize text-slate-950 sm:text-5xl">
                    {data.name}
                  </Text>
                  <Text className="mt-2 text-sm font-semibold text-slate-500">
                    {formatOrder(data.order)}
                  </Text>
                  <Text className="mt-3 text-slate-700">{t('pokemon.growthRate.formula')}: {data.formula || t('pokemon.growthRate.formulaPending')}</Text>
                </div>
              </div>
            </div>
          </Card>

          <section className="grid gap-6">
            <Card rounded="lg" className="bg-white">
              <Text as="h2" className="text-xl font-semibold text-slate-950">{t('pokemon.growthRate.tableTitle')}</Text>

              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full border-collapse text-left text-sm text-slate-700">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th scope="col"
                        className="px-3 py-2 font-semibold text-slate-900">{t('pokemon.level')}</th>
                      <th scope="col"
                        className="px-3 py-2 font-semibold text-slate-900">{t('pokemon.experience')}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {experienceToRender.map(({ level, experience }) => (
                      <tr key={level} className="border-b border-slate-100">
                        <td className="px-3 py-2">{level}</td>
                        <td className="px-3 py-2">{formatValue(experience)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {hasMoreExperiences ? (
                  <div className="flex justify-center pt-2 mb-2">
                    <Button
                      type="button"
                      size="lg"
                      appearance="outlineBorderless"
                      onClick={() => {
                        setVisibleExperiences((currentValue) => {
                          return Math.min(currentValue + ITEM_SIZE, experienceTableRows.length);
                        });
                      }}
                    >
                      {t('common.viewMore', { count: ITEM_SIZE })}
                    </Button>
                  </div>
                ) : null}

              </div>
            </Card>

          </section>
        </>
      )}
    </DetailsPage>
  );
  
}