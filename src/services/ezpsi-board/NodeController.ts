/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
import request from 'umi-request';

/** Create a new node api
@param request create node request
@return successful SecretPadResponse with nodeId
 POST /api/v1alpha1/node/create */
export async function createNode(
  body?: API.CreateNodeRequest,
  options?: { [key: string]: any },
) {
  return request<API.SecretPadResponse_String_>('/api/v1alpha1/node/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1alpha1/node/delete */
export async function deleteNode(
  body?: API.DeleteNodeIdRequest,
  options?: { [key: string]: any },
) {
  return request<API.SecretPadResponse_Void_>('/api/v1alpha1/node/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Download node certificate api
@param response http servlet response
@return successful SecretPadResponse with null data
 POST /api/v1alpha1/node/download */
export async function download(
  params: {
    // query
    /** http servlet response */
    response?: API.HttpServletResponse;
  },
  body?: API.DownloadNodeCertificateRequest,
  options?: { [key: string]: any },
) {
  return request<API.OneApiResult_object_>('/api/v1alpha1/node/download', {
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

/** 此处后端没有提供注释 POST /api/v1alpha1/node/get */
export async function get(options?: { [key: string]: any }) {
  return request<API.SecretPadResponse_NodeVO_>('/api/v1alpha1/node/get', {
    method: 'POST',
    ...(options || {}),
  });
}

/** Upload node certificate api
@param file multipart file
@return successful SecretPadResponse with upload certificate result view object
 POST /api/v1alpha1/node/upload */
export async function upload(files?: File[], options?: { [key: string]: any }) {
  const formData = new FormData();
  if (files) {
    formData.append('file', files[0] || '');
  }
  return request<API.SecretPadResponse_UploadNodeResultVO_>(
    '/api/v1alpha1/node/upload',
    {
      method: 'POST',
      data: formData,
      ...(options || {}),
    },
  );
}
