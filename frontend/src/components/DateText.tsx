import React from 'react';
import { Typography } from 'antd';
import { formatDate, formatDateTime, formatTime } from '../lib/format';

const { Text } = Typography;

export interface DateTextProps {
  value: Date | string | number | null | undefined;
  withTime?: boolean;
  onlyTime?: boolean;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Sanani Toshkent vaqti (Asia/Tashkent UTC+5) bo'yicha ko'rsatuvchi komponent
 */
export const DateText: React.FC<DateTextProps> = ({
  value,
  withTime = false,
  onlyTime = false,
  placeholder = '—',
  className,
  style,
}) => {
  if (!value) {
    return <Text type="secondary" className={className} style={style}>{placeholder}</Text>;
  }

  let formatted = '';
  if (onlyTime) {
    formatted = formatTime(value);
  } else if (withTime) {
    formatted = formatDateTime(value);
  } else {
    formatted = formatDate(value);
  }

  return (
    <Text
      className={className}
      style={{ fontVariantNumeric: 'tabular-nums', ...style }}
    >
      {formatted || placeholder}
    </Text>
  );
};
