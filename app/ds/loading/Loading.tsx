'use client';
import React from 'react';
import Spinner from '@/app/ds/loading/spinner';
import TopProgressBar from '@/app/ds/loading/top-progress-bar';

type TLoading = 'pokeball' | 'circle' | 'bar' | 'dots' | 'top-progress-bar';

type LoadingProps = {
  type?: TLoading;
  overlay?: boolean;
  isVisible?: boolean;
};

export default function Loading({ type = 'top-progress-bar', overlay = true, isVisible = true }: LoadingProps) {
  return  type === 'top-progress-bar' ? (
    <TopProgressBar isVisible={isVisible} />
  ) : <Spinner overlay={overlay} type="pokeball" color="warning"/>;
}