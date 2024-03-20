import { useState } from 'react';
import { Badge, Popconfirm, Space, Switch, Tooltip, message } from 'antd';
import { NodeRoute, NodeState } from '@/modules/node';
import { EllipsisText } from '@/components/text-ellipsis';
import { DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { confirmDelete } from '@/components/confirm-delete';
import styles from './index.less';

export const NodeListItemRender = (props: {
  node: NodeRoute;
  refreshNodeRoute: (routeId: string) => Promise<API.NodeRouterVO>;
  deleteNodeRoute: (routeId: string, nodeId: string) => void;
  updateNodeRoute: (nodeId: string, trust: boolean) => void;
  openNodeRouteInfoDrawer: (route: NodeRoute) => void;
  openEditNodeDrawer: (node: NodeRoute) => void;
}) => {
  const {
    node,
    deleteNodeRoute,
    refreshNodeRoute,
    updateNodeRoute,
    openNodeRouteInfoDrawer,
    openEditNodeDrawer,
  } = props;

  const [openPopconfirm, setOpenPopconfirm] = useState(false);
  const [trustConfirmLoading, setTrustConfigLoading] = useState(false);

  return (
    <Tooltip
      placement={'leftTop'}
      trigger={'hover'}
      title={
        node.status === NodeState.FAILED || node.status === NodeState.UNKNOWN ? (
          <div className={styles.tooltipTitle}>
            <div>节点不可用原因可能有：</div>
            <div>1.对方不在线，需提醒对方打开平台</div>
            <div>2.配置信息错误</div>
            <div>3.合作方未添加本方，需提醒对方添加</div>
          </div>
        ) : null
      }
    >
      <div className={styles.routeItem}>
        <div className={styles.item}>
          <div className={styles.statusIcon}>
            {node.status === NodeState.SUCCEEDED && (
              <Badge key={'green'} color={'rgb(35, 182, 95)'} text="" />
            )}
            {(node.status === NodeState.FAILED ||
              node.status === NodeState.UNKNOWN) && (
              <Badge color="rgba(252,117,116,1)" />
            )}
            {node.status === NodeState.PENDING && <Badge status="default" />}
          </div>

          <div className={styles.itemInfo}>
            <div className={styles.routeHeaderLayout}>
              <div onClick={() => openNodeRouteInfoDrawer(node)}>
                <EllipsisText width={220} className={styles.routeName}>
                  {node.dstNode?.nodeName}
                </EllipsisText>
              </div>
              <div>
                <Space size={16}>
                  <Tooltip title="刷新状态">
                    <ReloadOutlined
                      className={styles.actionIcon}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (node.routeId) {
                          try {
                            refreshNodeRoute(node.routeId);
                            message.success(`「${node.dstNodeId}」状态已刷新`);
                          } catch (e) {
                            message.error((e as Error).message);
                          }
                        }
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="删除">
                    <DeleteOutlined
                      className={styles.actionIcon}
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete({
                          name: node.dstNode?.nodeName as string,
                          description: '删除后新任务无法发起',
                          onOk: () => {
                            if (node.routeId && node.dstNodeId)
                              deleteNodeRoute(node.routeId, node.dstNodeId);
                          },
                        });
                      }}
                    />
                  </Tooltip>
                </Space>
              </div>
            </div>

            {/* <div className={styles.routeDescription}>
            <Space>
              <>
                ID:
                <EllipsisText className={styles.routeDescription}>
                  {node.routeId}
                </EllipsisText>
              </>
            </Space>
          </div> */}

            <div className={styles.routeDescription}>
              <Space>
                <>
                  节点别名:
                  <EllipsisText className={styles.routeDescription}>
                    {node.dstNode?.nodeRemark}
                  </EllipsisText>
                </>
              </Space>
            </div>

            <div className={styles.routeDescription}>
              <Space>
                <>
                  节点通讯地址:
                  <EllipsisText className={styles.routeDescription}>
                    {node.dstNetAddress}
                  </EllipsisText>
                </>
                {node.dstNode && (
                  <div className={styles.actionIcon}>
                    <Tooltip title="编辑">
                      <EditOutlined
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditNodeDrawer(node);
                        }}
                      />
                    </Tooltip>
                  </div>
                )}
              </Space>
            </div>
            <div className={styles.routeDescription}>
              <Popconfirm
                open={openPopconfirm}
                onOpenChange={(open) => {
                  if (!open) setOpenPopconfirm(false);
                }}
                title={
                  <div className={styles.popconfirmTitle}>
                    {node.dstNode?.trust
                      ? '关闭后该节点的任务请求将需要审核，确定要关闭吗？'
                      : '开启后该节点的任务请求将直接通过，确定要开启吗？'}
                  </div>
                }
                onConfirm={async () => {
                  if (node.dstNode && node.dstNodeId && node.routeId) {
                    setTrustConfigLoading(true);
                    await updateNodeRoute(node.dstNodeId, !node.dstNode.trust);
                    await refreshNodeRoute(node.routeId);
                    setTrustConfigLoading(false);
                  }
                }}
                okButtonProps={{ loading: trustConfirmLoading }}
                okText={node.dstNode?.trust ? '关闭' : '开启'}
                cancelText="取消"
                placement="leftTop"
                arrow={{ pointAtCenter: true }}
              >
                <Space>
                  <>
                    信任节点:
                    <Switch
                      checked={node.dstNode?.trust}
                      size="small"
                      onClick={() => {
                        setOpenPopconfirm(true);
                      }}
                    />
                  </>
                </Space>
              </Popconfirm>
            </div>
            {/* <div className={styles.routeDescription}>
            <Space>
              <>
                本方通讯地址:
                <EllipsisText width={150} className={styles.routeDescription}>
                  {node.srcNetAddress}
                </EllipsisText>
              </>
            </Space>
          </div> */}
          </div>
        </div>
      </div>
    </Tooltip>
  );
};
