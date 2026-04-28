'use client';
import React from 'react';
import { BreadcrumbContextProps } from '@/app/ds/breadcrumb/types';

export const BreadcrumbContext = React.createContext<BreadcrumbContextProps | undefined>(undefined);