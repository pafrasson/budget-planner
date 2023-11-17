const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const url = require('url');
let sql;
const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('./quote.db', sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err)
});

app.use(bodyParser.json());

//post request
app.post('/quote', (req, res) => {
    try {
        const { date, description, type, amount } = req.body;
        sql = "INSERT INTO quote(date, description,type,amount) VALUES (?,?,?,?)"
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

app.listen(3000);