import { TPokemonType ,translatePokemonTypeName } from '@/app/ui';
import { Badge } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';

type TypesBadgeProps = {
  types: Array<TPokemonType>;
}
export default function TypesBadge({ types }: TypesBadgeProps) {
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-wrap gap-2">
      {types.length > 0 ? types.map((type) => (
        <span
          key={type.id}
          className="inline-flex h-6 items-center rounded-full px-2.5 text-xs font-semibold"
          style={{
            backgroundColor: type.background_color || '#E5E7EB',
            color: type.text_color || '#111827',
          }}
        >
          {translatePokemonTypeName(t, type.name)}
        </span>
      )) : (
        <Badge tone="neutral" variant="soft">{t('pokemon.type.typesPending')}</Badge>
      )}
    </div>
  );
}