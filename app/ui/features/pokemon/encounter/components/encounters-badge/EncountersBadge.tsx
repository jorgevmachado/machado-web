import { Badge ,Card ,Text } from '@/app/ds';
import Link from 'next/link';
import { normalizedName } from '@/app/utils';
import { TPokemonEncounter } from '@/app/ui';
import { useAppTranslation } from '@/app/i18n';

type EncountersBadgeProps = {
  encounters?: Array<TPokemonEncounter & { href: string }>;
}
export default function EncountersBadge({ encounters }: EncountersBadgeProps) {
  const { t } = useAppTranslation();
  return (
    <Card variant="elevated" rounded="2xl" className="border border-white/80 bg-white/90">
      <Text as="h2" className="text-xl font-semibold text-slate-950">{t('common.found')}</Text>
      {encounters && encounters.length > 0
        ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {encounters.map((encounter) => (
              <Link key={encounter.id} href={encounter.href} className="block focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Badge random={true}>
                  {normalizedName(encounter.name)}
                </Badge>
              </Link>
            ))}
          </div>
        )
        : (
          <Text color="text-slate-700">
            {t('common.unknown')}
          </Text>
        )
      }

    </Card>
  );
}