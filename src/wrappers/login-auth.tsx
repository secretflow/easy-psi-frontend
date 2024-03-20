import { useEffect } from 'react';
import { Outlet } from 'umi';

import { UserService } from '@/modules/user';
import { get } from '@/services/ezpsi-board/NodeController';
import { useModel } from '@/util/valtio-helper';
import { NodeService } from '@/modules/node/node.service';
import { message } from 'antd';
import API from '@/services/ezpsi-board';

const UserAuth = () => {
  const userService = useModel(UserService);
  const nodeService = useModel(NodeService);

  const getUserInfo = async () => {
    await userService.getUserInfo();
    const { platformNodeId } = userService?.userInfo || {};
    const { data, status } = await get({ nodeId: platformNodeId });
    const { data: pathData, status: pathStatus } =
      await API.DataController.queryHostPath();

    if (status?.code === 0) {
      nodeService.currentNode = data;
    } else {
      message.error(status?.msg || '获取本方节点失败');
    }

    if (pathStatus?.code === 0) {
      nodeService.nodePath = pathData?.path;
    } else {
      message.error(pathStatus?.msg || '获取节点文件路径失败');
    }
  };
  useEffect(() => {
    getUserInfo();
  }, []);

  return <Outlet />;
};

export default UserAuth;
