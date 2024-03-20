/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Space,
  Select,
  Input,
  Button,
  Table,
  Spin,
  Typography,
  Tooltip,
  Badge,
  BadgeProps,
  Progress,
  Tour,
  TourProps,
  message,
  TablePaginationConfig,
  notification,
} from 'antd';
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { EllipsisText } from '@/components/text-ellipsis';
import { useModel, Model, getModel } from '@/util/valtio-helper';
import styles from './index.less';
import { Task, TaskAction, TaskStatus } from './types';
import { NodeRoute, NodeService } from '../node';
import { formatTimestamp } from '@/util/timestamp-formatter';
import { TaskListAction } from './task-list-action';
import { TaskLogDrawer } from './task-log';
import { history, useLocation } from 'umi';
import { GuideTourKey, GuideTourService } from '../guide-tour';
import { DEFAULT_ERROR_MESSAGE, TaskService } from './task.service';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import { DefaultModalManager } from '../modal-manager';

const taskStatusBadge: Record<TaskStatus, BadgeProps> = {
  [TaskStatus.SUCCEEDED]: { color: 'rgb(35, 182, 95)', text: '成功' },
  [TaskStatus.FAILED]: { color: 'rgba(252,117,116,1)', text: '失败' },
  [TaskStatus.REJECTED]: { color: 'rgba(252,117,116,1)', text: '已拒绝' },
  [TaskStatus.TIMEOUT]: { color: 'rgba(252,117,116,1)', text: '失败' },
  [TaskStatus.CANCELED]: { color: 'rgba(252,117,116,1)', text: '已取消' },
  [TaskStatus.PAUSED]: { color: 'rgba(0,99,238,0.5)', text: '已暂停' },
  [TaskStatus.PENDING_CERT]: { color: 'gold', text: '待审核' },
  [TaskStatus.PENDING_REVIEW]: { color: 'gold', text: '待审核' },
  [TaskStatus.RUNNING]: { status: 'processing', text: '运行中' },
};

const statusSelectOptions = [
  { value: 'all', label: '全部状态' },
  { value: 'succeeded', label: '成功' },
  { value: 'failed', label: '失败' },
  { value: 'stopped', label: '已暂停' },
  { value: 'pending', label: '待审核' },
  { value: 'running', label: '运行中' },
  { value: 'cancel', label: '已取消' },
  { value: 'rejected', label: '已拒绝' },
];
const statusSelectOptionMap = {
  all: [] as TaskStatus[],
  succeeded: [TaskStatus.SUCCEEDED],
  failed: [TaskStatus.FAILED, TaskStatus.TIMEOUT],
  rejected: [TaskStatus.REJECTED],
  canceled: [TaskStatus.CANCELED],
  pending: [TaskStatus.PENDING_CERT, TaskStatus.PENDING_REVIEW],
  running: [TaskStatus.RUNNING],
  stopped: [TaskStatus.PAUSED],
};

export const TaskListComponent = () => {
  const viewInstance = useModel(TaskListView);
  const guideService = useModel(GuideTourService);

  const { pathname } = useLocation();
  useEffect(() => {
    viewInstance.pageNum = 1;
    viewInstance.statusFilter = [];
    viewInstance.search = undefined;
    viewInstance.sortType = 'DESC';
  }, [pathname]);

  const ref = useRef(null);
  const steps: TourProps['steps'] = [
    {
      title: <span className={styles.stepTitle}>🎉发起任务成功</span>,
      description: <span className={styles.stepDesc}>这里可以查看任务的进度哦～</span>,
      target: () => ref.current,
      nextButtonProps: { children: '知道了' },
    },
  ];

  const columns = [
    {
      title: '任务ID',
      key: 'jobId',
      render: (_, record: Task) => {
        return (
          <>
            <Tooltip title={record.name}>
              <Typography.Link
                ellipsis={true}
                className={styles.taskName}
                onClick={() => {
                  history.push({
                    pathname: '/task-details',
                    search: `taskId=${record.jobId}`,
                  });
                }}
              >
                {record.name}
              </Typography.Link>
            </Tooltip>
            <div className={styles.taskId}>ID: {record.jobId}</div>
          </>
        );
      },
    },
    {
      title: '发起节点',
      dataIndex: ['srcNode', 'nodeName'],
      key: 'srcNodeName',
      render: (_, record: Task) => {
        return <EllipsisText width={120}>{record.srcNodeId}</EllipsisText>;
      },
    },
    {
      title: '合作节点',
      key: 'dstNodeName',
      render: (_, record: Task) => {
        return <EllipsisText width={120}> {record.dstNodeId} </EllipsisText>;
      },
    },

    {
      title: (
        <div className={styles.status}>
          <>状态</>
          <Button
            type="link"
            icon={<ReloadOutlined />}
            onClick={() => {
              clearTimeout(viewInstance.timer);
              viewInstance.getTaskList();
            }}
          >
            刷新
          </Button>
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      render: (_, record: Task, index: number) => {
        const badge = taskStatusBadge[record.status];
        if (record.status === TaskStatus.REJECTED) {
          return (
            <Tooltip title={record.errMsg}>
              <Badge {...badge} />
            </Tooltip>
          );
        }

        if (record.status === TaskStatus.FAILED) {
          return (
            <Tooltip title={record.errMsg || DEFAULT_ERROR_MESSAGE}>
              <Badge {...badge} />
            </Tooltip>
          );
        }
        return record.errMsg ? (
          <Tooltip title={record.errMsg}>
            <Badge {...badge} />
          </Tooltip>
        ) : (
          <>
            <div ref={index === 0 ? ref : undefined}>
              <Badge {...badge} />
            </div>
            <Tour
              open={!guideService.CreateTaskTour}
              onFinish={() => guideService.finish(GuideTourKey.CreateTaskTour)}
              mask={false}
              type="primary"
              steps={steps}
              closeIcon={false}
              rootClassName={styles.tourTask}
              placement="top"
            />
          </>
        );
        // }
      },
    },

    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      ellipsis: true,
      render: (_, { gmtCreate }: { gmtCreate: string }) => {
        return (
          <Tooltip title={formatTimestamp(gmtCreate)}>
            {formatTimestamp(gmtCreate)}
          </Tooltip>
        );
      },
      sorter: true,
    },

    {
      title: '操作',
      key: 'action',
      render: (_, record: Task) => {
        return (
          <TaskListAction
            actions={record.operation as TaskAction[]}
            id={record.jobId as string}
            name={record.name as string}
            recoveryEnabled={record.enabled as boolean}
            agreeData={{
              initiatorDataTableInformation: record?.initiatorDataTableInformation,
              partnerdstDataTableInformation: record?.partnerdstDataTableInformation,
              dataTableConfirmation: record?.dataTableConfirmation,
            }}
          />
        );
      },
    },
  ];

  useEffect(() => {
    const fetchTaskList = async () => {
      await viewInstance.getTaskList();
    };
    fetchTaskList();
  }, [viewInstance.nodeService.currentNode]);

  useEffect(() => {
    return () => {
      if (viewInstance.timer) {
        clearTimeout(viewInstance.timer);
        viewInstance.timer = 0;
      }
    };
  }, []);

  return (
    <div className={styles.taskList}>
      <div className={styles.header}>
        <div className={styles.title}>我的任务</div>
        <Space size={20}>
          <Select
            defaultValue={'all'}
            className={styles.select}
            onChange={(e) =>
              viewInstance.filterByStatus(e as keyof typeof statusSelectOptionMap)
            }
            options={statusSelectOptions}
          />

          <Input
            className={styles.input}
            placeholder="搜索任务名/节点名称"
            suffix={<SearchOutlined />}
            onChange={(e) => viewInstance.searchTask(e)}
          />

          <Button
            type="primary"
            onClick={() => {
              history.push('/task');
            }}
          >
            发起任务
          </Button>
        </Space>
      </div>

      <div className={styles.body}>
        <Table
          dataSource={viewInstance.taskList}
          columns={columns}
          rowKey={'jobId'}
          loading={viewInstance.isTaskListLoading}
          pagination={{
            showSizeChanger: false,
            total: viewInstance.total,
            current: viewInstance.pageNum,
            hideOnSinglePage: true,
          }}
          onChange={(pagination, filters, sorter) =>
            viewInstance.handleTableChange(pagination, filters, sorter)
          }
        />
      </div>
      <TaskLogDrawer />
    </div>
  );
};

export class TaskListView extends Model {
  taskService = getModel(TaskService);
  nodeService = getModel(NodeService);
  modalManager = getModel(DefaultModalManager);

  timer: ReturnType<typeof setTimeout> | 0 = 0;

  taskList: Task[] = [];
  total: number = 0;
  searchDebounce: number | undefined;

  isTaskListLoading = true;

  pageSize = 10;
  pageNum = 1;
  statusFilter: TaskStatus[] = [];
  search: string | undefined;
  sortKey: string | undefined;
  sortType: 'ASC' | 'DESC' | undefined;

  async searchTask(e: ChangeEvent<HTMLInputElement>) {
    this.search = e.target.value;

    this.pageNum = 1;

    clearTimeout(this.searchDebounce);
    clearTimeout(this.timer);
    this.searchDebounce = setTimeout(() => {
      this.getTaskList();
    }, 300) as unknown as number;
  }

  openLogDrawer(taskId: string) {
    this.modalManager.openModal('task-log', taskId);
  }

  async handleTableChange(
    pagination: TablePaginationConfig,
    _,
    sorter: SorterResult<Task>,
  ) {
    const { current, pageSize } = pagination;
    const { order, columnKey } = sorter;
    clearTimeout(this.timer);

    if (pageSize) this.pageSize = pageSize;
    if (current) this.pageNum = current;
    this.sortType = order ? (order === 'ascend' ? 'ASC' : 'DESC') : undefined;
    if (columnKey) this.sortKey = columnKey as string;

    await this.getTaskList();
  }

  async filterByStatus(status: keyof typeof statusSelectOptionMap) {
    this.statusFilter = statusSelectOptionMap[status];

    this.pageNum = 1;
    this.search = undefined;
    clearTimeout(this.timer);

    await this.getTaskList();
  }

  async pollingTaskList() {
    const { list = [], total = 0 } = await this.taskService.listTask({
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      statusFilter: this.statusFilter,
      search: this.search,
      sortKey: this.sortKey,
      sortType: this.sortType,
    });

    this.taskList = list;
    this.total = total;

    const pendingTasks = (this.taskList || []).filter((t) =>
      [TaskStatus.PENDING_REVIEW, TaskStatus.PENDING_CERT, TaskStatus.RUNNING].includes(
        t.status as TaskStatus,
      ),
    );

    if (pendingTasks.length > 0) {
      this.timer = setTimeout(async () => {
        this.pollingTaskList();
      }, 3000);
    } else {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = 0;
      }
    }
  }

  async getTaskList() {
    try {
      this.isTaskListLoading = true;
      const { list = [], total = 0 } = await this.taskService.listTask({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        statusFilter: this.statusFilter,
        search: this.search,
        sortKey: this.sortKey,
        sortType: this.sortType,
      });

      this.taskList = list;
      this.total = total;
      this.isTaskListLoading = false;

      const pendingTasks = (this.taskList || []).filter((t) =>
        [
          TaskStatus.PENDING_REVIEW,
          TaskStatus.PENDING_CERT,
          TaskStatus.RUNNING,
        ].includes(t.status as TaskStatus),
      );

      if (pendingTasks.length > 0) {
        clearTimeout(this.timer);
        this.timer = setTimeout(async () => {
          await this.pollingTaskList();
        }, 3000);
      }
    } catch (e) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = 0;
      }

      this.isTaskListLoading = false;
      message.error((e as Error).message);
    }
  }

  async agree(jobId: string, name: string) {
    try {
      await this.taskService.agreeTask({ jobId });
      message.success(`「${name}」开始执行！`);
      const { list = [], total = 0 } = await this.taskService.listTask({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        statusFilter: this.statusFilter,
        search: this.search,
        sortKey: this.sortKey,
        sortType: this.sortType,
      });

      this.taskList = list;
      this.total = total;
    } catch (e) {
      if ((e as Error).message === 'PROJECT_DATA_NOT_EXISTS_ERROR') {
        notification.warning({
          message: <div className={styles.warningMsg}>请确认数据表路径地址</div>,
          description: `请将文件放到${this.nodeService.nodePath} 路径下`,
        });
      } else if ((e as Error).message === 'PROJECT_DATA_HEADER_NOT_EXISTS_ERROR') {
        notification.warning({
          message: <div className={styles.warningMsg}>请确认关联键</div>,
          description: `关联键不存在`,
        });
      } else {
        message.error((e as Error).message);
      }
    }
  }

  async pause(jobId: string, name: string) {
    try {
      await this.taskService.pauseTask({ jobId });
      message.success(`「${name}」已暂停运行`);
      const { list = [], total = 0 } = await this.taskService.listTask({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        statusFilter: this.statusFilter,
        search: this.search,
        sortKey: this.sortKey,
        sortType: this.sortType,
      });

      this.taskList = list;
      this.total = total;
    } catch (e) {
      message.error((e as Error).message);
    }
  }

  async delete(jobId: string, name: string) {
    try {
      await this.taskService.deleteTask({ jobId });
      message.success(`「${name}」已删除`);
      const { list = [], total = 0 } = await this.taskService.listTask({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        statusFilter: this.statusFilter,
        search: this.search,
        sortKey: this.sortKey,
        sortType: this.sortType,
      });

      this.taskList = list;
      this.total = total;
    } catch (e) {
      message.error((e as Error).message);
    }
  }

  async continue(jobId: string, name: string, recoveryEnabled: boolean) {
    try {
      await this.taskService.continueTask({ jobId });
      message.success(`「${name}」${recoveryEnabled ? '继续' : '重新'}运行！`);
      const { list = [], total = 0 } = await this.taskService.listTask({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        statusFilter: this.statusFilter,
        search: this.search,
        sortKey: this.sortKey,
        sortType: this.sortType,
      });

      this.taskList = list;
      this.total = total;
    } catch (e) {
      message.error((e as Error).message);
    }
  }

  async reject(jobId: string, name: string, rejectMsg?: string) {
    try {
      await this.taskService.rejectTask({ jobId, rejectMsg });
      message.success(`已拒绝「${name}」`);
      const { list = [], total = 0 } = await this.taskService.listTask({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        statusFilter: this.statusFilter,
        search: this.search,
        sortKey: this.sortKey,
        sortType: this.sortType,
      });

      this.taskList = list;
      this.total = total;
    } catch (e) {
      message.error((e as Error).message);
    }
  }

  async cancel(jobId: string, name: string) {
    try {
      await this.taskService.cancelTask({ jobId });
      message.success(`「${name}」已取消`);
      const { list = [], total = 0 } = await this.taskService.listTask({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        statusFilter: this.statusFilter,
        search: this.search,
        sortKey: this.sortKey,
        sortType: this.sortType,
      });

      this.taskList = list;
      this.total = total;
    } catch (e) {
      message.error((e as Error).message);
    }
  }

  async download(jobId: string) {
    try {
      await this.taskService.downloadResult(jobId);
    } catch (e) {
      message.error((e as Error).message);
    }
  }
}
