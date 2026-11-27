import React, { useState } from 'react';
import { Card, Col, Divider, Row, Skeleton, Space, Tabs, Typography, message } from 'antd';
import {
  ConfirmButton,
  DateText,
  EmptyState,
  ErrorState,
  MoneyInput,
  MoneyText,
  PageHeader,
  PatientSelect,
  PhoneInput,
  StatusTag,
} from '../../components';

const { Title, Text } = Typography;

/**
 * Komponentlar vitrini (/dev/components)
 * Qabul mezoni: Har bir loyiha komponenti 4 ta holatda (oddiy, xato, o'chirilgan, yuklanmoqda) ko'rsatiladi
 */
export const ComponentsShowcase: React.FC = () => {
  const [phone, setPhone] = useState('+998901234567');
  const [money, setMoney] = useState<number | null>(350000);
  const [patientId, setPatientId] = useState<number | null>(1);

  const nowIso = new Date().toISOString();

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <PageHeader
        title="Loyiha komponentlari vitrini"
        description="F-2 Dental loyihasi uchun umumiy komponentlar va ularning 4 holati"
        breadcrumbs={[
          { title: 'Bosh sahifa', href: '/' },
          { title: 'Dev' },
          { title: 'Komponentlar' },
        ]}
      />

      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        {/* 1. PhoneInput */}
        <Card title="1. PhoneInput (Telefon raqami kiritish)">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Oddiy:</Text>
              <PhoneInput value={phone} onChange={(val) => setPhone(val)} />
              <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
                Qiymat: {phone}
              </Text>
            </Col>
            <Col xs={24} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Xato holati:</Text>
              <PhoneInput status="error" value="123" />
            </Col>
            <Col xs={24} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>O'chirilgan (Disabled):</Text>
              <PhoneInput disabled value="+998901234567" />
            </Col>
            <Col xs={24} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Yuklanmoqda (Skeleton):</Text>
              <Skeleton.Input active block style={{ height: 38 }} />
            </Col>
          </Row>
        </Card>

        {/* 2. MoneyInput */}
        <Card title="2. MoneyInput (Pul kiritish)">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Oddiy:</Text>
              <MoneyInput value={money ?? 0} onChange={(val) => setMoney(val)} />
              <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
                Qiymat: {money} so'm
              </Text>
            </Col>
            <Col xs={24} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Xato holati:</Text>
              <MoneyInput status="error" value={-5000} />
            </Col>
            <Col xs={24} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>O'chirilgan (Disabled):</Text>
              <MoneyInput disabled value={1200000} />
            </Col>
            <Col xs={24} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Yuklanmoqda (Skeleton):</Text>
              <Skeleton.Input active block style={{ height: 38 }} />
            </Col>
          </Row>
        </Card>

        {/* 3. MoneyText */}
        <Card title="3. MoneyText (Pul ko'rsatish)">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Oddiy:</Text>
              <MoneyText amount={350000} />
            </Col>
            <Col xs={24} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Manfiy / Qaytarish (Rangli):</Text>
              <MoneyText amount={-50000} colorize bold />
            </Col>
            <Col xs={24} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Katta summa (Rangli):</Text>
              <MoneyText amount={4500000} colorize bold />
            </Col>
            <Col xs={24} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Yuklanmoqda (Skeleton):</Text>
              <Skeleton.Button active size="small" style={{ width: 100 }} />
            </Col>
          </Row>
        </Card>

        {/* 4. DateText */}
        <Card title="4. DateText (Toshkent vaqti)">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Faqat sana:</Text>
              <DateText value={nowIso} />
            </Col>
            <Col xs={24} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Sana va vaqt:</Text>
              <DateText value={nowIso} withTime />
            </Col>
            <Col xs={24} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Faqat vaqt:</Text>
              <DateText value={nowIso} onlyTime />
            </Col>
            <Col xs={24} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Yuklanmoqda (Skeleton):</Text>
              <Skeleton.Button active size="small" style={{ width: 80 }} />
            </Col>
          </Row>
        </Card>

        {/* 5. StatusTag */}
        <Card title="5. StatusTag (Status va turlar)">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Qabul statuslari:</Text>
              <Space wrap>
                <StatusTag type="appointment" value="SCHEDULED" />
                <StatusTag type="appointment" value="ARRIVED" />
                <StatusTag type="appointment" value="IN_PROGRESS" />
                <StatusTag type="appointment" value="COMPLETED" />
                <StatusTag type="appointment" value="CANCELLED" />
                <StatusTag type="appointment" value="NO_SHOW" />
              </Space>
            </Col>
            <Col xs={24} md={8}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Tish holatlari (FDI kodi bilan):</Text>
              <Space wrap>
                <StatusTag type="tooth" value="HEALTHY" showCode />
                <StatusTag type="tooth" value="CARIES" showCode />
                <StatusTag type="tooth" value="FILLED" showCode />
                <StatusTag type="tooth" value="PULPITIS" showCode />
                <StatusTag type="tooth" value="PERIODONTITIS" showCode />
                <StatusTag type="tooth" value="CROWN" showCode />
                <StatusTag type="tooth" value="IMPLANT" showCode />
              </Space>
            </Col>
            <Col xs={24} md={8}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Rollar va to'lov turlari:</Text>
              <Space wrap>
                <StatusTag type="role" value="ADMIN" />
                <StatusTag type="role" value="DOCTOR" />
                <StatusTag type="role" value="RECEPTIONIST" />
                <StatusTag type="role" value="CASHIER" />
                <StatusTag type="paymentType" value="PAYMENT" />
                <StatusTag type="paymentType" value="REFUND" />
              </Space>
            </Col>
          </Row>
        </Card>

        {/* 6. PatientSelect */}
        <Card title="6. PatientSelect (Bemorni qidiruvli tanlash)">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Oddiy:</Text>
              <PatientSelect
                value={patientId}
                onChange={(id) => setPatientId(id)}
                onCreateNew={() => message.info("Yangi bemor qo'shish oynasi ochiladi")}
              />
            </Col>
            <Col xs={24} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Xato holati:</Text>
              <PatientSelect status="error" placeholder="Bemor tanlanishi shart" />
            </Col>
            <Col xs={24} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>O'chirilgan (Disabled):</Text>
              <PatientSelect disabled value={1} />
            </Col>
            <Col xs={24} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Yuklanmoqda (Skeleton):</Text>
              <Skeleton.Input active block style={{ height: 38 }} />
            </Col>
          </Row>
        </Card>

        {/* 7. ConfirmButton */}
        <Card title="7. ConfirmButton (Tasdiqlash so'rovchi tugma)">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Oddiy:</Text>
              <ConfirmButton
                title="Qabulni bekor qilmoqchimisiz?"
                description="Ushbu amalni ortga qaytarib bo'lmaydi."
                danger
                onConfirm={() => message.success('Bekor qilindi')}
              >
                Qabulni bekor qilish
              </ConfirmButton>
            </Col>
            <Col xs={24} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Yuklanmoqda (Loading):</Text>
              <ConfirmButton
                title="Tasdiqlash"
                loading
                onConfirm={() => {}}
              >
                Yuklanmoqda
              </ConfirmButton>
            </Col>
            <Col xs={24} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>O'chirilgan (Disabled):</Text>
              <ConfirmButton
                title="Tasdiqlash"
                disabled
                onConfirm={() => {}}
              >
                Nofaol tugma
              </ConfirmButton>
            </Col>
            <Col xs={24} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Skeleton:</Text>
              <Skeleton.Button active style={{ height: 38 }} />
            </Col>
          </Row>
        </Card>

        {/* 8. EmptyState va ErrorState */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="8. EmptyState (Bo'sh holat)">
              <EmptyState
                title="Bemorlar ro'yxati bo'sh"
                description="Hozircha hech qanday bemor kiritilmagan."
              />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="9. ErrorState (Xatolik holati)">
              <ErrorState
                title="Tarmoq xatosi"
                message="Server bilan ulanish uzildi. Qaytadan urinib ko'ring."
                onRetry={() => message.loading("Qayta yuklanmoqda...")}
              />
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default ComponentsShowcase;
