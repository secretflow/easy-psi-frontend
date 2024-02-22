import { NodeRoute, NodeState } from '@/modules/node';

import styles from './index.less';
import { EllipsisText } from '@/components/text-ellipsis';
import { Badge, Space, Tooltip, message } from 'antd';
import { DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { confirmDelete } from '@/components/confirm-delete';

export const NodeRouteItemRender = (props: {
  node: NodeRoute;
  refreshNodeRoute: (routeId: string) => Promise<API.NodeRouterVO>;
  deleteNodeRoute: (routeId: string, nodeId: string) => void;
  openNodeRouteInfoDrawer: (route: NodeRoute) => void;
  openEditNodeDrawer: (node: NodeRoute) => void;
}) => {
  const {
    node,
    deleteNodeRoute,
    refreshNodeRoute,
    openNodeRouteInfoDrawer,
    openEditNodeDrawer,
  } = props;

  return (
    <Tooltip
      placement={'leftTop'}
      trigger={'hover'}
      title={
        node.status === NodeState.FAILED || node.status === NodeState.UNKNOWN ? (
          <div
            style={{
              width: 260,
            }}
          >
            <div>节点不可用原因可能有：</div>
            <div>1.对方不在线，需提醒对方打开平台</div>
            <div>2.配置信息错误</div>
            <div>3.合作方未添加本方，需提醒对方添加</div>
          </div>
        ) : null
      }
    >
      <div className={styles.routeItem}>
        <div style={{ display: 'flex', alignItems: 'start' }}>
          <div style={{ marginRight: 8 }}>
            {node.status === NodeState.SUCCEEDED && (
              <Badge key={'green'} color={'rgb(35, 182, 95)'} text="" />
            )}
            {(node.status === NodeState.FAILED ||
              node.status === NodeState.UNKNOWN) && (
              <Badge color="rgba(252,117,116,1)" />
            )}
            {node.status === NodeState.PENDING && <Badge status="default" />}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
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
