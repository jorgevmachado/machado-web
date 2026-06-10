'use client';
import {
  DetailsPage ,
  pokemonBffService ,
  TPokemonType ,
  translatePokemonTypeName ,
} from '@/app/ui';
import { useDetail } from '@/app/ui/hooks/detail';
import { useAppTranslation } from '@/app/i18n';
import { Card, Text, Image } from '@/app/ds';
import { buildPathRelations ,formatOrder } from '@/app/utils';
import Link from 'next/link';

type TypeDetailsProps = {
  param?: string;
  origin?: string;
  identifier: string;
}

export default function TypeDetails({ origin, param, identifier }: TypeDetailsProps) {
  const { data ,isLoading ,errorMessage } = useDetail<TPokemonType>({ identifier ,fetchDetail: pokemonBffService.type.fetchOne });
  const { t } = useAppTranslation();

  const translatedTypeName = translatePokemonTypeName(t, data?.name ?? '');

  return (
    <DetailsPage
      origin={origin}
      domain="type"
      param={param}
      hasData={ !!data }
      isLoading={ isLoading }
      originDomain="catalog"
      errorMessage={ errorMessage }>
      {data && (
        <>
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
                    <Link
                      href={buildPathRelations({
                        origin,
                        param,
                        relation:'type',
                        identifier: type.name,
                      })}
                      key={type.id}
                      aria-label={type.name}
                      className="block h-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Card
                        variant="elevated"
                        rounded="lg"
                        hoverEffect="lift"
                        interactive
                        className="flex h-full min-h-72 flex-col gap-4 border-slate-200 bg-white"
                      >
                        <div className="flex min-h-24 items-center justify-center rounded-lg bg-slate-100 p-4">
                          {
                            type.badge_url ? (
                              <Image
                                src={type.badge_url}
                                alt={`${translatePokemonTypeName(t, type.name)} badge`}
                                size="lg"
                                fit="contain"
                                className="max-h-20"
                              />
                            ) : (
                              <span
                                className="inline-flex min-h-16 min-w-32 items-center justify-center rounded-lg px-5 text-lg font-bold capitalize shadow-sm"
                                style={{
                                  backgroundColor: type.background_color || '#E5E7EB',
                                  color: type.text_color || '#111827',
                                }}
                              >
                                {translatePokemonTypeName(t, type.name)}
                              </span>
                            )
                          }
                        </div>

                        <div className="flex flex-1 flex-col gap-3">
                          <Text className="text-xs font-semibold uppercase text-slate-500">
                            {formatOrder(type.order)}
                          </Text>
                          <Text as="h2" className="truncate text-xl font-semibold capitalize text-slate-950">
                            {translatedRelatedTypeName}
                          </Text>

                          <div className="flex flex-1 flex-col gap-3">
                            <Text className="line-clamp-2 text-sm text-slate-600">
                              {type.description ?? t('pokemon.type.list.fallbackDescription')}
                            </Text>
                          </div>
                        </div>
                      </Card>
                    </Link>
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
                    <Link
                      href={buildPathRelations({
                        origin,
                        param,
                        relation:'type',
                        identifier: type.name,
                      })}
                      key={type.id}
                      aria-label={type.name}
                      className="block h-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Card
                        variant="elevated"
                        rounded="lg"
                        hoverEffect="lift"
                        interactive
                        className="flex h-full min-h-72 flex-col gap-4 border-slate-200 bg-white"
                      >
                        <div className="flex min-h-24 items-center justify-center rounded-lg bg-slate-100 p-4">
                          {
                            type.badge_url ? (
                              <Image
                                src={type.badge_url}
                                alt={`${translatePokemonTypeName(t, type.name)} badge`}
                                size="lg"
                                fit="contain"
                                className="max-h-20"
                              />
                            ) : (
                              <span
                                className="inline-flex min-h-16 min-w-32 items-center justify-center rounded-lg px-5 text-lg font-bold capitalize shadow-sm"
                                style={{
                                  backgroundColor: type.background_color || '#E5E7EB',
                                  color: type.text_color || '#111827',
                                }}
                              >
                                {translatePokemonTypeName(t, type.name)}
                              </span>
                            )
                          }
                        </div>

                        <div className="flex flex-1 flex-col gap-3">
                          <Text className="text-xs font-semibold uppercase text-slate-500">
                            {formatOrder(type.order)}
                          </Text>
                          <Text as="h2" className="truncate text-xl font-semibold capitalize text-slate-950">
                            {translatedRelatedTypeName}
                          </Text>

                          <div className="flex flex-1 flex-col gap-3">
                            <Text className="line-clamp-2 text-sm text-slate-600">
                              {type.description ?? t('pokemon.type.list.fallbackDescription')}
                            </Text>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </section>
            </Card>
          )}
        </>
      )}
    </DetailsPage>
  );
}