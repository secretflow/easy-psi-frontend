import {
  ArrowLeftOutlined,
  DownOutlined,
  HddFilled,
  ReloadOutlined,
  UpOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Typography,
  message,
  Space,
  Tag,
  notification,
  Image as AntdImage,
} from 'antd';
import styles from './index.less';
import { useState, useEffect, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import queryString from 'query-string';
import { useLocation, history } from 'umi';

import taskSuccessLink from '@/assets/ezpsi-success.png';
import { formatTimestamp, getTimeCost } from '@/util/timestamp-formatter';
import {
  TaskLogDrawer,
  TaskService,
  TaskStatus,
  TaskAction,
  TaskDetail,
} from '@/modules/task';
import { useModel, Model, getModel } from '@/util/valtio-helper';
import { DefaultModalManager } from '@/modules/modal-manager';
import { NodeService } from '../node';
import { TaskActionButtons } from './operations';
import { getImgLink } from '@/util/platform';
import { DEFAULT_ERROR_MESSAGE } from '../task/task.service';

const { Title, Link } = Typography;

export const TaskDetailsLayout = () => {
  const [configStatus, setConfigStatus] = useState(true);
  const modalManager = useModel(DefaultModalManager);
  const viewInstance = useModel(TaskDetailView);
  const { taskDetail } = viewInstance;

  const { search } = useLocation();
  const { taskId } = queryString.parse(search);
  const { status, operation = [] } = taskDetail;

  useEffect(() => {
    if (taskId && viewInstance.nodeService.currentNode?.nodeId)
      viewInstance.getTaskDetail({
        jobId: taskId as string,
        nodeId: viewInstance.nodeService.currentNode.nodeId,
      });
  }, [taskId, viewInstance.nodeService.currentNode]);

  const pending =
    status === TaskStatus.PENDING_CERT || status === TaskStatus.PENDING_REVIEW;

  const error = status === TaskStatus.TIMEOUT || status === TaskStatus.FAILED;
  const canceled = status === TaskStatus.CANCELED;

  const rejected = status === TaskStatus.REJECTED;

  const running = status === TaskStatus.RUNNING;

  const stopped = status === TaskStatus.PAUSED;

  const success = status === TaskStatus.SUCCEEDED;

  const clickConfigIcon = (flag: boolean) => {
    setConfigStatus(flag);
  };

  const getTimeItems = useCallback(() => {
    return taskDetail.startTime
      ? [
          {
            key: 'gtmCreate',
            label: '创建时间',
            children: formatTimestamp(taskDetail.gmtCreate),
          },
          {
            key: 'gtmRunning',
            label: '运行时间',
            children: (
              <Space size={12}>
                {taskDetail.gmtFinished
                  ? `${formatTimestamp(taskDetail.startTime)} 至 ${formatTimestamp(
                      taskDetail.gmtFinished,
                    )}`
                  : `${formatTimestamp(taskDetail.startTime)}`}
                {taskDetail.gmtFinished && (
                  <Tag>{getTimeCost(taskDetail.startTime, taskDetail.gmtFinished)}</Tag>
                )}
              </Space>
            ),
          },
        ]
      : [
          {
            key: 'gtmCreate',
            label: '创建时间',
            children: formatTimestamp(taskDetail.gmtCreate),
          },
        ];
  }, [taskDetail]);

  const getNodeItems = useCallback(() => {
    return [
      {
        key: 'initiator',
        label: (
          <div className={styles.join}>
            <HddFilled className={styles.initiatorHdd} />
            <span className={styles.joinName}>发起方</span>
          </div>
        ),
        children: taskDetail.initiatorConfig?.nodeId,
      },
      {
        key: 'intiator-input',
        label: '数据表',
        children: taskDetail.initiatorConfig?.inputConfig?.path,
      },
      {
        key: 'intiator-keys',
        label: '关联键',
        children: taskDetail.initiatorConfig?.keys?.join(','),
      },
      {
        key: 'partner',
        label: (
          <div className={styles.join}>
            <HddFilled className={styles.partnerHdd} />
            <span className={styles.joinName}>合作方</span>
          </div>
        ),
        children: taskDetail.partnerConfig?.nodeId,
      },
      {
        key: 'partner-input',
        label: '数据表',
        children: taskDetail.partnerConfig?.inputConfig?.path,
      },
      {
        key: 'partner-keys',
        label: '关联键',
        children: taskDetail.partnerConfig?.keys?.join(','),
      },
    ];
  }, [taskDetail.initiatorConfig, taskDetail.partnerConfig]);

  const getResultItems = useCallback(() => {
    const receivers = [
      taskDetail.initiatorConfig?.protocolConfig?.role === 'ROLE_RECEIVER'
        ? taskDetail.initiatorConfig?.nodeId
        : undefined,
      taskDetail.partnerConfig?.protocolConfig?.role === 'ROLE_RECEIVER'
        ? taskDetail.partnerConfig?.nodeId
        : undefined,
    ];
    if (taskDetail.initiatorConfig?.protocolConfig.broadcastResult) {
      receivers[0] = taskDetail.initiatorConfig?.nodeId;
      receivers[1] = taskDetail.partnerConfig?.nodeId;
    }

    return [
      {
        key: 'output-path',
        label: '结果名称',
        children:
          taskDetail.initiatorConfig?.outputConfig?.path ||
          taskDetail.partnerConfig?.outputConfig?.path,
      },
      {
        key: 'output-receive',
        label: '结果获取方',
        children: (
          <Space>
            {receivers[0] && (
              <div>
                <HddFilled className={styles.initiatorHdd} />
                <span>{receivers[0]}</span>
              </div>
            )}
            {receivers[1] && (
              <div>
                <HddFilled className={styles.partnerHdd} />
                <span>{receivers[1]}</span>
              </div>
            )}
          </Space>
        ),
      },
    ];
  }, [taskDetail.initiatorConfig, taskDetail.partnerConfig]);

  const getAdvancedConfigItems = useCallback(() => {
    const joinType = {
      ADVANCED_JOIN_TYPE_UNSPECIFIED: 'join（关联键不允许重复）',
      ADVANCED_JOIN_TYPE_INNER_JOIN: 'inner_join（允许关联键重复）',
      ADVANCED_JOIN_TYPE_LEFT_JOIN: 'left join（允许关联键重复）',
      ADVANCED_JOIN_TYPE_RIGHT_JOIN: 'right join（允许关联键重复）',
      ADVANCED_JOIN_TYPE_FULL_JOIN: 'full join（允许关联键重复）',
      ADVANCED_JOIN_TYPE_DIFFERENCE: 'difference（允许关联键重复）',
    };

    enum protocolEnum {
      PROTOCOL_ECDH = 'PROTOCOL_ECDH',
      PROTOCOL_KKRT = 'PROTOCOL_KKRT',
      PROTOCOL_RR22 = 'PROTOCOL_RR22',
    }

    const protocol = {
      [protocolEnum.PROTOCOL_ECDH]: 'ECDH',
      [protocolEnum.PROTOCOL_KKRT]: 'KKRT',
      [protocolEnum.PROTOCOL_RR22]: 'RR22',
    };
    const protocolConfig = taskDetail.initiatorConfig?.protocolConfig;

    const bucket_size = () => {
      if (protocolConfig?.protocol === protocolEnum.PROTOCOL_KKRT) {
        return protocolConfig?.kkrtConfig?.bucketSize;
      } else if (protocolConfig?.protocol === protocolEnum.PROTOCOL_RR22) {
        return protocolConfig?.rr22Config?.bucketSize;
      } else {
        return '1048576';
      }
    };

    const curveType = [
      {
        key: 'curve',
        label: 'ECDH曲线类型',
        children: protocolConfig?.ecdhConfig?.curve || 'CURVE_25519',
      },
    ];
    const bucketSize = [
      {
        key: 'bucketSize',
        label: '分桶大小',
        children: bucket_size(),
      },
    ];
    const lowCommMode = [
      {
        key: 'lowCommMode',
        label: '低通信模式',
        children: protocolConfig?.rr22Config?.lowCommMode ? '开' : '关',
      },
    ];
    const placeholder = [
      {
        key: '',
        label: '',
        children: '',
      },
    ];

    const protocolConfiguration = useMemo(() => {
      if (protocolConfig?.protocol === protocolEnum.PROTOCOL_ECDH) {
        return [...curveType, ...placeholder];
      } else if (protocolConfig?.protocol === protocolEnum.PROTOCOL_KKRT) {
        return [...bucketSize, ...placeholder];
      } else if (protocolConfig?.protocol === protocolEnum.PROTOCOL_RR22) {
        return [...bucketSize, ...lowCommMode];
      } else return [];
    }, [protocolConfig?.protocol]);

    // 数据量级检查字段
    const dataTableConfirmation = taskDetail.initiatorConfig?.dataTableConfirmation;

    // 没有dataTableConfirmation字段则不展示
    const dataConfirmItem =
      dataTableConfirmation === null
        ? []
        : [
            {
              key: 'dataTableConfirmation',
              label: '数据量级检查',
              children: dataTableConfirmation ? '开' : '关',
            },
          ];

    // 左方
    const leftSide = taskDetail.initiatorConfig?.leftSide;

    const showLeftSide = useMemo(() => {
      if (
        taskDetail.initiatorConfig?.advancedJoinType ===
          'ADVANCED_JOIN_TYPE_LEFT_JOIN' ||
        taskDetail.initiatorConfig?.advancedJoinType === 'ADVANCED_JOIN_TYPE_RIGHT_JOIN'
      ) {
        return [
          {
            key: 'leftSide',
            label: '左方',
            children: leftSide,
          },
        ];
      } else return [];
    }, [taskDetail.initiatorConfig?.advancedJoinType, leftSide]);

    return [
      {
        key: 'protocol',
        label: '隐私求交协议',
        children: protocol[protocolConfig?.protocol as protocolEnum] || 'ECDH',
      },
      ...protocolConfiguration,
      {
        key: 'advancedJoinType',
        label: '求交方式',
        children:
          joinType[
            (taskDetail.initiatorConfig?.advancedJoinType as keyof typeof joinType) ||
              'ADVANCED_JOIN_TYPE_UNSPECIFIED'
          ],
      },
      ...showLeftSide,
      {
        key: 'recoveryEnabled',
        label: '是否断点续传',
        children: taskDetail.initiatorConfig?.recoveryConfig?.enabled ? '开' : '关',
      },
      {
        key: 'skipDuplicatesCheck',
        label: '重复值检查',
        children: taskDetail.initiatorConfig?.skipDuplicatesCheck ? '是' : '否',
      },
      {
        key: 'disableAlignment',
        label: '是否结果重排序',
        children: taskDetail.initiatorConfig?.disableAlignment ? '是' : '否',
      },
      {
        key: 'linkConfig',
        label: '节点通信超时',
        children: `${taskDetail.initiatorConfig?.linkConfig?.recvTimeoutMs || '30'}s`,
      },
      ...dataConfirmItem,
    ];
  }, [taskDetail.initiatorConfig, taskId]);

  return (
    <div className={styles.taskDetailsContent}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <ArrowLeftOutlined onClick={() => history.push('/home')} />
          <Title level={4}>任务名称：{taskDetail.name}</Title>
          <span className={styles.idText}>ID：{taskId}</span>
          <Button
            icon={<ReloadOutlined />}
            type="link"
            onClick={() => {
              if (taskId && viewInstance.nodeService.currentNode?.nodeId)
                viewInstance.getTaskDetail({
                  jobId: taskId as string,
                  nodeId: viewInstance.nodeService.currentNode.nodeId,
                });
            }}
          >
            刷新
          </Button>
        </div>
        {taskDetail.jobId && taskDetail.name && (
          <div className={styles.headerRight}>
            {/* todo */}
            <TaskActionButtons
              actions={operation as TaskAction[]}
              id={taskDetail.jobId}
              name={taskDetail.name}
              recoveryEnabled={taskDetail.initiatorConfig?.recoveryConfig?.enabled}
              agreeData={{
                dataTableConfirmation:
                  taskDetail?.initiatorConfig?.dataTableConfirmation,
                initiatorDataTableInformation: {
                  nodeId: taskDetail?.initiatorConfig?.nodeId,
                  dataTableName: taskDetail?.initiatorConfig?.inputConfig?.path,
                  dataTableCount: taskDetail?.initiatorConfig?.datatableCount,
                },
                partnerdstDataTableInformation: {
                  nodeId: taskDetail?.partnerConfig?.nodeId,
                  dataTableName: taskDetail?.partnerConfig?.inputConfig?.path,
                  dataTableCount: taskDetail?.partnerConfig?.datatableCount,
                },
              }}
            />
          </div>
        )}
      </div>
      <Card className={styles.oneCard}>
        {pending && (
          <Alert
            rootClassName={styles.pendingAlert}
            message={`任务待${
              taskDetail.partnerConfig?.nodeId ===
              viewInstance.nodeService.currentNode?.nodeId
                ? '我方'
                : taskDetail.partnerConfig?.nodeId
            }审核。${
              taskDetail.partnerConfig?.nodeId ===
              viewInstance.nodeService.currentNode?.nodeId
                ? '请确认我方(合作方)的信息是否准确，确保数据表已在对应目录下'
                : '记得联系合作方进行任务审批，并提醒对方核实数据表信息。'
            }`}
            type="warning"
            showIcon
          />
        )}
        {running && (
          <Alert
            message={
              <Space size={24}>
                <span>任务运行中</span>

                {operation.includes(TaskAction.LOG) && (
                  <Link onClick={() => modalManager.openModal('task-log', taskId)}>
                    查看日志
                  </Link>
                )}
              </Space>
            }
            rootClassName={styles.runningAlert}
            type="info"
            showIcon
          />
        )}
        {stopped && (
          <Alert
            message={
              <Space size={24}>
                <span>任务已暂停</span>
                {operation.includes(TaskAction.LOG) && (
                  <Link onClick={() => modalManager.openModal('task-log', taskId)}>
                    查看日志
                  </Link>
                )}
              </Space>
            }
            type="info"
            showIcon
            rootClassName={styles.stoppedAlert}
          />
        )}
        {error && (
          <Alert
            rootClassName={styles.failedAlert}
            type="error"
            showIcon
            message={
              <>
                <span className={styles.errMsg}>
                  {taskDetail.errMsg
                    ? `任务运行失败，${taskDetail.errMsg}`
                    : DEFAULT_ERROR_MESSAGE}
                </span>
                {operation.includes(TaskAction.LOG) && (
                  <Link onClick={() => modalManager.openModal('task-log', taskId)}>
                    查看日志
                  </Link>
                )}
              </>
            }
          />
        )}
        {canceled && (
          <Alert
            rootClassName={styles.failedAlert}
            type="error"
            showIcon
            message={
              <>
                <span className={styles.errMsg}>{`任务已取消`}</span>
                {operation.includes(TaskAction.LOG) && (
                  <Link onClick={() => modalManager.openModal('task-log', taskId)}>
                    查看日志
                  </Link>
                )}
              </>
            }
          />
        )}

        {rejected && (
          <Alert
            rootClassName={styles.failedAlert}
            type="error"
            showIcon
            message={
              `任务被${taskDetail.partnerConfig?.nodeId}拒绝` +
              (taskDetail.rejectMsg ? `, 拒绝理由：${taskDetail.rejectMsg}` : ``)
            }
          />
        )}
        {success && (
          <Alert
            rootClassName={styles.successAlert}
            type="success"
            showIcon
            icon={viewInstance.logSucceeded()}
            message={
              <>
                <span className={styles.successMsg}>任务运行成功</span>
                {operation.includes(TaskAction.LOG) && (
                  <Link onClick={() => modalManager.openModal('task-log', taskId)}>
                    查看日志
                  </Link>
                )}
              </>
            }
          />
        )}
        {taskDetail.initiatorConfig?.recoveryConfig?.enabled && pending && (
          <Alert
            showIcon
            message="开启断点续传存在潜在安全风险，并影响性能"
            type="warning"
            rootClassName={styles.recoveryEnabledAlert}
          />
        )}
        <Descriptions items={getTimeItems()} className={styles.time} />
        <Descriptions
          items={[
            {
              key: 'descrption',
              label: '备注',
              children: taskDetail.description || '',
            },
          ]}
          className={styles.remark}
        />
      </Card>
      <Card className={styles.twoCard}>
        <Descriptions
          title="节点数据配置"
          items={getNodeItems()}
          className={styles.nodeConfig}
        />
        <Descriptions
          title="结果配置"
          items={getResultItems()}
          className={styles.resultConfig}
        />
        <Descriptions
          title={
            <div className={styles.advancedDescriptions}>
              <Title level={5} className={styles.title}>
                高级配置
              </Title>
              {configStatus ? (
                <div
                  className={styles.configIcon}
                  onClick={() => clickConfigIcon(false)}
                >
                  <span>收起</span>
                  <UpOutlined />
                </div>
              ) : (
                <div
                  className={styles.configIcon}
                  onClick={() => clickConfigIcon(true)}
                >
                  <span>展开</span>
                  <DownOutlined />
                </div>
              )}
            </div>
          }
          className={classNames(configStatus ? styles.advancedConfig : styles.close)}
          items={getAdvancedConfigItems()}
          column={3}
        />
      </Card>
      <TaskLogDrawer />
    </div>
  );
};

export class TaskDetailView extends Model {
  taskDetail: TaskDetail = {};

  actionExecuting: boolean = false;
  executingAction: TaskAction | undefined;

  taskService = getModel(TaskService);
  nodeService = getModel(NodeService);

  timer = 0;

  onViewUnMount(): void {
    clearTimeout(this.timer);
    this.timer = 0;
  }

  logSucceeded() {
    const imgLink = getImgLink({
      onlineLink:
        'https://secretflow-public.oss-cn-hangzhou.aliyuncs.com/ezpsi-success.png',
      localLink: taskSuccessLink,
      offlineLink: taskSuccessLink,
      localStorageKey: 'task_success',
    });

    return (
      <span className={styles.logSuccess}>
        <AntdImage
          width={14}
          preview={false}
          src={imgLink}
          fallback={taskSuccessLink}
        />
      </span>
    );
  }

  async getTaskDetail(option: { jobId: string; nodeId: string }) {
    try {
      clearTimeout(this.timer);
      this.taskDetail = await this.taskService.getTaskDetail(option);

      if (
        [
          TaskStatus.PENDING_REVIEW,
          TaskStatus.PENDING_CERT,
          TaskStatus.RUNNING,
        ].includes(this.taskDetail.status as TaskStatus)
      ) {
        this.timer = setTimeout(async () => {
          await this.getTaskDetail(option);
        }, 3000);
      } else {
        clearTimeout(this.timer);
        this.timer = 0;
      }
    } catch (e) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = 0;
      }
      message.error((e as Error).message);
    }
  }

  async cancel(jobId: string, name: string) {
    try {
      this.actionExecuting = true;
      this.executingAction = TaskAction.CANCEL;
      await this.taskService.cancelTask({ jobId });
      message.success(`「${name}」已取消`);
      this.taskDetail = await this.taskService.getTaskDetail({
        jobId,
        nodeId: this.nodeService.currentNode?.nodeId as string,
      });
    } catch (e) {
      message.error((e as Error).message);
    }
    this.executingAction = undefined;
    this.actionExecuting = false;
  }

  async agree(jobId: string, name: string) {
    try {
      this.actionExecuting = true;
      this.executingAction = TaskAction.AGREE;
      await this.taskService.agreeTask({ jobId });
      message.success(`「${name}」开始执行！`);
      this.taskDetail = await this.taskService.getTaskDetail({
        jobId,
        nodeId: this.nodeService.currentNode?.nodeId as string,
      });
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
    this.executingAction = undefined;
    this.actionExecuting = false;
  }

  async pause(jobId: string, name: string) {
    try {
      this.actionExecuting = true;
      this.executingAction = TaskAction.PAUSE;
      await this.taskService.pauseTask({ jobId });
      message.success(`「${name}」已暂停运行`);
      this.taskDetail = await this.taskService.getTaskDetail({
        jobId,
        nodeId: this.nodeService.currentNode?.nodeId as string,
      });
    } catch (e) {
      message.error((e as Error).message);
    }
    this.executingAction = undefined;
    this.actionExecuting = false;
  }

  async continue(jobId: string, name: string, recoveryEnabled: boolean) {
    try {
      this.actionExecuting = true;
      this.executingAction = TaskAction.CONTINUE;
      await this.taskService.continueTask({ jobId });
      message.success(`「${name}」${recoveryEnabled ? '继续' : '重新'}运行！`);
      this.taskDetail = await this.taskService.getTaskDetail({
        jobId,
        nodeId: this.nodeService.currentNode?.nodeId as string,
      });
    } catch (e) {
      message.error((e as Error).message);
    }
    this.executingAction = undefined;
    this.actionExecuting = false;
  }

  async delete(jobId: string, name: string) {
    try {
      this.actionExecuting = true;
      this.executingAction = TaskAction.DELETE;
      await this.taskService.deleteTask({ jobId });
      message.success(`「${name}」已删除`);
      // this.taskDetail = await this.taskService.getTaskDetail({
      //   jobId,
      //   nodeId: this.nodeService.currentNode?.nodeId as string,
      // });
      history.push('/home');
    } catch (e) {
      message.error((e as Error).message);
    }
    this.executingAction = undefined;
    this.actionExecuting = false;
  }

  async reject(jobId: string, name: string, rejectMsg?: string) {
    try {
      this.actionExecuting = true;
      this.executingAction = TaskAction.REJECT;
      await this.taskService.rejectTask({ jobId, rejectMsg });
      message.success(`已拒绝「${name}」`);
      this.taskDetail = await this.taskService.getTaskDetail({
        jobId,
        nodeId: this.nodeService.currentNode?.nodeId as string,
      });
    } catch (e) {
      message.error((e as Error).message);
    }
    this.executingAction = undefined;
    this.actionExecuting = false;
  }
  async download(jobId: string) {
    try {
      await this.taskService.downloadResult(jobId);
    } catch (e) {
      message.error((e as Error).message);
    }
  }
}
