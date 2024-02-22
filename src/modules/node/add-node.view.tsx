import { CloseOutlined, LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Drawer,
  Form,
  Input,
  Upload,
  UploadProps,
  message,
  Space,
  Tag,
  FormInstance,
  Alert,
} from 'antd';
import { useState, useEffect } from 'react';
import { history } from 'umi';
import API from '@/services/ezpsi-board';

import styles from './index.less';
import { getModel, useModel } from '@/util/valtio-helper';
import { DefaultModalManager } from '@/modules/modal-manager';
import { NodeService } from './node.service';
import { NodeRouteListView } from './node-list.view';

const tokenTestSuffix = {
  testing: <Tag color="processing">测试中</Tag>,
  failed: <Tag color="error">地址不可访问</Tag>,
  succeed: <Tag color="success">地址可访问</Tag>,
  pending: <Tag color="warning">待测试</Tag>,
};

export const AddNodeDrawer = () => {
  const modalManager = useModel(DefaultModalManager);
  const nodeService = useModel(NodeService);
  const viewInstance = useModel(NodeRouteListView);
  const modal = modalManager.modals[addNodeDrawer.id];

  const { visible, close } = modal;

  const [form] = Form.useForm();
  const [tokenTestStatus, setTokenTestStatus] = useState<
    keyof typeof tokenTestSuffix | undefined
  >();

  const SubmitButton = ({ form, text }: { form: FormInstance; text: string }) => {
    const [submittable, setSubmittable] = useState(false);

    // Watch all values
    const values = Form.useWatch([], form);

    useEffect(() => {
      form.validateFields({ validateOnly: true }).then(
        () => {
          setSubmittable(true);
        },
        () => {
          setSubmittable(false);
        },
      );
    }, [values, tokenTestStatus]);

    return (
      <Button type="primary" htmlType="submit" disabled={!submittable}>
        {text}
      </Button>
    );
  };

  const uploadProps: UploadProps = {
    name: 'file',
    maxCount: 1,
    accept: '.crt',
    customRequest: (option) => {
      const upload = (file: File) => {
        const formData = new FormData();
        formData.append('file', file, file.name);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/v1alpha1/node/upload');
        xhr.setRequestHeader('User-Token', localStorage.getItem('User-Token') || '');
        xhr.setRequestHeader('authorization', 'authorization-text');
        xhr.onerror = () => {
          if (option.onError) option.onError(new Error('上传失败'));
        };

        xhr.onreadystatechange = () => {
          // Call a function when the state changes.
          if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            const { data, status } = JSON.parse(xhr.response);
            if (status.code === 0) {
              form.setFieldsValue({
                dstNodeId: data.nodeId,
                certText: data.certificate,
              });
              if (option.onSuccess) option.onSuccess(xhr.response);
            } else {
              if (status.code === 202011601 || status.code === 202011602) {
                history.push('/login');
                return;
              }
              if (option.onError) option.onError(new Error('解析失败'));
            }
          }
        };

        xhr.send(formData);
      };
      upload(option.file as File);
    },
  };

  const nodeAddress = Form.useWatch('dstNetAddress', form);

  const testNodeAddress = async () => {
    const netAddress = form.getFieldValue('dstNetAddress');
    setTokenTestStatus('testing');
    const { data, status } = await API.NodeRouteController.test({ netAddress });
    if (status && status.code === 0) {
      setTokenTestStatus(data ? 'succeed' : 'failed');
    } else {
      message.error(status?.msg);
      setTokenTestStatus('failed');
    }
  };

  useEffect(() => {
    if (tokenTestStatus !== 'pending' && tokenTestStatus !== 'testing') {
      form.validateFields(['dstNetAddress']);
    }
  }, [tokenTestStatus]);

  const [dstNetAddressDisable, setdstNetAddressDisable] = useState(false);

  useEffect(() => {
    if (nodeAddress) {
      const regex =
        /^.{1,50}:([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
      setdstNetAddressDisable(regex.test(nodeAddress));
    } else {
      setdstNetAddressDisable(false);
    }
  }, [nodeAddress]);

  return (
    <>
      <Drawer
        placement="right"
        onClose={close}
        open={visible}
        width={480}
        className={styles.addNodeDrawer}
        closeIcon={false}
        title={<div className={styles.title}>添加合作节点</div>}
        extra={<CloseOutlined style={{ fontSize: 12 }} onClick={close} />}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark="optional"
          preserve={false}
          onFinish={async (val) => {
            try {
              if (close) close();
              await nodeService.addNodeRoute(val);
              message.success(`「${val.dstNodeId}」节点添加成功`);
              await viewInstance.getNodeRouteList();
            } catch (e) {
              message.error((e as Error).message);
            }
          }}
        >
          <div className={styles.subTitleContent}>
            <div className={styles.subTitle}>合作节点</div>
            <Alert
              message="请先线下获取合作方的节点公钥文件、通讯地址"
              type="warning"
              showIcon
              rootClassName={styles.alert}
            />
          </div>
          <div className={styles.part}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8 }}>
                节点公钥
                <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
                  （仅支持上传1个文件）
                </span>
              </div>
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} size="small">
                  上传
                </Button>
              </Upload>
            </div>

            <Form.Item
              hidden
              name={'dstNodeId'}
              rules={[
                {
                  required: true,
                },
              ]}
            ></Form.Item>

            <Form.Item
              hidden
              name={'certText'}
              rules={[
                {
                  required: true,
                },
              ]}
            ></Form.Item>
            <Form.Item
              name="dstNetAddress"
              label={
                <div className={styles.formTitle}>
                  <>节点通讯地址</>{' '}
                  {tokenTestStatus === 'testing' ? (
                    <Button
                      type="link"
                      icon={<LoadingOutlined />}
                      disabled={true}
                      style={{ padding: 0 }}
                    >
                      测试中
                    </Button>
                  ) : (
                    <Button
                      type="link"
                      style={{ padding: 0 }}
                      disabled={!dstNetAddressDisable}
                      onClick={testNodeAddress}
                    >
                      测试连接
                    </Button>
                  )}
                </div>
              }
              rules={[
                {
                  required: true,
                  message: '请输入节点通讯地址',
                },
                {
                  pattern:
                    /^.{1,50}:([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
                  message: '请检查通讯地址格式, 如 127.0.0.1:8080',
                },
                {
                  validator: () => {
                    if (tokenTestStatus === 'pending' || tokenTestStatus === 'testing')
                      return Promise.reject();
                    else return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                placeholder="请输入节点通讯地址"
                onChange={(val) => {
                  if (val) setTokenTestStatus('pending');
                }}
                disabled={tokenTestStatus === 'testing'}
                suffix={
                  (nodeAddress &&
                    tokenTestStatus &&
                    tokenTestSuffix[tokenTestStatus]) || <span />
                }
              />
            </Form.Item>

            <Form.Item
              name="nodeRemark"
              label="节点别名"
              rules={[
                { required: false },
                { max: 32, message: '长度限制32字符' },
                {
                  pattern: /^([a-z0-9A-Z-_\u4e00-\u9fa5]*)$/,
                  message: '名称可由中文/数字/英文/下划线/中划线组成',
                },
              ]}
            >
              <Input placeholder="名称可由中文/数字/英文/中划线/下划线组成，长度限制32" />
            </Form.Item>
          </div>

          {/* <div className={styles.subTitle}>本方节点</div>
          <div className={styles.part}>
            <Form.Item
              name="srcNetAddress"
              label="本方通讯地址"
              initialValue={nodeService.currentNode?.netAddress}
              rules={[
                {
                  required: true,
                  message: '请输入本方节点通讯地址',
                },
                {
                  pattern:
                    /^.{1,50}:([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
                  message: '请检查通讯地址格式',
                },
              ]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
          </div> */}
          <Form.Item>
            <Space>
              <SubmitButton form={form} text={'确定'} />
              <Button onClick={close}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export const addNodeDrawer = {
  id: 'add-node',
  visible: false,
  data: {},
};

getModel(DefaultModalManager).registerModal(addNodeDrawer);
