import React from 'react';
import { InputNumber } from 'antd';
import type { InputNumberProps } from 'antd';

export interface MoneyInputProps extends Omit<InputNumberProps<number>, 'precision' | 'formatter' | 'parser'> {
  value?: number;
  onChange?: (value: number | null) => void;
  addonAfter?: React.ReactNode;
}

/**
 * Pul summasini kiritish komponenti
 * Faqat butun sonlarni qabul qiladi, mingliklarni probel bilan ajratadi va "so'm" qo'shimchasini ko'rsatadi.
 */
export const MoneyInput: React.FC<MoneyInputProps> = ({
  value,
  onChange,
  disabled,
  placeholder = '0',
  min = 0,
  addonAfter = "so'm",
  style,
  ...rest
}) => {
  return (
    <InputNumber<number>
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      min={min}
      precision={0} // Butun son (arxitektura.md Q5)
      addonAfter={addonAfter}
      formatter={(val) => {
        if (val === undefined || val === null || val === '') return '';
        return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      }}
      parser={(displayValue) => {
        if (!displayValue) return 0;
        const clean = displayValue.replace(/[^\d-]/g, '');
        return clean ? parseInt(clean, 10) : 0;
      }}
      style={{ width: '100%', ...style }}
      {...rest}
    />
  );
};
