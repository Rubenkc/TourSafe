import pool from "./index.js";
import { fetchInfo, deleteCrimes } from './queries/crimes.js'
import crimeFetch from "./utils/crimeFetch.js";



export async function fetchCrimeData(){
    let fetch = true;
    const twenty_four_hour_ms = 24 * 60 * 60 * 1000;

    
    try{

        const fetchData = await fetchInfo();
        

        if( Date.now() >= fetchData.last_fetch.getTime() + (twenty_four_hour_ms)){ 

            await crimeFetch()
            
        }
        
        await deleteCrimes();
        
    } catch (e){
        throw e
    }
}