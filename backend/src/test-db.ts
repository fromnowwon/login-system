import pool from "./db";

(async () => {
  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("DB 연결 성공", rows);
  } catch (error) {
    console.error("DB 연결 실패", error);
  } finally {
    await pool.end();
  }
})();
