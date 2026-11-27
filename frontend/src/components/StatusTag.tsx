import React from 'react';
import { Tag } from 'antd';
import {
  APPOINTMENT_STATUS_MAP,
  TOOTH_STATUS_MAP,
  VISIT_STATUS_MAP,
  PLAN_STATUS_MAP,
  PLAN_ITEM_STATUS_MAP,
  PAYMENT_TYPE_MAP,
  PAYMENT_METHOD_MAP,
  ROLE_MAP,
  AppointmentStatus,
  ToothStatus,
  VisitStatus,
  PlanStatus,
  PlanItemStatus,
  PaymentType,
  PaymentMethod,
  Role,
} from '../lib/labels';

export type StatusType =
  | 'appointment'
  | 'tooth'
  | 'visit'
  | 'plan'
  | 'planItem'
  | 'paymentType'
  | 'paymentMethod'
  | 'role';

export interface StatusTagProps {
  type: StatusType;
  value: string;
  showCode?: boolean; // Tish holati uchun FDI kodini ham ko'rsatish
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Loyihadagi barcha status va turlarni yagona ko'rinishda ko'rsatuvchi Tag komponenti
 * Ranglar va o'zbekcha nomlar Sanjarning tokenlari (docs/dizayn/tokenlar.md) va labels.ts dan olinadi
 */
export const StatusTag: React.FC<StatusTagProps> = ({
  type,
  value,
  showCode = false,
  className,
  style,
}) => {
  let label: string = value;
  let textColor: string = '#4B5563';
  let bgColor: string = '#F3F4F6';
  let borderColor: string = '#D1D5DB';

  switch (type) {
    case 'appointment': {
      const meta = APPOINTMENT_STATUS_MAP[value as AppointmentStatus];
      if (meta) {
        label = meta.label;
        textColor = meta.textColor || meta.color;
        bgColor = meta.bgColor;
        borderColor = meta.borderColor;
      }
      break;
    }
    case 'tooth': {
      const meta = TOOTH_STATUS_MAP[value as ToothStatus];
      if (meta) {
        label = showCode && meta.code !== '—' ? `${meta.code} · ${meta.label}` : meta.label;
        textColor = meta.textColor || meta.color;
        bgColor = meta.bgColor;
        borderColor = meta.borderColor;
      }
      break;
    }
    case 'visit': {
      const meta = VISIT_STATUS_MAP[value as VisitStatus];
      if (meta) {
        label = meta.label;
        textColor = meta.textColor || meta.color;
        bgColor = meta.bgColor;
        borderColor = meta.borderColor;
      }
      break;
    }
    case 'plan': {
      const meta = PLAN_STATUS_MAP[value as PlanStatus];
      if (meta) {
        label = meta.label;
        textColor = meta.textColor || meta.color;
        bgColor = meta.bgColor;
        borderColor = meta.borderColor;
      }
      break;
    }
    case 'planItem': {
      const meta = PLAN_ITEM_STATUS_MAP[value as PlanItemStatus];
      if (meta) {
        label = meta.label;
        textColor = meta.textColor || meta.color;
        bgColor = meta.bgColor;
        borderColor = meta.borderColor;
      }
      break;
    }
    case 'paymentType': {
      const meta = PAYMENT_TYPE_MAP[value as PaymentType];
      if (meta) {
        label = meta.label;
        textColor = meta.textColor || meta.color;
        bgColor = meta.bgColor;
        borderColor = meta.borderColor;
      }
      break;
    }
    case 'paymentMethod': {
      const meta = PAYMENT_METHOD_MAP[value as PaymentMethod];
      if (meta) {
        label = meta.label;
        textColor = meta.textColor || meta.color;
        bgColor = meta.bgColor;
        borderColor = meta.borderColor;
      }
      break;
    }
    case 'role': {
      const meta = ROLE_MAP[value as Role];
      if (meta) {
        label = meta.label;
        textColor = meta.textColor || meta.color;
        bgColor = meta.bgColor;
        borderColor = meta.borderColor;
      }
      break;
    }
  }

  return (
    <Tag
      className={className}
      style={{
        borderRadius: 4,
        color: textColor,
        backgroundColor: bgColor,
        borderColor: borderColor,
        fontWeight: 500,
        ...style,
      }}
    >
      {label}
    </Tag>
  );
};
