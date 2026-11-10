import pool from '../index.js';


 export async function getNeigh(db = pool){
    try{
        const {rows} = await db.query(`
            SELECT n.id, n.name, n.type, ST_AsGeoJSON(n.geom) geom, COUNT(n.name) crimesbyneigh, t.totalcrimes
            FROM neighborhoods n
            JOIN crimes c ON ST_Contains(n.geom, c.location) 
            CROSS JOIN(
            SELECT COUNT(primary_type) totalcrimes
            FROM crimes) AS t
            GROUP BY n.id, t.totalcrimes
            `)

            return rows

    } catch(e){
       throw e
    }
};

