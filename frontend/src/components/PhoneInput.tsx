import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import type { InputProps } from 'antd';
import { normalizePhone } from '../lib/format';

export interface PhoneInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: string;
  onChange?: (normalizedPhone: string) => void;
}

/**
 * 9 ta raqamni "90 123 45 67" ko'rinishida formatlaydi
 */
function formatLocalDigits(digits: string): string {
  const clean = digits.replace(/\D/g, '').slice(0, 9);
  const parts: string[] = [];

  if (clean.length > 0) parts.push(clean.slice(0, 2));
  if (clean.length > 2) parts.push(clean.slice(2, 5));
  if (clean.length > 5) parts.push(clean.slice(5, 7));
  if (clean.length > 7) parts.push(clean.slice(7, 9));

  return parts.join(' ');
}

/**
 * Telefon raqami kiritish komponenti
 * +998 prefiksi va "90 123 45 67" maskasi bilan ta'minlaydi.
 * Tashqariga doim normallashtirilgan (+998XXXXXXXXX) qiymatni qaytaradi.
 */
export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  disabled,
  status,
  placeholder = '90 123 45 67',
  ...rest
}) => {
  const [displayValue, setDisplayValue] = useState<string>('');

  // Tashqi value o'zgarganda ichki ko'rinishni yangilaymiz
  useEffect(() => {
    if (!value) {
      setDisplayValue('');
      return;
    }

    // Agar +998 bilan kelgan bo'lsa, oxirgi 9 ta raqamini olamiz
    const digits = value.replace(/\D/g, '');
    const localPart = digits.startsWith('998') ? digits.slice(3) : digits;
    setDisplayValue(formatLocalDigits(localPart));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    const digits = inputVal.replace(/\D/g, '').slice(0, 9);
    const formatted = formatLocalDigits(digits);
    setDisplayValue(formatted);

    if (onChange) {
      if (digits.length === 0) {
        onChange('');
      } else {
        const normalized = normalizePhone(digits);
        onChange(normalized ?? `+998${digits}`);
      }
    }
  };

  return (
    <Input
      addonBefore="+998"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      maxLength={12} // 9 raqam + 3 probel
      disabled={disabled}
      status={status}
      style={{ width: '100%' }}
      {...rest}
    />
  );
};
