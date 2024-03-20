import {
  ArrowLeftOutlined,
  HddFilled,
  DownOutlined,
  UpOutlined,
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
  message,
  InputNumber,
} from 'antd';
import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { history } from 'umi';
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
  const [disableDataTableConfirmation, setDisableDataTableConfirmation] =
    useState(false);

  useEffect(() => {
    // 当合作方节点发生改变时，获取合作方节点的stauts与trust信息
    const getPartnerInfo = async () => {
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
          if (data?.dstNode?.trust === true) {
            setDisableDataTableConfirmation(true);
          } else {
            setDisableDataTableConfirmation(false);
          }
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
    getPartnerInfo();
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

    form.setFieldValue(
      ['advancedConfig', 'leftSide'],
      viewInstance.nodeService.currentNode?.nodeId,
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
              <div className={styles.flexContent}>
                <HddFilled className={styles.partnerHdd} />
                <div className={styles.routeDstNodeId}>{route.dstNodeId}</div>
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
    // 当用户选择所有join之外的选项时，结果获取方强制为双方
    if (outputDifference || joinType !== 'ADVANCED_JOIN_TYPE_UNSPECIFIED') {
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
      // 求交方式切换为join时 结果获取方默认为发起方
      form.setFieldValue(
        ['outputConfig', 'broadcastResult'],
        [viewInstance.nodeService.currentNode?.nodeId],
      );
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
              <div className={styles.flexContent}>
                <HddFilled className={styles.partnerHdd} />
                <div className={styles.routeDstNodeId}>{route.dstNodeId}</div>
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
    // 当用户选择所有join之外的选项时，重复值检查将会被强制跳过
    if (outputDifference || joinType !== 'ADVANCED_JOIN_TYPE_UNSPECIFIED') {
      form.setFieldValue(['advancedConfig', 'skipDuplicatesCheck'], false);
      setDisabledSkipDuplicatesCheck(true);
    } else {
      setDisabledSkipDuplicatesCheck(false);
    }
  }, [outputDifference, joinType]);

  return (
    <div className={styles.taskContent}>
      <div className={styles.header}>
        <ArrowLeftOutlined onClick={() => history.push('/home')} />
        <span className={styles.headerText}>发起任务</span>
      </div>
      <div className={styles.card}>
        <Card>
          <Form layout="vertical" form={form} requiredMark="optional">
            <div className={styles.taskInfo}>
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
                <Input placeholder="名称可由中文/英文/中划线/下划线组成，长度限制32" />
              </Form.Item>
              <Form.Item
                label="备注"
                name="description"
                rules={[{ type: 'string', max: 100, message: '任务备注过长' }]}
                className={styles.subForm}
              >
                <Input placeholder="100个字符内" />
              </Form.Item>
            </div>
            {/* 节点数据配置 */}
            <div className={styles.dataPage}>
              <div className={styles.flexTitle}>
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
                    disabled
                    prefix={<HddFilled className={styles.initiatorHdd} />}
                  />
                </Form.Item>
                <Form.Item
                  label="数据表"
                  name={['initiatorConfig', 'path']}
                  className={styles.subForm}
                  rules={[{ required: true, message: '请选择数据表' }]}
                >
                  <Select
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
                  className={styles.subForm}
                  rules={[{ required: true, message: '请选择关联键' }]}
                >
                  <Select
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
              <div className={classNames(styles.flexTitle, styles.partnerTitle)}>
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
              <div className={styles.partner}>
                <Form.Item
                  label="合作方"
                  name={['partnerConfig', 'nodeId']}
                  validateTrigger="onChange"
                  rules={[{ required: true, message: '请选择合作方' }]}
                >
                  <Select
                    placeholder={
                      <>
                        <HddFilled className={styles.partnerHdd} />
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
                  className={styles.subForm}
                  rules={[
                    { required: true, message: '请选择数据表' },
                    {
                      pattern: /.*\.csv$/,
                      message: '数据表名格式为xxx.csv',
                    },
                  ]}
                >
                  <Input placeholder="请输入数据表名（xxx.csv）" />
                </Form.Item>
                <Form.Item
                  label="关联键"
                  name={['partnerConfig', 'keys']}
                  className={styles.subForm}
                  normalize={(val) => {
                    return val.split(',');
                  }}
                  rules={[
                    { required: true, message: '请选择关联键' },
                    { pattern: /^[^,]+(,[^,]+)*$/ },
                  ]}
                >
                  <Input placeholder="多个字段用“,”隔开" />
                </Form.Item>
              </div>
            </div>
            {/* 结果配置 */}
            <div className={styles.resultPage}>
              <Title level={5}>结果配置</Title>
              <div className={styles.flexContent}>
                <Form.Item
                  label="结果名称"
                  name={['outputConfig', 'path']}
                  className={styles.bottomStyle}
                  rules={[
                    { required: true, message: '请输入结果名称' },
                    { type: 'string', max: 32, message: '结果名称过长' },
                    {
                      pattern: /^[\w_-\d\u4e00-\u9fa5]+\.csv$/gi,
                      message: '名称由中文、英文、数字、下划线、中划线组成, 后缀为.csv',
                    },
                  ]}
                >
                  <Input placeholder="请输入结果名（xxx.csv），长度限制32" />
                </Form.Item>
                <Form.Item
                  label="结果获取方"
                  name={['outputConfig', 'broadcastResult']}
                  className={classNames(styles.subForm, styles.bottomStyle)}
                  rules={[{ required: true, message: '请选择结果获取方' }]}
                >
                  <Checkbox.Group
                    options={[
                      {
                        label: (
                          <div className={styles.flexContent}>
                            <HddFilled className={styles.initiatorHdd} />
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
                          <div className={styles.flexContent}>
                            <HddFilled className={styles.partnerHdd} />
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
              <div className={styles.flexTitle}>
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
                <Row className={styles.rowBottom}>
                  <Col span={8}>
                    <Form.Item
                      label="隐私求交协议"
                      name={['advancedConfig', 'protocolConfig', 'protocol']}
                      className={styles.bottomStyle}
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
                        className={styles.advancedSelect}
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
                            className={styles.bottomStyle}
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
                              className={styles.advancedSelect}
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
                            className={styles.bottomStyle}
                            required
                            dependencies={[
                              'advancedConfig',
                              'protocolConfig',
                              'protocol',
                            ]}
                            initialValue={1048576}
                          >
                            <InputNumber
                              min={10000}
                              className={styles.advancedSelect}
                            />
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
                            className={styles.bottomStyle}
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
                <Row className={styles.rowBottom}>
                  <Col span={8}>
                    <Form.Item
                      label="求交方式"
                      name={['advancedConfig', 'advancedJoinType']}
                      className={styles.bottomStyle}
                      initialValue={'ADVANCED_JOIN_TYPE_UNSPECIFIED'}
                      rules={[{ required: true, message: '请选择求交方式' }]}
                    >
                      <Select
                        options={[
                          {
                            value: 'ADVANCED_JOIN_TYPE_UNSPECIFIED',
                            label: 'join（关联键不允许重复）',
                          },
                          {
                            value: 'ADVANCED_JOIN_TYPE_INNER_JOIN',
                            label: 'inner join（允许关联键重复）',
                          },
                          {
                            value: 'ADVANCED_JOIN_TYPE_LEFT_JOIN',
                            label: 'left join（允许关联键重复）',
                          },
                          {
                            value: 'ADVANCED_JOIN_TYPE_RIGHT_JOIN',
                            label: 'right join（允许关联键重复）',
                          },
                          {
                            value: 'ADVANCED_JOIN_TYPE_FULL_JOIN',
                            label: 'full join（允许关联键重复）',
                          },
                          {
                            value: 'ADVANCED_JOIN_TYPE_DIFFERENCE',
                            label: 'difference（允许关联键重复）',
                          },
                        ]}
                        className={styles.advancedSelect}
                      />
                    </Form.Item>
                  </Col>
                  {/* 左方 选择left join / right join时出现 */}
                  <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) =>
                      getFieldValue(['advancedConfig', 'advancedJoinType']) ===
                        'ADVANCED_JOIN_TYPE_LEFT_JOIN' ||
                      getFieldValue(['advancedConfig', 'advancedJoinType']) ===
                        'ADVANCED_JOIN_TYPE_RIGHT_JOIN' ? (
                        <Col span={8}>
                          <Form.Item
                            label="左方"
                            name={['advancedConfig', 'leftSide']}
                            className={styles.bottomStyle}
                            rules={[{ required: true, message: '请选择左方' }]}
                          >
                            <Radio.Group>
                              <Radio
                                value={
                                  viewInstance.nodeService.currentNode?.nodeId ||
                                  'Option1'
                                }
                              >
                                <div className={styles.flexContent}>
                                  <HddFilled className={styles.initiatorHdd} />
                                  <div>
                                    {viewInstance.nodeService.currentNode?.nodeId || ''}
                                  </div>
                                </div>
                              </Radio>
                              <Radio value={selectedPartner || 'Option2'}>
                                <div className={styles.flexContent}>
                                  <HddFilled className={styles.partnerHdd} />
                                  <div>{selectedPartner || ''}</div>
                                </div>
                              </Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Col>
                      ) : null
                    }
                  </Form.Item>
                  <Col span={8}>
                    <Form.Item
                      label="是否断点续传"
                      name={['advancedConfig', 'recoveryEnabled']}
                      className={styles.bottomStyle}
                      tooltip="开启如影响性能，可暂停任务"
                      initialValue={true}
                      valuePropName={'checked'}
                      required
                    >
                      <Switch checkedChildren="开" unCheckedChildren="关" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles.rowBottom}>
                  <Col span={8}>
                    <Form.Item
                      label="重复值检查"
                      name={['advancedConfig', 'skipDuplicatesCheck']}
                      className={styles.bottomStyle}
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
                  <Col span={8}>
                    <Form.Item
                      label="是否结果重排序"
                      name={['advancedConfig', 'disableAlignment']}
                      className={styles.bottomStyle}
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
                      className={styles.bottomStyle}
                      initialValue={'_'}
                    >
                      <Form.Item
                        name={['advancedConfig', 'linkConfig']}
                        rules={[{ required: true, message: '请输入节点通信超时' }]}
                        initialValue={30}
                        noStyle
                      >
                        <InputNumber className={styles.advancedInputNumber} min={30} />
                      </Form.Item>
                      <span className="ant-form-text">s</span>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <Form.Item
                      label="数据量级检查"
                      name={['advancedConfig', 'dataTableConfirmation']}
                      className={styles.bottomStyle}
                      initialValue={false}
                      valuePropName={'checked'}
                      required
                    >
                      <Switch
                        disabled={disableDataTableConfirmation}
                        checkedChildren="开"
                        unCheckedChildren="关"
                      />
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
                className={styles.cancelBtn}
                size="large"
                onClick={() => history.push('/home')}
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
