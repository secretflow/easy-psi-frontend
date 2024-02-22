import sha256 from 'crypto-js/sha256';

import API from '@/services/ezpsi-board';
import { Model } from '@/util/valtio-helper';

export class LoginService extends Model {
  userInfo: API.UserContextDTO | null = null;

  constructor() {
    super();
    this.getUserInfo();
  }

  async login(loginField: { name: string; password: string }) {
    const { data, status } = await API.AuthController.login(
      {},
      {
        name: loginField.name,
        passwordHash: sha256(loginField.password).toString(),
      },
    );

    if (status?.code === 0) this.userInfo = data as API.UserContextDTO;

    return { status, data };
  }

  getUserInfo = async () => {
    if (!this.userInfo) {
      const { data } = await API.UserController.get();
      this.userInfo = data as API.UserContextDTO;
    }
    return this.userInfo;
  };

  resetUserPwd = async (
    name: string,
    currentPwd: string,
    newPwd: string,
    verifiedNewPwd: string,
  ) => {
    const res = await API.UserController.updatePwd({
      name: name,
      oldPasswordHash: sha256(currentPwd).toString(),
      newPasswordHash: sha256(newPwd).toString(),
      confirmPasswordHash: sha256(verifiedNewPwd).toString(),
    });
    return res.status
  };
}
