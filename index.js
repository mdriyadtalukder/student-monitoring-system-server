const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


const corsConfig = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}
app.use(cors(corsConfig))
app.options("*", cors(corsConfig));


app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gekvcup.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const userCollection = client.db('allusers').collection('users');
        const infoCollection = client.db('allinfo').collection('info');
        const cmCollection = client.db('coursemarks').collection('cm');
        const atcCollection = client.db('attend').collection('atd');
        const fdbkCollection = client.db('feedback').collection('fdbck');



        //info get
        app.get('/info', async (req, res) => {
            const users = await infoCollection.find().toArray();
            res.send(users);

        })

        //info get by email
        app.get('/info/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await infoCollection.findOne(query);
            res.send(result);
        });

        //my profile update

        app.put('/info/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: user.name,
                    fName: user.fName,
                    mName: user.mName,
                    geender: user.geender,
                    contactN: user.contactN,
                    cAddress: user.cAddress,
                    pAddress: user.pAddress,
                    email: user.email,
                    bDay: user.bDay,
                },

            };

            const result = await infoCollection.updateOne(filter, updateDoc, options);
            res.send(result);

        });



        //user create
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = userCollection.insertOne(user);
            res.send(result);
        })

        //user get
        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users)
        })

        //user get by email
        app.get('/user', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = userCollection.find(query);
            const emaill = await cursor.toArray();
            res.send(emaill);

        })


        //course or marks create
        app.post('/cms', async (req, res) => {
            const user = req.body;
            const result = cmCollection.insertOne(user);
            res.send(result);
        })

        //course or marks  get by email
        app.get('/cms', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = cmCollection.find(query);
            const emails = await cursor.toArray();
            res.send(emails);
        })
        // get data by id
        app.get('/cms/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await cmCollection.findOne(query);
            res.send(result);
        });


        // course or marks update
        app.put('/cms/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {

                $set: {
                    email: user.email,
                    semesters: user.semesters,
                    code: user.code,
                    sub: user.sub,
                    prac: user.prac,
                    theory: user.theory,
                    totals: user.totals,
                },
            }
            const result = await cmCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        });

        // attedence 
        app.post('/atc', async (req, res) => {
            const user = req.body;
            const result = atcCollection.insertOne(user);
            res.send(result);
        })

        app.get('/atc', async (req, res) => {
            const query = {};
            const cursor = atcCollection.find(query);
            const users = await cursor.toArray();
            res.send(users)
        })

        //feedback

        app.post('/fdb', async (req, res) => {
            const user = req.body;
            const result = fdbkCollection.insertOne(user);
            res.send(result);
        })

        app.get('/fdb', async (req, res) => {
            const query = {};
            const cursor = fdbkCollection.find(query);
            const users = await cursor.toArray();
            res.send(users)
        })






    } finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello SMS!')
})

app.listen(port, () => {
    console.log(`SMS listening on port ${port}`)
})