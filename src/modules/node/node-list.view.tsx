import { Button, Spin, message, Empty } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';
import { Model, getModel, useModel } from '@/util/valtio-helper';
import { DefaultModalManager } from '@/modules/modal-manager';
import styles from './index.less';
import { AddNodeDrawer, NodeListItemRender, addNodeDrawer } from '.';
import { useEffect, useState, useRef } from 'react';
import type { NodeRoute } from './types';
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
          viewInstance.nodeRouteList.map((node: NodeRoute) => (
            <NodeListItemRender
              node={node}
              key={node.routeId}
              deleteNodeRoute={(routeId: string, nodeId: string) =>
                viewInstance.deleteNodeRoute(routeId, nodeId)
              }
              updateNodeRoute={(nodeId: string, trust: boolean) =>
                viewInstance.updateNodeRoute(nodeId, trust)
              }
              openNodeRouteInfoDrawer={(route: NodeRoute) =>
                viewInstance.openNodeRouteInfoDrawer(route)
              }
              refreshNodeRoute={(routeId: string) =>
                viewInstance.refreshNodeRoute(routeId)
              }
              openEditNodeDrawer={() => {
                viewInstance.openEditModal(node, () => {
                  if (node.routeId) viewInstance.refreshNodeRoute(node.routeId);
                });
              }}
            />
          ))
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

  async updateNodeRoute(nodeId: string, trust: boolean) {
    try {
      await this.nodeService.updateNodeRoute({ nodeId, trust });
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
