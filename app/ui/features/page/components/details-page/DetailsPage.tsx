'use client';
import React ,{ useEffect ,useMemo } from 'react';
import { Card ,Text ,useBreadcrumb } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type DetailsPageProps = {
  param?: string;
  origin?: string;
  domain: string;
  hasData?: boolean;
  children?: React.ReactNode;
  isLoading?: boolean;
  originDomain?: string;
  errorMessage?: string;
};
export default function DetailsPage({ param, origin, domain, hasData, children, isLoading, originDomain, errorMessage }: DetailsPageProps) {
  const pathname = usePathname();

  const { t } = useAppTranslation();

  const { customBuildBreadcrumbs } = useBreadcrumb();
  
  const translateDomain = useMemo(() => {
    if (originDomain) {
      return `${originDomain}.${domain}`;
    }
    return domain;
  }, [domain, originDomain]);

  

  const goBackHref  = useMemo(() => {
    if (origin) {
      return param ? `/${origin}/${param}` : `/${origin}`;
    }
    if (originDomain) {
      return `/${originDomain}/${domain}`;
    }
    return `/${domain}`;
  }, [domain, origin, originDomain, param]);

  const goBackLabel = useMemo(() => {
    if (origin) {
      return t('common.back');
    }
    return t(`${translateDomain}.detail.back`);
  }, [origin, t, translateDomain]);


  useEffect(() => {
    if (!origin || !originDomain) {
      return;
    }

    const replaceValueOrigin = !param ? `/${origin}` : `/${origin}/${param}`;
    const pathOrigin = pathname.replaceAll(`/${originDomain}`, replaceValueOrigin);
    customBuildBreadcrumbs(pathOrigin, [domain]);
  }, []);

  if (isLoading && !hasData) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <Card rounded="lg" className="mx-auto max-w-5xl text-center">
          <Text className="text-slate-600">{t(`${translateDomain}.detail.loading`)}</Text>
        </Card>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <Card rounded="lg" className="mx-auto max-w-5xl text-center">
          <Text className="text-slate-600">{errorMessage || t(`${translateDomain}.detail.notFound`)}</Text>
        </Card>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <Link href={goBackHref} className="text-sm font-semibold text-blue-700">
          {goBackLabel}
        </Link>
        {children}
      </div>
    </div>
  );
}