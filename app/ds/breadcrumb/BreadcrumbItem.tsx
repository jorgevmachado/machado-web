import { TBreadcrumbItem } from '@/app/ds/breadcrumb/types';
import { Text } from '@/app/ds';
import React from 'react';
import Link from 'next/link';

type BreadcrumbItemProps = {
  item: TBreadcrumbItem
}
export default function BreadcrumbItem({ item }: BreadcrumbItemProps) {
  if (item.isCurrent) {
    return (
      <Text
        size="sm"
        color="text-slate-700"
        weight="semibold"
        aria-current='page'
      >
        {item.label}
      </Text>
    );
  }

  if (!item.clickable) {
    return (
      <Text
        size="sm"
        color="text-slate-400"
        weight="normal"
        aria-current='page'
      >
        {item.label}
      </Text>
    );
  }
  
  return (
    <Link
      href={item.href}
      className='text-sm font-medium text-slate-400 transition hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'
    >
      {item.label}
    </Link>
  );
}