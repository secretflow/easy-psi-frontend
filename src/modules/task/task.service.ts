/* eslint-disable @typescript-eslint/no-unused-vars */
import { Model, getModel } from '@/util/valtio-helper';
import { Task, TaskServiceProtocol, TaskStatus } from './types';
import API from '@/services/ezpsi-board';
import { NodeService } from '../node';
import { message } from 'antd';

export const DEFAULT_ERROR_MESSAGE =
  '任务执行失败，可能原因是：1.网络异常；2.服务异常。请结合任务日志及容器日志与任务参与方进行问题排查。若无法定位问题，请联系隐语寻求协助。';
export class TaskService extends Model implements TaskServiceProtocol {
  nodeService = getModel(NodeService);

  async listTask(options: {
    pageNum: number;
    pageSize: number;
    sortKey?: string;
    sortType?: 'ASC' | 'DESC';
    statusFilter?: TaskStatus[];
    search?: string;
  }): Promise<API.SecretPadPageResponse_ProjectJobListVO_> {
    const { data, status } = await API.ProjectController.listJob({
      ...options,
      nodeId: this.nodeService.currentNode?.nodeId,
    });
    if (status?.code === 0) return data || {};
    throw new Error(status?.msg || '任务列表获取失败');
  }
  async getTaskDetail(option: { jobId: string; nodeId: string }): Promise<any> {
    const { data, status } = await API.ProjectController.getJob(option);
    if (status?.code === 0) return data || {};
    throw new Error(status?.msg || '任务详情获取失败');
  }
  async createTask(val: object): Promise<any> {
    const { status, data } = await API.ProjectController.createJob({ ...val });
    if (status?.code === 0) return data || {};
    throw new Error(status?.msg || '任务发起失败');
  }
  async agreeTask(val: { jobId: string }): Promise<void> {
    const { status } = await API.ProjectController.agreeJob({ ...val });
    if (status?.code === 0) return;
    if (status?.code === 202011905) throw new Error('PROJECT_DATA_NOT_EXISTS_ERROR');
    if (status?.code === 202011909)
      throw new Error('PROJECT_DATA_HEADER_NOT_EXISTS_ERROR');

    throw new Error(status?.msg || '任务同意失败');
  }
  async rejectTask(val: { jobId: string; rejectMsg?: string }): Promise<void> {
    const { status } = await API.ProjectController.rejectJob({ ...val });
    if (status?.code === 0) return;
    throw new Error(status?.msg || '任务取消失败');
  }
  async cancelTask(val: { jobId: string }): Promise<void> {
    const { status } = await API.ProjectController.stopJob({ ...val });
    if (status?.code === 0) return;
    throw new Error(status?.msg || '任务取消失败');
  }
  async pauseTask(val: { jobId: string }) {
    const { status } = await API.ProjectController.pauseJob({ ...val });
    if (status?.code === 0) return;
    throw new Error(status?.msg || '任务暂停失败');
  }
  async continueTask(val: { jobId: string }): Promise<void> {
    const { status } = await API.ProjectController.continueJob({ ...val });
    if (status?.code === 0) return;
    throw new Error(status?.msg || '继续任务失败');
  }
  async deleteTask(val: { jobId: string }): Promise<void> {
    const { status } = await API.ProjectController.deleteJob({ ...val });
    if (status?.code === 0) return;
    throw new Error(status?.msg || '任务删除失败');
  }
  async getLog(jobId: string): Promise<{ logs: string[]; status: TaskStatus }> {
    const { status, data } = await API.ProjectController.getProjectLogs({ jobId });
    if (status?.code === 0) return data;
    throw new Error(status?.msg || '日志获取失败');
  }
  async downloadResult(jobId: string) {
    const { status, data } = await API.ProjectController.downloadProjectResult({
      jobId,
    });
    if (status?.code === 0) {
      const a = document.createElement('a');
      a.href = `/api/v1alpha1/project/job/result/download?hash=${data as string}`;
      a.click();
    } else {
      throw new Error(status?.msg || '下载结果失败');
    }
  }
  async getDataTableInformation(val: object) {
    const { status, data } = await API.DataController.queryDataTableInformation(val);
    if (status?.code === 0) return data;
    throw new Error(status?.msg || '底层服务异常或网络异常');
  }
}
