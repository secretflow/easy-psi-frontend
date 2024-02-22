export enum GuideTourKey {
  MyNodeTour = 'MyNodeTour',
  CreateTaskTour = 'CreateTaskTour',
  AddNodeRouteTour = 'AddNodeRouteTour',
  GuidCreateTaskTour = 'GuidCreateTaskTour',
  GuidAddNodeRouteTour = 'GuidAddNodeRouteTour',
}

/**
 * Manage the status for each step in guide tour
 */
export interface GuideTourServiceProtocol {
  MyNodeTour: boolean;
  CreateTaskTour: boolean;
  AddNodeRouteTour: boolean;
  GuidCreateTaskTour: boolean;
  GuidAddNodeRouteTour: boolean;

  /**
   * Close the step tip in guide.
   * @param key step key
   */
  finish(key: GuideTourKey): void;
}
