/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
import request from 'umi-request';

/** Agree project job api
@param request agree project job task request
@return successful EasyPsiResponse with null data
 POST /api/v1alpha1/project/job/agree */
export async function agreeJob(
  body?: API.AgreeProjectJobTaskRequest,
  options?: { [key: string]: any },
) {
  return request<API.EasyPsiResponse_Void_>('/api/v1alpha1/project/job/agree', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Continue project job api
@param request Continue project job task request
@return successful EasyPsiResponse with null data
 POST /api/v1alpha1/project/job/continue */
export async function continueJob(
  body?: API.StopProjectJobTaskRequest,
  options?: { [key: string]: any },
) {
  return request<API.EasyPsiResponse_Void_>('/api/v1alpha1/project/job/continue', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Continue project job api
@param request Continue project job task request
@return successful EasyPsiResponse with null data
 POST /api/v1alpha1/project/job/continue/kuscia */
export async function continueKusciaJob(
  body?: API.StopProjectJobTaskRequest,
  options?: { [key: string]: any },
) {
  return request<API.EasyPsiResponse_Void_>(
    '/api/v1alpha1/project/job/continue/kuscia',
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

/** Create project job api
@param request create project job task request
@return successful EasyPsiResponse with CreateProjectJobVO
 POST /api/v1alpha1/project/job/create */
export async function createJob(
  body?: API.CreateProjectJobRequest,
  options?: { [key: string]: any },
) {
  return request<API.EasyPsiResponse_CreateProjectJobVO_>(
    '/api/v1alpha1/project/job/create',
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

/** Create project job api
@param request create project job task request
@return successful EasyPsiResponse with null data
 POST /api/v1alpha1/project/job/create/kuscia */
export async function createKusciaJob(
  body?: API.CreateProjectJobTaskRequest,
  options?: { [key: string]: any },
) {
  return request<API.EasyPsiResponse_Void_>('/api/v1alpha1/project/job/create/kuscia', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Delete project job api
@param request delete project job task request
@return successful EasyPsiResponse with null data
 POST /api/v1alpha1/project/job/delete */
export async function deleteJob(
  body?: API.DeleteProjectJobTaskRequest,
  options?: { [key: string]: any },
) {
  return request<API.EasyPsiResponse_Void_>('/api/v1alpha1/project/job/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Download project result api
@param request download data request
@return successful EasyPsiResponse with hash string
 POST /api/v1alpha1/project/job/result/download */
export async function downloadProjectResult(
  body?: API.DownloadProjectResult,
  options?: { [key: string]: any },
) {
  return request<API.EasyPsiResponse_String_>(
    '/api/v1alpha1/project/job/result/download',
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

/** Query csv data header
@return successful EasyPsiResponse with csv data header list view object
 POST /api/v1alpha1/project/data/header */
export async function getDataHeader(
  body?: API.GetProjectJobDataHeaderRequest,
  options?: { [key: string]: any },
) {
  return request<API.EasyPsiResponse_GrapDataHeaderVO_>(
    '/api/v1alpha1/project/data/header',
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

/** Query csv data table
@return successful EasyPsiResponse with csv data table list view object
 POST /api/v1alpha1/project/data/table */
export async function getDataTable(
  body?: API.GetProjectJobTableRequest,
  options?: { [key: string]: any },
) {
  return request<API.EasyPsiResponse_GrapDataTableVO_>(
    '/api/v1alpha1/project/data/table',
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

/** Query project job detail api
@param request get project job request
@return successful EasyPsiResponse with project job view object
 POST /api/v1alpha1/project/job/get */
export async function getJob(
  body?: API.GetProjectJobRequest,
  options?: { [key: string]: any },
) {
  return request<API.EasyPsiResponse_ProjectJobVO_>('/api/v1alpha1/project/job/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Query project job logs
@return successful EasyPsiResponse with project job logs list view object
 POST /api/v1alpha1/project/job/logs */
export async function getProjectLogs(
  body?: API.GetProjectJobLogRequest,
  options?: { [key: string]: any },
) {
  return request<API.EasyPsiResponse_GraphNodeJobLogsVO_>(
    '/api/v1alpha1/project/job/logs',
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

/** Download project result api
@param response http servlet response
@param request download data request
@return successful EasyPsiResponse with null data
 GET /api/v1alpha1/project/job/result/download */
export async function getloadProjectResult(
  params: {
    // query
    /** http servlet response */
    response?: API.HttpServletResponse;
    /** download data request */
    request?: API.GetloadProjectResult;
  },
  options?: { [key: string]: any },
) {
  return request<API.OneApiResult_object_>(
    '/api/v1alpha1/project/job/result/download',
    {
      method: 'GET',
      params: {
        ...params,
        response: undefined,
        ...params['response'],
        request: undefined,
        ...params['request'],
      },
      ...(options || {}),
    },
  );
}

/** Paging list project job list api
@param request list project job request
@return successful EasyPsiResponse with paging project job view object
 POST /api/v1alpha1/project/job/list */
export async function listJob(
  body?: API.ListProjectJobRequest,
  options?: { [key: string]: any },
) {
  return request<API.EasyPsiResponse_EasyPsiPageResponse_ProjectJobListVO__>(
    '/api/v1alpha1/project/job/list',
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

/** Paging list project job list api
@param request list project job request
@return successful EasyPsiResponse with paging project job view object
 POST /api/v1alpha1/project/job/list/black_screen */
export async function listJobByBlackScreen(
  body?: API.ListProjectJobRequest,
  options?: { [key: string]: any },
) {
  return request<API.EasyPsiResponse_List_ProjectJobListByBlackScreenVO__>(
    '/api/v1alpha1/project/job/list/black_screen',
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

/** Pause project job api
@param request pause project job task request
@return successful EasyPsiResponse with null data
 POST /api/v1alpha1/project/job/pause */
export async function pauseJob(
  body?: API.StopProjectJobTaskRequest,
  options?: { [key: string]: any },
) {
  return request<API.EasyPsiResponse_Void_>('/api/v1alpha1/project/job/pause', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Pause project job api
@param request pause project job task request
@return successful EasyPsiResponse with null data
 POST /api/v1alpha1/project/job/pause/kuscia */
export async function pauseKusciaJob(
  body?: API.StopProjectJobTaskRequest,
  options?: { [key: string]: any },
) {
  return request<API.EasyPsiResponse_Void_>('/api/v1alpha1/project/job/pause/kuscia', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Query project edge job list
@return project job view object list
 POST /api/v1alpha1/project/edge/job/list */
export async function queryEdgeProjectJobs(options?: { [key: string]: any }) {
  return request<API.EasyPsiResponse_List_ProjectJobVO__>(
    '/api/v1alpha1/project/edge/job/list',
    {
      method: 'POST',
      ...(options || {}),
    },
  );
}

/** Reject project job api
@param request Reject project job task request
@return successful EasyPsiResponse with null data
 POST /api/v1alpha1/project/job/reject */
export async function rejectJob(
  body?: API.RejectProjectJobTaskRequest,
  options?: { [key: string]: any },
) {
  return request<API.EasyPsiResponse_Void_>('/api/v1alpha1/project/job/reject', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Stop project job api
@param request stop project job task request
@return successful EasyPsiResponse with null data
 POST /api/v1alpha1/project/job/stop */
export async function stopJob(
  body?: API.StopProjectJobTaskRequest,
  options?: { [key: string]: any },
) {
  return request<API.EasyPsiResponse_Void_>('/api/v1alpha1/project/job/stop', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Stop project job api
@param request stop project job task request
@return successful EasyPsiResponse with null data
 POST /api/v1alpha1/project/job/stop/kuscia */
export async function stopKusciaJob(
  body?: API.StopProjectJobTaskRequest,
  options?: { [key: string]: any },
) {
  return request<API.EasyPsiResponse_Void_>('/api/v1alpha1/project/job/stop/kuscia', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
