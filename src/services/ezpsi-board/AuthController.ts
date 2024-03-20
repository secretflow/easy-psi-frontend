/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
import request from 'umi-request';

/** query user info
@return successful EasyPsiResponse with user name
 POST /api/get */
export async function get(options?: { [key: string]: any }) {
  return request<API.EasyPsiResponse_UserContextDTO_>('/api/get', {
    method: 'POST',
    ...(options || {}),
  });
}

/** User login api
@param response http servlet response
@param request login request
@return successful EasyPsiResponse with token
 POST /api/login */
export async function login(
  params: {
    // query
    /** http servlet response */
    response?: API.HttpServletResponse;
  },
  body?: API.LoginRequest,
  options?: { [key: string]: any },
) {
  return request<API.EasyPsiResponse_UserContextDTO_>('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...params,
      response: undefined,
      ...params['response'],
    },
    data: body,
    ...(options || {}),
  });
}

/** User logout api
@param request http servlet request
@return {@link EasyPsiResponse }<{@link String }>
 POST /api/logout */
export async function logout(
  params: {
    // query
    /** http servlet request */
    request?: API.HttpServletRequest;
  },
  options?: { [key: string]: any },
) {
  return request<API.EasyPsiResponse_String_>('/api/logout', {
    method: 'POST',
    params: {
      ...params,
      request: undefined,
      ...params['request'],
    },
    ...(options || {}),
  });
}
