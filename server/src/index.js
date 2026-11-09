import 'dotenv/config'
import app from './app.js'



const PORT = process.env.PORT || 3000;

console.log(PORT)

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})

