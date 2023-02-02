const pg = require('pg');
// String de conexão com BD
let connString = "postgres://sangnsjj:7mX6_XfRpAVr_j_PhoC6F_so_ZnHQ3ni@babar.db.elephantsql.com/sangnsjj";
// Abre uma porta para se comunicar com o BD
let client = new pg.Client(connString);
// Permite que esta API faça queries (consultas) no BD
client.connect(function(err) {
    if(err) {
        return console.error('could not connect to postgres', err);
    }
    client.query('SELECT NOW() AS "theTime"', function(err, result) {
        if(err) {
            return console.error('error running query', err);
        }
        console.log(result.rows[0].theTime);
    })
})

module.exports = client;