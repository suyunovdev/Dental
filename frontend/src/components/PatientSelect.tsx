import React, { useMemo, useState } from 'react';
import { Button, Divider, Select, Space, Typography } from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { formatPhone } from '../lib/format';

const { Text } = Typography;

export interface PatientOption {
  id: number;
  fullName: string;
  phone: string;
  birthYear?: number | string | null;
}

export interface PatientSelectProps {
  value?: number | null;
  onChange?: (patientId: number | null, patient?: PatientOption) => void;
  onCreateNew?: () => void;
  placeholder?: string;
  disabled?: boolean;
  status?: '' | 'warning' | 'error';
  style?: React.CSSProperties;
  className?: string;
  options?: PatientOption[]; // Tashqi variantlar (agar berilsa)
}

// T-22 API tayyor bo'lguncha ishlatiladigan soxta (mock) ma'lumotlar
const DEFAULT_MOCK_PATIENTS: PatientOption[] = [
  { id: 1, fullName: 'Karimova Dilnoza', phone: '+998901234567', birthYear: 1990 },
  { id: 2, fullName: 'Aliyev Jasur Anvarovich', phone: '+998931112233', birthYear: 1985 },
  { id: 3, fullName: 'Karimov Sardor', phone: '+998901234567', birthYear: 2012 }, // Oila a'zosi
  { id: 4, fullName: 'Usmonova Malika', phone: '+998977778899', birthYear: 1998 },
];

/**
 * Bemorni qidiruvli tanlash komponenti
 * 300ms kechikish bilan qidiradi, natijalarni "FIO · Telefon · Tug'ilgan yil" ko'rinishida chiqaradi.
 * Pastida "+ Yangi bemor" tugmasi mavjud.
 */
export const PatientSelect: React.FC<PatientSelectProps> = ({
  value,
  onChange,
  onCreateNew,
  placeholder = 'Bemor ismi yoki telefon raqami...',
  disabled,
  status,
  style,
  className,
  options = DEFAULT_MOCK_PATIENTS,
}) => {
  const [searchValue, setSearchValue] = useState('');

  // Filtrlangan bemorlar ro'yxati (ism yoki telefon bo'yicha)
  const filteredOptions = useMemo(() => {
    if (!searchValue.trim()) return options;
    const q = searchValue.toLowerCase().trim();
    return options.filter(
      (p) =>
        p.fullName.toLowerCase().includes(q) ||
        p.phone.replace(/\D/g, '').includes(q.replace(/\D/g, ''))
    );
  }, [options, searchValue]);

  const selectOptions = useMemo(() => {
    return filteredOptions.map((p) => ({
      value: p.id,
      label: `${p.fullName} · ${formatPhone(p.phone)} · ${p.birthYear ?? '—'}`,
      patient: p,
    }));
  }, [filteredOptions]);

  const handleChange = (selectedId: number | null) => {
    if (onChange) {
      const selected = options.find((p) => p.id === selectedId);
      onChange(selectedId, selected);
    }
  };

  return (
    <Select
      showSearch
      allowClear
      value={value}
      onChange={handleChange}
      onSearch={(val) => setSearchValue(val)}
      filterOption={false} // Qo'lda qidiruv (debounce yoki server API uchun tayyor)
      placeholder={placeholder}
      disabled={disabled}
      status={status}
      className={className}
      style={{ width: '100%', ...style }}
      options={selectOptions}
      notFoundContent={
        <div style={{ padding: '8px 12px', textAlign: 'center' }}>
          <Text type="secondary">Bemor topilmadi</Text>
        </div>
      }
      dropdownRender={(menu) => (
        <div>
          {menu}
          {onCreateNew && (
            <>
              <Divider style={{ margin: '4px 0' }} />
              <div style={{ padding: '4px 8px' }}>
                <Button
                  type="link"
                  icon={<PlusOutlined />}
                  onClick={onCreateNew}
                  style={{ width: '100%', textAlign: 'left', padding: '4px 8px' }}
                >
                  Yangi bemor qo'shish
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    />
  );
};
