import { db } from "../config/db";
import { Request, Response } from "express";


export async function logPumpSession(status: "ON" | "OFF", userId?: number) {
  const now = new Date();
  const timeNow = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  console.log("Time Now:", timeNow);
  if (status === "ON") {
    const check = await (await db).query(`
      SELECT id FROM pump_sessions
      WHERE end_time IS NULL
      ORDER BY id DESC
      LIMIT 1
    `);

    if (check.rows.length === 0) {
      const userInfo = await (await db).query(`
  SELECT name AS farmowner, farmname, farmlocation, farmphone
  FROM users
  WHERE id = $1
`, [userId]);

      const { farmowner, farmname, farmlocation, farmphone } = userInfo.rows[0] || {};

      await (await db).query(`
      INSERT INTO pump_sessions (
        start_time, date, status, user_id,
        farmowner, farmname, farmlocation, farmphone
      ) VALUES ($1, CURRENT_DATE, 'In Progress', $2, $3, $4, $5, $6)
    `, [
        timeNow,
        userId ?? null,
        farmowner,
        farmname,
        farmlocation,
        farmphone
      ]);

      console.log("Pump session started with farm metadata");
    }
  }

  if (status === "OFF") {
    const { rows } = await (await db).query(`
      SELECT id, start_time FROM pump_sessions
      WHERE end_time IS NULL
      ORDER BY id DESC
      LIMIT 1
    `);

    if (rows.length > 0) {
      const session = rows[0];
      const [sh, sm, ss] = session.start_time.split(":").map(Number);

      const sessionStart = new Date(now);
      sessionStart.setHours(sh, sm, ss, 0);

      const durationMinutes = (now.getTime() - sessionStart.getTime()) / (1000 * 60);
      const duration = Math.abs(durationMinutes).toFixed(2);

      const endTime = timeNow;

      const { rows: flowRows } = await (await db).query(`
        SELECT flowrate
        FROM water_flow_sensor_data
        WHERE date = CURRENT_DATE
          AND time >= $1
          AND time <= $2
      `, [session.start_time, endTime]);

      const flowrates = flowRows.map(r => parseFloat(r.flowrate)).filter(n => !isNaN(n));
      const avgFlow = flowrates.length > 0
        ? flowrates.reduce((sum, r) => sum + r, 0) / flowrates.length
        : 0;

      const totalLiters = (avgFlow * durationMinutes).toFixed(2);
      const statusLabel = parseFloat(totalLiters) < 70 ? "Low flow" : "Completed";

      await (await db).query(`
        UPDATE pump_sessions
        SET end_time = $1,
            duration = $2,
            total_liters = $3,
            status = $4
        WHERE id = $5
      `, [endTime, duration, totalLiters, statusLabel, session.id]);

      console.log("Pump session ended");
    }
  }

  const result = await (await db).query(`
    SELECT * FROM pump_sessions
    ORDER BY date DESC, id DESC
    LIMIT 1
  `);
  console.log("Pump session logged:", result.rows[0]);
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
export async function getPumpSessionsByUserId(userId: number) {
  const result = await (await db).query(`
  SELECT 
    TO_CHAR(date, 'YYYY-MM-DD') AS date,
    start_time,
    end_time,
    duration,
    total_liters,
    status
  FROM pump_sessions
  WHERE user_id = $1
  ORDER BY date DESC, id DESC
`, [userId]);
  return result.rows;
}

export async function fetchAllPumpSessions() {
  const result = await (await db).query(`
    SELECT 
      id,
      date,
      start_time,
      end_time,
      total_liters,
      status,
      ABS(duration) AS duration,
      farmowner,
      farmname,
      farmlocation,
      farmphone
    FROM pump_sessions
    ORDER BY date DESC, id DESC
  `);
  return result.rows;
}

export const getTotalWaterUsedDaily = async (userId: number) => {
  const result = await (await db).query(`
  SELECT 
    TO_CHAR(date, 'YYYY-MM-DD') AS date, 
    SUM(total_liters) AS total_water_used,
    AVG(duration)
  FROM pump_sessions
  WHERE user_id = $1
  GROUP BY date
  ORDER BY date DESC
`, [userId]);
  console.log("Total water used:", result.rows);
  return result.rows;
}