const express = require('express')
const pool = require('./Database/DBConnection')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.get('/', async (req, res) => {
    res.status(200).send('App iniciado')
})

app.get('/getusers', async (req, res) => {
    try {
        const {rows} = await pool.query('SELECT * FROM users')
        return res.status(200).send(rows)
    } catch (err) {
        return res.status(400).send(err)
    }
})

app.listen(3333)
console.log(`Server running on port 3333`)