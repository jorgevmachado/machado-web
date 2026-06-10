import React ,{ useMemo } from 'react';
import { BarChart ,BarChartProps ,Card ,Text } from '@/app/ds';
import { joinClass } from '@/app/utils';
import { TProgressionAttributes } from '@/app/ui';
import { useAppTranslation } from '@/app/i18n';

type TStatEntry = BarChartProps &{
  key: string;
};

type PokemonStatsProps = Omit<TProgressionAttributes, 'level'> & {
  title?: string;
  level?: number;
  withBorder?: boolean;
}

const PokemonStats = ({
  hp = 0,
  max_hp ,
  title ,
  speed = 0,
  attack = 0,
  defense = 0,
  withBorder ,
  special_attack = 0,
  special_defense = 0,
}: PokemonStatsProps) => {
  const { t } = useAppTranslation();
  const statEntries: Array<TStatEntry> = useMemo(() => {
    return [
      {
        key: 'hp' ,
        label: t('pokemon.detail.labels.hp') ,
        value: hp ,
        compareValue: max_hp ,
        maxValue: 100,
      } ,
      { key: 'speed' ,label: t('pokemon.detail.labels.speed') ,value: speed } ,
      { key: 'attack' ,label: t('pokemon.detail.labels.attack') ,value: attack } ,
      { key: 'defense' ,label: t('pokemon.detail.labels.defense') ,value: defense } ,
      { key: 'sp-atk' ,label: t('pokemon.detail.labels.specialAttack') ,value: special_attack } ,
      { key: 'sp-def' ,label: t('pokemon.detail.labels.specialDefense') ,value: special_defense } ,
    ];
  } ,[attack, defense, hp, max_hp, special_attack, special_defense, speed, t]);

  const barChartClassName = useMemo(() => {
    const classNames= [
      'space-y-3'
    ];
    if (title) {
      classNames.push('mt-6');
    }
    return joinClass(classNames);
  }, [title]);

  return (
    <Card variant={withBorder ? 'elevated' : 'none'} shadow={withBorder ? 'sm' : 'none'}>
      {title && (
        <Text as="h3">{ title }</Text>
      )}
      <div className={ barChartClassName }>
        { statEntries.map(({ key ,label ,value ,maxValue ,compareValue }) => (
          <BarChart
            key={key}
            label={ label }
            value={ value }
            compareValue={compareValue}
            maxValue={maxValue}
            tone='auto'
            size='lg'
            formatValue={(v) => v}
          />
        )) }
      </div>
    </Card>
  );
};
export default PokemonStats;