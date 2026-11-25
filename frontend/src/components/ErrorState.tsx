import React from 'react';
import { Button, Result } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  extra?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Xatolik holati komponenti (API yoki tarmoq xatosi bo'lganda)
 * Har sahifadagi 4 holatdan (xato holati) biri
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Xatolik yuz berdi",
  message = "Ma'lumotlarni yuklashda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.",
  onRetry,
  extra,
  className,
  style,
}) => {
  return (
    <div
      className={className}
      style={{
        padding: '24px 16px',
        ...style,
      }}
    >
      <Result
        status="error"
        title={title}
        subTitle={message}
        extra={
          extra ||
          (onRetry && (
            <Button type="primary" icon={<ReloadOutlined />} onClick={onRetry}>
              Qayta urinish
            </Button>
          ))
        }
      />
    </div>
  );
};
