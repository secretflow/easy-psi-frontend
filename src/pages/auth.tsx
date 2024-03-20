import React, { useEffect } from 'react';
import { get } from '@/services/ezpsi-board/AuthController';
import { history } from 'umi';
import { UserService } from '@/modules/user';
import { useModel } from '@/util/valtio-helper';

const AdminAuth: React.FC = () => {
  const userService = useModel(UserService);

  const getUserInfo = async () => {
    const { status, data } = await get();
    if (status?.code !== 0) {
      return history.replace('/login');
    } else {
      userService.userInfo = data as any;
      return history.replace('/home');
    }
  };
  useEffect(() => {
    getUserInfo();
  }, []);

  return null;
};

export default AdminAuth;
