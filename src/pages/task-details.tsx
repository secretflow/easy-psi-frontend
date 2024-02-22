import { HomeLayout } from '@/modules/layout/home-layout';
import { TaskDetailsLayout } from '@/modules/task-details';

const TaskDetailsPage = () => {
  return (
    <HomeLayout>
      <TaskDetailsLayout />
    </HomeLayout>
  );
};

export default TaskDetailsPage;
