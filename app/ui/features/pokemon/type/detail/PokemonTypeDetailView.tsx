'use client';

import Link from 'next/link';

import { Card, Text } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import { AssociationCard } from '../../components/association-card';

import PokemonTypeVisual from '../components/pokemon-type-visual';
import { translatePokemonTypeName } from '../translatePokemonTypeName';
import { usePokemonTypeDetail } from './usePokemonTypeDetail';

type PokemonTypeDetailViewProps = Readonly<{
  identifier: string;
}>;

const formatOrder = (order: number | null | undefined): string => (
  order === null || order === undefined ? '#---' : `#${String(order).padStart(3, '0')}`
);

export function PokemonTypeDetailView({ identifier }: PokemonTypeDetailViewProps) {
  const { data, isLoading, errorMessage } = usePokemonTypeDetail(identifier);
  const { t } = useAppTranslation();

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <Card rounded="lg" className="mx-auto max-w-5xl text-center">
          <Text className="text-slate-600">{t('pokemon.type.detail.loading')}</Text>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <Card rounded="lg" className="mx-auto max-w-5xl text-center">
          <Text className="text-slate-600">{errorMessage || t('pokemon.type.detail.notFound')}</Text>
        </Card>
      </div>
    );
  }

  const translatedTypeName = translatePokemonTypeName(t, data.name);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Link href="/pokemon/type" className="text-sm font-semibold text-blue-700">
          {t('pokemon.type.detail.back')}
        </Link>

        <Card rounded="lg" className="bg-white">
          <Text as="h1" className="text-3xl font-bold capitalize text-slate-950 sm:text-5xl">
            {translatedTypeName}
          </Text>
          <Text className="mt-2 text-sm font-semibold text-slate-500">
            {formatOrder(data.order)}
          </Text>
          <Text className="mt-4 text-slate-700">
            {data.description || t('pokemon.type.detail.descriptionFallback')}
          </Text>
        </Card>
        {data.strengths.length > 0 && (
          <Card rounded="lg" className="bg-white">
            <Text as="h2" className="text-xl font-semibold text-slate-950">{t('pokemon.type.detail.strengths')}</Text>
            <section className="grid grid-cols-1 gap-4 mt-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.strengths.map((type) => {
                const translatedRelatedTypeName = translatePokemonTypeName(t, type.name);

                return (
                  <AssociationCard
                    key={type.id}
                    href={`/pokemon/type/${type.name}`}
                    eyebrow={formatOrder(type.order)}
                    visual={<PokemonTypeVisual type={type}/>}
                    title={translatedRelatedTypeName}
                    ariaLabel={t('pokemon.type.list.open', { name: translatedRelatedTypeName })}
                  >
                    <Text className="line-clamp-2 text-sm text-slate-600">
                      {type.description ?? t('pokemon.type.list.fallbackDescription')}
                    </Text>
                  </AssociationCard>
                );
              })}
            </section>
          </Card>
        )}

        {data.weaknesses.length > 0 && (
          <Card rounded="lg" className="bg-white">
            <Text as="h2" className="text-xl font-semibold text-slate-950">{t('pokemon.type.detail.weaknesses')}</Text>
            <section className="grid grid-cols-1 gap-4 mt-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.weaknesses.map((type) => {
                const translatedRelatedTypeName = translatePokemonTypeName(t, type.name);

                return (
                  <AssociationCard
                    key={type.id}
                    href={`/pokemon/type/${type.name}`}
                    eyebrow={formatOrder(type.order)}
                    visual={<PokemonTypeVisual type={type}/>}
                    title={translatedRelatedTypeName}
                    ariaLabel={t('pokemon.type.list.open', { name: translatedRelatedTypeName })}
                  >
                    <Text className="line-clamp-2 text-sm text-slate-600">
                      {type.description ?? t('pokemon.type.list.fallbackDescription')}
                    </Text>
                  </AssociationCard>
                );
              })}
            </section>
          </Card>
        )}

      </div>
    </div>
  );
}
