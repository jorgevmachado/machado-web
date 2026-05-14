'use client';

import Link from 'next/link';

import { Badge, BarChart, Card, Text } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import { translatePokemonTypeName } from '@/app/ui/features/pokemon/type';
import { displayDate, formatLabel } from '@/app/utils';

import { useMyPokemonDetail } from './useMyPokemonDetail';

type MyPokemonDetailViewProps = Readonly<{
  name: string;
}>;

export function MyPokemonDetailView({ name }: MyPokemonDetailViewProps) {
  const { data, isLoading, errorMessage } = useMyPokemonDetail(name);
  const { t } = useAppTranslation();

  if (isLoading && !data) {
    return (
      <main className='min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8'>
        <Card rounded='lg' className='mx-auto max-w-5xl text-center'>
          <Text className='text-slate-600'>{t('myPokemon.detail.loading')}</Text>
        </Card>
      </main>
    );
  }

  if (!data) {
    return (
      <main className='min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8'>
        <Card rounded='lg' className='mx-auto max-w-5xl text-center'>
          <Text className='text-slate-600'>{errorMessage || t('myPokemon.detail.notFound')}</Text>
          <Link className='mt-4 inline-flex text-sm font-semibold text-blue-700' href='/my-pokemon'>
            {t('myPokemon.detail.back')}
          </Link>
        </Card>
      </main>
    );
  }

  const statItems = [
    { label: t('pokemon.detail.labels.hp'), value: data.hp, maxValue: data.max_hp },
    { label: t('pokemon.detail.labels.attack'), value: data.attack },
    { label: t('pokemon.detail.labels.defense'), value: data.defense },
    { label: t('pokemon.detail.labels.speed'), value: data.speed },
    { label: t('pokemon.detail.labels.specialAttack'), value: data.special_attack },
    { label: t('pokemon.detail.labels.specialDefense'), value: data.special_defense },
  ];

  return (
    <main className='min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#f8fafc_42%,#eef2ff_100%)] px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mx-auto flex max-w-6xl flex-col gap-6'>
        <section className='grid gap-6 lg:grid-cols-[320px_1fr]'>
          <Card variant='elevated' rounded='2xl' className='border border-white/80 bg-white/90 shadow-xl shadow-slate-200/70'>
            <div className='flex min-h-72 items-center justify-center rounded-lg bg-slate-100'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.pokemon.external_image} alt={data.nickname} className='max-h-64 object-contain p-4' />
            </div>
          </Card>

          <Card variant='elevated' rounded='2xl' className='border border-white/80 bg-white/90 shadow-xl shadow-slate-200/70'>
            <div className='flex h-full flex-col gap-6'>
              <div className='flex flex-wrap items-start justify-between gap-4'>
                <div className='space-y-3'>
                  <Text as='small' color='text-slate-400' weight='semibold' className='uppercase tracking-[0.28em]'>
                    {t('myPokemon.detail.publicName', { value: data.name })}
                  </Text>
                  <Text as='h1' className='capitalize'>
                    {data.nickname}
                  </Text>
                  <Text className='text-slate-600'>
                    {t('myPokemon.detail.basePokemon', { name: formatLabel(data.pokemon.name) })}
                  </Text>
                </div>

                <div className='flex flex-col items-end gap-2'>
                  <Badge tone='success' variant='soft' className='px-3 py-2'>
                    {t('myPokemon.list.level', { value: data.level })}
                  </Badge>
                  <Text className='text-sm text-slate-500'>
                    {t('myPokemon.detail.capturedAt', { value: displayDate(data.captured_at) })}
                  </Text>
                </div>
              </div>

              <div className='flex flex-wrap gap-2'>
                {data.pokemon.types.map((type) => (
                  <Badge
                    key={type.id}
                    style={{
                      color: type.text_color || undefined,
                      backgroundColor: type.background_color || undefined,
                    }}
                  >
                    {translatePokemonTypeName(t, type.name)}
                  </Badge>
                ))}
              </div>

              <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                <Card variant='tonal' rounded='xl' className='bg-slate-50'>
                  <Text as='small' color='text-slate-500' weight='semibold' className='uppercase tracking-[0.2em]'>{t('myPokemon.detail.experience')}</Text>
                  <Text as='p' size='xl' weight='bold'>{data.experience}</Text>
                </Card>
                <Card variant='tonal' rounded='xl' className='bg-slate-50'>
                  <Text as='small' color='text-slate-500' weight='semibold' className='uppercase tracking-[0.2em]'>{t('myPokemon.detail.hp')}</Text>
                  <Text as='p' size='xl' weight='bold'>{data.hp}/{data.max_hp}</Text>
                </Card>
                <Card variant='tonal' rounded='xl' className='bg-slate-50'>
                  <Text as='small' color='text-slate-500' weight='semibold' className='uppercase tracking-[0.2em]'>{t('myPokemon.detail.pokeballs')}</Text>
                  <Text as='p' size='xl' weight='bold'>{data.trainer.pokeballs}</Text>
                </Card>
                <Card variant='tonal' rounded='xl' className='bg-slate-50'>
                  <Text as='small' color='text-slate-500' weight='semibold' className='uppercase tracking-[0.2em]'>{t('myPokemon.detail.captureRate')}</Text>
                  <Text as='p' size='xl' weight='bold'>{data.trainer.capture_rate}</Text>
                </Card>
              </div>
            </div>
          </Card>
        </section>

        <section className='grid gap-6 xl:grid-cols-[1.2fr_0.8fr]'>
          <Card variant='elevated' rounded='2xl' className='border border-white/80 bg-white/90'>
            <div className='space-y-5'>
              <Text as='h3'>{t('pokemon.detail.statistics')}</Text>
              <div className='space-y-3'>
                {statItems.map((item) => (
                  <BarChart
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    maxValue={item.maxValue ?? 255}
                    size='lg'
                  />
                ))}
              </div>
            </div>
          </Card>

          <Card variant='elevated' rounded='2xl' className='border border-white/80 bg-white/90'>
            <div className='space-y-5'>
              <Text as='h3'>{t('myPokemon.detail.moves')}</Text>
              <div className='space-y-3'>
                {data.moves.map((move) => (
                  <Card key={move.id} variant='tonal' rounded='xl' className='bg-slate-50'>
                    <div className='flex items-start justify-between gap-4'>
                      <div>
                        <Text as='h4' className='font-semibold text-slate-950'>{formatLabel(move.pokemon_move_name)}</Text>
                        <Text className='text-sm text-slate-600'>{t('myPokemon.detail.moveMeta', { type: move.pokemon_move_type, power: move.pokemon_move_power, accuracy: move.pokemon_move_accuracy })}</Text>
                      </div>
                      <Badge tone='primary' variant='soft'>
                        {t('myPokemon.detail.movePp', { current: move.pp, max: move.max_pp })}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
