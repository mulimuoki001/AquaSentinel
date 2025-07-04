import { db } from "../config/db";
import { Request, Response } from "express";

export async function logPumpSession(status: "ON" | "OFF") {
  const now = new Date();

  if (status === "ON") {
    // Check if there's already an open session
    const check = await (await db).query(`
      SELECT id FROM pump_sessions
      WHERE end_time IS NULL
      ORDER BY start_time DESC
      LIMIT 1
    `);

    if (check.rows.length === 0) {
      // Start a new session
      await (await db).query(`
        INSERT INTO pump_sessions (start_time) VALUES ($1)
      `, [now.toISOString()]);
    }
  }

  if (status === "OFF") {
    // Close the latest open session
    const { rows } = await (await db).query(`
      SELECT id, start_time FROM pump_sessions
      WHERE end_time IS NULL
      ORDER BY start_time DESC
      LIMIT 1
    `);

    if (rows.length > 0) {
      const session = rows[0];
      const duration = ((now.getTime() - new Date(session.start_time).getTime()) / (1000 * 60 * 60)).toFixed(0); // minutes

      // Optional: calculate liters used during this session
      const { rows: waterRows } = await (await db).query(`
        WITH paired AS (
          SELECT
            timestamp,
            flowrate,
            LEAD(timestamp) OVER (ORDER BY timestamp) AS next_timestamp,
            LEAD(flowrate) OVER (ORDER BY timestamp) AS next_flow_rate
          FROM water_flow_sensor_data
          WHERE timestamp BETWEEN $1 AND $2
        )
        SELECT
          SUM(
            (EXTRACT(EPOCH FROM (next_timestamp - timestamp)) / 60.0) *
            ((flowrate + next_flow_rate) / 2)
          ) AS total
        FROM paired
      `, [session.start_time, now.toISOString()]);

      const totalLiters = (waterRows[0]?.total || 0).toFixed(2);

      await (await db).query(`
        UPDATE pump_sessions
        SET end_time = $1, duration = $2, total_liters = $3
        WHERE id = $4
      `, [now.toISOString(), duration, totalLiters, session.id]);
    }
  }
  // ✅ Return the full latest session
  const result = await (await db).query(`
    SELECT * FROM pump_sessions
    ORDER BY start_time DESC
    LIMIT 1
  `);

  return result.rows[0];
}


export async function getLastPumpStatus(): Promise<"ON" | "OFF" | null> {
  const { rows } = await (await db).query(`
    SELECT pumpStatus
    FROM water_flow_sensor_data
    WHERE pumpStatus IS NOT NULL
    ORDER BY timestamp DESC
    LIMIT 1
  `);

  return rows[0]?.pumpstatus?.toUpperCase() ?? null;
}
