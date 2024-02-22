import { Model } from '@/util/valtio-helper';
import { Node, NodeRoute, NodeServiceProtocol } from './types';
import API from '@/services/ezpsi-board';

export class NodeService extends Model implements NodeServiceProtocol {
  currentNode: Node | undefined;
  nodePath: string | undefined;

  async editNode(option: {
    routerId: string;
    srcNetAddress: string;
    dstNetAddress: string;
  }) {
    const { data, status } = await API.NodeRouteController.update(option);
    if (status?.code !== 0) throw new Error(status?.msg);
    return data;
  }
  async listNodeRoutes(): Promise<NodeRoute[] | undefined> {
    const { data, status } = await API.NodeRouteController.queryCollaborationList();

    if (status?.code !== 0) throw new Error(status?.msg);
    return data;
  }

  async addNodeRoute(info: {
    certText: string;
    dstNetAddress: string;
    dstNodeId: string;
    nodeRemark?: string;
    srcNetAddress: string;
  }): Promise<void> {
    const { status } = await API.NodeController.createNode({ ...info });
    if (status?.code !== 0) throw new Error(status?.msg);
  }
  async deleteNodeRoute(routerId: string): Promise<void> {
    const { status } = await API.NodeController.deleteNode({ routerId });
    if (status?.code !== 0) throw new Error(status?.msg);
    return;
  }
  async refreshNodeRoute(routerId: string): Promise<NodeRoute> {
    const { data, status } = await API.NodeRouteController.refresh({ routerId });

    if (status?.code !== 0) throw new Error(status?.msg);
    return data as NodeRoute;
  }

  async editCurrentNode(val: { netAddress: string }) {
    if (!this.currentNode) return;
    const { status } = await API.NodeController.update({
      ...val,
      nodeId: this.currentNode.nodeId,
    });
    if (status?.code !== 0) throw new Error(status?.msg);

    this.currentNode.netAddress = val.netAddress;
  }

  downloadCertificate(nodeId: string) {
    const token = localStorage.getItem('User-Token') || '';
    fetch(`/api/v1alpha1/node/download`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
        'User-Token': token,
      },
      body: JSON.stringify({
        nodeId,
      }),
    }).then((res) =>
      res.blob().then((blob) => {
        const disposition = res.headers.get('Content-Disposition');
        let filename = '';
        const filenameRegex = /filename[^;=\n]*=[^'"]*['"]*((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition || '');
        if (matches !== null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
        const a = document.createElement('a');
        document.body.appendChild(a); //兼容火狐，将a标签添加到body当中
        const url = window.URL.createObjectURL(blob); // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
        a.href = url;
        a.download = filename + '.crt';
        a.click();
        a.remove(); //移除a标签
        window.URL.revokeObjectURL(url);
      }),
    );
  }
}
