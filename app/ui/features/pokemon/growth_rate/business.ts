import { replaceFractions } from '@/app/utils';

export const MIN_LEVEL = 1;
export const MAX_LEVEL = 100;
export const ITEM_SIZE = 6;

export const normalizeFormulaExpression = (formula: string, level: number): string | null => {
  const normalizedFormula = formula.replaceAll(/\s+/g, '').toLowerCase();
  if (!normalizedFormula) {
    return null;
  }

  const expression = replaceFractions(normalizedFormula)
    .replaceAll(/[{}]/g, (token) => (token === '{' ? '(' : ')'))
    .replaceAll('^', '**')
    .replaceAll('x', `(${String(level)})`)
    .replaceAll(/(\d|\))\(/g, '$1*(')
    .replaceAll(/\)(\d)/g, ')*$1');

  if (!/^[0-9()+\-*/.]+$/.test(expression)) {
    return null;
  }

  return expression;
};

export const evaluateFormulaExpression = (expression: string): number | null => {
  try {
    const evaluate = new Function(`return (${expression});`);
    const value = Number(evaluate());
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
};

export const calculateExperience = (level: number, formula: string, minLevel: number = MIN_LEVEL): number | undefined => {
  if (level === minLevel) {
    return 0;
  }

  const expression = normalizeFormulaExpression(formula, level);
  if (!expression) {
    return undefined;
  }

  const result = evaluateFormulaExpression(expression);
  return result && Number.isFinite(result) ? Math.floor(result) : undefined;
};