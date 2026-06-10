import type { TFunction } from 'i18next';

import { formatLabel } from '@/app/utils';

export function translatePokemonTypeName(t: TFunction, typeName: string): string {
  return t(`pokemon.type.names.${typeName}`, {
    defaultValue: formatLabel(typeName),
  });
}
