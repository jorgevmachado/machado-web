'use client';
import { TPokedex } from '@/app/ui';
import { Badge ,Button ,Card ,Text } from '@/app/ds';
import { displayDate ,formatLabel } from '@/app/utils';
import { useAppTranslation } from '@/app/i18n';
import { useMemo ,useState } from 'react';

type LatestDiscoveriesProps = {
  pokedex: TPokedex;
  item_size?: number;
};
export default function LatestDiscoveries({ pokedex, item_size = 6 }: LatestDiscoveriesProps) {
  const { t } = useAppTranslation();
  
  const [visibleItems, setVisibleItems] = useState<number>(item_size);
  
  const latest_discoveries = useMemo(() => {
    if (!pokedex) {
      return [];
    }
    return pokedex.entries
      .filter((item) => item.discovered)
      .filter(
        (item): item is typeof item & { discovered_at: Date } =>
          item.discovered_at !== undefined,
      )
      .sort((a, b) => b.discovered_at.getTime() - a.discovered_at.getTime());
  }, [pokedex]);
  
  const hasMoreItems = useMemo(() => {
    return visibleItems < latest_discoveries.length;
  }, [latest_discoveries.length, visibleItems]);
  
  const latestDiscoveriesToRender = useMemo(() => {
    return latest_discoveries.slice(0, visibleItems);
  }, [latest_discoveries, visibleItems]);

  return (
    <Card rounded='lg' variant='elevated'>
      <div className='mb-4 flex items-center justify-between'>
        <Text as='h2' className='text-lg font-semibold'>{t('home.dashboard.latestDiscoveries')}</Text>
        <Badge tone='info' variant='soft'>{latest_discoveries.length}</Badge>
      </div>

      <div className='grid gap-3'>
        {latestDiscoveriesToRender.length ? latestDiscoveriesToRender.map((entry) => (
          <div key={entry.id} className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3'>
            <Text as='h3' className='font-semibold'>{formatLabel(entry.name)}</Text>
            <Text className='text-sm text-slate-500'>
              {entry?.discovered_at ? displayDate(entry?.discovered_at?.toString()) : t('home.dashboard.noDiscoveryDate')}
            </Text>
          </div>
        )) : (
          <Text className='text-sm text-slate-500'>
            {t('home.dashboard.noDiscoveries')}
          </Text>
        )}
      </div>
      { hasMoreItems && (
        <div className="flex justify-center pt-2">
          <Button
            type="button"
            size="lg"
            appearance="outlineBorderless"
            onClick={() => {
              setVisibleItems((currentValue) => {
                return Math.min(currentValue + item_size, latest_discoveries.length);
              });
            }}
          >
            {t('common.viewMore', { count: item_size })}
          </Button>
        </div>
      ) }
    </Card>
  );
}