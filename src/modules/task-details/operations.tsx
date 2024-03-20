import { useModel } from '@/util/valtio-helper';
import {
  TaskAction,
  TaskDataTableInformation,
  TaskDataTableInformationText,
} from '../task';
import { Button, Input, Popconfirm, Space, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { TaskDetailView } from '.';
import { useState } from 'react';
import React from 'react';
import styles from './index.less';

export const TaskActionButtons = (props: {
  actions: TaskAction[];
  id: string;
  name: string;
  recoveryEnabled: boolean;
  agreeData: Record<string, any>;
}) => {
  const { actions, id, name, recoveryEnabled, agreeData } = props;
  const viewInstance = useModel(TaskDetailView);

  // 是否显示数据量确认气泡
  const showDataConfirm = () => {
    // 如果没有数据量确认信息，则显示气泡
    if (typeof agreeData.dataTableConfirmation !== 'boolean') {
      return true;
    }
    return agreeData.dataTableConfirmation;
  };

  const actionList: Record<
    Exclude<TaskAction, TaskAction.LOG | TaskAction.UPLOAD_CERT>,
    {
      text: string;
      callback: (id: string, name: string, comment?: string) => Promise<void>;
      Render: (props: {
        text: string;
        callback: (id: string, name: string, comment?: string) => void;
      }) => JSX.Element;
    }
  > = React.useMemo(
    () => ({
      [TaskAction.CANCEL]: {
        text: '取消任务',
        callback: async (id, name) => {
          await viewInstance.cancel(id, name);
        },
        Render: (props: {
          text: string;
          callback: (id: string, name: string) => void;
        }) => (
          <Popconfirm
            title="确定要取消任务吗？"
            okButtonProps={{ danger: true, type: 'default' }}
            onConfirm={() => {
              props.callback(id, name);
            }}
            okText="取消任务"
            placement="leftTop"
            key={`${id}-cancel`}
          >
            <Button
              loading={
                viewInstance.actionExecuting &&
                viewInstance.executingAction === TaskAction.CANCEL
              }
              disabled={
                viewInstance.actionExecuting &&
                viewInstance.executingAction !== TaskAction.CANCEL
              }
            >
              {props.text}
            </Button>
          </Popconfirm>
        ),
      },

      [TaskAction.AGREE]: {
        text: '同意任务',
        callback: async (id, name) => {
          await viewInstance.agree(id, name);
        },
        Render: (props: {
          text: string;
          callback: (id: string, name: string) => void;
        }) => {
          const [openPopconfirm, setOpenPopconfirm] = useState(false);
          return showDataConfirm() ? (
            <Popconfirm
              onOpenChange={(e) => {
                setOpenPopconfirm(e);
              }}
              open={openPopconfirm}
              destroyTooltipOnHide
              placement="leftBottom"
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
                  <div className={styles.customButton}>
                    <Space>
                      <Button
                        size="small"
                        onClick={() => {
                          setOpenPopconfirm(false);
                        }}
                      >
                        取消
                      </Button>
                      {viewInstance.actionExecuting &&
                      viewInstance.executingAction === TaskAction.AGREE ? (
                        <Button size="small" type="primary" loading={true}>
                          数据路径校验中
                          <InfoCircleOutlined />
                        </Button>
                      ) : (
                        <Tooltip title={'同意后会发起数据路径校验'} placement="bottom">
                          <Button
                            size="small"
                            type="primary"
                            onClick={() => props.callback(id, name)}
                            disabled={
                              viewInstance.actionExecuting &&
                              viewInstance.executingAction !== TaskAction.AGREE
                            }
                          >
                            {props.text}
                            <InfoCircleOutlined />
                          </Button>
                        </Tooltip>
                      )}
                    </Space>
                  </div>
                </>
              }
              showCancel={false}
              okButtonProps={{
                style: {
                  display: 'none',
                },
              }}
            >
              <Button type="primary">{props.text}</Button>
            </Popconfirm>
          ) : (
            <Button type="primary" onClick={() => props.callback(id, name)}>
              {props.text}
            </Button>
          );
        },
      },
      [TaskAction.REJECT]: {
        text: '拒绝任务',
        callback: async (id, name, comment?: string) => {
          await viewInstance.reject(id, name, comment);
        },
        Render: (props: {
          text: string;
          callback: (id: string, name: string, comment?: string) => void;
        }) => {
          const [comment, setComment] = useState<string | undefined>();
          return (
            <Popconfirm
              title={<span className={styles.rejectTitle}>你确定要拒绝吗？</span>}
              okButtonProps={{ danger: true, type: 'default' }}
              onOpenChange={(open) => {
                if (!open) {
                  setComment(undefined);
                }
              }}
              onConfirm={() => {
                props.callback(id, name, comment);
              }}
              okText="拒绝"
              placement="leftTop"
              description={
                <Input.TextArea
                  className={styles.rejectTextArea}
                  rows={3}
                  placeholder="请输入拒绝理由，可选，50字符以内"
                  maxLength={50}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              }
              key={`${id}-decline`}
            >
              <Button
                danger
                loading={
                  viewInstance.actionExecuting &&
                  viewInstance.executingAction === TaskAction.REJECT
                }
                disabled={
                  viewInstance.actionExecuting &&
                  viewInstance.executingAction !== TaskAction.REJECT
                }
              >
                {props.text}
              </Button>
            </Popconfirm>
          );
        },
      },
      [TaskAction.CONTINUE]: {
        text: recoveryEnabled ? '继续任务' : '重试任务',
        callback: async (id, name) => {
          await viewInstance.continue(id, name, recoveryEnabled);
        },
        Render: (props: {
          text: string;
          callback: (id: string, name: string) => void;
        }) => (
          <Button
            type="primary"
            onClick={() => props.callback(id, name)}
            loading={
              viewInstance.actionExecuting &&
              viewInstance.executingAction === TaskAction.CONTINUE
            }
            disabled={
              viewInstance.actionExecuting &&
              viewInstance.executingAction !== TaskAction.CONTINUE
            }
          >
            {props.text}
          </Button>
        ),
      },
      [TaskAction.PAUSE]: {
        text: '暂停任务',
        callback: async (id, name) => {
          await viewInstance.pause(id, name);
        },
        Render: (props: {
          text: string;
          callback: (id: string, name: string) => void;
        }) => (
          <Button
            type="primary"
            onClick={() => props.callback(id, name)}
            loading={
              viewInstance.actionExecuting &&
              viewInstance.executingAction === TaskAction.PAUSE
            }
            disabled={
              viewInstance.actionExecuting &&
              viewInstance.executingAction !== TaskAction.PAUSE
            }
          >
            {props.text}
          </Button>
        ),
      },
      [TaskAction.DELETE]: {
        text: '删除任务',
        callback: async (id: string, name: string) => {
          await viewInstance.delete(id, name);
        },
        Render: (props: {
          text: string;
          callback: (id: string, name: string) => void;
        }) => (
          <Popconfirm
            title="确定要删除任务吗？"
            okButtonProps={{ danger: true, type: 'default' }}
            onConfirm={() => {
              props.callback(id, name);
            }}
            okText="删除"
            placement="leftTop"
            key={`${id}-delete`}
          >
            <Button
              loading={
                viewInstance.actionExecuting &&
                viewInstance.executingAction === TaskAction.DELETE
              }
              disabled={
                viewInstance.actionExecuting &&
                viewInstance.executingAction !== TaskAction.DELETE
              }
            >
              {props.text}
            </Button>
          </Popconfirm>
        ),
      },
      // // [TaskAction.LOG]: {
      // //   text: '日志',
      // //   callback: (id) => {
      // //     console.log('log', id);
      // //     viewInstance.openLogDrawer(id);
      // //   },
      // // },
      [TaskAction.DOWNLOAD_RESULT]: {
        text: '下载结果',
        callback: async (id) => {
          await viewInstance.download(id);
        },
        Render: (props: {
          text: string;
          callback: (id: string, name: string) => void;
        }) => (
          <Button
            type="primary"
            onClick={() => props.callback(id, name)}
            loading={
              viewInstance.actionExecuting &&
              viewInstance.executingAction === TaskAction.DOWNLOAD_RESULT
            }
            disabled={
              viewInstance.actionExecuting &&
              viewInstance.executingAction !== TaskAction.DOWNLOAD_RESULT
            }
          >
            {props.text}
          </Button>
        ),
      },
      // // [TaskAction.UPLOAD_CERT]: {
      // //   text: '上传公钥',
      // //   callback: (id) => {
      // //     console.log('upload');
      // //   },
      // // },
    }),
    [id, name, recoveryEnabled],
  );

  // const actions = actionMap[status] || [];
  const actionInfos = actions
    .filter(
      (action: TaskAction) =>
        action !== TaskAction.LOG && action !== TaskAction.UPLOAD_CERT,
    )
    .map(
      (action) =>
        actionList[
          action as Exclude<TaskAction, TaskAction.LOG | TaskAction.UPLOAD_CERT>
        ],
    );

  return (
    <Space>
      {actionInfos.map((i) => {
        const { Render, text, callback } = i;
        // const render = i.render || (
        //   <Button
        //     type="link"
        //     onClick={() => {
        //       const { callback } = i;
        //       callback(id);
        //     }}
        //     key={`${id}-${index}`}
        //     style={{ padding: 0 }}
        //     {...(i.props || {})}
        //   >
        //     {i.text}
        //   </Button>
        // );
        return <Render text={text} callback={callback} key={`${id}-${text}`} />;
      })}
    </Space>
  );
};

// export const OperationButtons = (props: { operation: TaskAction, onClick: (e: any)=>void }) => {
//   const { operation, onClick} = props;

// };
