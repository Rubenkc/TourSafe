import pool from '../index.js'

export async function fetchInfo(){
    try{
        const {rows:[cityinfo]} = await pool.query(`
            SELECT * FROM fetch_info
            WHERE city = 'chicago'
            `)

            return cityinfo
    } catch (e) {
        throw e
    }
};

export async function insertOffset(offset, boolean, db = pool ){
    try{
        const {rows} = await db.query(`
            UPDATE fetch_info
            SET current_offset=$1, fetch_success=$2
            WHERE city = 'chicago'
            RETURNING *;
            `, [offset, boolean])

            console.log('returned uodate', rows)

            return rows
    } catch (e){
        throw e
    }
};

export async function lastFetchUpd(){
    try{
        await pool.query(`
            UPDATE fetch_info
            SET last_fetch = NOW()
            WHERE city = 'chicago';
            `)
    } catch(e){
        throw e
    }
}

export async function insertCrimes(fetchArr, db = pool){

    
    const expectedKeys = ["case_number", "date", "primary_type", "location"];
    let valueArray= [];
    let offset = 1;
    let string = fetchArr.map((crimeObj, i) => {

        const valid = expectedKeys.every((elem) => {
            return Object.keys(crimeObj).includes(elem)
        })
        
        if(!valid){
            console.log('uneven object', crimeObj)
            return;
        }
        const schema = Object.keys(crimeObj);
        let current = i * (schema.length + offset) + 1; // +1 for for the indexing since it starts at 0
        let stringInter = '';
        
        

        schema.forEach((key, index) => {
            const comma = index === 0 ? '' : ', ';
            if(key === 'location') {
                valueArray.push(crimeObj[key].longitude, crimeObj[key].latitude)
               stringInter += comma + `ST_SetSRID(ST_POINT($${index + current}, $${index + current + 1}), 4326)`
                current++
            } else{
                valueArray.push(crimeObj[key])
                stringInter += comma + `$${index + current}`
            }  
                
        })



        return `(${stringInter})`;
    }).join(', ');

    
    

    try{
        console.log('schema', string)
        console.log('insert values', Object.keys(fetchArr[0]).join(', '))
        console.log('insert values', valueArray)
      const {rows} = await db.query(`
        INSERT INTO crimes(${Object.keys(fetchArr[0]).join(', ')})
        VALUES ${string}
        RETURNING *;
        `, valueArray)
        console.log('crime insert result', rows)
        return rows
    } catch(e){
        throw e;
    }
};

export async function  deleteCrimes(){
    try{
        await pool.query(`
            DELETE FROM crimes
            WHERE date < (NOW() AT THE TIME ZONE 'America/Chicago') - interval '1 year'
            `);
    } catch(e){
        console.log(e)
    }
};

