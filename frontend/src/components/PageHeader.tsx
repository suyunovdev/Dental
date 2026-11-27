import React from 'react';
import { Breadcrumb, Button, Space, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  extra?: React.ReactNode;
  onBack?: () => void;
  breadcrumbs?: { title: string; href?: string }[];
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Sahifa sarlavhasi komponenti
 * Sarlavha, qisqa tavsif, non ushoqlari (breadcrumbs) va o'ng tarafdagi harakatlar (tugmalar)ni ko'rsatadi
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  extra,
  onBack,
  breadcrumbs,
  className,
  style,
}) => {
  return (
    <div
      className={className}
      style={{
        padding: '16px 24px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        marginBottom: 20,
        ...style,
      }}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb
          style={{ marginBottom: 12 }}
          items={breadcrumbs.map((b) => ({
            title: b.href ? <a href={b.href}>{b.title}</a> : b.title,
          }))}
        />
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <Space orientation="horizontal" align="center" size={12}>
          {onBack && (
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
              aria-label="Orqaga"
            />
          )}
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 600 }}>
              {title}
            </Title>
            {description && (
              <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                {description}
              </Text>
            )}
          </div>
        </Space>

        {extra && <Space wrap size={12}>{extra}</Space>}
      </div>
    </div>
  );
};
