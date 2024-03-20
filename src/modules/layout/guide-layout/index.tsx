import { Button, Empty, Spin, Tour, TourProps, message } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { history } from 'umi';

import styles from './index.less';
import classnames from 'classnames';
import { GuidePipeline } from '@/modules/guide-pipeline/guide-pipeline';
import {
  AddNodeDrawer,
  NodeListItemRender,
  NodeRoute,
  addNodeDrawer,
} from '@/modules/node';
import { useModel, Model, getModel } from '@/util/valtio-helper';
import { DefaultModalManager } from '@/modules/modal-manager';
import { PlusCircleFilled } from '@ant-design/icons';
import { GuideTourService, GuideTourKey } from '@/modules/guide-tour';
import { NodeRouteListView } from '@/modules/node/node-list.view';
import { NodeRouteInfoDrawer } from '@/modules/node/route-info-drawer';
import { EditNodeModal } from '@/modules/node/edit-node-modal';
import { listJob } from '@/services/ezpsi-board/ProjectController';
import { UserService } from '@/modules/user';

export const GuideLayout = () => {
  const modalManager = useModel(DefaultModalManager);
  const [nodeListLoading, setNodeListLoading] = useState(true);
  const viewInstance = useModel(NodeRouteListView);
  const guideService = useModel(GuideTourService);
  const guideLayoutViewInstance = useModel(GuideLayoutView);

  const { pollingTaskList } = guideLayoutViewInstance;

  useEffect(() => {
    const fetchNodeList = async () => {
      await viewInstance.getNodeRouteList();
      setNodeListLoading(false);
    };

    fetchNodeList();
  }, []);

  useEffect(() => {
    if (viewInstance.nodeRouteList.length !== 0) {
      guideService.GuidAddNodeRouteTour = false;
      guideService.MyNodeTour = true;
      // 轮询任务列表，有任务自动跳转到任务列表
      pollingTaskList();
    }
  }, [viewInstance.nodeRouteList.length]);

  const addNodeRef = useRef(null);
  const createTaskRef = useRef(null);

  const addNodeSteps: TourProps['steps'] = [
    {
      title: <span className={styles.addTitle}>🎉节点添加成功～</span>,
      description: (
        <span className={styles.addDesc}>
          还需要下载本方「节点公钥」和「通讯地址」并线下告知合作方，以便对方进入平台添加本方节点。
          可点击节点名称查看相关信息。
        </span>
      ),
      target: () => addNodeRef.current,
      nextButtonProps: {
        children: '知道了',
        onClick: () => (guideService.GuidCreateTaskTour = false),
      },
    },
  ];

  const createTaskSteps: TourProps['steps'] = [
    {
      title: <span className={styles.createTitle}>任务是在这里发起哦～</span>,
      description: null,
      target: () => createTaskRef.current,
      nextButtonProps: { children: '知道了' },
    },
  ];

  return (
    <div className={styles.guideLayout}>
      <div className={classnames(styles.top, styles.block)}>
        <div className={styles.title}>
          <span className={styles.cup}>🍵</span>
          <span>Hi～，</span>
          欢迎来到 Easy PSI。
        </div>
        <div className={styles.description}>
          快速体验隐私求交（Private Set
          Intersection）算法过程，结合双方数据产出交集结果，方便后续联合建模。
          {/* <a className={styles.more}>了解更多</a> */}
        </div>

        <div className={styles.graph}>
          <GuidePipeline />
        </div>
        <AddNodeDrawer />
      </div>

      <div
        className={classnames(styles.bottom, {
          [styles.screenLargeBottom]: true,
        })}
      >
        <div className={classnames(styles.bottomLeft, styles.block)}>
          <div className={styles.title}>我的任务</div>
          {/* TODO: Place holder */}
          <div className={styles.empty}>
            <Empty
              description={<span className={styles.emptyDesc}>还没有任务哦～</span>}
            >
              {viewInstance.nodeRouteList.length ? (
                <Button
                  type="primary"
                  className={styles.addButton}
                  onClick={() => history.push('/task')}
                  ref={createTaskRef}
                >
                  <span>发起任务</span>
                </Button>
              ) : null}
            </Empty>
          </div>
        </div>
        <div className={classnames(styles.bottomRight, styles.block)}>
          <div className={styles.title}>合作节点</div>
          {nodeListLoading ? (
            <Spin />
          ) : viewInstance.nodeRouteList.length ? (
            <>
              <div
                className={styles.addNodeRouteBtn}
                onClick={() => modalManager.openModal(addNodeDrawer.id)}
              >
                <PlusCircleFilled />
                添加
              </div>
              <div className={styles.listContainer}>
                {viewInstance.nodeRouteList.map((node, index) => (
                  <div ref={index === 0 ? addNodeRef : null} key={node.routeId}>
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
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className={styles.empty}>
              <Empty description={null}>
                <Button
                  type="primary"
                  className={styles.addButton}
                  onClick={() => modalManager.openModal(addNodeDrawer.id)}
                >
                  <span>✨先来添加合作节点吧</span>
                </Button>
              </Empty>
            </div>
          )}
        </div>
        <Tour
          open={!guideService.GuidAddNodeRouteTour}
          placement={'left'}
          steps={addNodeSteps}
          mask={false}
          type="primary"
          closeIcon={false}
          onFinish={() => guideService.finish(GuideTourKey.GuidAddNodeRouteTour)}
          rootClassName={styles.tourAddNode}
        />
        <Tour
          open={!guideService.GuidCreateTaskTour}
          placement={'right'}
          steps={createTaskSteps}
          mask={false}
          type="primary"
          closeIcon={false}
          onFinish={() => guideService.finish(GuideTourKey.GuidCreateTaskTour)}
          rootClassName={styles.createTaskNode}
        />
      </div>
      <NodeRouteInfoDrawer />
      <EditNodeModal />
    </div>
  );
};

export class GuideLayoutView extends Model {
  timer: ReturnType<typeof setTimeout> | 0 = 0;
  userService = getModel(UserService);

  onViewUnMount(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = 0;
    }
  }

  pollingTaskList = async () => {
    const { data } = await listJob({
      nodeId: this.userService?.userInfo?.ownerId,
      pageNum: 1,
      pageSize: 1,
    });
    if (data?.total === 0) {
      this.timer = setTimeout(async () => {
        this.pollingTaskList();
      }, 3000);
    } else {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = 0;
      }
      message.success('合作节点发起任务，请记得审核');
      setTimeout(() => {
        history.push('/home');
      }, 1000);
    }
  };
}
