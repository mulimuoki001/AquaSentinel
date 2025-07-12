import { db } from "../config/db";

export interface WaterFlowRecord {
  flowRate: number;
  flowUnit?: string;
  pumpStatus?: string;
  timestamp?: Date;
  date?: string;
  time?: string;
}

// ✅ Save a water flow reading
export async function saveWaterFlowData(data: WaterFlowRecord): Promise<void> {
  const query = `
    INSERT INTO water_flow_sensor_data (flowRate, flowUnit, pumpStatus, timestamp, date, time)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;
  const values = [
    data.flowRate,
    data.flowUnit,
    data.pumpStatus,
    data.timestamp,
    data.date,
    data.time
  ];


  await (await db).query(query, values);
}

// ✅ Get recent readings
export async function getRecentWaterFlowData(limit = 10): Promise<WaterFlowRecord[]> {
  const { rows } = await (await db).query(`
    SELECT * FROM water_flow_sensor_data
    ORDER BY timestamp DESC
    LIMIT $1
  `, [limit]);

  return rows;
}

export async function getTotalWaterUsed(startTime: Date, endTime: Date): Promise<number> {
  const query = `
    SELECT
      SUM((timestamp_diff / 60.0) * ((flowRate + next_flow_rate) / 2)) AS total_liters
    FROM (
      SELECT
        timestamp,
        flowRate,
        LEAD(timestamp) OVER (ORDER BY timestamp) AS next_timestamp,
        LEAD(flowRate) OVER (ORDER BY timestamp) AS next_flow_rate,
        EXTRACT(EPOCH FROM LEAD(timestamp) OVER (ORDER BY timestamp) - timestamp) AS timestamp_diff
      FROM water_flow_sensor_data
      WHERE timestamp BETWEEN $1 AND $2
    ) AS subquery
  `;

  const { rows } = await (await db).query(query, [startTime.toISOString(), endTime.toISOString()]);
  return rows[0]?.total_liters || 0;
}
export async function getPumpRuntime(startTime: Date, endTime: Date): Promise<number> {
  const query = `
    WITH status_pairs AS (
      SELECT 
        timestamp,
        pumpStatus,
        LEAD(timestamp) OVER (ORDER BY timestamp) AS raw_next_timestamp
      FROM water_flow_sensor_data
      WHERE timestamp <= $2
    ),
    clipped AS (
      SELECT
        timestamp,
        pumpStatus,
        LEAST(raw_next_timestamp, $2) AS next_timestamp
      FROM status_pairs
      WHERE timestamp >= $1
    )
    SELECT 
      SUM(EXTRACT(EPOCH FROM (next_timestamp - timestamp))) AS runtime_seconds
    FROM clipped
    WHERE pumpStatus = 'ON';
  `;

  const { rows } = await (await db).query(query, [
    startTime.toISOString(),
    endTime.toISOString(),
  ]);

  return (rows[0]?.runtime_seconds || 0) / 60; // convert to minutes
}

export async function getWaterUsageTodayBuckets(userId: number, intervalMinutes = 30) {
  const query = `
    SELECT
      date_trunc('minute', timestamp) + INTERVAL '1 minute' * FLOOR(EXTRACT(EPOCH FROM timestamp - $1) / 60 / $3) * $3 AS bucket_start,
      SUM((timestamp_diff / 60.0) * ((flowRate + next_flow_rate) / 2)) AS liters_used
    FROM (
      SELECT
        timestamp,
        flowRate,
        LEAD(timestamp) OVER (ORDER BY timestamp) AS next_timestamp,
        LEAD(flowRate) OVER (ORDER BY timestamp) AS next_flow_rate,
        EXTRACT(EPOCH FROM LEAD(timestamp) OVER (ORDER BY timestamp) - timestamp) AS timestamp_diff
      FROM water_flow_sensor_data
      WHERE DATE(timestamp) = CURRENT_DATE AND user_id = $2
    ) AS subquery
    GROUP BY bucket_start
    ORDER BY bucket_start;
  `;

  const { rows } = await (await db).query(query, [
    new Date(new Date().setHours(0, 0, 0, 0)).toISOString(), // start of today
    userId,
    intervalMinutes,
  ]);

  return rows;
}



export async function getFlowRateBuckets(startTime: Date, endTime: Date, bucketMinutes: number = 5) {
  const query = `
  SELECT
    date_trunc('minute', timestamp) + INTERVAL '1 minute' * FLOOR(EXTRACT(EPOCH FROM timestamp - $1) / 60 / $3) * $3 AS bucket_start,
    MAX(time) AS time_label,  -- use the latest local time in each 5-minute bucket
    AVG(flowRate) AS avg_flow_rate
  FROM water_flow_sensor_data
  WHERE timestamp BETWEEN $1 AND $2
  GROUP BY bucket_start
  ORDER BY bucket_start DESC
  LIMIT 20;
`;

  const { rows } = await (await db).query(query, [
    startTime.toISOString(),     // $1
    endTime.toISOString(),       // $2
    bucketMinutes,               // $3
  ]);
  // Return in ascending order (earliest to latest) for correct chart display
  return rows.reverse();
}


export async function getFlowRateDataLastHour(startTime: Date, endTime: Date) {
  const query = `
    SELECT
      timestamp,
      flowRate,
      time
    FROM water_flow_sensor_data
    WHERE timestamp BETWEEN $1 AND $2
    ORDER BY timestamp ASC;
  `;
  console.log("Fetched Data", query);
  const { rows } = await (await db).query(query, [
    startTime.toISOString(),
    endTime.toISOString()
  ]);
  console.log("Rows", rows);
  return rows; // each row has: timestamp, flowRate, time
}
