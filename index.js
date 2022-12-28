const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


///middle wares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.izqajim.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
          try{
            //    const taskCollection = client.db('myTask').collection('tasks');
            const taskCollection = client.db('myTask').collection(tasks);
          }
          finally{

          }

            // tasks api,
            app.get('/tasks',  async(req, res) => {
                // const email = req.query.email;
                // const query = { email: email };
                const tasks = taskCollection.find(query).toArray();
                res.send(tasks);
            })
            app.post('/tasks', async(req, res) =>{
                const task = req.body;
                const result = await taskCollection.insertOne(task);
                res.send(result);
            })
}
run().catch(err => console.error(err));


app.get('/', (req, res) =>{
    res.send('my task server is running')
})

app.listen(port, () =>{
    console.log(`my task server is running on ${port}`)
})
