import React, { memo } from 'react';

import type { AlertProps, AlertType } from './types';

const alertStyleByType: Record<AlertType, string> = {
  info: 'border-blue-200 bg-blue-50/95 text-blue-900',
  warning: 'border-amber-200 bg-amber-50/95 text-amber-900',
  error: 'border-red-200 bg-red-50/95 text-red-900',
  success: 'border-emerald-200 bg-emerald-50/95 text-emerald-900',
};

const alertIconByType: Record<AlertType, React.ReactNode> = {
  info: (
    <svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
      <path
        fillRule='evenodd'
        d='M18 10A8 8 0 114 3.08V2a1 1 0 112 0v2.126A8 8 0 0118 10zm-8-3a1 1 0 100 2 1 1 0 000-2zm1 4a1 1 0 10-2 0v3a1 1 0 102 0v-3z'
        clipRule='evenodd'
      />
    </svg>
  ),
  warning: (
    <svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
      <path
        fillRule='evenodd'
        d='M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l6.518 11.6c.75 1.335-.214 3.001-1.742 3.001H3.481c-1.528 0-2.492-1.666-1.742-3l6.518-11.601zM11 7a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 15z'
        clipRule='evenodd'
      />
    </svg>
  ),
  error: (
    <svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
      <path
        fillRule='evenodd'
        d='M10 18a8 8 0 100-16 8 8 0 000 16zm-2.707-10.707a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414L11.414 10l1.293 1.293a1 1 0 01-1.414 1.414L10 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L8.586 10 7.293 8.707a1 1 0 010-1.414z'
        clipRule='evenodd'
      />
    </svg>
  ),
  success: (
    <svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
      <path
        fillRule='evenodd'
        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
        clipRule='evenodd'
      />
    </svg>
  ),
};

const Alert = ({ type = 'info', children, className }: AlertProps) => {
  const colorClassName = alertStyleByType[type];
  const icon = alertIconByType[type];
  const liveBehavior = type === 'error' || type === 'warning' ? 'assertive' : 'polite';

  return (
    <div
      role='status'
      aria-live={liveBehavior}
      className={`my-3 flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium shadow-sm ${colorClassName} ${className ?? ''}`}
    >
      <span className='mt-0.5 shrink-0 opacity-95'>{icon}</span>
      <div>{children}</div>
    </div>
  );
};

export default memo(Alert);

