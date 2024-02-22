import classnames from 'classnames';
import platformConfig from '@/platform.config';
import { NodeRouteList } from '@/modules/node';
import styles from './index.less';
import { TaskListComponent } from '@/modules/task';

export const WorkspaceLayout = () => {
  return (
    <div className={styles.workspaceLayout}>
      {platformConfig.home?.HomePageTitle && (
        <div className={styles.welcome}>{platformConfig.home.HomePageTitle}</div>
      )}

      <div className={styles.content}>
        <div className={classnames(styles.block, styles.left)}>
          <TaskListComponent />
        </div>
        <div className={classnames(styles.block, styles.right)}>
          <NodeRouteList />
        </div>
      </div>
    </div>
  );
};
