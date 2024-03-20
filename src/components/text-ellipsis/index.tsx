import { Typography } from 'antd';
import React from 'react';
import styles from './index.less';

interface IProps {
  children?: React.ReactNode;
  width?: string | number;
  className?: string;
}

const { Text } = Typography;

export const EllipsisText = (props: IProps) => {
  const { children, width = 180, className } = props;
  if (children === undefined || children === null) {
    return <Typography.Text className={className}>{'--'}</Typography.Text>;
  }
  return (
    <Typography.Text
      ellipsis={{
        tooltip: children,
      }}
      style={{
        maxWidth: width,
      }}
      className={className}
    >
      {children}
    </Typography.Text>
  );
};

export const EllipsisMiddle: React.FC<{ suffixCount: number; children: string }> = ({
  suffixCount,
  children,
}) => {
  let start = children;
  let suffix = '';
  if (children && children?.length > suffixCount) {
    start = children?.slice(0, children?.length - suffixCount)?.trim();
    suffix = children?.slice(-suffixCount)?.trim();
  }
  return (
    <Text className={styles.text} ellipsis={{ suffix, tooltip: children }}>
      {start}
    </Text>
  );
};
