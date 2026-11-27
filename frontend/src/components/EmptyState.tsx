import React from 'react';
import { Empty, Typography } from 'antd';

const { Text } = Typography;

export interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  image?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Bo'sh holat komponenti (ro'yxat yoki ma'lumot bo'lmaganda)
 * Har sahifada 4 holatdan (bo'sh holat) biri sifatida ishlatiladi
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Ma'lumot topilmadi",
  description,
  action,
  image = Empty.PRESENTED_IMAGE_SIMPLE,
  className,
  style,
}) => {
  return (
    <div
      className={className}
      style={{
        padding: '32px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <Empty
        image={image}
        description={
          <div>
            <div style={{ fontWeight: 500, fontSize: 15, color: '#334155' }}>
              {title}
            </div>
            {description && (
              <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                {description}
              </Text>
            )}
          </div>
        }
      >
        {action}
      </Empty>
    </div>
  );
};
