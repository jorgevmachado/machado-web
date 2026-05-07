'use client';

import { useEffect } from 'react';

import { Badge, Card, Filters, Pagination, Text, useAlert } from '@/app/ds';
import { AssociationCard } from '../../components/association-card';

import type { PokemonTypeFilters } from '../types';
import { usePokemonTypeList } from './usePokemonTypeList';
import PokemonTypeVisual from '../components/pokemon-type-visual';

const formatOrder = (order: number): string => `#${String(order).padStart(3, '0')}`;

export function PokemonTypeListView() {
  const {
    items,
    meta,
    isLoading,
    errorMessage,
    inputFilters,
    goToPage,
    applyInputFilters,
    clearInputFilters,
  } = usePokemonTypeList();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (errorMessage) {
      showAlert({ type: 'error', message: errorMessage });
    }
  }, [errorMessage, showAlert]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Text as="h1" className="text-3xl font-bold text-slate-950 sm:text-4xl">
                            Pokemon Types
            </Text>
            <Text className="mt-1 max-w-2xl text-sm text-slate-600 sm:text-base">
                            Browse type badges, colors, strengths, and weaknesses.
            </Text>
          </div>
          <Badge tone="info" variant="soft" size="lg">
            {meta.total} records
          </Badge>
        </header>

        <Filters
          filters={inputFilters}
          ariaLabel="Pokemon type filters"
          onApply={(filters) => applyInputFilters(filters as PokemonTypeFilters)}
          onClear={clearInputFilters}
        />

        {!isLoading && items.length === 0 ? (
          <Card variant="outlined" rounded="lg" className="text-center">
            <Text className="text-slate-600">No Pokemon types found.</Text>
          </Card>
        ) : null}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((type) => (
            <AssociationCard
              key={type.id}
              href={`/pokemon/type/${type.name}`}
              eyebrow={formatOrder(type.order)}
              visual={<PokemonTypeVisual type={type}/>}
              ariaLabel={`Open ${type.name} type`}
              footer={(
                <div className="flex flex-wrap gap-2">
                  <Badge tone="success" variant="soft">{type.strengths.length} strengths</Badge>
                  <Badge tone="warning" variant="soft">{type.weaknesses.length} weaknesses</Badge>
                </div>
              )}
            >
              <Text className="line-clamp-2 text-sm text-slate-600">
                {type.description ?? 'Explore damage relations and visual identity for this type.'}
              </Text>
            </AssociationCard>
          ))}
        </section>

        <Pagination
          currentPage={meta.current_page}
          totalPages={meta.total_pages}
          onPageChange={goToPage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
