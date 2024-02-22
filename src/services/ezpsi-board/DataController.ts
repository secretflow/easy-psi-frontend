/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
import request from 'umi-request';

/** 此处后端没有提供注释 POST /api/v1alpha1/data/count */
export async function queryDataTableInformation(
  body?: API.GetDataTableInformatinoRequest,
  options?: { [key: string]: any },
) {
  return request<API.SecretPadResponse_DataTableInformationVo_>(
    '/api/v1alpha1/data/count',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 此处后端没有提供注释 POST /api/v1alpha1/data/version */
export async function queryDataVersion(options?: { [key: string]: any }) {
  return request<API.SecretPadResponse_DataVersionVO_>('/api/v1alpha1/data/version', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1alpha1/data/host/path */
export async function queryHostPath(options?: { [key: string]: any }) {
  return request<API.SecretPadResponse_DataSourceVO_>('/api/v1alpha1/data/host/path', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1alpha1/data/count/kuscia */
export async function queryKusciaDataTableInformation(
  body?: API.GetDataTableInformatinoRequest,
  options?: { [key: string]: any },
) {
  return request<API.SecretPadResponse_String_>('/api/v1alpha1/data/count/kuscia', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
