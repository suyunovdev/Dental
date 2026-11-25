import type { ThemeConfig } from 'antd';

/**
 * Dental platformasi (F-2) — Ant Design 6 temasi va Sanjar UI kit tokenlari
 * Arxitektura talabi: arxitektura.md 5-bo'lim va TZ T-13 1-band
 */
export const theme: ThemeConfig = {
  token: {
    // Asosiy brend ranglari (stomatologiya klinikasi uchun tibbiy ko'k/feruza)
    colorPrimary: '#0ea5e9',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#0ea5e9',

    // Tipografika va shriftlar
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontSize: 14,
    fontSizeHeading1: 28,
    fontSizeHeading2: 24,
    fontSizeHeading3: 20,
    fontSizeHeading4: 16,

    // Geometriya va o'lchamlar
    borderRadius: 8,
    controlHeight: 38,
    controlHeightLG: 44,
    controlHeightSM: 32,

    // Fon va chegaralar
    colorBgContainer: '#ffffff',
    colorBorder: '#e2e8f0',
    colorBorderSecondary: '#f1f5f9',
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 38,
      fontWeight: 500,
    },
    Table: {
      headerBg: '#f8fafc',
      headerColor: '#1e293b',
      borderRadius: 8,
      rowHoverBg: '#f1f5f9',
    },
    Card: {
      borderRadiusLG: 12,
    },
    Modal: {
      borderRadiusLG: 12,
      headerBg: '#ffffff',
    },
    Input: {
      borderRadius: 8,
      controlHeight: 38,
    },
    Select: {
      borderRadius: 8,
      controlHeight: 38,
    },
    Tag: {
      borderRadiusSM: 6,
    },
  },
};
