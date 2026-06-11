import { Badge ,Text } from '@/app/ds';
import { formatOrder ,normalizedName } from '@/app/utils';
import { TPokemon } from '@/app/ui';
import { useAppTranslation } from '@/app/i18n';
import { useMemo } from 'react';

type PokemonCardHeaderProps = {
  name?: string;
  hide?: boolean;
  order: TPokemon['order'];
  status: TPokemon['status'];
  nickname?: string;
};

export default function PokemonCardHeader({ name, hide = false, order, status, nickname }: PokemonCardHeaderProps) {
  const { t } = useAppTranslation();

  const display = nickname || name;

  const displayName = useMemo(() => {
    if (!display) {
      return t('pokemon.unknown');
    }
    return normalizedName(display);
  }, [display, t]);

  const displaySubName = useMemo(() => {
    if (name && name !== display) {
      return name;
    }
    return undefined;
  }, [name, display]);

  return (
    <div className="space-y-3 px-1 pb-1 pt-4">
      <div className="flex items-center justify-between gap-2">
        <Text
          size="sm"
          color="text-slate-400"
          weight="extrabold"
          className="uppercase tracking-[0.16em]"
        >
          {formatOrder(order)}
        </Text>
        <Badge tone={status === 'COMPLETE' ? 'success' : 'warning'} variant="soft">
          {t(`pokemon.status.${status}`)}
        </Badge>
      </div>

      <div className="flex space-y-1 flex-col gap-2">
        <Text
          as="h3"
          size="3xl"
          color={hide ? 'text-slate-400' : undefined}
          tracking="tight"
          leading="none"
          className="font-black"
        >
          { displayName }
          { displaySubName && !hide && (
            <Text
              as="p"
              size="sm"
              className="font-medium text-slate-500">
              ({ normalizedName(displaySubName) })
            </Text>
          ) }
        </Text>
      </div>
    </div>
  );
}
