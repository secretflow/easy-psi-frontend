/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
import request from 'umi-request';

/** All page requests are returned to this index, and the front end handles page routing
@return the string
 GET / */
export async function index(options?: { [key: string]: any }) {
  return request<API.OneApiResult_string_>('/', {
    method: 'GET',
    ...(options || {}),
  });
}

/** All page requests are returned to this index, and the front end handles page routing
@return the string
 GET /login */
export async function indexUsingGET(options?: { [key: string]: any }) {
  return request<API.OneApiResult_string_>('/login', {
    method: 'GET',
    ...(options || {}),
  });
}

/** index_2 All page requests are returned to this index, and the front end handles page routing
@return the string
 GET /guide */
export async function index2(options?: { [key: string]: any }) {
  return request<API.OneApiResult_string_>('/guide', {
    method: 'GET',
    ...(options || {}),
  });
}

/** index_3 All page requests are returned to this index, and the front end handles page routing
@return the string
 GET /task */
export async function index3(options?: { [key: string]: any }) {
  return request<API.OneApiResult_string_>('/task', {
    method: 'GET',
    ...(options || {}),
  });
}

/** index_4 All page requests are returned to this index, and the front end handles page routing
@return the string
 GET /task-details */
export async function index4(options?: { [key: string]: any }) {
  return request<API.OneApiResult_string_>('/task-details', {
    method: 'GET',
    ...(options || {}),
  });
}
