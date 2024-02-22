export interface ModalItem<T> {
  id: string;
  visible: boolean;
  data?: T;
  close?: () => void;
}

export interface ModalManager<T> {
  modals: Record<string, ModalItem<T>>;

  openModal: (modalId: string, data: any) => void;
  closeModal: (modalId: string) => void;
}
