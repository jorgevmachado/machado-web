'use client';

import Link from 'next/link';

import { Badge, Card, Image, Text } from '@/app/ds';

import { usePokemonDetail } from './usePokemonDetail';
import type { PokemonDetail } from '../types';

type PokemonDetailViewProps = {
  identifier: string;
};

const statEntries = [
  ['HP', 'hp'],
  ['Attack', 'attack'],
  ['Defense', 'defense'],
  ['Sp. Attack', 'special_attack'],
  ['Sp. Defense', 'special_defense'],
  ['Speed', 'speed'],
] as const;

const uniqueById = <T extends { id: string }>(items: T[]): T[] => {
  const seenIds = new Set<string>();

  return items.filter((item) => {
    if (seenIds.has(item.id)) {
      return false;
    }

    seenIds.add(item.id);
    return true;
  });
};

const getPrimaryImage = (pokemon: PokemonDetail): string => {
  return pokemon.images?.front_image || pokemon.external_image;
};

const getGalleryImages = (pokemon: PokemonDetail): string[] => {
  const imageSet = new Set<string>();

  if (pokemon.images?.front_image) {
    imageSet.add(pokemon.images.front_image);
  }

  if (pokemon.images?.back_image) {
    imageSet.add(pokemon.images.back_image);
  }

  pokemon.images?.images.forEach((image) => {
    if (image) {
      imageSet.add(image);
    }
  });

  return Array.from(imageSet);
};

export function PokemonDetailView({ identifier }: PokemonDetailViewProps) {
  const { data, isLoading, errorMessage } = usePokemonDetail(identifier);

  if (isLoading && !data) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <Card rounded="lg" className="mx-auto max-w-5xl text-center">
          <Text className="text-slate-600">Loading Pokemon...</Text>
        </Card>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <Card rounded="lg" className="mx-auto max-w-5xl text-center">
          <Text className="text-slate-600">{errorMessage || 'Pokemon not found.'}</Text>
          <Link className="mt-4 inline-flex text-sm font-semibold text-blue-700" href="/pokemon">
            Back to list
          </Link>
        </Card>
      </main>
    );
  }

  const primaryImage = getPrimaryImage(data);
  const galleryImages = getGalleryImages(data);
  const weaknesses = uniqueById(data.types.flatMap((type) => type.weaknesses ?? []));
  const strengths = uniqueById(data.types.flatMap((type) => type.strengths ?? []));

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <Link href="/pokemon" className="text-sm font-semibold text-blue-700">
          Back to Pokemon
        </Link>

        <section className="grid gap-6 lg:grid-cols-[minmax(280px,420px)_1fr]">
          <Card rounded="lg" className="flex flex-col gap-4 bg-white">
            <div className="flex min-h-80 items-center justify-center rounded-lg bg-slate-100">
              <Image src={primaryImage} alt={data.name} size="xl" fit="contain" className="p-5" />
            </div>
            {galleryImages.length > 1 ? (
              <div className="grid grid-cols-3 gap-2">
                {galleryImages.slice(0, 6).map((image) => (
                  <div key={image} className="flex h-20 items-center justify-center rounded-lg border border-slate-200 bg-white">
                    <Image src={image} alt={data.name} size="sm" fit="contain" className="p-2" />
                  </div>
                ))}
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2">
              {data.types.map((type) => (
                <span
                  key={type.id}
                  className="inline-flex h-7 items-center rounded-full px-3 text-sm font-semibold"
                  style={{
                    backgroundColor: type.background_color || '#E5E7EB',
                    color: type.text_color || '#111827',
                  }}
                >
                  {type.name}
                </span>
              ))}
            </div>
          </Card>

          <div className="flex flex-col gap-6">
            <Card rounded="lg" className="bg-white">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Text as="h1" className="text-3xl font-bold capitalize text-slate-950 sm:text-5xl">
                    {data.name}
                  </Text>
                  <Text className="mt-1 text-sm font-semibold text-slate-500">
                    #{String(data.order).padStart(4, '0')}
                  </Text>
                </div>
                <Badge tone={data.status === 'COMPLETE' ? 'success' : 'warning'} variant="soft" size="lg">
                  {data.status}
                </Badge>
              </div>
              {data.description ? (
                <Text className="mt-4 text-slate-700">{data.description}</Text>
              ) : null}
            </Card>

            <Card rounded="lg" className="bg-white">
              <Text as="h2" className="text-xl font-semibold text-slate-950">Stats</Text>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {statEntries.map(([label, key]) => (
                  <div key={key} className="rounded-lg border border-slate-200 p-3">
                    <Text className="text-xs font-semibold uppercase text-slate-500">{label}</Text>
                    <Text className="text-2xl font-bold text-slate-950">{data[key] ?? 0}</Text>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card rounded="lg" className="bg-white">
            <Text as="h2" className="text-xl font-semibold text-slate-950">Abilities</Text>
            <div className="mt-4 flex flex-wrap gap-2">
              {data.abilities.map((ability) => (
                <Link key={ability.id} href={`/pokemon/ability/${ability.name}`} className="block focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <Badge tone="info" variant="soft">
                    {ability.name}
                  </Badge>
                </Link>
              ))}
              {data.abilities.length === 0 ? (
                <Badge tone="neutral" variant="soft">abilities pending</Badge>
              ) : null}
            </div>
          </Card>

          <Card rounded="lg" className="bg-white">
            <Text as="h2" className="text-xl font-semibold text-slate-950">Strengths</Text>
            <div className="mt-4 flex flex-wrap gap-2">
              {strengths.map((strength, index) => (
                <Link key={strength.id} href={`/pokemon/type/${strength.name}`} className="block focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <Badge
                    key={`${strength.id}-${index}`}
                    style={{
                      color: strength.text_color || undefined,
                      backgroundColor: strength.background_color || undefined,
                    }}
                  >
                    {strength.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </Card>

          <Card rounded="lg" className="bg-white">
            <Text as="h2" className="text-xl font-semibold text-slate-950">Weaknesses</Text>
            <div className="mt-4 flex flex-wrap gap-2">
              {weaknesses.map((weakness, index) => (
                <Link key={weakness.id} href={`/pokemon/type/${weakness.name}`} className="block focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <Badge
                    key={`${weakness.id}-${index}`}
                    style={{
                      color: weakness.text_color || undefined,
                      backgroundColor: weakness.background_color || undefined,
                    }}
                  >
                    {weakness.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </Card>
        </section>

        <section className="flex flex-wrap gap-2">
          <Card rounded="lg" className="bg-white">
            <Text as="h2" className="text-xl font-semibold text-slate-950">Moves</Text>
            <div className="mt-4 flex max-h-40 flex-wrap gap-2 overflow-auto pr-1">
              {data.moves.slice(0, 24).map((move) => (
                <Link key={move.id} href={`/pokemon/move/${move.name}`} className="block focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <Badge tone="neutral" variant="soft">
                    {move.name}
                  </Badge>
                </Link>
              ))}
              {data.moves.length === 0 ? (
                <Badge tone="neutral" variant="soft">moves pending</Badge>
              ) : null}
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
