import React, { useState } from 'react';
import { Button, Popconfirm } from 'antd';
import type { ButtonProps } from 'antd';

export interface ConfirmButtonProps extends Omit<ButtonProps, 'onClick'> {
  title: string;
  description?: string;
  onConfirm: () => void | Promise<void>;
  okText?: string;
  cancelText?: string;
  placement?: 'top' | 'left' | 'right' | 'bottom';
  children: React.ReactNode;
}

/**
 * Tasdiqlash so'rovchi tugma komponenti (Popconfirm asosida)
 * Xavfli yoki muhim amallarni bajarishdan oldin tasdiq so'raydi.
 */
export const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  title,
  description,
  onConfirm,
  okText = 'Ha',
  cancelText = "Yo'q",
  placement = 'top',
  danger,
  type = 'default',
  children,
  loading: externalLoading,
  disabled,
  ...buttonProps
}) => {
  const [internalLoading, setInternalLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setInternalLoading(true);
      await onConfirm();
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <Popconfirm
      title={title}
      description={description}
      onConfirm={handleConfirm}
      okText={okText}
      cancelText={cancelText}
      placement={placement}
      okButtonProps={{ danger, loading: externalLoading || internalLoading }}
      disabled={disabled}
    >
      <Button
        danger={danger}
        type={type}
        loading={externalLoading || internalLoading}
        disabled={disabled}
        {...buttonProps}
      >
        {children}
      </Button>
    </Popconfirm>
  );
};
