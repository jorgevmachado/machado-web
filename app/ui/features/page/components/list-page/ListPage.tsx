import React from 'react';
import {
  Badge ,
  Card ,
  Filters ,type FiltersProps ,
  Pagination ,
  Text ,
  TPaginatedListResponse ,
} from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';

type ListPageProps<TItem, TFilters> = {
  meta: TPaginatedListResponse<TItem>['meta'];
  domain: string;
  goToPage?: (page: number) => void;
  children?: React.ReactNode;
  isLoading?: boolean;
  totalItems?: number;
  errorMessage?: string;
  inputFilters?: FiltersProps['filters'];
  applyInputFilters?: (nextFilters: TFilters) => void;
  clearInputFilters?: () => void;
};
export default function ListPage<TItem, TFilters>({
  meta,
  domain,
  goToPage,
  children,
  isLoading,
  totalItems = 0,
  inputFilters,
  clearInputFilters,
  applyInputFilters
}: ListPageProps<TItem, TFilters>) {
  const { t } = useAppTranslation();
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header
          className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Text as="h1" className="text-3xl font-bold text-slate-950 sm:text-4xl">
              { t(`${domain}.list.title`) }
            </Text>
            <Text
              className="mt-1 max-w-2xl text-sm text-slate-600 sm:text-base">
              { t('catalog.list.description') }
            </Text>
          </div>
          <Badge tone="info" variant="soft" size="lg">
            { t('common.recordCount' ,{ count: meta.total }) }
          </Badge>
        </header>
        { inputFilters && inputFilters.length > 0 && (
          <Filters
            filters={ inputFilters }
            ariaLabel={ t('catalog.list.filtersAria') }
            onApply={ (filters) => applyInputFilters?.(filters as TFilters) }
            onClear={ clearInputFilters }
          />
        )}
        
        { !isLoading && totalItems === 0 ? (
          <Card variant="outlined" rounded="lg" className="text-center">
            <Text className="text-slate-600">{ t('catalog.list.empty') }</Text>
          </Card>
        ) : null }

        { children }

        <Pagination
          currentPage={ meta.current_page }
          totalPages={ meta.total_pages }
          onPageChange={ goToPage }
          isLoading={ isLoading }
        />
      </div>
    </main>
  );
}