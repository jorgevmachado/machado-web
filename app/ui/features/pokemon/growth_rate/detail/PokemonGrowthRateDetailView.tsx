'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { GiStumpRegrowth } from 'react-icons/gi';

import { Card, Text } from '@/app/ds';

import { usePokemonGrowthRateDetail } from './usePokemonGrowthRateDetail';

type PokemonGrowthRateDetailViewProps = {
  identifier: string;
};

type TExperienceTableRow = {
  level: number;
  experience: number | null;
};

const MIN_LEVEL = 1;
const MAX_LEVEL = 100;

const formatOrder = (order: number): string => `#${String(order).padStart(3, '0')}`;
const formatValue = (value: number | null | undefined): string => value === null || value === undefined ? '-' : String(value);

const FRACTION_REGEX = /\\frac\{([^{}]+)\}\{([^{}]+)\}/g;

const replaceFractions = (expression: string): string => {
  const nextExpression = expression.replace(FRACTION_REGEX, '(($1)/($2))');
  return nextExpression === expression ? expression : replaceFractions(nextExpression);
};

const normalizeFormulaExpression = (formula: string, level: number): string | null => {
  const normalizedFormula = formula.replace(/\s+/g, '').toLowerCase();
  if (!normalizedFormula) {
    return null;
  }

  const expression = replaceFractions(normalizedFormula)
    .replace(/[{}]/g, (token) => (token === '{' ? '(' : ')'))
    .replace(/\^/g, '**')
    .replace(/x/g, `(${String(level)})`)
    .replace(/(\d|\))\(/g, '$1*(')
    .replace(/\)(\d)/g, ')*$1');

  if (!/^[0-9()+\-*/.]+$/.test(expression)) {
    return null;
  }

  return expression;
};

const evaluateFormulaExpression = (expression: string): number | null => {
  try {
    const evaluate = new Function(`return (${expression});`);
    const value = Number(evaluate());
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
};

const calculateExperience = (level: number, formula: string): number | null => {
  if (level === MIN_LEVEL) {
    return 0;
  }

  const expression = normalizeFormulaExpression(formula, level);
  if (!expression) {
    return null;
  }

  const result = evaluateFormulaExpression(expression);
  return Number.isFinite(result) ? Math.floor(result) : null;
};

export function PokemonGrowthRateDetailView({ identifier }: PokemonGrowthRateDetailViewProps) {
  const { data, isLoading, errorMessage } = usePokemonGrowthRateDetail(identifier);

  const experienceTableRows: TExperienceTableRow[] = useMemo(() => (
    Array.from({ length: MAX_LEVEL }, (_, index) => {
      const level = index + MIN_LEVEL;
      return {
        level,
        experience: calculateExperience(level, data?.formula ?? ''),
      };
    })
  ), [data?.formula]);

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <Card rounded="lg" className="mx-auto max-w-5xl text-center">
          <Text className="text-slate-600">Loading Pokemon growth rate...</Text>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <Card rounded="lg" className="mx-auto max-w-5xl text-center">
          <Text className="text-slate-600">{errorMessage || 'Pokemon growth rate not found.'}</Text>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Link href="/pokemon/growth-rate" className="text-sm font-semibold text-blue-700">
          Back to Growth Rates
        </Link>

        <Card rounded="lg" className="bg-white">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-700">
                <GiStumpRegrowth size={34} />
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
          </div>
        </Card>

        <section className="flex flex-col gap-6">
          <Card rounded="lg" className="bg-white">
            <Text as="h2" className="text-xl font-semibold text-slate-950">Formula</Text>
            <Text className="mt-3 text-slate-700">{data.formula || 'Formula pending.'}</Text>
          </Card>

          <Card rounded="lg" className="bg-white">
            <Text as="h2" className="text-xl font-semibold text-slate-950">Level Experience Table</Text>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm text-slate-700">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th scope="col" className="px-3 py-2 font-semibold text-slate-900">Level</th>
                    <th scope="col" className="px-3 py-2 font-semibold text-slate-900">Experience</th>
                  </tr>
                </thead>

                <tbody>
                  {experienceTableRows.map(({ level, experience }) => (
                    <tr key={level} className="border-b border-slate-100">
                      <td className="px-3 py-2">{level}</td>
                      <td className="px-3 py-2">{formatValue(experience)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
