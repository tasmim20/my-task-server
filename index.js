const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
          
            const taskCollection = client.db('taskManger').collection('tasks');
              

          
            // app.get('/tasks',  async(req, res) => {
            //   const email = req.query.email;
            //   const query = { email: email };
            //   const tasks = await taskCollection.find(query).toArray();
            //   const cursor = taskCollection.find({});
            //   const tasks = await cursor.toArray()
            //  res.send(tasks);
            //  })

            // load user specific data
            // app.get('/tasks', async(req, res) =>{
            //   let query = {};
            //   if(req.query.email){
            //     query = {
            //       email: req.query.email
            //     }
            //   }
            //   const cursor = taskCollection.find(query);
            //   const tasks = await cursor.toArray();
            //   res.send(tasks);
            // })

            app.get('/tasks',  async(req, res) => {
              const email = req.query.email;
              const query = {email: email};
              const tasks = await taskCollection.find(query).toArray();
              res.send(tasks);
          })
         
            app.post('/tasks', async(req, res) =>{
                const task = req.body;
                console.log(task);
                const result = await taskCollection.insertOne(task);
                res.send(result);
            })

            app.delete('/tasks/:id', async(req, res) =>{
              const id = req.params.id;
              const query = {_id: ObjectId(id)}
              // console.log('trying to delete', id)
              const result = await taskCollection.deleteOne(query);
              console.log(result)
              res.send(result);
            })
          }
          finally{

          }

           
           
}
run().catch(err => console.error(err));


app.get('/', (req, res) =>{
    res.send('my task server is running')
})

app.listen(port, () =>{
    console.log(`my task server is running on ${port}`)
})
