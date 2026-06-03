import { Badge ,Button ,Card ,Text } from '@/app/ds';
import { formatLabel } from '@/app/utils';
import { useCallback } from 'react';
import { useAppTranslation } from '@/app/i18n';
import { TTrainerParty } from '@/app/ui';

type MainPartyProps = {
  party_slots: Array<TTrainerParty>;
};
export default function MainParty({
  party_slots,
}: MainPartyProps) {

  const { t } = useAppTranslation();

  const isSavingParty = false;
  const partySelection: Array<string> = ['3539c3a5-f860-461c-80d4-a0e55ab7b737'];



  const saveParty = useCallback(async () => {
    console.log('Saving party');
  }, []);

  const togglePartySelection = useCallback((ownedPokemonId: string) => {
    console.log('Toggling party selection', ownedPokemonId);
  }, []);

  return (
    <Card rounded='lg' variant='elevated'>
      <div className='mb-4 flex items-center justify-between'>
        <div>
          <Text as='h2' className='text-lg font-semibold'>{t('home.dashboard.partyTitle')}</Text>
          <Text className='text-sm text-slate-500'>{t('home.dashboard.partyHint')}</Text>
        </div>
        <Button onClick={() => void saveParty()} disabled={isSavingParty}>
          {isSavingParty ? t('home.dashboard.savingParty') : t('home.dashboard.saveParty')}
        </Button>
      </div>
      <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
        {party_slots.map((item) => {
          const isSelected = partySelection.includes(item.id);
          return (
            <button
              key={item.id}
              type='button'
              onClick={() => togglePartySelection(item.id)}
              className={`rounded-2xl border px-4 py-3 text-left transition ${isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white'}`}
            >
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <Text as='h3' className='font-semibold'>
                    {item.owned_pokemon.nickname || formatLabel(item.owned_pokemon.name)}
                  </Text>
                  <Text className='text-sm text-slate-500'>{formatLabel(item.owned_pokemon.name)}</Text>
                </div>
                {isSelected ? <Badge tone='success' variant='soft'>{t('home.dashboard.inParty')}</Badge> : null}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}