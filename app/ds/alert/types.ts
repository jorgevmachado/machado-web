import React  from 'react';

export type AlertType = 'info' | 'warning' | 'error' | 'success';

export type AlertProps = {
  type?: AlertType;
  children: React.ReactNode;
  className?: string;
};

export type GlobalAlert = {
  id: string;
  type: AlertType;
  message: string;
};

export type ShowAlertInput = {
  type?: AlertType;
  message: string;
  durationMs?: number;
};

export type AlertContextValue = {
  alerts: GlobalAlert[];
  showAlert: (input: ShowAlertInput) => string;
  dismissAlert: (id: string) => void;
  clearAlerts: () => void;
};