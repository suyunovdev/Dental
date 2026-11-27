import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Space,
  Typography,
  message,
} from 'antd';
import {
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  ApiError,
  checkPhone,
  createPatient,
  updatePatient,
  type CreatePatientDto,
  type Patient,
  type PatientShort,
  type UpdatePatientDto,
} from '../../api/patients';
import { PhoneInput } from '../../components/PhoneInput';
import { formatPhone } from '../../lib/format';
import type { Role } from '../../lib/labels';

const { Text } = Typography;
const { TextArea } = Input;

export interface PatientFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (patient: Patient) => void;
  onOpenCard?: (patientId: number) => void;
  initialData?: Patient | null;
  currentUserRole?: Role;
}

interface FormValues {
  lastName: string;
  firstName: string;
  middleName?: string;
  birthDate?: dayjs.Dayjs;
  gender?: 'MALE' | 'FEMALE';
  phone: string;
  phone2?: string;
  address?: string;
  allergies?: string;
  note?: string;
}

/**
 * Bemor yaratish va tahrirlash modali
 * Arxitektura va TZ (T-22) talablari:
 * 1. familiya*, ism*, otasining ismi, tug'ilgan sana (kelajak tanlanmaydi), jinsi, telefon* (+998), qo'shimcha telefon, manzil, allergiya, izoh
 * 2. Telefon onBlur da checkPhone tekshiruvi -> sariq ogohlantirish (oila a'zolari bir xil raqamdan foydalanishi mumkin)
 * 3. 409 PATIENT_DUPLICATE -> "Bu bemor allaqachon bor" + "Kartani ochish" havolasi
 * 4. DOCTOR tahrirlaganda faqat "Allergiya" maydoni faol
 */
export const PatientFormModal: React.FC<PatientFormModalProps> = ({
  open,
  onClose,
  onSuccess,
  onOpenCard,
  initialData,
  currentUserRole = 'ADMIN',
}) => {
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [phoneChecking, setPhoneChecking] = useState(false);
  const [matchingPatients, setMatchingPatients] = useState<PatientShort[]>([]);
  const [duplicateError, setDuplicateError] = useState<{
    message: string;
    existingPatientId?: number;
  } | null>(null);

  const isEditing = Boolean(initialData);
  const isDoctor = currentUserRole === 'DOCTOR';
  // DOCTOR tahrirlaganda faqat allergiya maydoni faol, boshqalar o'chirilgan
  const isNonAllergyDisabled = isEditing && isDoctor;

  useEffect(() => {
    if (open) {
      setMatchingPatients([]);
      setDuplicateError(null);

      if (initialData) {
        form.setFieldsValue({
          lastName: initialData.lastName,
          firstName: initialData.firstName,
          middleName: initialData.middleName || undefined,
          birthDate: initialData.birthDate ? dayjs(initialData.birthDate) : undefined,
          gender: initialData.gender || undefined,
          phone: initialData.phone,
          phone2: initialData.phone2 || undefined,
          address: initialData.address || undefined,
          allergies: initialData.allergies || undefined,
          note: initialData.note || undefined,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, initialData, form]);

  // Telefon kiritilgach (onBlur) check-phone tekshiruvi
  const handlePhoneBlur = async () => {
    const phoneVal = form.getFieldValue('phone');
    if (!phoneVal || phoneVal.replace(/\D/g, '').length < 9) {
      setMatchingPatients([]);
      return;
    }

    try {
      setPhoneChecking(true);
      const results = await checkPhone(phoneVal);
      // Agar tahrirlanayotgan bo'lsa, o'zini ro'yxatdan chiqarib tashlaymiz
      const filtered = initialData ? results.filter((p) => p.id !== initialData.id) : results;
      setMatchingPatients(filtered);
    } catch {
      setMatchingPatients([]);
    } finally {
      setPhoneChecking(false);
    }
  };

  const handleFinish = async (values: FormValues) => {
    setLoading(true);
    setDuplicateError(null);

    const payload: CreatePatientDto = {
      lastName: values.lastName.trim(),
      firstName: values.firstName.trim(),
      middleName: values.middleName?.trim() || null,
      birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null,
      gender: values.gender || null,
      phone: values.phone,
      phone2: values.phone2 || null,
      address: values.address?.trim() || null,
      allergies: values.allergies?.trim() || null,
      note: values.note?.trim() || null,
    };

    try {
      let saved: Patient;
      if (isEditing && initialData) {
        const updatePayload: UpdatePatientDto = isDoctor
          ? { allergies: payload.allergies }
          : payload;

        saved = await updatePatient(initialData.id, updatePayload, currentUserRole);
        message.success("Bemor ma'lumotlari muvaffaqiyatli yangilandi");
      } else {
        saved = await createPatient(payload);
        message.success("Yangi bemor muvaffaqiyatli ro'yxatga olindi");
      }

      onSuccess(saved);
      onClose();
    } catch (err: unknown) {
      if (err instanceof ApiError && err.code === 'PATIENT_DUPLICATE') {
        const existingId = err.details?.existingPatientId as number | undefined;
        setDuplicateError({
          message: err.message,
          existingPatientId: existingId,
        });
      } else if (err instanceof Error) {
        message.error(err.message);
      } else {
        message.error("Ma'lumotni saqlashda kutilmagan xatolik yuz berdi");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <UserOutlined style={{ orientation: 'initial' }} />
          <span>{isEditing ? "Bemor ma'lumotlarini tahrirlash" : 'Yangi bemor qo\'shish'}</span>
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={680}
      destroyOnClose
    >
      {/* 409 PATIENT_DUPLICATE ogohlantirishi va Kartani ochish havolasi */}
      {duplicateError && (
        <Alert
          type="error"
          showIcon
          icon={<ExclamationCircleOutlined />}
          style={{ marginBottom: 16 }}
          message={duplicateError.message}
          description={
            duplicateError.existingPatientId && onOpenCard ? (
              <div style={{ marginTop: 8 }}>
                <Button
                  type="primary"
                  danger
                  size="small"
                  onClick={() => {
                    onClose();
                    onOpenCard(duplicateError.existingPatientId!);
                  }}
                >
                  Mavjud bemor kartasini ochish
                </Button>
              </div>
            ) : null
          }
        />
      )}

      {/* Bir xil telefon bo'yicha sariq ogohlantirish (oila a'zolari) */}
      {matchingPatients.length > 0 && (
        <Alert
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: 16 }}
          message={
            <span>
              Bu raqamda {matchingPatients.length} ta bemor mavjud:{' '}
              <b>{matchingPatients.map((p) => p.fullName).join(', ')}</b>
            </span>
          }
          description="Eslatma: bu xato emas. Oila a'zolari (masalan, ota-ona va bolalar) bir xil raqamdan foydalanishi mumkin."
        />
      )}

      {/* Shifokor roli uchun eslatma */}
      {isDoctor && isEditing && (
        <Alert
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          style={{ marginBottom: 16 }}
          message="Shifokor faqat bemorning allergiya va muhim kasalliklar maydonini tahrirlashi mumkin."
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ gender: undefined }}
        requiredMark="optional"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          {/* Familiya* */}
          <Form.Item
            name="lastName"
            label="Familiya"
            rules={[{ required: !isNonAllergyDisabled, message: 'Familiyani kiriting' }]}
          >
            <Input placeholder="Masalan: Karimova" disabled={isNonAllergyDisabled} />
          </Form.Item>

          {/* Ism* */}
          <Form.Item
            name="firstName"
            label="Ism"
            rules={[{ required: !isNonAllergyDisabled, message: 'Ismni kiriting' }]}
          >
            <Input placeholder="Masalan: Dilnoza" disabled={isNonAllergyDisabled} />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          {/* Otasining ismi */}
          <Form.Item name="middleName" label="Otasining ismi (ixtiyoriy)">
            <Input placeholder="Masalan: Sobirovna" disabled={isNonAllergyDisabled} />
          </Form.Item>

          {/* Jinsi */}
          <Form.Item name="gender" label="Jinsi">
            <Radio.Group disabled={isNonAllergyDisabled}>
              <Radio value="FEMALE">Ayol</Radio>
              <Radio value="MALE">Erkak</Radio>
            </Radio.Group>
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          {/* Asosiy telefon* */}
          <Form.Item
            name="phone"
            label="Asosiy telefon"
            rules={[{ required: !isNonAllergyDisabled, message: 'Telefon raqamini kiriting' }]}
            help={phoneChecking ? 'Telefon raqami tekshirilmoqda...' : undefined}
          >
            <PhoneInput
              placeholder="90 123 45 67"
              disabled={isNonAllergyDisabled}
              onBlur={handlePhoneBlur}
            />
          </Form.Item>

          {/* Qo'shimcha telefon */}
          <Form.Item name="phone2" label="Qo'shimcha telefon (ixtiyoriy)">
            <PhoneInput placeholder="93 555 44 33" disabled={isNonAllergyDisabled} />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          {/* Tug'ilgan sana (kelajak sanalar tanlanmaydi) */}
          <Form.Item name="birthDate" label="Tug'ilgan sana">
            <DatePicker
              style={{ width: '100%' }}
              placeholder="KK.OO.YYYY"
              format="DD.MM.YYYY"
              disabledDate={(current) => current && current > dayjs().endOf('day')}
              disabled={isNonAllergyDisabled}
            />
          </Form.Item>

          {/* Manzil */}
          <Form.Item name="address" label="Yashash manzili">
            <Input
              placeholder="Toshkent sh., Yunusobod..."
              disabled={isNonAllergyDisabled}
            />
          </Form.Item>
        </div>

        {/* Allergiya va muhim kasalliklar (Har doim faol va muhim) */}
        <Form.Item
          name="allergies"
          label={
            <span>
              Allergiya va muhim kasalliklar{' '}
              <Text type="danger" style={{ fontSize: 12 }}>
                (Diqqat: bemor kartasi va tashrifda qizil bilan ko'rinadi)
              </Text>
            </span>
          }
        >
          <TextArea
            rows={2}
            placeholder="Masalan: Lidokain, Penitsillin yoki qon bosimi kasalligi..."
          />
        </Form.Item>

        {/* Izoh */}
        <Form.Item name="note" label="Qo'shimcha izoh">
          <TextArea
            rows={2}
            placeholder="Bemor haqida qo'shimcha eslatmalar..."
            disabled={isNonAllergyDisabled}
          />
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
          <Button onClick={onClose} disabled={loading}>
            Bekor qilish
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEditing ? 'Saqlash' : 'Bemor qo\'shish'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
