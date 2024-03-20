/* eslint-disable @typescript-eslint/no-unused-vars */
import { DefaultModalManager } from '@/modules/modal-manager';
import { getModel, useModel, Model } from '@/util/valtio-helper';
import { Drawer, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { Log } from './log.view';
import { useEffect } from 'react';
import { TaskService } from '../task.service';
import { TaskStatus } from '../types';
import styles from './index.less';

export const TaskLogDrawer = () => {
  const modalManager = useModel(DefaultModalManager);
  const drawer = modalManager.modals[taskLogDrawer.id];
  const viewInstance = useModel(LogView);

  const { visible, data, close } = drawer;

  const onClose = () => {
    if (viewInstance.timer) {
      clearTimeout(viewInstance.timer);
      viewInstance.timer = 0;
    }
    if (close) close();
  };

  useEffect(() => {
    if (data && visible) {
      if (viewInstance.timer) {
        clearTimeout(viewInstance.timer);
        viewInstance.timer = 0;
      }
      viewInstance.getLog(data);
    }
  }, [data, visible]);

  return (
    <Drawer
      title="日志"
      placement="right"
      onClose={onClose}
      open={visible}
      width={560}
      mask={true}
      closeIcon={false}
      extra={<CloseOutlined onClick={onClose} />}
      destroyOnClose
      className={styles.logDrawer}
    >
      <Log />
    </Drawer>
  );
};

export class LogView extends Model {
  logContent: string | undefined;
  taskService = getModel(TaskService);
  timer: number | undefined;

  async getLog(jobId: string) {
    try {
      const { status, logs } = await this.taskService.getLog(jobId);
      this.logContent = logs.join('\n');

      if (status === TaskStatus.RUNNING) {
        this.timer = window.setTimeout(async () => {
          await this.getLog(jobId);
        }, 3000);
      } else {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = 0;
        }
      }
    } catch (e) {
      this.logContent = '';
      message.error((e as Error).message);
    }
  }
}

export const taskLogDrawer = {
  id: 'task-log',
  visible: false,
  data: undefined,
};

getModel(DefaultModalManager).registerModal(taskLogDrawer);
