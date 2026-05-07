'use client';

import { useEffect } from 'react';
import { GiStumpRegrowth } from 'react-icons/gi';

import { Badge, Card, Filters, Pagination, Text, useAlert } from '@/app/ds';
import { AssociationCard } from '../../components/association-card';

import type { PokemonGrowthRateFilters } from '../types';
import { usePokemonGrowthRateList } from './usePokemonGrowthRateList';

const formatOrder = (order: number): string => `#${String(order).padStart(3, '0')}`;
const formatValue = (value: number | null | undefined): string => value === null || value === undefined ? '-' : String(value);

export function PokemonGrowthRateListView() {
  const {
    items,
    meta,
    isLoading,
    errorMessage,
    inputFilters,
    goToPage,
    applyInputFilters,
    clearInputFilters,
  } = usePokemonGrowthRateList();
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
              Pokemon Growth Rate
            </Text>
          </div>
          <Badge tone="info" variant="soft" size="lg">
            {meta.total} records
          </Badge>
        </header>

        <Filters
          filters={inputFilters}
          ariaLabel="Pokemon growth rate filters"
          onApply={(filters) => applyInputFilters(filters as PokemonGrowthRateFilters)}
          onClear={clearInputFilters}
        />

        {!isLoading && items.length === 0 ? (
          <Card variant="outlined" rounded="lg" className="text-center">
            <Text className="text-slate-600">No Pokemon growth rate found.</Text>
          </Card>
        ) : null}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((growth_rate) => (
            <AssociationCard
              key={growth_rate.id}
              href={`/pokemon/growth-rate/${growth_rate.name}`}
              title={growth_rate.name}
              eyebrow={formatOrder(growth_rate.order)}
              ariaLabel={`Open ${growth_rate.name} growth_rate`}
              visual={(
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                  <GiStumpRegrowth size={30} />
                </div>
              )}
            >
              <Text className="line-clamp-3 text-sm text-slate-700">
                {growth_rate.formula || 'Formula pending.'}
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
