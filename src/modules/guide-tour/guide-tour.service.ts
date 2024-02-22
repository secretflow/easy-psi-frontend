import { Model, getModel } from '@/util/valtio-helper';
import { GuideTourKey, GuideTourServiceProtocol } from './types';
import { LoginService } from '../login/login.service';

export class GuideTourService extends Model implements GuideTourServiceProtocol {
  loginService = getModel(LoginService);

  // 默认已经未提示过
  MyNodeTour: boolean = false;
  CreateTaskTour: boolean = !this.loginService.userInfo?.noviceUser as boolean;
  AddNodeRouteTour: boolean = !this.loginService.userInfo?.noviceUser as boolean;

  // guid tour
  GuidCreateTaskTour: boolean = true;
  GuidAddNodeRouteTour: boolean = true;

  finish(key: GuideTourKey): void {
    this[key] = true;
  }
}
