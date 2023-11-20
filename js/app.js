const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const url = require('url');
let sql;
const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('./quote.db', sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err)
});

app.use(cors());
app.use(bodyParser.json());

//post request
app.post('/quote', (req, res) => {
    try {
        const { date, description, type, amount } = req.body;
        sql = "INSERT INTO quote(date,description,type,amount) VALUES (?,?,?,?)"
        db.run(sql, [date, description, type, amount], (err) => {
            if (err) return res.json({ status: 300, success: false, error: err });

            console.log('successfull input', date, description, type, amount);
        });
        return res.json({
            status: 200,
            success: true
        });
    } catch (error) {
        return res.json({
            status: 400,
            success: false,
        });
    }
})

//get request
app.get('/quote', (req, res) => {
    sql = "SELECT * FROM quote";
    try {
        const queryObject = url.parse(req.url, true).query; //query parameters

        if (queryObject.field && queryObject.type) sql += ` WHERE ${queryObject.field} LIKE '%${queryObject.type}%'`;

        db.all(sql, [], (err, rows) => {
            if (err) return res.json({ status: 300, success: false, error: err });

            if (rows.length < 1) return res.json({ status: 300, success: false, error: "no match" });

            return res.json({ status: 200, data: rows, success: true })
        })
    } catch (error) {
        return res.json({
            status: 400,
            success: false,
        });
    }
})

// delete by id
app.delete('/quote/:id', (req, res) => {
    const id = req.params.id;
    const deleteSql = "DELETE FROM quote WHERE ID = ?";

    db.run(deleteSql, [id], (err) => {
        if (err) {
            return res.json({ status: 300, success: false, error: err });
        }

        return res.json({ status: 200, success: true });
    });
});

// put request
app.put('/quote/:id', (req, res) => {
    const id = req.params.id;
    const { date, description, type, amount } = req.body;
    const updateSql = "UPDATE quote SET date=?, description=?, type=?, amount=? WHERE id=?";

    db.run(updateSql, [date, description, type, amount, id], (err) => {
        if (err) {
            return res.json({ status: 300, success: false, error: err });
        }

        return res.json({ status: 200, success: true });
    });
});

app.listen(3000);