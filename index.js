const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;


const corsConfig = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}
app.use(cors(corsConfig))
app.options("*", cors(corsConfig));


app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello SMS!')
})

app.listen(port, () => {
    console.log(`SMS listening on port ${port}`)
})