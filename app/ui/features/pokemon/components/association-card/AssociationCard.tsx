'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

import { Card, Text } from '@/app/ds';

type AssociationCardProps = Readonly<{
  href: string;
  title?: string;
  eyebrow?: string;
  visual?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  ariaLabel?: string;
}>;

export function AssociationCard({
  href,
  title,
  eyebrow,
  visual,
  children,
  footer,
  ariaLabel,
}: AssociationCardProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel ?? title}
      className="block h-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <Card
        variant="elevated"
        rounded="lg"
        hoverEffect="lift"
        interactive
        className="flex h-full min-h-72 flex-col gap-4 border-slate-200 bg-white"
      >
        {visual ? (
          <div className="flex min-h-24 items-center justify-center rounded-lg bg-slate-100 p-4">
            {visual}
          </div>
        ) : null}

        <div className="flex flex-1 flex-col gap-3">
          {(title || eyebrow) ? (
            <div className="min-w-0">
              {eyebrow ? (
                <Text className="text-xs font-semibold uppercase text-slate-500">
                  {eyebrow}
                </Text>
              ) : null}
              {title ? (
                <Text as="h2" className="truncate text-xl font-semibold capitalize text-slate-950">
                  {title}
                </Text>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-1 flex-col gap-3">
            {children}
          </div>

          {footer ? (
            <div className="mt-auto">
              {footer}
            </div>
          ) : null}
        </div>
      </Card>
    </Link>
  );
}
