import { Drawer, Space, Button, Typography, Badge } from 'antd';
import { CloseOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import classnames from 'classnames';
import { getModel, useModel } from '@/util/valtio-helper';
import { formatTimestamp } from '@/util/timestamp-formatter';
import { DefaultModalManager } from '@/modules/modal-manager';
import { EllipsisText } from '@/components/text-ellipsis';
import { confirmDelete } from '@/components/confirm-delete';
import { NodeState, BadgeType, NodeRoute } from './types';
import styles from './index.less';
import { NodeRouteListView } from './node-list.view';

export const NodeStateText: Record<NodeState, { icon: BadgeType; text: string }> = {
  [NodeState.PENDING]: {
    icon: 'default',
    text: '创建中',
  },
  [NodeState.UNKNOWN]: {
    icon: 'error',
    text: '不可用',
  },
  [NodeState.SUCCEEDED]: {
    icon: 'success',
    text: '可用',
  },
  [NodeState.FAILED]: {
    icon: 'error',
    text: '不可用',
  },
};

export const NodeRouteInfoDrawer = () => {
  const modalManager = useModel(DefaultModalManager);
  const viewInstance = useModel(NodeRouteListView);
  const modal = modalManager.modals[routeInfoDrawer.id];

  const { visible, data = {}, close } = modal;
  const { route = {} } = data;

  const [routeInfo, setRouteInfo] = useState<NodeRoute>({});

  useEffect(() => {
    if (visible) {
      setRouteInfo(route);
    }
  }, [visible]);

  return (
    <Drawer
      placement="right"
      onClose={close}
      open={visible}
      width={480}
      className={classnames(styles.addNodeDrawer, styles.routeInfoDrawer)}
      closeIcon={false}
      title={
        <div className={styles.title}>
          「
          <EllipsisText className={styles.title}>
            {routeInfo.dstNode?.nodeName}
          </EllipsisText>
          」详情
        </div>
      }
      extra={<CloseOutlined style={{ fontSize: 12 }} onClick={close} />}
      footer={
        <Button
          danger
          onClick={(e) => {
            e.stopPropagation();
            confirmDelete({
              name: routeInfo?.dstNode?.nodeName as string,
              description: '删除后新任务无法发起',
              onOk: () => {
                if (routeInfo.routeId && routeInfo.dstNodeId) {
                  viewInstance.deleteNodeRoute(routeInfo.routeId, routeInfo.dstNodeId);
                  modalManager.closeModal(routeInfoDrawer.id);
                }
              },
            });
          }}
        >
          删除
        </Button>
      }
      footerStyle={{ display: 'flex', justifyContent: 'end' }}
    >
      <div className={styles.subTitle}>合作节点基本信息</div>
      <div className={styles.part}>
        <Space direction="vertical" size={'middle'}>
          <div>
            <span className={styles.infoIndex}>节点名：</span>
            <span>
              {' '}
              <EllipsisText width={300} className={styles.infoText}>
                {routeInfo.dstNode?.nodeName}
              </EllipsisText>
            </span>
          </div>

          <div>
            <span className={styles.infoIndex}>节点ID：</span>
            <span className={styles.infoText}>{routeInfo.dstNode?.nodeId}</span>
          </div>

          <div>
            <span className={styles.infoIndex}>节点通讯地址：</span>
            <Space>
              <span className={styles.infoText}>{routeInfo.dstNode?.netAddress}</span>
              <EditOutlined
                className={styles.btnIcon}
                onClick={() =>
                  viewInstance.openEditModal(routeInfo, async () => {
                    if (routeInfo.routeId) {
                      const res = await viewInstance.refreshNodeRoute(
                        routeInfo.routeId,
                      );
                      if (res) setRouteInfo(res);
                    }
                  })
                }
              />
            </Space>
          </div>

          <div>
            <span className={styles.infoIndex}>节点别名：</span>
            <EllipsisText className={styles.infoText}>
              {routeInfo.dstNode?.nodeRemark}
            </EllipsisText>
          </div>

          <div>
            <span className={styles.infoIndex}>节点公钥：</span>
            <span>
              <Typography.Link
                onClick={() => {
                  if (routeInfo.dstNodeId)
                    viewInstance.downloadCertificate(routeInfo.dstNodeId);
                }}
              >
                下载{' '}
              </Typography.Link>
            </span>
          </div>
        </Space>
      </div>
      <div className={styles.subTitle}>双方合作信息</div>
      <div className={styles.part}>
        <Space direction="vertical" size={'middle'}>
          {/* <div>
            <span className={styles.infoIndex}>本方通讯地址：</span>
            <span>
              <EllipsisText width={300} className={styles.infoText}>
                {routeInfo.srcNode?.netAddress}
              </EllipsisText>
            </span>
          </div> */}

          <div>
            <span className={styles.infoIndex}>发起合作节点：</span>
            <span className={styles.infoText}>
              {' '}
              <EllipsisText width={300} className={styles.infoText}>
                {routeInfo.srcNode?.nodeName}{' '}
              </EllipsisText>
            </span>
          </div>

          <div>
            <span className={styles.infoIndex}>通讯状态：</span>
            <span className={styles.infoText}>
              <Space size={12}>
                <Badge
                  status={NodeStateText[routeInfo.status as NodeState]?.icon || 'error'}
                  text={NodeStateText[routeInfo.status as NodeState]?.text || '不可用'}
                />
                <Button
                  type="link"
                  icon={<ReloadOutlined />}
                  onClick={async () => {
                    if (routeInfo.routeId) {
                      const res = await viewInstance.refreshNodeRoute(
                        routeInfo.routeId,
                      );
                      if (res) setRouteInfo(res);
                    }
                  }}
                  style={{ padding: '4px 0' }}
                >
                  刷新
                </Button>
              </Space>
            </span>
          </div>

          <div>
            <span className={styles.infoIndex}>合作时间：</span>
            <span className={styles.infoText}>
              {formatTimestamp(routeInfo.gmtCreate)}
            </span>
          </div>

          <div>
            <span className={styles.infoIndex}>编辑时间：</span>
            <span className={styles.infoText}>
              {formatTimestamp(routeInfo.gmtModified)}
            </span>
          </div>
        </Space>
      </div>
    </Drawer>
  );
};

export const routeInfoDrawer = {
  id: 'route-info',
  visible: false,
  data: {},
};

getModel(DefaultModalManager).registerModal(routeInfoDrawer);
