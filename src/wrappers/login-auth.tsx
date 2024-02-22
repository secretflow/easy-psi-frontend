/* eslint-disable @typescript-eslint/no-unused-vars */
// import { useEffect } from 'react';
// import { Navigate, Outlet } from 'umi';

// import { LoginService } from '@/modules/login/login.service';
// import { useModel } from '@/util/valtio-helper';

// // 在这里控制是不是第一次进入平台
// const BeginnerAuth = () => {
//   const loginService = useModel(LoginService);

//   const neverLogined = localStorage.getItem('neverLogined');
//   if (!neverLogined) {
//     localStorage.setItem('neverLogined', 'true');
//     return <Navigate to="/login" />;
//   }

//   // 获取用户信息
//   const getUserInfo = async () => {
//     await loginService.getUserInfo();
//   };

//   useEffect(() => {
//     if (neverLogined) {
//       getUserInfo();
//     }
//   }, []);

//   return <Outlet />;
// };

// export default BeginnerAuth;

import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'umi';

import { LoginService } from '@/modules/login/login.service';
import API from '@/services/ezpsi-board';
import { useModel } from '@/util/valtio-helper';
import { NodeService } from '@/modules/node/node.service';
import { message } from 'antd';

const UserAuth = () => {
  const loginService = useModel(LoginService);
  const nodeService = useModel(NodeService);
  // const [canOutlet, setCanOutlet] = useState(true);
  // const { pathname } = useLocation();

  const getUserInfo = async () => {
    await loginService.getUserInfo();
    const { noviceUser, platformNodeId } = loginService?.userInfo || {};
    const { data, status } = await API.NodeController.get({ nodeId: platformNodeId });
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
    // if (noviceUser) {
    //   //用户是新手则跳转guide页面
    //   setCanOutlet(false);
    // }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  // if (canOutlet || pathname === '/guide' || pathname === '/task') {
  return <Outlet />;
  // } else {
  //   return <Navigate to="/guide" />;
  // }
};

export default UserAuth;
