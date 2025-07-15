"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveWaterFlowData = saveWaterFlowData;
exports.getRecentWaterFlowData = getRecentWaterFlowData;
exports.getTotalWaterUsed = getTotalWaterUsed;
exports.getPumpRuntime = getPumpRuntime;
exports.getWaterUsageTodayBuckets = getWaterUsageTodayBuckets;
exports.getFlowRateBuckets = getFlowRateBuckets;
exports.getFlowRateDataLastHour = getFlowRateDataLastHour;
exports.getAllWaterFlowDataPerUser = getAllWaterFlowDataPerUser;
const db_1 = require("../config/db");
// ✅ Save a water flow reading
async function saveWaterFlowData(data) {
    const query = `
    INSERT INTO water_flow_sensor_data (userId, flowRate, flowUnit, pumpStatus, timestamp, date, time)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;
    const values = [
        data.userId,
        data.flowRate,
        data.flowUnit,
        data.pumpStatus,
        data.timestamp,
        data.date,
        data.time
    ];
    await (await db_1.db).query(query, values);
}
// ✅ Get recent readings
async function getRecentWaterFlowData(limit = 10) {
    const { rows } = await (await db_1.db).query(`
    SELECT * FROM water_flow_sensor_data
    ORDER BY timestamp DESC
    LIMIT $1
  `, [limit]);
    return rows;
}
async function getTotalWaterUsed(startTime, endTime) {
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
    const { rows } = await (await db_1.db).query(query, [startTime.toISOString(), endTime.toISOString()]);
    return rows[0]?.total_liters || 0;
}
async function getPumpRuntime(startTime, endTime) {
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
    const { rows } = await (await db_1.db).query(query, [
        startTime.toISOString(),
        endTime.toISOString(),
    ]);
    return (rows[0]?.runtime_seconds || 0) / 60; // convert to minutes
}
async function getWaterUsageTodayBuckets(userId, intervalMinutes = 30) {
    const query = `
    SELECT
      date_trunc('minute', timestamp) + INTERVAL '1 minute' * FLOOR(EXTRACT(EPOCH FROM timestamp - $1) / 60 / $3) * $3 AS bucket_start,
      SUM((timestamp_diff / 60.0) * ((flowRate + next_flow_rate) / 2)) AS liters_used,
       MAX(time) AS time_label
    FROM (
      SELECT
        timestamp,
        flowRate,
        time,
        LEAD(timestamp) OVER (ORDER BY timestamp) AS next_timestamp,
        LEAD(flowRate) OVER (ORDER BY timestamp) AS next_flow_rate,
        LEAD(time) OVER (ORDER BY timestamp) AS next_time,
        EXTRACT(EPOCH FROM LEAD(timestamp) OVER (ORDER BY timestamp) - timestamp) AS timestamp_diff
      FROM water_flow_sensor_data
      WHERE DATE(timestamp) = CURRENT_DATE AND userid = $2
    ) AS subquery
    GROUP BY bucket_start
    ORDER BY bucket_start;
  `;
    const { rows } = await (await db_1.db).query(query, [
        new Date(new Date().setHours(0, 0, 0, 0)).toISOString(), // start of today
        userId,
        intervalMinutes,
    ]);
    return rows;
}
async function getFlowRateBuckets(startTime, endTime, bucketMinutes = 5) {
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
    const { rows } = await (await db_1.db).query(query, [
        startTime.toISOString(), // $1
        endTime.toISOString(), // $2
        bucketMinutes, // $3
    ]);
    // Return in ascending order (earliest to latest) for correct chart display
    return rows.reverse();
}
async function getFlowRateDataLastHour(startTime, endTime) {
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
    const { rows } = await (await db_1.db).query(query, [
        startTime.toISOString(),
        endTime.toISOString()
    ]);
    console.log("Rows", rows);
    return rows; // each row has: timestamp, flowRate, time
}
// ✅ Get all water flow data for a user
async function getAllWaterFlowDataPerUser(userId) {
    const query = `
    SELECT id, userid, flowRate, flowUnit, pumpStatus, timestamp, TO_CHAR(date, 'YYYY-MM-DD') AS date, time
    FROM water_flow_sensor_data
    WHERE userid = $1
    ORDER BY timestamp ASC
  `;
    const { rows } = await (await db_1.db).query(query, [userId]);
    return rows;
}
