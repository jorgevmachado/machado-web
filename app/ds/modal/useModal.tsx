'use client';
import { useCallback, useState } from 'react';
import { ModalContextProps } from './types';
import Modal from './Modal';

export function useModal() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [config, setConfig] = useState<ModalContextProps | undefined>(undefined);

  const open = useCallback((nextConfig: ModalContextProps) => {
    setConfig(nextConfig);
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    setConfig(undefined);
  }, []);

  const updateModal = useCallback((partialConfig: Partial<ModalContextProps>) => {
    setConfig((prev) => (prev ? { ...prev, ...partialConfig } : prev));
  }, []);

  const modal = isVisible && config
    ? (
      <Modal {...config} isOpen={isVisible} onClose={close}>
        {config.body}
      </Modal>
    )
    : null;

  return {
    modal,
    isOpen: isVisible,
    openModal: open,
    closeModal: close,
    updateModal,
  };
}