import type { ThemeConfig } from 'antd';

/**
 * Dental platformasi (F-2) — Ant Design 6 temasi va Sanjarning dizayn tokenlari
 * Arxitektura va dizayn talabi:
 * - docs/dizayn/tokenlar.md (T-12, PR #18)
 * - Mentor tavsiyasi: colorPrimaryHover uchun #115E59 (7.58:1) va colorPrimaryActive uchun #134E4A (9.48:1)
 *   (WCAG AA kamida 4.5:1 kontrast mezoniga to'liq mos kelish uchun)
 */
export const getClinicTheme = (isTablet = false): ThemeConfig => ({
  token: {
    // 2.1 Asosiy va semantik ranglar (medical teal brendi)
    colorPrimary: '#0F766E',
    colorPrimaryHover: '#115E59',
    colorPrimaryActive: '#134E4A',
    colorPrimaryBg: '#F0FDFA',
    colorSuccess: '#15803D',
    colorSuccessBg: '#F0FDF4',
    colorWarning: '#B45309',
    colorWarningBg: '#FFFBEB',
    colorError: '#DC2626',
    colorErrorBg: '#FEF2F2',
    colorInfo: '#0369A1',
    colorInfoBg: '#F0F9FF',

    // 2.2 Neytral ranglar (matn, chegara, fon)
    colorText: '#111827',
    colorTextSecondary: '#4B5563',
    colorTextTertiary: '#6B7280',
    colorTextDisabled: '#9CA3AF',
    colorBorder: '#D1D5DB',
    colorBorderSecondary: '#E5E7EB',
    colorBgLayout: '#F8FAFC',
    colorBgContainer: '#FFFFFF',
    colorBgElevated: '#FFFFFF',
    colorFillAlter: '#F9FAFB',

    // 2.3 Tipografiya, o'lcham va bo'shliqlar
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontSize: 14,
    fontSizeSM: 12,
    fontSizeLG: 16,
    fontSizeHeading1: 30,
    fontSizeHeading2: 24,
    fontSizeHeading3: 20,
    fontSizeHeading4: 16,

    borderRadius: 6,
    borderRadiusSM: 4,
    borderRadiusLG: 8,
    controlHeight: isTablet ? 40 : 32,
    controlHeightLG: 40,
    controlHeightSM: 24,
    wireframe: false,
  },
  components: {
    Layout: {
      siderBg: '#FFFFFF',
      headerBg: '#FFFFFF',
      bodyBg: '#F8FAFC',
    },
    Menu: {
      itemSelectedBg: '#F0FDFA',
      itemSelectedColor: '#0F766E',
    },
    Table: {
      headerBg: '#F9FAFB',
      headerColor: '#4B5563',
      borderColor: '#E5E7EB',
    },
    Card: {
      borderRadiusLG: 8,
    },
    Modal: {
      borderRadiusLG: 8,
      headerBg: '#FFFFFF',
    },
    Button: {
      borderRadius: 6,
      controlHeight: isTablet ? 40 : 32,
      fontWeight: 500,
    },
    Input: {
      borderRadius: 6,
      controlHeight: isTablet ? 40 : 32,
    },
    Select: {
      borderRadius: 6,
      controlHeight: isTablet ? 40 : 32,
    },
    Tag: {
      borderRadiusSM: 4,
    },
  },
});

export const theme: ThemeConfig = getClinicTheme();
