export enum TaskStatus {
  PENDING_CERT = 'PENDING_CERT', // 证书缺失， 待审核
  PENDING_REVIEW = 'PENDING_REVIEW', // 待审核
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  FAILED = 'FAILED',
  TIMEOUT = 'TIMEOUT',
  CANCELED = 'CANCELED', //失败，bob取消任务,
  REJECTED = 'REJECTED',
  SUCCEEDED = 'SUCCEEDED',
}

export type TaskDetail = API.ProjectJobVO;

export enum TaskAction {
  AGREE = 'AGREE',
  REJECT = 'REJECT',
  PAUSE = 'PAUSE',
  CONTINUE = 'CONTINUE',
  CANCEL = 'CANCEL',
  DELETE = 'DELETE',
  LOG = 'LOG',
  DOWNLOAD_RESULT = 'DOWNLOAD_RESULT',
  UPLOAD_CERT = 'UPLOAD_CERT',
}

export type Task = API.ProjectJobListVO;

export enum TaskDataTableInformation {
  L0 = 'L0',
  L1 = 'L1',
  L2 = 'L2',
  L3 = 'L3',
  L4 = 'L4',
  L5 = 'L5',
  L6 = 'L6',
}

export const TaskDataTableInformationText = {
  [TaskDataTableInformation.L0]: '',
  [TaskDataTableInformation.L1]: '[0-1万)',
  [TaskDataTableInformation.L2]: '[1w-10万)',
  [TaskDataTableInformation.L3]: '[10万-100万)',
  [TaskDataTableInformation.L4]: '[100万-1000万))',
  [TaskDataTableInformation.L5]: '[1000万-1亿)',
  [TaskDataTableInformation.L6]: '大于等于1亿',
};

export interface TaskServiceProtocol {
  /**
   * 获取任务列表，支持分页，关键词搜索和排序，状态筛选
   * @param options
   * @returns task
   */
  listTask(options: {
    pageNum: number;
    /** page size default 10 */
    pageSize: number;
    /** sort，property,property(,ASC|DESC) "createdDate,desc" */
    sortType?: 'ASC' | 'DESC';
    srtKey?: string;
    /** filter by task status */
    statusFilter?: TaskStatus[];
    /** name,nodeName,search */
    search?: string;
  }): Promise<API.SecretPadPageResponse_ProjectJobListVO_>;

  /**
   * 获取任务详情
   * @param taskId
   * @returns task detail
   */
  getTaskDetail(option: { jobId: string; nodeId: string }): Promise<any>;

  /**
   * 发起任务
   * @param info
   * @returns task
   */
  createTask(info: any): Promise<void>;

  /**
   * 同意任务
   * @param taskId
   * @returns task
   */
  agreeTask(val: { jobId: string }): Promise<void>;

  /**
   * 拒绝任务
   * @param taskId
   * @param [reason] optional
   * @returns task
   */
  rejectTask(val: { jobId: string; rejectMsg?: string }): Promise<void>;

  /**
   * 取消任务
   * @param taskId
   * @returns task
   */
  cancelTask(val: { jobId: string }): Promise<void>;

  /**
   * 暂停任务
   * @param taskId
   * @returns task
   */
  pauseTask(val: { jobId: string }): Promise<void>;

  /**
   * 继续任务
   * @param taskId
   * @returns task
   */
  continueTask(val: { jobId: string }): Promise<void>;

  /**
   * 删除任务
   * @param taskId
   * @returns task
   */
  deleteTask(val: { jobId: string }): Promise<void>;

  /**
   * 获取任务日志
   * @param taskId
   * @returns log
   */
  getLog(jobId: string): Promise<{ logs: string[]; status: TaskStatus }>;

  /**
   * 下载任务结果
   * @param taskId
   * @returns result
   */
  downloadResult(jobId: string): Promise<void>;
}
