/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Task, TaskDataTableInformation } from './types';
import { TaskAction, TaskDataTableInformationText, TaskStatus } from './types';
import { Button, Space, Popconfirm, Input } from 'antd';
import { DefaultModalManager } from '@/modules/modal-manager';
import { getModel, useModel, Model } from '@/util/valtio-helper';
import { ReactNode, useState } from 'react';
import { TaskService } from '.';
import { TaskListView } from './task-list.view';
import styles from './index.less';

// the actions will be return by backend, this is just a mock
const actionMap: Record<TaskStatus, TaskAction[]> = {
  [TaskStatus.SUCCEEDED]: [
    TaskAction.DOWNLOAD_RESULT,
    TaskAction.LOG,
    TaskAction.DELETE,
  ],
  [TaskStatus.REJECTED]: [TaskAction.DELETE],
  [TaskStatus.PAUSED]: [TaskAction.LOG, TaskAction.CONTINUE, TaskAction.CANCEL],
  [TaskStatus.RUNNING]: [TaskAction.LOG, TaskAction.PAUSE, TaskAction.CANCEL],
  [TaskStatus.FAILED]: [TaskAction.LOG, TaskAction.DELETE],
  [TaskStatus.CANCELED]: [TaskAction.LOG, TaskAction.DELETE],
  [TaskStatus.PENDING_REVIEW]: [TaskAction.AGREE, TaskAction.REJECT],
  [TaskStatus.TIMEOUT]: [TaskAction.LOG, TaskAction.CONTINUE, TaskAction.DELETE],
  [TaskStatus.PENDING_CERT]: [TaskAction.UPLOAD_CERT, TaskAction.REJECT],
};

export const TaskListAction = (props: {
  actions: string[];
  id: string;
  name: string;
  recoveryEnabled: boolean;
  agreeData: Record<string, any>;
}) => {
  const { actions, id, name, recoveryEnabled, agreeData } = props;
  const viewInstance = useModel(TaskListView);
  const [actionExecuting, setActionExecuting] = useState<boolean>(false);

  const [rejectMsg, setRejectMsg] = useState<string | undefined>();

  // 是否显示数据量确认气泡
  const showDataConfirm = () => {
    // 如果没有数据量确认信息，则显示气泡
    if (typeof agreeData?.dataTableConfirmation !== 'boolean') {
      return true;
    }
    return agreeData?.dataTableConfirmation;
  };

  const actionList: Record<
    TaskAction,
    {
      text: string;
      callback: (id: string, name: string) => void;
      props?: object;
      render?: ReactNode;
    }
  > = {
    [TaskAction.CANCEL]: {
      text: '取消',
      callback: async (id, name) => {
        setActionExecuting(true);
        await viewInstance.cancel(id, name);
        setActionExecuting(false);
      },
      render: (
        <Popconfirm
          title="确定要取消任务吗？"
          okButtonProps={{ danger: true, type: 'default' }}
          onConfirm={async () => {
            setActionExecuting(true);
            await viewInstance.cancel(id, name);
            setActionExecuting(false);
          }}
          okText="取消任务"
          placement="leftTop"
          key={`${id}-cancel`}
        >
          <Button type="link" className={styles.btn}>
            取消
          </Button>
        </Popconfirm>
      ),
    },

    [TaskAction.AGREE]: {
      text: '同意',
      callback: () => {},
      render: showDataConfirm() ? (
        <Popconfirm
          destroyTooltipOnHide
          title={
            <>
              <div>
                {agreeData?.initiatorDataTableInformation?.nodeId}：
                {agreeData?.initiatorDataTableInformation?.dataTableName}，
                <span className={styles.dataTableCount}>
                  {
                    TaskDataTableInformationText[
                      agreeData?.initiatorDataTableInformation
                        ?.dataTableCount as TaskDataTableInformation
                    ]
                  }
                </span>
                行
              </div>
              <div>
                {agreeData?.partnerdstDataTableInformation?.nodeId}：
                {agreeData?.partnerdstDataTableInformation?.dataTableName}，
                <span className={styles.dataTableCount}>
                  {
                    TaskDataTableInformationText[
                      agreeData?.partnerdstDataTableInformation
                        ?.dataTableCount as TaskDataTableInformation
                    ]
                  }
                </span>
                行
              </div>
              <div>请确认是否同意</div>
            </>
          }
          onConfirm={async () => {
            await viewInstance.agree(id, name);
          }}
          okText="同意"
          okButtonProps={{
            style: {
              background: '#1677ff',
              color: '#fff',
            },
          }}
        >
          <Button type="link" className={styles.btn}>
            同意
          </Button>
        </Popconfirm>
      ) : (
        <Button
          type="link"
          className={styles.btn}
          onClick={async () => {
            await viewInstance.agree(id, name);
          }}
        >
          同意
        </Button>
      ),
    },
    [TaskAction.REJECT]: {
      text: '拒绝',
      callback: () => {},
      render: (
        <Popconfirm
          title={<span className={styles.rejectTitle}>你确定要拒绝吗？</span>}
          okButtonProps={{ danger: true, type: 'default' }}
          onConfirm={async () => {
            setActionExecuting(true);
            await viewInstance.reject(id, name, rejectMsg);
            setActionExecuting(false);
          }}
          onOpenChange={(open) => {
            if (!open) {
              setRejectMsg(undefined);
            }
          }}
          okText="拒绝"
          placement="leftTop"
          description={
            <Input.TextArea
              className={styles.rejectTextArea}
              rows={3}
              placeholder="请输入拒绝理由，可选，50字符以内"
              maxLength={50}
              value={rejectMsg}
              onChange={(e) => setRejectMsg(e.target.value)}
            />
          }
          key={`${id}-decline`}
        >
          <Button type="link" danger className={styles.btn}>
            拒绝
          </Button>
        </Popconfirm>
      ),
    },
    [TaskAction.CONTINUE]: {
      text: recoveryEnabled ? '继续' : '重试',
      callback: async (id, name) => {
        await viewInstance.continue(id, name, recoveryEnabled);
      },
    },
    [TaskAction.PAUSE]: {
      text: '暂停',
      callback: async (id, name) => {
        await viewInstance.pause(id, name);
      },
    },
    [TaskAction.DELETE]: {
      text: '删除',
      callback: async (id, name) => {
        await viewInstance.delete(id, name);
      },
      render: (
        <Popconfirm
          title="确定要删除任务吗？"
          okButtonProps={{ danger: true, type: 'default' }}
          onConfirm={async () => {
            setActionExecuting(true);
            await viewInstance.delete(id, name);
            setActionExecuting(false);
          }}
          okText="删除"
          placement="leftTop"
          key={`${id}-delete`}
        >
          <Button type="link" className={styles.btn} disabled={actionExecuting}>
            删除
          </Button>
        </Popconfirm>
      ),
    },
    [TaskAction.LOG]: {
      text: '日志',
      callback: (id) => {
        viewInstance.openLogDrawer(id);
      },
    },
    [TaskAction.DOWNLOAD_RESULT]: {
      text: '下载结果',
      callback: async (id) => {
        await viewInstance.download(id);
      },
    },
    [TaskAction.UPLOAD_CERT]: {
      text: '上传公钥',
      callback: () => {},
    },
  };

  // const actions = actionMap[status] || [];
  const actionInfos = actions.map((action) => actionList[action]);

  return (
    <Space className={styles.taskAction}>
      {actionInfos.map((i, index) => {
        const render = i.render || (
          <Button
            type="link"
            onClick={async () => {
              const { callback } = i;
              setActionExecuting(true);
              await callback(id, name);
              setActionExecuting(false);
            }}
            disabled={actionExecuting}
            key={`${id}-${index}`}
            className={styles.btn}
            {...(i.props || {})}
          >
            {i.text}
          </Button>
        );
        return render;
      })}
    </Space>
  );
};
