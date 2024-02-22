import { Modal, Input, Form, message } from 'antd';
import type { InputRef } from 'antd';
import { useRef, useState, useEffect } from 'react';

import { getModel, useModel, Model } from '@/util/valtio-helper';
import { DefaultModalManager } from '@/modules/modal-manager';
import { NodeService } from './node.service';
import { NodeRouteListView } from './node-list.view';

export const EditCurrentNodeModal = () => {
  const modalManager = useModel(DefaultModalManager);
  const viewInstance = useModel(NodeEditView);
  const modal = modalManager.modals[editCurrentNodeModal.id];

  const { visible, data = {}, close } = modal;
  const { currentNode = {}, callback } = data;
  const [editConfirmLoading, setEditConfirmLoading] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.setFieldValue('netAddress', currentNode.netAddress);
      setTimeout(() => inputRef.current!.focus({ cursor: 'all' }), 100);
    }
  }, [visible]);

  useEffect(() => {
    form.setFieldValue('netAddress', currentNode.netAddress);
  }, [currentNode]);

  return (
    <Modal
      title="编辑"
      open={visible}
      onOk={async () => {
        form.submit();
      }}
      onCancel={close}
      confirmLoading={editConfirmLoading}
      destroyOnClose={true}
      width={420}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        preserve={false}
        onFinish={async (val) => {
          setEditConfirmLoading(true);
          await viewInstance.editAddress({
            ...val,
          });
          if (callback) {
            try {
              await callback();
            } catch (e) {
              message.error(e.message);
            }
          }
          setEditConfirmLoading(false);
          if (close) close();
        }}
      >
        <Form.Item
          label="本方通讯地址"
          name="netAddress"
          rules={[
            {
              required: true,
              message: '请输入通讯地址',
            },
            {
              pattern:
                /^.{1,50}:([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
              message: '请检查通讯地址格式',
            },
          ]}
        >
          <Input ref={inputRef} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

class NodeEditView extends Model {
  nodeService = getModel(NodeService);
  listView = getModel(NodeRouteListView);

  async editAddress(val: { netAddress: string }) {
    try {
      await this.nodeService.editCurrentNode(val);
      message.success(`本方节点通讯地址修改成功`);
    } catch (e) {
      message.error((e as Error).message);
    }
  }
}

export const editCurrentNodeModal = {
  id: 'edit-current-node',
  visible: false,
  data: {},
};

getModel(DefaultModalManager).registerModal(editCurrentNodeModal);
