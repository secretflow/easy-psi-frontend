import { LoadingOutlined } from '@ant-design/icons';
import {
  message,
  FormInstance,
  Popconfirm,
  Spin,
  notification,
  Button,
  Form,
} from 'antd';

import styles from './index.less';
import { useState, useEffect } from 'react';
import { history } from 'umi';
import {
  TaskDataTableInformation,
  TaskDataTableInformationText,
  TaskService,
} from '@/modules/task';
import { useModel } from '@/util/valtio-helper';

export const SubmitButton = ({
  form,
  text,
  condition,
}: {
  form: FormInstance;
  text: string;
  condition: boolean;
}) => {
  const taskService = useModel(TaskService);
  const [submittable, setSubmittable] = useState(false);
  const [dataCountInformation, setDataCountInformation] = useState<{
    srcDataTableInformation: { dataTableCount: TaskDataTableInformation };
    dstDataTableInformation: { dataTableCount: TaskDataTableInformation };
  }>({
    srcDataTableInformation: { dataTableCount: TaskDataTableInformation.L0 },
    dstDataTableInformation: { dataTableCount: TaskDataTableInformation.L0 },
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [openPopconfirm, setOpenPopconfirm] = useState(false);
  const [startTaskDisabled, setStartTaskDisabled] = useState(true);

  const showPopconfirm = () => {
    setOpenPopconfirm(true);
    setSubmitLoading(true);
  };

  const handleOpenChange = (e) => {
    // 点击了外部区域 改变openPopconfirm状态
    if (!e) {
      setOpenPopconfirm(false);
    }
  };

  const handleCancel = () => {
    setOpenPopconfirm(false);
  };

  // Watch all values
  const values = Form.useWatch([], form);

  useEffect(() => {
    const validate = () => {
      form.validateFields({ validateOnly: true }).then(
        () => {
          setSubmittable(condition && true);
        },
        (err) => {
          if (err.outOfDate) {
            // 由于状态已经过时，尝试重新校验
            validate();
          } else {
            setSubmittable(false);
          }
        },
      );
    };
    validate();
  }, [values, condition]);

  const errorNotification = (msg?: string) =>
    notification.warning({
      message: <div className={styles.errorNotice}>服务异常</div>,
      description: `${msg || '底层服务异常或网络异常'}，无法获取对方数据`,
    });

  const spinLoading = () => <Spin indicator={<LoadingOutlined spin />} />;

  // 立即发起任务
  const startTask = async () => {
    const handleProtocolConfig = () => {
      const { protocol, ecdhConfig, kkrtConfig, rr22Config } =
        values?.advancedConfig?.protocolConfig;
      if (protocol === 'PROTOCOL_ECDH') {
        return { ecdhConfig };
      } else if (protocol === 'PROTOCOL_KKRT') {
        return {
          kkrtConfig: { ...kkrtConfig, bucketSize: kkrtConfig.bucketSize.toString() },
        };
      } else if (protocol === 'PROTOCOL_RR22') {
        return {
          rr22Config: {
            ...rr22Config,
            bucketSize: rr22Config.bucketSize.toString(),
          },
        };
      } else return {};
    };
    try {
      const handleValues = {
        ...values,
        advancedConfig: {
          ...values.advancedConfig,
          protocolConfig: {
            ...values.advancedConfig.protocolConfig,
            ...handleProtocolConfig(),
          },
          linkConfig: values.advancedConfig.linkConfig.toString(),
        },
      };
      delete handleValues['nodeCommunicationTimeout'];
      const res = await taskService.createTask(handleValues);
      message.success(`「${values.name}」发起成功！`);
      history.push({
        pathname: '/task-details',
        search: `taskId=${res.jobId}`,
      });
      setOpenPopconfirm(false);
    } catch (e) {
      message.error((e as Error).message);
    }
  };

  useEffect(() => {
    if (submitLoading) {
      getDataCountInformation();
      setStartTaskDisabled(true);
    }
  }, [submitLoading]);

  // 数据量二次确认
  const getDataCountInformation = () => {
    Promise.race([
      taskService.getDataTableInformation({
        dstNodeId: values?.partnerConfig?.nodeId,
        dstDataTableName: values?.partnerConfig?.path,
        srcDataTableName: values?.initiatorConfig?.path,
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => reject('底层服务异常或网络异常'), 20000);
      }),
    ])
      .then((res) => {
        setDataCountInformation(res);
        setSubmitLoading(false);
        setStartTaskDisabled(false);
      })
      .catch((e: Error) => {
        errorNotification(e.message);
        setSubmitLoading(false);
        setStartTaskDisabled(true);
      });
  };

  return (
    <Popconfirm
      destroyTooltipOnHide
      placement="right"
      open={openPopconfirm}
      onOpenChange={handleOpenChange}
      className={styles.countConfirm}
      title={
        <>
          <div>
            {values?.initiatorConfig?.nodeId}：{values?.initiatorConfig?.path}，
            <span className={styles.count}>
              {submitLoading
                ? spinLoading()
                : TaskDataTableInformationText[
                    dataCountInformation?.srcDataTableInformation?.dataTableCount
                  ] || '--'}
            </span>
            行
          </div>
          <div>
            {values?.partnerConfig?.nodeId}：{values?.partnerConfig?.path}，
            <span className={styles.count}>
              {submitLoading
                ? spinLoading()
                : TaskDataTableInformationText[
                    dataCountInformation?.dstDataTableInformation?.dataTableCount
                  ] || '--'}
            </span>
            行
          </div>
          <div>请确认是否发起任务</div>
        </>
      }
      onConfirm={() => startTask()}
      onCancel={handleCancel}
      okText="立即发起"
      okButtonProps={{
        disabled: startTaskDisabled,
        type: 'primary',
      }}
    >
      <Button
        type="primary"
        disabled={!submittable}
        size="large"
        onClick={showPopconfirm}
        loading={submitLoading}
      >
        {text}
      </Button>
    </Popconfirm>
  );
};
