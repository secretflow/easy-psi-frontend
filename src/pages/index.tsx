// import { GuidePageLayoutComponent } from '@/modules/guide';
import { HomeLayout } from '@/modules/layout/home-layout';
import { WorkspaceLayout } from '@/modules/layout/workspace-layout';

const GuidePage = () => {
  return (
    <HomeLayout>
      <WorkspaceLayout />
    </HomeLayout>
  );
};

export default GuidePage;
