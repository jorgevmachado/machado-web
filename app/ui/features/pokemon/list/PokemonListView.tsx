'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { Badge, Card, Filters, Image, Pagination, Text, useAlert } from '@/app/ds';

import { usePokemonList } from './usePokemonList';
import type { PokemonListFilters } from '../types';

const formatOrder = (order: number): string => `#${String(order).padStart(4, '0')}`;

export function PokemonListView() {
  const {
    items,
    meta,
    isLoading,
    errorMessage,
    inputFilters,
    goToPage,
    applyInputFilters,
    clearInputFilters,
  } = usePokemonList();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (errorMessage) {
      showAlert({ type: 'error', message: errorMessage });
    }
  }, [errorMessage, showAlert]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Text as="h1" className="text-3xl font-bold text-slate-950 sm:text-4xl">
              Pokemon
            </Text>
            <Text className="mt-1 max-w-2xl text-sm text-slate-600 sm:text-base">
              Browse the local catalog and open a Pokemon to enrich its complete profile.
            </Text>
          </div>
          <Badge tone="info" variant="soft" size="lg">
            {meta.total} records
          </Badge>
        </header>

        <Filters
          filters={inputFilters}
          ariaLabel="Pokemon filters"
          onApply={(filters) => applyInputFilters(filters as PokemonListFilters)}
          onClear={clearInputFilters}
        />

        {!isLoading && items.length === 0 ? (
          <Card variant="outlined" rounded="lg" className="text-center">
            <Text className="text-slate-600">No Pokemon found.</Text>
          </Card>
        ) : null}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((pokemon) => (
            <Link key={pokemon.id} href={`/pokemon/${pokemon.name}`} className="block focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Card
                variant="elevated"
                rounded="lg"
                hoverEffect="lift"
                interactive
                className="flex h-full flex-col gap-4 border-slate-200 bg-white"
              >
                <div className="flex min-h-44 items-center justify-center rounded-lg bg-slate-100">
                  <Image
                    src={pokemon.external_image}
                    alt={pokemon.name}
                    size="md"
                    fit="contain"
                    className="p-4"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Text as="h2" className="truncate text-xl font-semibold capitalize text-slate-950">
                        {pokemon.name}
                      </Text>
                      <Text className="text-sm font-semibold text-slate-500">
                        {formatOrder(pokemon.order)}
                      </Text>
                    </div>
                    <Badge tone={pokemon.status === 'COMPLETE' ? 'success' : 'warning'} variant="soft">
                      {pokemon.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pokemon.types.length > 0 ? pokemon.types.map((type) => (
                      <span
                        key={type.id}
                        className="inline-flex h-6 items-center rounded-full px-2.5 text-xs font-semibold"
                        style={{
                          backgroundColor: type.background_color || '#E5E7EB',
                          color: type.text_color || '#111827',
                        }}
                      >
                        {type.name}
                      </span>
                    )) : (
                      <Badge tone="neutral" variant="soft">types pending</Badge>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </section>

        <Pagination
          currentPage={meta.current_page}
          totalPages={meta.total_pages}
          onPageChange={goToPage}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}
