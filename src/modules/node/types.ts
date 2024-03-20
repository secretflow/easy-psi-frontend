export type Node = API.NodeVO;

export enum NodeState {
  PENDING = 'Pending',
  UNKNOWN = 'Unknown',
  SUCCEEDED = 'Succeeded',
  FAILED = 'Failed',
}

export type BadgeType = 'success' | 'error' | 'default';

export type NodeRoute = API.NodeRouterVO;

export interface NodeServiceProtocol {
  /**
   * 本方节点
   */
  currentNode: Node | undefined;

  /**
   * 编辑节点信息
   * @param nodeId 节点id
   * @param info
   */
  editNode(option: {
    routerId: string;
    srcNetAddress: string;
    dstNetAddress: string;
  }): Promise<string | undefined>;

  /**
   * 获取合作节点列表
   * @returns node routes 合作节点列表
   */
  listNodeRoutes(): Promise<NodeRoute[] | undefined>;

  /**
   * 添加节点合作
   * @param info
   * @returns dstNodeId
   */
  addNodeRoute(info: {
    certText: string;
    dstNetAddress: string;
    trust: boolean;
    nodeRemark?: string;
    srcNetAddress: string;
  }): Promise<string | undefined>;

  /**
   * 删除节点合作
   * @param routeId
   */
  deleteNodeRoute(routerId: string): Promise<void>;

  /**
   * 刷新节点合作状态
   * @param routeId
   */
  refreshNodeRoute(routerId: string): Promise<NodeRoute>;
}
