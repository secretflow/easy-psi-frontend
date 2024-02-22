import dayjs from 'dayjs';

// export const formatTimestamp = (timestamp?: string) => {
//   if (!timestamp) return timestamp;
//   const time = new Date(timestamp);
//   return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
// };

// Attention：In order to fix the bug from backend；should be fixed later
export const formatTimestamp = (timestamp?: string) => {
  if (!timestamp) return timestamp;
  const min = new Date(timestamp).getTime() / 1000 / 60;
  const localNow = new Date().getTimezoneOffset();

  const localTime = min - localNow;

  return dayjs(new Date(localTime * 1000 * 60)).format('YYYY-MM-DD HH:mm:ss');
};

export const getTimeCost = (createTime: string, finishedTime: string) => {
  const start = new Date(createTime);
  const end = new Date(finishedTime);
  const timeDiff = end.getTime() - start.getTime();
  const hours = Math.floor(timeDiff / (3600 * 1000));
  const hourLeft = timeDiff % (3600 * 1000);
  const minutes = Math.floor(hourLeft / (60 * 1000));
  const minLeft = timeDiff % (60 * 1000);
  const seconds = Math.floor(minLeft / 1000);

  if (hours !== 0) return `${hours}h ${minutes}min ${seconds}s`;
  if (minutes !== 0) return `${minutes}min ${seconds}s`;
  return `${seconds}s`;
};
