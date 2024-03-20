/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
import request from 'umi-request';

/** Get random key string.
@return {@link String }
 GET /api/encryption/getRandomKey */
export async function getRandomKey(options?: { [key: string]: any }) {
  return request<API.EasyPsiResponse_String_>('/api/encryption/getRandomKey', {
    method: 'GET',
    ...(options || {}),
  });
}
