const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("My Tasks is running successfully.");
})

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.flsgo3q.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    const tasksCollection = client.db("myTasksDb").collection("tasks");

    app.post('/tasks', async (req, res) => {
      const task = req.body;
      const result = await tasksCollection.insertOne(task);
      console.log(result);
      res.send(result);
    })

    app.get('/mytasks', async(req, res) => {
      const email = req.query.email;
      const query = { userEmail: email};
      const result = await tasksCollection.find(query).toArray();
      res.send(result);
    })

    app.delete('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id)};
      const result = await tasksCollection.deleteOne(query);
      res.send(result);
    })
    app.patch('/tasks/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: ObjectId(id)};
      const updateDoc = {
        $set: { isCompleted: true }
      }
      const result = await tasksCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

  }
  finally{

  }
}

run().catch(err => console.log(err));


app.listen(port, console.log(`Listening on port: ${port}`));
