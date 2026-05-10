'use client';
import React, { useMemo } from 'react';
import {
  BreadcrumbContext
} from '@/app/ds/breadcrumb/BreadcrumbContext';

type BreadcrumbProviderProps = Readonly<{
  children: React.ReactNode;
}>;

const BreadcrumbProvider = ({ children }: BreadcrumbProviderProps) => {
  const [labels, setLabels] = React.useState<Record<string, string>>({});

  const setCustomLabel = (path: string, label: string) => {
    setLabels((prevLabels) => ({
      ...prevLabels,
      [path]: label,
    }));
  };

  const value = useMemo(() => ({
    setCustomLabel,
    customLabels: labels,
  }), [labels]);

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export default BreadcrumbProvider;
