"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMoistureData = saveMoistureData;
exports.getRecentMoistureData = getRecentMoistureData;
const db_1 = require("../config/db");
// ✅ Insert new moisture record
async function saveMoistureData(data) {
    const query = `
    INSERT INTO moisture_data1 (moisture, moisture_unit, moisture_change)
    VALUES ($1, $2, $3)
  `;
    const values = [data.moisture, data.moistureUnit || '%', data.moistureChange || 0];
    await (await db_1.db).query(query, values);
}
// ✅ Fetch recent moisture records (default: 10)
async function getRecentMoistureData(limit = 10) {
    const query = `
    SELECT * FROM moisture_data1
    ORDER BY timestamp DESC
    LIMIT $1
  `;
    const { rows } = await (await db_1.db).query(query, [limit]);
    return rows;
}
