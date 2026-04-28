'use client';

import { type MouseEvent, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

import { ModalProps } from './types';
import './Modal.scss';
import { Button ,Text } from '@/app/ds';
import { WIDTH_CLASS_MAP } from '@/app/utils';

const defaultCloseIcon = <IoClose size={24} />;

const Modal = ({
  title,
  subtitle,
  children,
  isOpen,
  width = '2xl',
  onClose,
  maxHeight = '80vh',
  closeOnEsc = true,
  closeOnOutsideClick = true,
  customCloseIcon,
  submitButton,
  closeButton,
}: ModalProps) => {

  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEsc, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleOutsideClick = (event: MouseEvent<HTMLDivElement>) => {
    if (closeOnOutsideClick && event.target === event.currentTarget && onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className='modal-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4'
      onClick={handleOutsideClick}
      role='presentation'
    >
      <div
        className={`modal-scale-in relative w-full rounded-lg bg-white shadow-2xl ${WIDTH_CLASS_MAP[width]}`}
        style={{ maxHeight }}
        role='dialog'
        aria-modal='true'
        aria-labelledby='modal-title'
        aria-describedby={subtitle ? 'modal-description' : undefined}
      >
        <div className='flex items-start justify-between border-b border-gray-200 px-6 py-4'>
          <div className='flex-1'>
            <Text id='modal-title' as="h2"  size="xl" weight="bold" color="text-gray-900">
              {title}
            </Text>
            {subtitle && (
              <Text
                id='modal-description'
                as="p"
                size="sm"
                color="text-gray-600"
                className='mt-1'
              >
                {subtitle}
              </Text>
            )}
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className='ml-4 inline-flex cursor-pointer items-center justify-center rounded-md p-1 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              aria-label='Close modal'
              type='button'
            >
              {customCloseIcon || defaultCloseIcon}
            </button>
          )}
        </div>

        <div
          className='overflow-y-auto px-6 py-4'
          style={{ maxHeight: `calc(${maxHeight} - 140px)` }}
        >
          {children}
        </div>

        {(submitButton || closeButton) && (
          <div className='flex justify-between gap-3 border-t border-gray-200 px-6 py-4'>
            {closeButton && (
              <Button
                tone="neutral"
                onClick={closeButton.onClick || onClose}
                type='button'
              >
                {closeButton.label}
              </Button>
            )}


            {submitButton && (
              <Button
                onClick={submitButton.onClick}
                disabled={submitButton.disabled || submitButton.isLoading}
                isLoading={submitButton.isLoading}
                type='button'
              >
                {submitButton.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
