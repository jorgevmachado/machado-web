import React from 'react';
import type { TWidth } from '@/app/utils';

export type ModalProps = {
  title: string;
  width?: TWidth;
  subtitle?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  maxHeight?: string;
  closeOnEsc?: boolean;
  closeOnOutsideClick?: boolean;
  customCloseIcon?: React.ReactNode;
  submitButton?: {
    label: string;
    onClick: () => void;
    isLoading?: boolean;
    disabled?: boolean;
  };
  closeButton?: {
    label: string;
    onClick?: () => void;
  };
};


export type ModalContextProps = Omit<ModalProps, 'isOpen' | 'onClose' | 'children'> & {
  body: React.ReactNode;
}