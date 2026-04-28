'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';

import Alert from './Alert';

import { AlertContext } from './AlertContext';
import type { GlobalAlert, ShowAlertInput } from './types';

type AlertProviderProps = {
  children: React.ReactNode;
};

const DEFAULT_ALERT_DURATION_MS = 4200;

const AlertProvider = ({ children }: AlertProviderProps) => {
  const [alerts, setAlerts] = useState<GlobalAlert[]>([]);
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismissAlert = useCallback((id: string) => {
    const timeout = timeoutsRef.current.get(id);

    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }

    setAlerts((previousState) => previousState.filter((alert) => alert.id !== id));
  }, []);

  const showAlert = useCallback(({ type = 'info', message, durationMs = DEFAULT_ALERT_DURATION_MS }: ShowAlertInput) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    setAlerts((previousState) => [...previousState, { id, type, message }]);

    if (durationMs > 0) {
      const timeout = setTimeout(() => {
        setAlerts((previousState) => previousState.filter((alert) => alert.id !== id));
        timeoutsRef.current.delete(id);
      }, durationMs);

      timeoutsRef.current.set(id, timeout);
    }

    return id;
  }, []);

  const clearAlerts = useCallback(() => {
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current.clear();
    setAlerts([]);
  }, []);

  const value = useMemo(() => {
    return {
      alerts,
      showAlert,
      dismissAlert,
      clearAlerts,
    };
  }, [alerts, showAlert, dismissAlert, clearAlerts]);

  return (
    <AlertContext.Provider value={value}>
      {children}

      <div className='pointer-events-none fixed right-4 top-20 z-260 w-[min(92vw,24rem)]'>
        {alerts.map((alert) => (
          <div key={alert.id} className='pointer-events-auto'>
            <button
              type='button'
              onClick={() => dismissAlert(alert.id)}
              className='w-full text-left'
              aria-label='Dismiss alert'
            >
              <Alert type={alert.type} className='cursor-pointer shadow-md'>
                {alert.message}
              </Alert>
            </button>
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
};

export default AlertProvider;

