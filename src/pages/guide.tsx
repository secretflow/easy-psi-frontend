// import { GuidePageLayoutComponent } from '@/modules/guide';
import { HomeLayout } from '@/modules/layout/home-layout';
import { GuideLayout } from '@/modules/layout/guide-layout';

const GuidePage = () => {
  return (
    <HomeLayout>
      <GuideLayout />
    </HomeLayout>
  );
};

export default GuidePage;
