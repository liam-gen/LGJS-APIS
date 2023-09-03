const express = require('express')
const app = express()
const port = 3000

const https = require('https');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/tomacloud/:url', (req, res) => {
    res.send(req.params.url)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})