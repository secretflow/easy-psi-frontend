import { Model, getModel } from '@/util/valtio-helper';
import { GuideTourKey, GuideTourServiceProtocol } from './types';
import { UserService } from '@/modules/user';

export class GuideTourService extends Model implements GuideTourServiceProtocol {
  userService = getModel(UserService);

  // 默认已经未提示过
  MyNodeTour: boolean = false;
  CreateTaskTour: boolean = !this.userService.userInfo?.noviceUser as boolean;
  AddNodeRouteTour: boolean = !this.userService.userInfo?.noviceUser as boolean;

  // guid tour
  GuidCreateTaskTour: boolean = true;
  GuidAddNodeRouteTour: boolean = true;

  finish(key: GuideTourKey): void {
    this[key] = true;
  }
}
