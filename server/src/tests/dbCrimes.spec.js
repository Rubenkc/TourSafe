import pool from "../db/index";
import { insertCrimes, insertOffset } from "../db/queries/crimes";
import { getNeigh } from "../db/queries/map";

const client = await pool.connect();

describe('Crime tests', () => {
    beforeEach(async () => {
        await client.query('BEGIN')
    })

    afterEach( async() => {
        await client.query('ROLLBACK')
    })

    test('Crime insert', async () => {

        const crime = await insertCrimes([{

        "case_number": "JK102469",
        "date": "2026-01-03T09:27:00.000",
        "primary_type": "HOMICIDE",
        "location": {
        "type": "Point",
        "longitude":-87.576477067,
        "latitude": 41.772812361
        }
    },
    {

        "case_number": "JK102489",
        "date": "2026-01-03T09:27:00.000",
        "primary_type": "HOMICIDE",
        "location": {
        "type": "Point",
        "longitude":-87.576477067,
        "latitude": 41.772812361
       
        }
    }], client)

        expect(crime).toHaveLength(2)
    });

    test("Check offset insert query", async () => {
        const result = await insertOffset(0, false , client)

        expect(result).toHaveLength(1)
    })

    test("Neighborhoods fetch", async () => {
        const result = await getNeigh(client);
        console.log('neighborhood results', result)
        expect(result).toBeTruthy()
    })

    
})