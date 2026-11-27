import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Checkbox,
  Input,
  Skeleton,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  FolderOutlined,
  InboxOutlined,
  MedicineBoxOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  archivePatient,
  getPatients,
  unarchivePatient,
  type Patient,
} from '../../api/patients';
import { ConfirmButton } from '../../components/ConfirmButton';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { PageHeader } from '../../components/PageHeader';
import { formatPhone, getAge } from '../../lib/format';
import type { Role } from '../../lib/labels';
import { useTableParams } from '../../lib/useTableParams';
import { PatientFormModal } from './PatientFormModal';

const { Text } = Typography;

export interface PatientsPageProps {
  currentUserRole?: Role;
  onOpenPatientCard?: (patientId: number) => void;
}

/**
 * Bemorlar ro'yxati sahifasi (/patients)
 * Arxitektura va TZ (T-22) talablari:
 * 1. Qidiruv (300 ms kechikish bilan, URL'da saqlanadi)
 * 2. Jadval: №, FIO, telefon, yosh, amallar (Ochish, Tahrirlash)
 * 3. Server sahifalash va qatorni bosish -> karta
 * 4. ADMIN: arxivlash, arxivdan qaytarish va "Arxivdagilar" filtri
 * 5. 4 holat: yuklanmoqda (Skeleton), bo'sh (EmptyState), xato (ErrorState), ma'lumot
 */
export const PatientsPage: React.FC<PatientsPageProps> = ({
  currentUserRole = 'ADMIN',
  onOpenPatientCard,
}) => {
  const { params, page, pageSize, search, setPage, setPageSize, setSearch } = useTableParams({
    defaultPage: 1,
    defaultPageSize: 20,
  });

  const [searchInput, setSearchInput] = useState(search);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal holatlari
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const isAdmin = currentUserRole === 'ADMIN';

  // 300 ms debounce qidiruv
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        setSearch(searchInput);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, search, setSearch]);

  // Bemorlar ro'yxatini yuklash
  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getPatients({
        search,
        page,
        pageSize,
        includeArchived: isAdmin && includeArchived,
      });

      setPatients(res.items);
      setTotal(res.total);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Bemorlar ro'yxatini yuklashda kutilmagan xatolik yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  }, [search, page, pageSize, isAdmin, includeArchived]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Arxivlash amali
  const handleArchive = async (patient: Patient) => {
    try {
      await archivePatient(patient.id);
      message.success(`${patient.fullName} arxivlandi`);
      fetchPatients();
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : 'Arxivlashda xatolik yuz berdi');
    }
  };

  // Arxivdan chiqarish amali
  const handleUnarchive = async (patient: Patient) => {
    try {
      await unarchivePatient(patient.id);
      message.success(`${patient.fullName} arxivdan chiqarildi`);
      fetchPatients();
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : 'Arxivdan chiqarishda xatolik yuz berdi');
    }
  };

  const handleEdit = (patient: Patient, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingPatient(patient);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingPatient(null);
    setModalOpen(true);
  };

  const handleRowClick = (patient: Patient) => {
    if (onOpenPatientCard) {
      onOpenPatientCard(patient.id);
    } else {
      message.info(`Bemor kartasi ochilmoqda: ${patient.fullName} (ID: ${patient.id})`);
    }
  };

  const columns: ColumnsType<Patient> = [
    {
      title: '№',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_, __, index) => (
        <span style={{ fontVariantNumeric: 'tabular-nums', color: '#6B7280' }}>
          {(page - 1) * pageSize + index + 1}
        </span>
      ),
    },
    {
      title: 'F.I.O',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (fullName: string, record: Patient) => (
        <Space direction="vertical" size={2}>
          <Space>
            <Text strong style={{ color: '#111827' }}>
              {fullName}
            </Text>
            {record.isArchived && (
              <Tag color="default" style={{ borderRadius: 4 }}>
                Arxivlangan
              </Tag>
            )}
          </Space>
          {record.allergies && (
            <Tooltip title={`Allergiya: ${record.allergies}`}>
              <Tag
                color="#FEF2F2"
                style={{
                  color: '#B91C1C',
                  borderColor: '#FECACA',
                  borderRadius: 4,
                  fontSize: 11,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <MedicineBoxOutlined />
                {record.allergies.length > 35
                  ? `${record.allergies.slice(0, 35)}...`
                  : record.allergies}
              </Tag>
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: 'Telefon',
      dataIndex: 'phone',
      key: 'phone',
      width: 170,
      render: (phone: string, record: Patient) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
            {formatPhone(phone)}
          </span>
          {record.phone2 && (
            <Text type="secondary" style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>
              {formatPhone(record.phone2)}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Yosh',
      key: 'age',
      width: 100,
      render: (_, record: Patient) => {
        const age = getAge(record.birthDate);
        return (
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>
            {age !== null ? `${age} yosh` : '—'}
          </span>
        );
      },
    },
    {
      title: 'Manzil',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
      render: (address: string | null) => (
        <Text type="secondary" ellipsis>
          {address || '—'}
        </Text>
      ),
    },
    {
      title: 'Amallar',
      key: 'actions',
      width: 220,
      align: 'right',
      render: (_, record: Patient) => (
        <Space onClick={(e) => e.stopPropagation()}>
          <Button
            size="small"
            type="link"
            onClick={() => handleRowClick(record)}
          >
            Ochish
          </Button>

          <Button
            size="small"
            type="text"
            onClick={(e) => handleEdit(record, e)}
          >
            Tahrirlash
          </Button>

          {isAdmin && (
            record.isArchived ? (
              <ConfirmButton
                title="Bemor arxivdan chiqarilsinmi?"
                description={`${record.fullName} faol bemorlar ro'yxatiga qaytariladi.`}
                okText="Arxivdan chiqarish"
                danger={false}
                size="small"
                type="text"
                icon={<FolderOutlined />}
                onConfirm={() => handleUnarchive(record)}
              >
                Tiklash
              </ConfirmButton>
            ) : (
              <ConfirmButton
                title="Bemor arxivlansinmi?"
                description={`${record.fullName} asosiy qidiruvdan yashiriladi.`}
                okText="Arxivlash"
                danger
                size="small"
                type="text"
                icon={<InboxOutlined />}
                onConfirm={() => handleArchive(record)}
              >
                Arxiv
              </ConfirmButton>
            )
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Sarlavha va asosiy amal */}
      <PageHeader
        title="Bemorlar"
        subtitle="Klinika bemorlari ro'yxati, qidiruv va kartani boshqarish"
        breadcrumbs={[
          { title: 'Asosiy', href: '/' },
          { title: 'Bemorlar' },
        ]}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Yangi bemor
          </Button>
        }
      />

      {/* Filtrlar paneli */}
      <Card style={{ marginBottom: 16, borderRadius: 8 }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div style={{ flex: '1 1 320px', maxWidth: 480 }}>
            <Input
              prefix={<SearchOutlined style={{ color: '#9CA3AF' }} />}
              placeholder="Bemor F.I.O yoki telefon raqami bo'yicha qidirish..."
              allowClear
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <Space size={16}>
            {isAdmin && (
              <Checkbox
                checked={includeArchived}
                onChange={(e) => setIncludeArchived(e.target.checked)}
              >
                Arxivdagilarni ham ko'rsatish
              </Checkbox>
            )}

            <Button
              icon={<ReloadOutlined />}
              onClick={() => fetchPatients()}
              loading={loading}
            >
              Yangilash
            </Button>
          </Space>
        </div>
      </Card>

      {/* 4 holat: Xatolik, Yuklanmoqda, Bo'sh, Ma'lumot */}
      {error ? (
        <Card style={{ borderRadius: 8 }}>
          <ErrorState
            title="Bemorlar ro'yxatini yuklab bo'lmadi"
            description={error}
            onRetry={fetchPatients}
          />
        </Card>
      ) : loading && patients.length === 0 ? (
        <Card style={{ borderRadius: 8, padding: 24 }}>
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      ) : patients.length === 0 ? (
        <Card style={{ borderRadius: 8 }}>
          <EmptyState
            title="Bemor topilmadi"
            description={
              search
                ? `"${search}" so'rovi bo'yicha hech qanday bemor ma'lumoti topilmadi.`
                : "Hozircha klinikada ro'yxatdan o'tgan bemorlar mavjud emas."
            }
            actionText="Yangi bemor qo'shish"
            onAction={handleCreate}
          />
        </Card>
      ) : (
        <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 8, overflow: 'hidden' }}>
          <Table<Patient>
            rowKey="id"
            columns={columns}
            dataSource={patients}
            loading={loading}
            pagination={{
              current: page,
              pageSize,
              total,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showTotal: (totalCount) => `Jami: ${totalCount} nafar bemor`,
              onChange: (p, ps) => {
                setPage(p);
                if (ps !== pageSize) setPageSize(ps);
              },
            }}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              style: { cursor: 'pointer' },
            })}
          />
        </Card>
      )}

      {/* Bemor yaratish va tahrirlash modali */}
      <PatientFormModal
        open={modalOpen}
        initialData={editingPatient}
        currentUserRole={currentUserRole}
        onClose={() => {
          setModalOpen(false);
          setEditingPatient(null);
        }}
        onSuccess={() => {
          fetchPatients();
        }}
        onOpenCard={(patientId) => {
          if (onOpenPatientCard) {
            onOpenPatientCard(patientId);
          } else {
            message.info(`Bemor kartasi ochilmoqda (ID: ${patientId})`);
          }
        }}
      />
    </div>
  );
};
