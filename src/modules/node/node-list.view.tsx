import { Badge, Button, Spin, Space, Tooltip, message, Empty } from 'antd';
import {
  PlusCircleFilled,
  ReloadOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { Model, getModel, useModel } from '@/util/valtio-helper';
import { DefaultModalManager } from '@/modules/modal-manager';
import { EllipsisText } from '@/components/text-ellipsis';
import { confirmDelete } from '@/components/confirm-delete';
import styles from './index.less';
import { AddNodeDrawer, addNodeDrawer } from '.';
import { useEffect, useState, useRef } from 'react';
import type { NodeRoute } from './types';
import { NodeState } from './types';
import { NodeRouteInfoDrawer } from './route-info-drawer';
// import { GuideTourKey, GuideTourService } from '../guide-tour';
import { NodeService } from './node.service';
import { EditNodeModal } from './edit-node-modal';

export const NodeRouteList = () => {
  const viewInstance = useModel(NodeRouteListView);
  // const guideService = useModel(GuideTourService);
  const modalManager = useModel(DefaultModalManager);
  const [nodeListLoading, setNodeListLoading] = useState(true);

  const ref = useRef(null);
  // const steps: TourProps['steps'] = [
  //   {
  //     title: <span style={{ fontWeight: 400 }}>合作节点在这里添加哦～</span>,
  //     target: () => ref.current,
  //     nextButtonProps: { children: '知道了' },
  //   },
  // ];

  useEffect(() => {
    const fetchNodeList = async () => {
      await viewInstance.getNodeRouteList();
      setNodeListLoading(false);
    };

    fetchNodeList();
  }, []);
  return (
    <>
      <div className={styles.routeListHeader}>
        <div className={styles.title}>合作节点</div>
        <Button
          type="link"
          icon={<PlusCircleFilled />}
          className={styles.addBtn}
          onClick={() => {
            modalManager.openModal(addNodeDrawer.id);
            // viewInstance.addNodeRoute();
          }}
        >
          <span ref={ref}>添加</span>
        </Button>
        {/* <Tour
          open={guideService.CreateTaskTour && !guideService.AddNodeRouteTour}
          mask={false}
          type="primary"
          steps={steps}
          closeIcon={false}
          zIndex={100000000}
          rootClassName={styles.tourAddNode}
          placement="topLeft"
          onFinish={() => guideService.finish(GuideTourKey.AddNodeRouteTour)}
        /> */}
        <AddNodeDrawer />
      </div>

      <div>
        {nodeListLoading && <Spin />}
        {viewInstance.nodeRouteList.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          viewInstance.nodeRouteList.map((node: NodeRoute) => {
            return (
              <Tooltip
                key={node.routeId}
                placement={'leftTop'}
                trigger={'hover'}
                title={
                  node.status === NodeState.FAILED ||
                  node.status === NodeState.UNKNOWN ? (
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
                <div key={node.routeId} className={styles.routeItem}>
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

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                      }}
                    >
                      <div className={styles.routeHeaderLayout}>
                        <div onClick={() => viewInstance.openNodeRouteInfoDrawer(node)}>
                          <EllipsisText width={220} className={styles.routeName}>
                            {node.dstNode?.nodeName}
                          </EllipsisText>
                        </div>

                        <div>
                          <Space size={16}>
                            <Tooltip title="刷新状态">
                              <ReloadOutlined
                                className={styles.actionIcon}
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if (node.routeId) {
                                    try {
                                      await viewInstance.refreshNodeRoute(node.routeId);
                                      message.success(
                                        `「${node.dstNodeId}」状态已刷新`,
                                      );
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
                                        viewInstance.deleteNodeRoute(
                                          node.routeId,
                                          node.dstNodeId,
                                        );
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
                                    viewInstance.openEditModal(node, () => {
                                      if (node.routeId)
                                        viewInstance.refreshNodeRoute(node.routeId);
                                    });
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
          })
        )}
      </div>
      <EditNodeModal />
      <NodeRouteInfoDrawer />
    </>
  );
};

export class NodeRouteListView extends Model {
  nodeRouteList: NodeRoute[] = [];
  modalManager = getModel(DefaultModalManager);
  nodeService = getModel(NodeService);

  openEditModal(route: NodeRoute, callback?: () => void) {
    this.modalManager.openModal('edit-node', { route, callback });
  }

  openNodeRouteInfoDrawer(route: NodeRoute) {
    this.modalManager.openModal('route-info', { route });
  }

  async getNodeRouteList(): Promise<void> {
    try {
      const res = await this.nodeService.listNodeRoutes();
      this.nodeRouteList = res || ([] as NodeRoute[]);
    } catch (e) {
      message.error((e as Error).message);
    }
  }

  async refreshNodeRoute(routeId: string) {
    const nodeRoute = await this.nodeService.refreshNodeRoute(routeId);
    this.nodeRouteList = this.nodeRouteList.map((i) =>
      i.routeId === routeId ? nodeRoute : i,
    );
    return nodeRoute;
  }

  async deleteNodeRoute(routeId: string, nodeId: string) {
    try {
      await this.nodeService.deleteNodeRoute(routeId);
      message.success(`「${nodeId}」节点已删除`);
      this.nodeRouteList = this.nodeRouteList.filter((i) => i.routeId !== routeId);
    } catch (e) {
      message.error((e as Error).message);
    }
  }

  async downloadCertificate(nodeId: string) {
    try {
      await this.nodeService.downloadCertificate(nodeId);
    } catch (e) {
      message.error((e as Error).message);
    }
  }
}
