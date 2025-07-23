import { db } from "../config/db";

export interface MoistureRecord {
  id?: number;
  userId: number;
  moisture: number;
  moistureUnit?: string; // default = '%'
  moistureChange?: number;
  timestamp?: Date;
}

// ✅ Insert new moisture record
export async function saveMoistureData(data: MoistureRecord): Promise<void> {
  const query = `
    INSERT INTO moisture_data1 (user_id, moisture, moisture_unit, moisture_change)
    VALUES ($1, $2, $3, $4)
  `;
  const values = [data.userId, data.moisture, data.moistureUnit || '%', data.moistureChange || 0];
  await (await db).query(query, values);
}

// ✅ Fetch recent moisture records (default: 10)
export async function getRecentMoistureData(limit: number = 10): Promise<MoistureRecord[]> {
  const query = `
    SELECT * FROM moisture_data1
    ORDER BY timestamp DESC
    LIMIT $1
  `;
  const { rows } = await (await db).query(query, [limit]);
  return rows;
}
