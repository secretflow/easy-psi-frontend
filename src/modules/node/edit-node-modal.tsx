import { Modal, Input, Form, message } from 'antd';
import type { InputRef } from 'antd';
import { useRef, useState, useEffect } from 'react';

import { getModel, useModel, Model } from '@/util/valtio-helper';
import { DefaultModalManager } from '@/modules/modal-manager';
import { NodeService } from './node.service';
import { NodeRouteListView } from './node-list.view';

export const EditNodeModal = () => {
  const modalManager = useModel(DefaultModalManager);
  const viewInstance = useModel(NodeEditView);
  const modal = modalManager.modals[editNodeModal.id];

  const { visible, data = {}, close } = modal;
  const { route = {}, callback } = data;
  const [editConfirmLoading, setEditConfirmLoading] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.setFieldValue('dstNetAddress', route.dstNetAddress);
      setTimeout(() => inputRef.current!.focus({ cursor: 'all' }), 100);
    }
  }, [visible]);

  useEffect(() => {
    form.setFieldValue('dstNetAddress', route.dstNetAddress);
  }, [route]);

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
          await viewInstance.editAddress(
            {
              ...val,
              routerId: route.routeId,
              srcNetAddress: route.srcNetAddress,
            },
            route.dstNodeId,
          );
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
          label="节点通讯地址"
          name="dstNetAddress"
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

  async editAddress(
    val: {
      routerId: string;
      srcNetAddress: string;
      dstNetAddress: string;
    },
    nodeId?: string,
  ) {
    try {
      await this.nodeService.editNode(val);
      message.success(
        nodeId
          ? `「${nodeId}」节点通讯地址修改成功，请稍后点击刷新按钮获取最新状态`
          : `节点通讯地址修改成功，请稍后点击刷新按钮获取最新状态`,
      );
      // if (routeId) await this.listView.refreshNodeRoute(routeId);
    } catch (e) {
      message.error((e as Error).message);
    }
  }
}

export const editNodeModal = {
  id: 'edit-node',
  visible: false,
  data: {},
};

getModel(DefaultModalManager).registerModal(editNodeModal);
