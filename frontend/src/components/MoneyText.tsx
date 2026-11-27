import React from 'react';
import { Typography } from 'antd';
import { formatMoney } from '../lib/format';

const { Text } = Typography;

export interface MoneyTextProps {
  amount: number;
  colorize?: boolean;
  bold?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Pul miqdorini matn ko'rinishida ko'rsatuvchi komponent
 * Mingliklarni ajratadi va "so'm" qo'shimchasini chiqaradi.
 * Masalan: 350000 -> "350 000 so'm"
 */
export const MoneyText: React.FC<MoneyTextProps> = ({
  amount,
  colorize = false,
  bold = false,
  className,
  style,
}) => {
  const formatted = formatMoney(amount);

  let textColor: string | undefined;
  if (colorize) {
    if (amount > 0) textColor = '#16a34a'; // Yashil
    else if (amount < 0) textColor = '#dc2626'; // Qizil
    else textColor = '#64748b'; // Neytral kulrang
  }

  return (
    <Text
      strong={bold}
      className={className}
      style={{
        color: textColor,
        fontVariantNumeric: 'tabular-nums',
        ...style,
      }}
    >
      {formatted}
    </Text>
  );
};
