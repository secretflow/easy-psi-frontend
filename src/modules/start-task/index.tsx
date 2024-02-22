import {
  ArrowLeftOutlined,
  HddFilled,
  DownOutlined,
  UpOutlined,
  QuestionCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import styles from './index.less';
import {
  Card,
  Form,
  Typography,
  Input,
  Alert,
  Select,
  Checkbox,
  Button,
  Radio,
  Switch,
  Row,
  Col,
  Tooltip,
  message,
  InputNumber,
} from 'antd';
import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { history } from 'umi';
import { ReactComponent as Intersection } from '@/assets/intersection.svg';
import { ReactComponent as DifferenceSet } from '@/assets/differenceSet.svg';
import { AddNodeDrawer, addNodeDrawer, NodeRoute } from '@/modules/node';
import { useModel } from '@/util/valtio-helper';
import { DefaultModalManager } from '@/modules/modal-manager';
import { NodeRouteListView } from '../node/node-list.view';
import API from '@/services/ezpsi-board';

import { SubmitButton } from './submit-button';

const { Title } = Typography;

export const StartTaskLayout = () => {
  const [configStatus, setConfigStatus] = useState(false);
  const modalManager = useModel(DefaultModalManager);
  const viewInstance = useModel(NodeRouteListView);

  const [partnerOptions, setPartnerOptions] = useState<
    { label: JSX.Element; value: string; disabled?: boolean }[]
  >([]);
  const [dataTableOptions, setDataTableOptions] = useState<
    { label: JSX.Element | string; value: string }[]
  >([]);

  const [joinKeyOptions, setJoinKeyOptions] = useState<
    { label: JSX.Element | string; value: string }[]
  >([]);

  const [nodeRouteErrorVisible, setNodeRouteErrorVisible] = useState(false);

  const [nodeRouteList, setNodeRouteList] = useState<NodeRoute[]>([]);

  const [form] = Form.useForm();

  const selectedPartner = Form.useWatch(['partnerConfig', 'nodeId'], form);
  const selectedDataTable = Form.useWatch(['initiatorConfig', 'path'], form);
  const recoveryEnabled = Form.useWatch(['advancedConfig', 'recoveryEnabled'], form);
  const protocolType = Form.useWatch(
    ['advancedConfig', 'protocolConfig', 'protocol'],
    form,
  );
  const joinType = Form.useWatch(['advancedConfig', 'advancedJoinType'], form);
  const outputDifference = Form.useWatch(['advancedConfig', 'outputDifference'], form);

  const [selectedPartnerEnabled, setSelectedPartnerEnabled] = useState(false);
  const [disabledPartner, setDisabledPartner] = useState(true);
  const [disabledInitiator, setDisabledInitiator] = useState(false);
  const [disabledSkipDuplicatesCheck, setDisabledSkipDuplicatesCheck] = useState(false);

  useEffect(() => {
    const getPartnerStatus = async () => {
      if (selectedPartner) {
        const route = nodeRouteList.find((r) => r.dstNodeId === selectedPartner);
        if (!route) {
          setNodeRouteErrorVisible(true);
          setSelectedPartnerEnabled(false);
          return;
        }

        const { data, status } = await API.NodeRouteController.refresh({
          routerId: route.routeId,
        });
        if (status?.code === 0) {
          if (data?.status === 'Succeeded') {
            setNodeRouteErrorVisible(false);
            setSelectedPartnerEnabled(true);
            return;
          }
          setNodeRouteErrorVisible(true);
          setSelectedPartnerEnabled(false);
          return;
        }
        setNodeRouteErrorVisible(true);
        setSelectedPartnerEnabled(false);
        message.error(status?.msg || '查询节点状态失败');
        return;
      }

      setSelectedPartnerEnabled(true);
      return;
    };
    getPartnerStatus();
    setDisabledPartner(!selectedPartner);
  }, [selectedPartner]);

  useEffect(() => {
    const getDataTableCols = async () => {
      const { data, status } = await API.ProjectController.getDataHeader({
        tableName: selectedDataTable,
      });
      if (status?.code !== 0) {
        message.error(status?.msg || '表头获取失败');
        setJoinKeyOptions([]);
        return;
      }

      const { dataHeader = [] } = data || {};
      setJoinKeyOptions(dataHeader.map((i) => ({ value: i, label: i })));
    };
    if (selectedDataTable) {
      getDataTableCols();
    }
    form.setFieldValue(['initiatorConfig', 'keys'], undefined);
  }, [selectedDataTable]);

  useEffect(() => {
    form.setFieldValue(
      ['initiatorConfig', 'nodeId'],
      viewInstance.nodeService.currentNode?.nodeId,
    );

    form.setFieldValue(
      ['outputConfig', 'broadcastResult'],
      [viewInstance.nodeService.currentNode?.nodeId],
    );
    const getDataTableOptions = async () => {
      const { data, status } = await API.ProjectController.getDataTable({});
      if (status?.code !== 0) {
        message.error(status?.msg || '数据表获取失败');
        return;
      }

      const { dataTable = [] } = data || {};
      setDataTableOptions((dataTable || []).map((i) => ({ label: i, value: i })));
    };

    const getNodeOptions = async () => {
      const res = await viewInstance.nodeService.listNodeRoutes();
      if (res) {
        setNodeRouteList(res);
        const options = res.map((route) => {
          return {
            value: route.dstNodeId!,
            label: (
              <div style={{ display: 'flex' }}>
                <HddFilled
                  style={{
                    color: 'rgba(19,168,168,1)',
                    marginRight: '4px',
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <>{route.dstNodeId}</>
                </div>
              </div>
            ),
          };
        });
        setPartnerOptions(options);
        if (res && res[0])
          form.setFieldValue(['partnerConfig', 'nodeId'], res[0].dstNodeId);
      }
    };

    getNodeOptions();
    getDataTableOptions();
  }, [viewInstance.nodeService.currentNode]);

  useEffect(() => {
    if (outputDifference || joinType === 'ADVANCED_JOIN_TYPE_INNER_JOIN') {
      form.setFieldValue(
        ['outputConfig', 'broadcastResult'],
        [
          viewInstance.nodeService.currentNode?.nodeId || 'Option1',
          selectedPartner || 'Option2',
        ],
      );
      setDisabledPartner(true);
      setDisabledInitiator(true);
    } else {
      setDisabledPartner(!selectedPartner);
      setDisabledInitiator(false);
    }
  }, [outputDifference, joinType, selectedPartner]);

  useEffect(() => {
    const getNodeOptions = async () => {
      const res = await viewInstance.nodeService.listNodeRoutes();
      setNodeRouteList(res || []);
      if (res) {
        const options = res.map((route) => {
          return {
            value: route.dstNodeId!,
            label: (
              <div style={{ display: 'flex' }}>
                <HddFilled
                  style={{
                    color: 'rgba(19,168,168,1)',
                    marginRight: '4px',
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <>{route.dstNodeId}</>
                </div>
              </div>
            ),
          };
        });
        setPartnerOptions(options);
      }
    };
    getNodeOptions();
  }, [viewInstance.nodeRouteList]);

  const clickConfigIcon = (flag: boolean) => {
    setConfigStatus(flag);
  };

  useEffect(() => {
    if (outputDifference || joinType === 'ADVANCED_JOIN_TYPE_INNER_JOIN') {
      form.setFieldValue(['advancedConfig', 'skipDuplicatesCheck'], false);
      setDisabledSkipDuplicatesCheck(true);
    } else {
      setDisabledSkipDuplicatesCheck(false);
    }
  }, [outputDifference, joinType]);

  return (
    <div className={styles.taskContent}>
      <div className={styles.header}>
        <ArrowLeftOutlined onClick={() => history.push('/')} />
        <span className={styles.headerText}>发起任务</span>
      </div>
      <div className={styles.card}>
        <Card>
          <Form layout="vertical" form={form} requiredMark="optional">
            <div style={{ display: 'flex', marginBottom: '28px' }}>
              <Form.Item
                label="任务名称"
                name="name"
                rules={[
                  { required: true, message: '请输入任务名称！' },
                  { type: 'string', max: 32, message: '任务名称过长' },
                  {
                    pattern: /^[\w_-\d\u4e00-\u9fa5]+$/gi,
                    message: '名称由中文、英文、数字、下划线、中划线组成',
                  },
                ]}
              >
                <Input
                  style={{ width: 380 }}
                  placeholder="名称可由中文/英文/中划线/下划线组成，长度限制32"
                />
              </Form.Item>
              <Form.Item
                label="备注"
                name="description"
                rules={[{ type: 'string', max: 100, message: '任务备注过长' }]}
                style={{ marginLeft: '28px' }}
              >
                <Input style={{ width: 380 }} placeholder="100个字符内" />
              </Form.Item>
            </div>
            {/* 节点数据配置 */}
            <div className={styles.dataPage}>
              <div
                style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}
              >
                <Title level={5}>发起方节点数据</Title>
                <Alert
                  message={`请将你的文件放在目录：${viewInstance.nodeService.nodePath}`}
                  showIcon
                  rootClassName={styles.workingDirAlert}
                />
              </div>
              <div className={styles.initiator}>
                <Form.Item
                  label="发起方"
                  name={['initiatorConfig', 'nodeId']}
                  rules={[{ required: true, message: '请输入发起方' }]}
                >
                  <Input
                    style={{ width: 380 }}
                    disabled
                    prefix={
                      <HddFilled
                        style={{ color: 'rgba(0,104,250,1)', marginRight: '4px' }}
                      />
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="数据表"
                  name={['initiatorConfig', 'path']}
                  style={{ marginLeft: '28px' }}
                  rules={[{ required: true, message: '请选择数据表' }]}
                >
                  <Select
                    style={{ width: 380 }}
                    placeholder="请选择"
                    options={dataTableOptions}
                    showSearch
                    filterOption={(
                      input: string,
                      option?: { label: string; value: string },
                    ) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="关联键"
                  name={['initiatorConfig', 'keys']}
                  style={{ marginLeft: '28px' }}
                  rules={[{ required: true, message: '请选择关联键' }]}
                >
                  <Select
                    style={{ width: 380 }}
                    placeholder="请选择"
                    mode="multiple"
                    options={joinKeyOptions}
                    showSearch
                    filterOption={(
                      input: string,
                      option?: { label: string; value: string },
                    ) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '16px',
                  marginTop: 43,
                }}
              >
                <Title level={5}>合作方节点数据</Title>
                {nodeRouteErrorVisible ? (
                  <Alert
                    message={`当前节点不可用，请先确认是否有以下错误：对方不在线/配置信息错误/合作方未添加本方节点。合作节点可用之后再来发起任务。`}
                    showIcon
                    rootClassName={styles.workingDirAlertWarning}
                    type={'warning'}
                  />
                ) : (
                  <Alert
                    message={`请先线下获取合作方数据表名（xxx.csv）及用作关联键的字段`}
                    showIcon
                    rootClassName={styles.workingDirAlert}
                  />
                )}
              </div>
              <div style={{ display: 'flex', marginBottom: '16px' }}>
                <Form.Item
                  label="合作方"
                  name={['partnerConfig', 'nodeId']}
                  validateTrigger="onChange"
                  rules={[{ required: true, message: '请选择合作方' }]}
                >
                  <Select
                    style={{ width: 380 }}
                    placeholder={
                      <>
                        {' '}
                        <HddFilled
                          style={{
                            color: 'rgba(19,168,168,1)',
                            marginRight: '4px',
                          }}
                        />
                        请选择合作节点
                      </>
                    }
                    dropdownRender={(menu) => (
                      <div className={styles.nodeSelector}>
                        <div className={styles.header}>
                          <div className={styles.title}>合作节点</div>
                          <Button
                            type="link"
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={() => modalManager.openModal(addNodeDrawer.id)}
                          >
                            添加
                          </Button>
                        </div>
                        <div> {menu}</div>
                      </div>
                    )}
                    options={partnerOptions}
                  />
                </Form.Item>
                <Form.Item
                  label="数据表"
                  name={['partnerConfig', 'path']}
                  style={{ marginLeft: '28px' }}
                  rules={[
                    { required: true, message: '请选择数据表' },
                    {
                      pattern: /.*\.csv$/,
                      message: '数据表名格式为xxx.csv',
                    },
                  ]}
                >
                  <Input
                    style={{ width: 380 }}
                    placeholder="请输入数据表名（xxx.csv）"
                  />
                </Form.Item>
                <Form.Item
                  label="关联键"
                  name={['partnerConfig', 'keys']}
                  style={{ marginLeft: '28px' }}
                  normalize={(val) => {
                    return val.split(',');
                  }}
                  rules={[
                    { required: true, message: '请选择关联键' },
                    { pattern: /^[^,]+(,[^,]+)*$/ },
                  ]}
                >
                  <Input style={{ width: 380 }} placeholder="多个字段用“,”隔开" />
                </Form.Item>
              </div>
            </div>
            {/* 结果配置 */}
            <div className={styles.resultPage}>
              <Title level={5}>结果配置</Title>
              <div style={{ display: 'flex' }}>
                <Form.Item
                  label="结果名称"
                  name={['outputConfig', 'path']}
                  style={{ marginBottom: 0 }}
                  rules={[
                    { required: true, message: '请输入结果名称' },
                    { type: 'string', max: 32, message: '结果名称过长' },
                    {
                      pattern: /^[\w_-\d\u4e00-\u9fa5]+\.csv$/gi,
                      message: '名称由中文、英文、数字、下划线、中划线组成, 后缀为.csv',
                    },
                  ]}
                >
                  <Input
                    style={{ width: 380 }}
                    placeholder="请输入结果名（xxx.csv），长度限制32"
                  />
                </Form.Item>
                <Form.Item
                  label="结果获取方"
                  name={['outputConfig', 'broadcastResult']}
                  style={{ marginLeft: '28px', marginBottom: 0 }}
                  rules={[{ required: true, message: '请选择结果获取方' }]}
                >
                  <Checkbox.Group
                    options={[
                      {
                        label: (
                          <div style={{ display: 'flex' }}>
                            <HddFilled
                              style={{ color: 'rgba(0,104,250,1)', marginRight: '4px' }}
                            />
                            <div>
                              {viewInstance.nodeService.currentNode?.nodeId || ''}
                            </div>
                          </div>
                        ),
                        value:
                          viewInstance.nodeService.currentNode?.nodeId || 'Option1',
                        disabled: disabledInitiator,
                      },
                      {
                        label: (
                          <div style={{ display: 'flex' }}>
                            <HddFilled
                              style={{
                                color: 'rgba(19,168,168,1)',
                                marginRight: '4px',
                              }}
                            />
                            <div>{selectedPartner || ''}</div>
                          </div>
                        ),
                        value: selectedPartner || 'Option2',
                        disabled: disabledPartner,
                      },
                    ]}
                  />
                </Form.Item>
              </div>
            </div>
            {/* 高级配置 */}
            <div className={styles.advancedConfig}>
              <div
                style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}
              >
                <Title level={5}>高级配置</Title>
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
              <div className={classNames(configStatus ? '' : styles.close)}>
                <Row style={{ marginBottom: '16px' }}>
                  <Col span={8}>
                    <Form.Item
                      label="隐私求交协议"
                      name={['advancedConfig', 'protocolConfig', 'protocol']}
                      style={{ marginBottom: 0 }}
                      initialValue={'PROTOCOL_ECDH'}
                      rules={[{ required: true, message: '请选择隐私求交协议' }]}
                    >
                      <Select
                        options={[
                          { value: 'PROTOCOL_ECDH', label: 'ECDH' },
                          { value: 'PROTOCOL_KKRT', label: 'KKRT' },
                          { value: 'PROTOCOL_RR22', label: 'RR22' },
                          // { value: 'ECDH_OPRF_UB', label: 'ECDH_OPRF_UB（非平衡）' },
                        ]}
                        style={{ width: '200px' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item noStyle shouldUpdate>
                      {({ getFieldValue }) =>
                        getFieldValue([
                          'advancedConfig',
                          'protocolConfig',
                          'protocol',
                        ]) === 'PROTOCOL_ECDH' ? (
                          <Form.Item
                            label="ECDH曲线类型"
                            name={[
                              'advancedConfig',
                              'protocolConfig',
                              'ecdhConfig',
                              'curve',
                            ]}
                            style={{ marginBottom: 0 }}
                            initialValue={'CURVE_25519'}
                            rules={[{ required: true, message: '请选择ECDH曲线类型' }]}
                            dependencies={[
                              'advancedConfig',
                              'protocolConfig',
                              'protocol',
                            ]}
                          >
                            <Select
                              options={[
                                { value: 'CURVE_25519', label: 'CURVE_25519' },
                                { value: 'CURVE_FOURQ', label: 'CURVE_FOURQ' },
                                { value: 'CURVE_SM2', label: 'CURVE_SM2' },
                                { value: 'CURVE_SECP256K1', label: 'CURVE_SECP256K1' },
                                {
                                  value: 'CURVE_25519_ELLIGATOR2',
                                  label: 'CURVE_25519_ELLIGATOR2',
                                },
                              ]}
                              style={{ width: '200px' }}
                            />
                          </Form.Item>
                        ) : (
                          <Form.Item
                            label="分桶大小"
                            name={
                              protocolType === 'PROTOCOL_KKRT'
                                ? [
                                    'advancedConfig',
                                    'protocolConfig',
                                    'kkrtConfig',
                                    'bucketSize',
                                  ]
                                : [
                                    'advancedConfig',
                                    'protocolConfig',
                                    'rr22Config',
                                    'bucketSize',
                                  ]
                            }
                            style={{ marginBottom: 0 }}
                            required
                            dependencies={[
                              'advancedConfig',
                              'protocolConfig',
                              'protocol',
                            ]}
                            initialValue={1048576}
                          >
                            <InputNumber min={10000} style={{ width: '200px' }} />
                          </Form.Item>
                        )
                      }
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item noStyle shouldUpdate>
                      {({ getFieldValue }) =>
                        getFieldValue([
                          'advancedConfig',
                          'protocolConfig',
                          'protocol',
                        ]) === 'PROTOCOL_RR22' ? (
                          <Form.Item
                            name={[
                              'advancedConfig',
                              'protocolConfig',
                              'rr22Config',
                              'lowCommMode',
                            ]}
                            label="低通信模式"
                            rules={[{ required: true }]}
                            style={{ marginBottom: 0 }}
                            tooltip="当双方通信状况不佳时，请打开该开关"
                            initialValue={false}
                            valuePropName={'checked'}
                            dependencies={[
                              'advancedConfig',
                              'protocolConfig',
                              'protocol',
                            ]}
                          >
                            <Switch checkedChildren="开" unCheckedChildren="关" />
                          </Form.Item>
                        ) : null
                      }
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify="space-between" style={{ marginBottom: '16px' }}>
                  <Col span={8}>
                    <Form.Item
                      label="求交方式"
                      name={['advancedConfig', 'advancedJoinType']}
                      style={{ marginBottom: 0 }}
                      initialValue={'ADVANCED_JOIN_TYPE_UNSPECIFIED'}
                      rules={[{ required: true, message: '请选择求交方式' }]}
                    >
                      <Radio.Group>
                        <Radio value="ADVANCED_JOIN_TYPE_UNSPECIFIED">
                          {
                            <>
                              <span style={{ marginRight: '8px' }}>join</span>
                              <Tooltip title="不可有重复数据，否则会运行错误">
                                <QuestionCircleOutlined
                                  style={{
                                    cursor: 'pointer',
                                    color: 'rgba(0,0,0,0.45)',
                                  }}
                                />
                              </Tooltip>
                            </>
                          }
                        </Radio>
                        <Radio value={'ADVANCED_JOIN_TYPE_INNER_JOIN'}>
                          {
                            <>
                              <span style={{ marginRight: '8px' }}>inner_join</span>
                              <Tooltip title="可以有重复数据">
                                <QuestionCircleOutlined
                                  style={{
                                    cursor: 'pointer',
                                    color: 'rgba(0,0,0,0.45)',
                                  }}
                                />
                              </Tooltip>
                            </>
                          }
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="是否断点续传"
                      name={['advancedConfig', 'recoveryEnabled']}
                      style={{ marginBottom: 0 }}
                      tooltip="开启如影响性能，可暂停任务"
                      initialValue={true}
                      valuePropName={'checked'}
                      required
                    >
                      <Switch checkedChildren="开" unCheckedChildren="关" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="重复值检查"
                      name={['advancedConfig', 'skipDuplicatesCheck']}
                      style={{ marginBottom: 0 }}
                      tooltip="预先输入数据表求交键是否有重复"
                      initialValue={true}
                      dependencies={['advancedConfig', 'outputDifference']}
                      valuePropName={'checked'}
                      required
                    >
                      <Switch
                        disabled={disabledSkipDuplicatesCheck}
                        checkedChildren="开"
                        unCheckedChildren="关"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <Form.Item
                      label="求交关系"
                      name={['advancedConfig', 'outputDifference']}
                      style={{ marginBottom: 0 }}
                      initialValue={false}
                      rules={[{ required: true, message: '请选择求交关系' }]}
                    >
                      <Radio.Group>
                        <Radio value={false}>
                          {
                            <div style={{ display: 'flex' }}>
                              <span style={{ marginRight: '4px' }}>交集</span>
                              <Intersection />
                            </div>
                          }
                        </Radio>
                        <Radio value={true}>
                          {
                            <div style={{ display: 'flex' }}>
                              <span style={{ marginRight: '4px' }}>差集</span>
                              <DifferenceSet />
                            </div>
                          }
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="是否结果重排序"
                      name={['advancedConfig', 'disableAlignment']}
                      style={{ marginBottom: 0 }}
                      initialValue={true}
                      rules={[{ required: true, message: '请选择是否结果重排序' }]}
                    >
                      <Radio.Group>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="节点通信超时"
                      tooltip="当双方通信状况不佳时，请适当扩大超时"
                      name="nodeCommunicationTimeout"
                      required
                      style={{ marginBottom: 0 }}
                      initialValue={'_'}
                    >
                      <Form.Item
                        name={['advancedConfig', 'linkConfig']}
                        rules={[{ required: true, message: '请输入节点通信超时' }]}
                        initialValue={30}
                        noStyle
                      >
                        <InputNumber min={30} style={{ width: '98px' }} />
                      </Form.Item>
                      <span className="ant-form-text" style={{ marginLeft: 4 }}>
                        s
                      </span>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>
            {/* 底部按钮 */}
            <footer>
              {/* <Button
                type="primary"
                size="large"
                onClick={() => startTask()}
                disabled={!taskName || !resultName}
              >
                发起任务
              </Button> */}

              <SubmitButton
                form={form}
                text="发起任务"
                condition={selectedPartnerEnabled}
              />
              <Button
                style={{ marginLeft: '11px' }}
                size="large"
                onClick={() => history.push('/')}
              >
                取消
              </Button>
            </footer>
            {recoveryEnabled && (
              <Alert
                showIcon
                message="开启断点续传存在潜在安全风险，并影响性能"
                type="warning"
                rootClassName={styles.recoveryEnabledAlert}
              />
            )}
          </Form>
        </Card>
      </div>
      <AddNodeDrawer />
    </div>
  );
};
