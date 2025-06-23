import dotenv from "dotenv";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({ path: envFile });

import mysql from "mysql2/promise"; // Promise 기반 MySQL 클라이언트, async/await로 쿼리 가능

// RDS(혹은 로컬 MySQL)를 pool이라는 연결 객체로 만들어둔다.
// pool은 DB랑 안전하고 효율적으로 소통할 수 있는 파이프라인 역할을 함.
// 결과적으로 코드가 pool을 통해 DB와 대화하는 구조가 됨.
// 매 요청마다 DB에 새 연결을 만드는 건 비효율적임.
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "test",
});

export default pool;
