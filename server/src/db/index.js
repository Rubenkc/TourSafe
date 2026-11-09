import "dotenv/config";
import { Pool } from 'pg';



console.log("string key", process.env.CONNECTION_STRING)

const pool = new Pool(
    process.env.CONNECTION_STRING ? {
        connectionString: process.env.CONNECTION_STRING,
        ssl: { rejectUnauthorized: false },
        max: 10
    } : 
    {
        host:"localhost",
        port: 5432,
        database:"mini-project1",
}
);

export default pool;