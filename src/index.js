const express = require('express')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.get('/', async (req, res) => {
    res.status(200).send('App iniciado')
})

app.listen(3333)
console.log(`Server running on port 3333`)