'use client';
import React from 'react';
import {
  BreadcrumbContext
} from '@/app/ds/breadcrumb/BreadcrumbContext';

const BreadcrumbProvider: React.FC<{children: React.ReactNode }> = ({ children }) => {
  const [labels, setLabels] = React.useState<Record<string, string>>({});

  const setCustomLabel = (path: string, label: string) => {
    setLabels((prevLabels) => ({
      ...prevLabels,
      [path]: label,
    }));
  };

  return (
    <BreadcrumbContext.Provider value={{
      setCustomLabel,
      customLabels: labels,
    }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export default BreadcrumbProvider;