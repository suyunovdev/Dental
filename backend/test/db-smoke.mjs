import pg from 'pg';

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

try {
  for (const [table, expected] of [['User', 6], ['Chair', 3], ['ServiceCategory', 4], ['Service', 15], ['Patient', 50], ['Appointment', 30], ['Visit', 10], ['Payment', 10]]) {
    const { rows } = await client.query(`SELECT count(*)::int AS count FROM "${table}"`);
    if (rows[0].count !== expected) throw new Error(`${table}: ${rows[0].count}, kutilgan ${expected}`);
  }

  const constraints = await client.query(`SELECT conname FROM pg_constraint WHERE conname = ANY($1)`, [[
    'appointment_doctor_no_overlap', 'appointment_chair_no_overlap', 'appointment_time_valid',
    'payment_amount_positive', 'service_price_non_negative', 'user_share_percent_range',
    'schedule_time_valid',
  ]]);
  if (constraints.rowCount !== 7) throw new Error(`Cheklovlar: ${constraints.rowCount}/7`);

  const { rows: [appointment] } = await client.query('SELECT * FROM "Appointment" LIMIT 1');
  let rejected = false;
  try {
    await client.query(`INSERT INTO "Appointment"
      ("patientId", "doctorId", "chairId", "startAt", "endAt", "status", "createdById", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, 'SCHEDULED', $6, now())`, [
      appointment.patientId, appointment.doctorId, appointment.chairId,
      appointment.startAt, appointment.endAt, appointment.createdById,
    ]);
  } catch (error) {
    if (error.code !== '23P01') throw error;
    rejected = true;
  }
  if (!rejected) throw new Error('Ustma-ust qabul rad etilmadi');
  console.log('Seed sonlari, 7 cheklov va ustma-ust qabul rad etilishi tekshirildi.');
} finally {
  await client.end();
}
