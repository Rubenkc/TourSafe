import pool from '../index.js';


 export async function getNeigh(db = pool){
    try{
        const {rows} = await db.query(`
            SELECT n.id, n.name, n.type, ST_AsGeoJSON(n.geom) geom, COUNT(n.name) crimesbyneigh
            FROM neighborhoods n
            JOIN crimes c ON ST_Contains(n.geom, c.location)
            GROUP BY n.id
            CROSS JOIN
            SELECT COUNT(primary_type) totalcrimes
            FROM crimes;
            `)

            return rows

    } catch(e){
       throw e
    }
};

