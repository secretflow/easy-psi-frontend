import { Model } from '@/util/valtio-helper';
import sha256 from 'crypto-js/sha256';
import JSEncrypt from 'jsencrypt';

import { updatePwd } from '@/services/ezpsi-board/UserController';
import { get } from '@/services/ezpsi-board/AuthController';
import { getRandomKey } from '@/services/ezpsi-board/EncryptionController';

export class UserService extends Model {
  userInfo: API.UserContextDTO | null = null;

  // constructor() {
  //   super();
  //   this.getUserInfo();
  // }

  getUserInfo = async () => {
    if (!this.userInfo) {
      const { data } = await get();
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
    const publicKey = await this.getPublicKey();

    if (!publicKey) throw new Error('获取公钥失败');

    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKey);

    const rsaCurrentPwd = encryptor.encrypt(sha256(currentPwd).toString());
    const rsaNewPwd = encryptor.encrypt(sha256(newPwd).toString());
    const rsaVerifiedNewPwd = encryptor.encrypt(sha256(verifiedNewPwd).toString());

    if (!rsaCurrentPwd || !rsaNewPwd || !rsaVerifiedNewPwd) {
      throw new Error('加密失败');
    }

    const res = await updatePwd({
      name: name,
      oldPasswordHash: rsaCurrentPwd,
      newPasswordHash: rsaNewPwd,
      confirmPasswordHash: rsaVerifiedNewPwd,
      publicKey: publicKey,
    });
    return res.status;
  };

  async getPublicKey(): Promise<string | undefined> {
    const { data: publicKey, status } = await getRandomKey();
    if (status?.code === 0) return publicKey;
  }
}
