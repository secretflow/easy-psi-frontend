/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
import request from 'umi-request';

/** 此处后端没有提供注释 POST /api/v1alpha1/nodeRoute/collaborationRoute */
export async function queryCollaborationList(options?: { [key: string]: any }) {
  return request<API.SecretPadResponse_List_NodeRouterVO__>(
    '/api/v1alpha1/nodeRoute/collaborationRoute',
    {
      method: 'POST',
      ...(options || {}),
    },
  );
}

/** 此处后端没有提供注释 POST /api/v1alpha1/nodeRoute/refresh */
export async function refresh(body?: API.RouterIdRequest, options?: { [key: string]: any }) {
  return request<API.SecretPadResponse_NodeRouterVO_>('/api/v1alpha1/nodeRoute/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1alpha1/nodeRoute/test */
export async function test(body?: API.RouterAddressRequest, options?: { [key: string]: any }) {
  return request<API.SecretPadResponse_Boolean_>('/api/v1alpha1/nodeRoute/test', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1alpha1/nodeRoute/update */
export async function update(body?: API.UpdateNodeRouterRequest, options?: { [key: string]: any }) {
  return request<API.SecretPadResponse_String_>('/api/v1alpha1/nodeRoute/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
