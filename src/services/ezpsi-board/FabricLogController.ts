/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
import request from 'umi-request';

/** Query fabric log by log path or log hash
@param fabricLogRequest
@return {@link EasyPsiResponse }<{@link Object }>
 POST /api/v1alpha1/fabricLog/query */
export async function queryFabricLog(
  body?: API.FabricLogRequest,
  options?: { [key: string]: any },
) {
  return request<API.EasyPsiResponse_Object_>('/api/v1alpha1/fabricLog/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
