import { message } from 'antd';
import React from 'react';
import { history } from 'umi';

import { ReactComponent as Logo } from '@/assets/logo1.svg';
import { getModel, Model, useModel } from '@/util/valtio-helper';

import { LoginForm } from './component/login-form';
import type { UserInfo } from './component/login-form';
import styles from './index.less';
import { LoginService } from './login.service';

export const LoginComponent: React.FC = () => {
  const loginModel = useModel(LoginModel);
  return (
    <div className={styles.content}>
      <div className={styles.left}>
        <Logo />
      </div>
      <div className={styles.right}>
        <LoginForm onConfirm={loginModel.loginConfirm} />
      </div>
    </div>
  );
};

export class LoginModel extends Model {
  token = '';
  loginService = getModel(LoginService);

  loginConfirm = async (loginFields: UserInfo) => {
    try {
      const { status, data } = await this.loginService.login({
        name: loginFields.name,
        password: loginFields.password,
      });

      this.token = data?.token || '';
      if (status?.code === 0) {
        localStorage.setItem('User-Token', this.token);
        const { noviceUser } = data as API.UserContextDTO;
        message.success('登录成功');

        if (!noviceUser) {
          history.push('/home');
        } else {
          history.push('/guide');
        }
      } else {
        message.error(status?.msg || '登录失败，请检查用户名或密码');
      }
    } catch (e) {
      message.error('登录失败');
    }
  };
}
