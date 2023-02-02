const pool = require('../Database/DBConnection');
const jwt = require('jsonwebtoken');


//----------------------------------------------------------------- GET --------------------------------------------------------------------//

const get = async (req, res) => {
    res.status(200).send('App iniciado');
};

const getUsers = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users');
        return res.status(200).send(rows);
    } catch (err) {
        return res.status(400).send(err);
    }
};


//--------------------------------------------------------------- POST ---------------------------------------------------------------------//

const signup = async (req, res) => {
    const {user_name, user_email, user_type, password} = req.body;
    try {
        const user = await pool.query("SELECT * FROM users WHERE user_email = ($1)", [user_email]);
        if(!user.rows[0]) {
            const createUser = await pool.query("INSERT INTO users (user_name, user_email, user_type, password) VALUES ($1, $2, $3, $4) RETURNING *", [user_name, user_email, user_type, password]);
            return res.status(201).send(createUser.rows);
        } else {
            return res.status(400).send({
                message: "A user with this email already exists in the system, please enter your email and password"
            });
        }
    } catch (err) {
        return res.status(500).send(err);
    }
};

const login = async (req, res) => {
    const {user_id, user_email, password} = req.body;
    try {
        const loginData = await pool.query('SELECT user_email, password FROM users WHERE user_email LIKE ($1) AND password LIKE ($2)', [user_email, password]);
        if(!loginData.rows[0]) {
            return res.status(401).send({message: 'Invalid login, incorrect email or password, please try again'});
        } else {
            const token = jwt.sign({user_id}, 'secret', {
                expiresIn: 100
            });
            return res.json({auth: true, token: token, message: 'user successfuly logged in'});
        }
    } catch (err) {
        return res.status(500).send(err);
    }
};

//---------------------------------------------------------------- PATCH -------------------------------------------------------------------//

const updateUser = async (req, res) => {
    const {user_id} = req.params;
    const {user_name, password} = req.body;

    try {
        const updateUser = await pool.query('UPDATE users SET user_name = ($1), password = ($2) WHERE user_id = ($3) RETURNING *', [user_name, password, user_id]);
        return res.status(200).send(updateUser.rows);
    } catch (err) {
        return res.status(500).send(err);
    }
};

//---------------------------------------------------------------- DELETE ------------------------------------------------------------------//

const deleteUser =  async (req, res) => {
    const {user_id} = req.params;
    try {
        const userExists = await pool.query('SELECT * FROM users WHERE user_id = ($1)', [user_id]);
        if(!userExists.rows[0]) {
            return res.status(400).send({
                message: "Non-existent user"
            });
        } else {
            const deleteUser = await pool.query('DELETE FROM users WHERE user_id = ($1) RETURNING *', [user_id])
            return res.status(200).send({
            message: "User successfully deleted"
            });
        }
    } catch (err) {
        return res.status(500).send(err);
    }
};

//------------------------------------------------------------ MODULE EXPORTS --------------------------------------------------------------//

module.exports = {
    get,
    getUsers,
    signup,
    login,
    updateUser,
    deleteUser
};