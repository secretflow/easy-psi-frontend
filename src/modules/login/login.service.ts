import sha256 from 'crypto-js/sha256';
import JSEncrypt from 'jsencrypt';

import { login } from '@/services/ezpsi-board/AuthController';
import { Model } from '@/util/valtio-helper';
import { getRandomKey } from '@/services/ezpsi-board/EncryptionController';

export class LoginService extends Model {
  userInfo: API.UserContextDTO | null = null;

  async login(loginField: { name: string; password: string }) {
    const publicKey = await this.getPublicKey();

    if (publicKey) {
      const encryptor = new JSEncrypt();
      encryptor.setPublicKey(publicKey);

      const rsaPassWord = encryptor.encrypt(sha256(loginField.password).toString());
      if (!rsaPassWord) throw new Error('登录失败');

      const { data, status } = await login(
        {},
        {
          name: loginField.name,
          passwordHash: rsaPassWord,
          publicKey,
        },
      );

      if (status?.code === 0) this.userInfo = data as API.UserContextDTO;

      return { status, data };
    }
    throw new Error('登录失败');
  }

  async getPublicKey(): Promise<string | undefined> {
    const { data: publicKey, status } = await getRandomKey();
    if (status?.code === 0) return publicKey;
  }
}
