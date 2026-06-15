'use client';
import { useAppTranslation } from '@/app/i18n';
import {
  trainerBffService ,
  TTrainerBattle ,
  TTrainerEncounter ,
  TTrainerExploration ,
} from '@/app/ui';
import { Card ,Text ,Button ,useLoading ,useAlert } from '@/app/ds';
import React ,{ useCallback ,useMemo ,useState } from 'react';
import { useRouter } from 'next/navigation';

type ExplorationActionProps = {
  activeEncounter?: TTrainerEncounter;
  explorationEvent?: TTrainerExploration;
}

type TButtonProps = React.ComponentProps<typeof Button>;

export default function ExplorationAction({
  activeEncounter,
  explorationEvent,
}: ExplorationActionProps) {
  const router = useRouter();
  
  const { t } = useAppTranslation();
  const { isContentLoading, startContentLoading, stopContentLoading } = useLoading();
  const { showAlert } = useAlert();
  
  const [exploration, setExploration] = useState<TTrainerExploration | undefined>(explorationEvent);

  const battleSession = useMemo(() => {
    return exploration?.battle_sessions?.[0];
  }, [exploration?.battle_sessions]);

  const battleProgressStatus = useMemo(() => {
    const eventType = exploration?.event_type;
    if (eventType && eventType === 'WILD_POKEMON' && battleSession) {
      return battleSession.status;
    }
    return 'INACTIVE';
  }, [battleSession, exploration?.event_type]);
  
  const disableExploration = useMemo(() => {
    if (!activeEncounter) {
      return true;
    }
    return isContentLoading;
    
  }, [activeEncounter, isContentLoading]);

  const handleExplore = useCallback(async () => {
    startContentLoading();
    const tFetchErrorMessage = t('trainer.exploration.loadError');
    try {
      const response = await trainerBffService.explore();
      if (response.error && !response?.data) {
        const message = t(response.i18nMessage);
        showAlert({ type: 'error', message });
        return; 
      }
      setExploration(response.data);
      if (response.data && response.data.event_type === 'WILD_POKEMON' && response.data.battle_sessions?.length > 0) {
        router.push(`/battle/${response.data.battle_sessions[0].id}`);
      }
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : tFetchErrorMessage;
      setExploration(undefined);
      showAlert({ type: 'error', message });
    } finally {
      stopContentLoading();
    }
  }, [router, showAlert, startContentLoading, stopContentLoading, t]);

  const handleShowBattle = useCallback(async (battleSession: TTrainerBattle) => {
    router.push(`/battle/${battleSession.id}`);
  }, [router]);

  const buttonProps = useMemo(() => {
    if (!exploration) {
      return undefined;
    }
    const tLoadingMessage = 'trainer.exploration.loading';
    const props: TButtonProps = {
      tone: 'primary',
      disabled: disableExploration
    };
    
    if (battleProgressStatus === 'ACTIVE' && battleSession) {
      props.tone = 'danger';
      props.onClick = () => void handleShowBattle(battleSession);
      props.children = isContentLoading ? t(tLoadingMessage) : t('trainer.exploration.showBattle');
    }
    if (battleProgressStatus !== 'ACTIVE') {
      props.onClick = () => void handleExplore();
      props.children = isContentLoading ? t(tLoadingMessage) : t('trainer.exploration.nextStep');
    }
    return props;
  }, [battleProgressStatus, battleSession, disableExploration, exploration, handleExplore, handleShowBattle, isContentLoading, t]);

  return (
    <Card rounded="lg" variant="elevated">
      <Text as="h2" className="text-lg font-semibold">{ t('home.dashboard.walkTitle') }</Text>
      <div className="flex items-center justify-between">
        { buttonProps ? ( <Button {...buttonProps  }/> ) : (<Text>{t('trainer.exploration.tryAgainLater')}</Text>)}
      </div>
    </Card>
  );
}