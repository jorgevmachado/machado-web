'use client';
import React ,{ useMemo } from 'react';
import {
  BreadcrumbContext
} from '@/app/ds/breadcrumb/BreadcrumbContext';
import { TBreadcrumbItem ,buildBreadcrumbs } from '@/app/ds';
import { usePathname } from 'next/navigation';

type BreadcrumbProviderProps = Readonly<{
  children: React.ReactNode;
}>;

type BreadcrumbState = {
  pathname: string;
  breadcrumbs: Array<TBreadcrumbItem>;
};

const BreadcrumbProvider = ({ children }: BreadcrumbProviderProps) => {
  const pathname = usePathname();
  const [labels, setLabels] = React.useState<Record<string, string>>({});
  const [customBreadcrumbs, setCustomBreadcrumbs] = React.useState<BreadcrumbState | undefined>(undefined);

  const setCustomLabel = (path: string, label: string) => {
    setLabels((prevLabels) => ({
      ...prevLabels,
      [path]: label,
    }));
  };
  
  const customBuildBreadcrumbs = (pathname: string, blockedPaths: Array<string> = []) => {
    const customBreadcrumbs =  buildBreadcrumbs(pathname, blockedPaths);
    setCustomBreadcrumbs({
      pathname,
      breadcrumbs: customBreadcrumbs,
    });
  };

  const breadcrumbs = useMemo(() => {
    const currentBreadCrumbs: Array<TBreadcrumbItem> = [];
    if (customBreadcrumbs) {
      const currentPathNameSplit = pathname.split('/');
      const currentPathName = currentPathNameSplit[currentPathNameSplit.length - 1];

      const customBreadcrumbPathNameSplit = customBreadcrumbs.pathname.split('/');
      const customBreadcrumbPathName = customBreadcrumbPathNameSplit[customBreadcrumbPathNameSplit.length - 1];
      
      if (currentPathName === customBreadcrumbPathName) {
        currentBreadCrumbs.push(...customBreadcrumbs.breadcrumbs);
      }
    }
    if (!currentBreadCrumbs.length) {
      currentBreadCrumbs.push(...buildBreadcrumbs(pathname));
    }
    return currentBreadCrumbs.map((item) => ({
      ...item,
      label: labels[item.href] || item.label,
    }));
  }, [customBreadcrumbs, labels, pathname]);

  const value = useMemo(() => ({
    breadcrumbs: breadcrumbs,
    setCustomLabel,
    customBuildBreadcrumbs,
  }), [breadcrumbs]);



  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export default BreadcrumbProvider;
