'use client';
import { Card ,Text } from '@/app/ds';

import { useMemo } from 'react';
import { formatLabel } from '@/app/utils';
import {
  LatestDiscoveries ,
  MainParty ,
  SelectTrainerEncounters ,
  TTrainer ,
} from '@/app/ui';
import { useAppTranslation } from '@/app/i18n';
import ExplorationAction from '../../exploration/components/exploration-action';

type TrainerDashboardProps = {
  trainer: TTrainer
}
export default function TrainerDashboard({ trainer }: TrainerDashboardProps) {

  const { t } = useAppTranslation();

  const activeEncounter = useMemo(() => {
    return trainer.known_encounters.find((encounter) => encounter.is_active);
  } ,[trainer.known_encounters]);

  const lastExplorationEvent = useMemo(() => {
    return trainer.exploration_events?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
  }, [trainer.exploration_events]);

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 md:grid-cols-3">
        <Card rounded="lg" variant="elevated">
          <Text as="h2" className="text-lg font-semibold">{ t(
            'home.dashboard.trainerTitle') }</Text>
          <Text>{ t('home.dashboard.pokeballs' ,
            { value: trainer.pokeballs }) }</Text>
          <Text>{ t('home.dashboard.captureRate' ,
            { value: trainer.capture_rate }) }</Text>
        </Card>
        <Card rounded="lg" variant="elevated">
          <Text as="h2" className="text-lg font-semibold">{ t(
            'home.dashboard.activeEncounter') }</Text>
          <Text>{ activeEncounter ?
            formatLabel(activeEncounter.pokemon_encounter.name) :
            t('home.dashboard.noActiveEncounter') }</Text>
          <Text className="text-sm text-slate-500">
            { activeEncounter ?
              activeEncounter.pokemon_encounter.method :
              t('home.dashboard.chooseEncounter') }
          </Text>
        </Card>
        <ExplorationAction activeEncounter={activeEncounter} explorationEvent={lastExplorationEvent}/>
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <SelectTrainerEncounters
          trainer_encounters={ trainer.known_encounters }/>
        <LatestDiscoveries pokedex={ trainer.pokedex }/>

      </section>
      <MainParty party_slots={ trainer.party_slots }/>
    </div>
  );
}