import { Model } from '@/util/valtio-helper';

import type { ModalItem, ModalManager } from './modal-manger-protocol';

export class DefaultModalManager extends Model implements ModalManager<any> {
  // 保存所有 modal 的信息：包括 id、visible、data、close
  modals: Record<string, ModalItem<any>> = {};

  registerModal<T>(modalItem: ModalItem<T>) {
    this.modals[modalItem.id] = {
      close: () => {
        this.modals[modalItem.id].visible = false;
      },
      ...modalItem,
    };
  }

  openModal = (modalId: string, data?: any) => {
    this.modals[modalId] = {
      ...this.modals[modalId],
      visible: true,
      data,
    };
  };

  closeModal = (modalId: string) => {
    this.modals[modalId] = {
      ...this.modals[modalId],
      visible: false,
    };
  };
}
