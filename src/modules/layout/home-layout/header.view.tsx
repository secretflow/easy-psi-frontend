import {
  GlobalOutlined,
  ReadOutlined,
  DatabaseOutlined,
  // EditOutlined,
  CaretDownOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Divider,
  Dropdown,
  Popover,
  Space,
  Tour,
  TourProps,
  Typography,
  theme,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, history } from 'umi';
import API from '@/services/ezpsi-board';

import { GuideTourService, GuideTourKey } from '@/modules/guide-tour';
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { ReactComponent as NodeTour } from '@/assets/nodeTour.svg';
import ezpsiImgLink from '@/assets/ezpsi.png';
import ezpsiOfflineImgLink from '@/assets/ezpsi-offline.png';

import { Model, useModel } from '@/util/valtio-helper';
import platformConfig from '@/platform.config';
// import { DefaultModalManager } from '@/modules/modal-manager';
// import { EditCurrentNodeModal } from '@/modules/node/edit-current-node-modal';

import styles from './index.less';
import { NodeService } from '@/modules/node/node.service';
import { LoginService } from '@/modules/login/login.service';
import { getImgLink } from '@/util/platform';
import classNames from 'classnames';
import { ChangePasswordModal } from '@/modules/login/component/change-password';

const { useToken } = theme;

const avatarInfo = {
  onlineLink: 'https://secretflow-public.oss-cn-hangzhou.aliyuncs.com/ezpsi.png',
  localLink: ezpsiImgLink,
  offlineLink: ezpsiOfflineImgLink,
  localStorageKey: 'sf-ezpsi',
};

export const HeaderComponent = () => {
  const viewInstance = useModel(HeaderModel);
  const guideService = useModel(GuideTourService);
  const nodeService = useModel(NodeService);
  const loginService = useModel(LoginService);

  const [avatarLink, setAvatarLink] = useState('');

  const { token } = useToken();

  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  const menuStyle: React.CSSProperties = {
    boxShadow: 'none',
  };

  // const { userInfo } = loginService;

  const ref = useRef(null);
  const steps: TourProps['steps'] = [
    {
      title: (
        <span style={{ fontWeight: 400 }}>你的节点公钥、节点根目录在这里哦～</span>
      ),
      description: <NodeTour style={{ marginLeft: '-8px' }} />,
      target: () => ref.current,
      nextButtonProps: { children: '知道了' },
    },
  ];

  const { pathname } = useLocation();

  const onLogout = async () => {
    await API.AuthController.logout(
      {},
      {
        name: loginService?.userInfo?.name,
      },
    );
    history.push('/login');
  };

  const items = [
    {
      key: 'changePassword',
      label: <div onClick={viewInstance.showChangePassword}>修改密码</div>,
    },
    {
      key: 'logout',
      icon: null,
      label: <div onClick={onLogout}>退出登录</div>,
    },
  ];

  useEffect(() => {
    if (loginService.userInfo) {
      const imgLink = getImgLink(avatarInfo);
      setAvatarLink(imgLink);
    }
  }, [loginService]);

  return (
    <div className={styles['header-items']}>
      <div className={styles.left}>
        {platformConfig.header.logo ? platformConfig.header.logo : <Logo />}
        <span className={styles.subTitle}>Easy PSI</span>
        <span className={styles.line} />
        <Popover
          placement="bottomLeft"
          overlayInnerStyle={{
            padding: 16,
          }}
          zIndex={999}
          overlayClassName={styles.nodePopover}
          content={
            <div className={styles.myNodePopover}>
              <div className={styles.name}>
                <span>{nodeService.currentNode?.nodeName}</span>
                节点
              </div>
              <div className={styles.nodeId}>ID：{nodeService.currentNode?.nodeId}</div>
              <Divider className={styles.nodeContentLine} />
              <div className={styles.publicKey}>
                节点公钥：
                <Typography.Link
                  onClick={() => {
                    if (nodeService.currentNode?.nodeId)
                      nodeService.downloadCertificate(nodeService.currentNode?.nodeId);
                  }}
                >
                  下载
                </Typography.Link>
              </div>
              {/* <div className={styles.address}>
                通讯地址：{nodeService.currentNode?.netAddress}
                <EditOutlined
                  className={styles.editIcon}
                  onClick={() => {
                    modalManager.openModal('edit-current-node', {
                      currentNode: nodeService.currentNode,
                    });
                  }}
                />
              </div> */}

              <div className={styles.address}>节点根目录：{nodeService.nodePath}</div>
            </div>
          }
          trigger="hover"
        >
          <div className={styles.myNodeTitle} ref={ref}>
            <DatabaseOutlined />
            <span className={styles.nodeName}>{nodeService.currentNode?.nodeName}</span>
            节点
          </div>
        </Popover>
      </div>
      {platformConfig.header.rightLinks === true && (
        <div className={styles.right}>
          <>
            <span
              className={styles.community}
              onClick={() =>
                viewInstance.goto('https://github.com/orgs/secretflow/discussions')
              }
            >
              <GlobalOutlined />
              隐语开源社区
            </span>
            <span
              className={styles.help}
              onClick={() =>
                viewInstance.goto(
                  'https://www.secretflow.org.cn/docs/quickstart/easy-psi',
                )
              }
            >
              <ReadOutlined />
              帮助中心
            </span>
            <span className={styles.line} />
            <Dropdown
              menu={{
                items,
              }}
              dropdownRender={(menu) => (
                <div style={contentStyle}>
                  <Space direction="vertical" style={{ padding: '12px 16px' }}>
                    <div
                      className={classNames(styles.headerDropdown, styles.headerBlob)}
                    >
                      产品版本：{viewInstance.version.secretpadTag}
                    </div>
                    <div className={styles.headerDropdown}>
                      引擎版本：{viewInstance.version.secretflowTag}
                    </div>
                    <div className={styles.headerDropdown}>
                      框架版本：{viewInstance.version.kusciaTag}
                    </div>
                  </Space>
                  <Divider style={{ margin: 0 }} />
                  {React.cloneElement(menu as React.ReactElement, { style: menuStyle })}
                </div>
              )}
            >
              <div style={{ cursor: 'pointer' }} onClick={(e) => e.preventDefault()}>
                <Space>
                  {/* <Image
                    width={28}
                    preview={false}
                    src={avatarLink}
                    fallback={avatarInfo.offlineLink}
                  /> */}
                  <Avatar
                    size={28}
                    // 用 icon 代替 Image 的 fallback
                    // Antd: Avatar 组件中，可以设置 icon 或 children 作为图片加载失败的默认 fallback 行为.
                    icon={<img width={'100%'} src={avatarInfo.offlineLink} />}
                    src={avatarLink || null}
                  />
                  <span style={{ fontSize: 14, color: 'rgba(0,0,0,0.85)' }}>
                    {loginService?.userInfo?.name}
                  </span>
                  <CaretDownOutlined
                    style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)' }}
                  />
                </Space>
              </div>
            </Dropdown>
          </>
          <Tour
            // open={!guideService.MyNodeTour && pathname === '/guide'}
            open={!guideService.MyNodeTour && pathname === '/guide'}
            steps={steps}
            mask={false}
            type="primary"
            closeIcon={false}
            zIndex={100000000}
            onFinish={() => guideService.finish(GuideTourKey.MyNodeTour)}
            rootClassName={styles.tourMyNode}
          />
        </div>
      )}
      {/* <EditCurrentNodeModal /> */}
      <ChangePasswordModal
        visible={viewInstance.showChangePasswordModel}
        close={() => (viewInstance.showChangePasswordModel = false)}
      />
    </div>
  );
};

export class HeaderModel extends Model {
  showChangePasswordModel = false;

  constructor() {
    super();
    this.getVersion();
  }

  goto(url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.click();
  }

  version: API.DataVersionVO = {
    secretflowTag: '',
    kusciaTag: '',
    secretpadTag: '',
  };

  getVersion = async () => {
    const { data } = await API.DataController.queryDataVersion();
    if (data) {
      this.version = data;
    }
  };

  showChangePassword = () => {
    this.showChangePasswordModel = true;
  };
}
