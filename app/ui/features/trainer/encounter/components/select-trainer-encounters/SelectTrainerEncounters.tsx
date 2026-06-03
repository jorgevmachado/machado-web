'use client';
import { Badge ,Button ,Card ,Text ,useAlert ,useLoading } from '@/app/ds';
import { formatLabel } from '@/app/utils';
import { useAppTranslation } from '@/app/i18n';
import { trainerEncounterBffService ,TTrainerEncounter } from '@/app/ui';
import { useCallback ,useMemo ,useState } from 'react';

type SelectTrainerEncountersProps = {
  item_size?: number;
  selected_encounter?: (selectedEncounter: TTrainerEncounter) => void;
  trainer_encounters: Array<TTrainerEncounter>;
};

export default function SelectTrainerEncounters({
  item_size = 2,
  trainer_encounters,
  selected_encounter
}: SelectTrainerEncountersProps) {

  const { t } = useAppTranslation();
  const { showAlert } = useAlert();
  
  const [trainerEncounters, setTrainerEncounters] = useState<Array<TTrainerEncounter>>(trainer_encounters);
  const [visibleItems, setVisibleItems] = useState<number>(item_size);

  const trainerEncountersToRender = useMemo(() => {
    const sortedTrainerEncounters = trainerEncounters.sort((a, b) => Number(b.is_active) - Number(a.is_active));
    return sortedTrainerEncounters.slice(0, visibleItems);
  }, [trainerEncounters, visibleItems]);

  const hasMoreItems = useMemo(() => {
    return visibleItems < trainerEncounters.length;
  }, [trainerEncounters.length, visibleItems]);

  const { startContentLoading, stopContentLoading } = useLoading();

  const [updatingTrainerEncounter, setUpdatingTrainerEncounter] = useState<boolean>(false);


  const selectEncounter = useCallback(async (encounterId: string) => {
    startContentLoading();
    const tFetchErrorMessage = t('common.unknown');
    setUpdatingTrainerEncounter(true);
    try {
      const response = await trainerEncounterBffService().active({ encounter_id: encounterId });
      if (response.error && !response?.data) {
        const message = t(response.i18nMessage);
        showAlert({ type: 'error', message });
        return;
      }
      const trainer_encounter = response.data as TTrainerEncounter;
      
      setTrainerEncounters((prevState) => prevState.map((encounter) => {
        if (encounter.id === trainer_encounter.id) {
          return { ...encounter, is_active: true };
        }
        return { ...encounter, is_active: false };
      }));

      selected_encounter?.(trainer_encounter);
      
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : tFetchErrorMessage;
      showAlert({ type: 'error', message });
    } finally {
      stopContentLoading();
      setUpdatingTrainerEncounter(false);
    }
  }, [selected_encounter, showAlert, startContentLoading, stopContentLoading, t]);
  
  return (
    <Card rounded='lg' variant='elevated'>
      <div className='mb-4 flex items-center justify-between'>
        <Text as='h2' className='text-lg font-semibold'>{t('home.dashboard.encountersTitle')}</Text>
        <Badge tone='info' variant='soft'>{trainerEncounters.length}</Badge>
      </div>
      <div className='grid gap-3'>
        {trainerEncountersToRender.map((trainer_encounter) => (
          <button
            key={trainer_encounter.id}
            type='button'
            onClick={() => void selectEncounter(trainer_encounter.pokemon_encounter.id)}
            disabled={updatingTrainerEncounter}
            className={`rounded-2xl border cursor-pointer px-4 py-3 text-left transition ${trainer_encounter.is_active ? 'border-amber-500 bg-amber-50' : 'border-slate-200 bg-white'}`}
          >
            <div className='flex items-center justify-between gap-3'>
              <div>
                <Text as='h3' className='font-semibold'>{formatLabel(trainer_encounter.pokemon_encounter.name)}</Text>
                <Text className='text-sm text-slate-500'>{trainer_encounter.pokemon_encounter.method}</Text>
              </div>
              {trainer_encounter.is_active ? <Badge tone='success' variant='soft'>{t('home.dashboard.active')}</Badge> : null}
            </div>
          </button>
        ))}
      </div>
      { hasMoreItems && (
        <div className="flex justify-center pt-2">
          <Button
            type="button"
            size="lg"
            appearance="outlineBorderless"
            onClick={() => {
              setVisibleItems((currentValue) => {
                return Math.min(currentValue + item_size, trainerEncounters.length);
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