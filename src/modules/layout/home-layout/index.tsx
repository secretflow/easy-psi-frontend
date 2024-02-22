// import { ShowMenuContext, Portal } from '@secretflow/dag';
import classnames from 'classnames';
import type { ReactNode } from 'react';
import { useLocation } from 'umi';

// import { useModel } from '@/util/valtio-helper';

import { HeaderComponent } from './header.view';
import styles from './index.less';
import { useModel } from '@/util/valtio-helper';
import { GuideTourService } from '@/modules/guide-tour';

export const HomeLayout = ({ children }: { children: ReactNode }) => {
  const guideService = useModel(GuideTourService);
  const { pathname } = useLocation();

  return (
    <div className={classnames(styles.home, styles.homeBg)}>
      <div className={styles.header}>
        <HeaderComponent />
      </div>
      {/* 防止Tour滚动 */}
      <div
        className={classnames(styles.content, {
          [styles.contentNotScroll]:
            (!guideService.GuidAddNodeRouteTour || !guideService.GuidCreateTaskTour) &&
            pathname === '/guide',
        })}
      >
        {children}
      </div>
    </div>
  );
};
