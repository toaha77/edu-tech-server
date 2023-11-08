const express = require('express');
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();


const port = process.env.PORT || 5000


app.use(cors());
app.use(express.json())




const uri = "mongodb+srv://hw1020471:BCq5Kfz4OhkoHD8P@cluster0.qpzgaq6.mongodb.net/?retryWrites=true&w=majority";

 
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const featureCollection = client.db('study').collection('feature')
    const createCollection = client.db('study').collection('create-assignment')

  


// services related api
    app.get('/feature', async(req, res)=>{
        const cursor = featureCollection.find()
        const result =  await cursor.toArray()
        res.send(result)
    })

    app.get('/page-assignment', async(req,res)=>{
      const page = parseInt(req.query.page)
      const size = parseInt(req.query.size)
       
         
        const result = await createCollection.find()
        .skip(page * size)
        .limit(size)
        .toArray()
        res.send(result)
    })
    app.post('/create-assignment', async(req, res)=>{
        const assignment = req.body
        const result = await createCollection.insertOne(assignment)
        console.log(result);
        res.send(result)
    })

    app.get('/create-assignment', async(req, res)=> {
      let query = {}
     if (req.query?.email) {
      query = {email: req.query.email}
     }
      const result = await createCollection.find(query).toArray()
      res.send(result)
    })

    app.delete('/create-assignment/:id', async(req, res)=>{
        const id = req.params.id
        const query  = {_id: new ObjectId(id)}
        const result = await createCollection.deleteOne(query)
        res.send(result)
    })

    app.get('/create-assignment/:id', async (req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await createCollection.findOne(query)
      res.send(result)
    })
/ 

    app.put('/create-assignment/:id', async (req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const update=  req.body
      const assignment = {
        $set: {
       
          name: update.name,
           marks: update.marks,
           photo: update.photo,
           data: update.data,
           description: update.description,

        }
      }
      const result = await createCollection.updateOne(query, assignment, options)
      res.send(result)
    })

    app.get('/assignmentCount', async(req, res)=>{
      const count = await createCollection.estimatedDocumentCount()
     
      res.send({count})
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('group study is running')
  })
  
   app.listen(port, () => console.log(`Example app listening on port ${port}!`));