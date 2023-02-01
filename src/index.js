const express = require('express')
const pool = require('./Database/DBConnection')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
    res.status(200).send('App iniciado')
})

app.get('/getusers', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users')
        return res.status(200).send(rows)
    } catch (err) {
        return res.status(400).send(err)
    }
})

app.post('/signup', async (req, res) => {
    const {
        user_name,
        user_email,
        user_type,
        password
    } = req.body
    try {
        const user = await pool.query("SELECT * FROM users WHERE user_email = ($1)", [user_email])
        if(!user.rows[0]) {
            const createUser = await pool.query("INSERT INTO users (user_name, user_email, user_type, password) VALUES ($1, $2, $3, $4) RETURNING *", [user_name, user_email, user_type, password])
            return res.status(201).send(createUser.rows)
        } else {
            return res.status(400).send({
                message: "A user with this email already exists in the system, please enter your email and password"
            })
        }
    } catch (err) {
        return res.status(500).send(err)
    }
})

app.patch('/user/:user_id', async (req, res) => {
    const { user_id } = req.params
    const {
        user_name,
        password
    } = req.body

    try {
        const updateUser = await pool.query('UPDATE users SET user_name = ($1), password = ($2) WHERE user_id = ($3) RETURNING *', [user_name, password, user_id])
        return res.status(200).send(updateUser.rows)
    } catch (err) {
        return res.status(500).send(err)
    }
})

app.delete('/user/:user_id', async (req, res) => {
    const {user_id} = req.params
    try {
        const userExists = await pool.query('SELECT * FROM users WHERE user_id = ($1)', [user_id])
        if(!userExists.rows[0]) {
            return res.status(400).send({
                message: "Non-existent user"
            })
        } else {
            const deleteUser = await pool.query('DELETE FROM users WHERE user_id = ($1) RETURNING *', [user_id])
            return res.status(200).send({
            message: "User successfully deleted"
            })
        }
    } catch (err) {
        return res.status(500).send(err)
    }
})

app.listen(3333)
console.log(`Server running on port 3333`)