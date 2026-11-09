import dotenv from "dotenv";

dotenv.config({
  path: "../../.env" // adjust based on where you run from
});

 const { default: pool } = await import("./index.js")





async function NeighFetch(db = pool){

    try{
        const res = await fetch('https://data.cityofchicago.org/resource/y6yq-dbs2.json');
        const result = await res.json();

        console.log(result)

        for (const neighborhood of result ){

            await db.query(`
            INSERT INTO neighborhoods( name, type, geom)
            VALUES ($1, $2, ST_GeomFromGeoJSON($3) )
            `, [neighborhood.pri_neigh, neighborhood.the_geom.type, neighborhood.the_geom ])
        } 

    } catch(e) {
        throw e
    }
}

NeighFetch()


