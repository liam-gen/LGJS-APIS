const express = require('express')
const app = express()
const port = 3000

const https = require('https');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/tomacloud/:id', (req, res) => {
    let id = req.params.id;
    let base = "https://tomacloud.com/file"

    const https = require('https');

    https.get(base+"/"+id, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            console.log(data);
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})