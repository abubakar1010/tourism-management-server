
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a2ulpwj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    await client.connect();

    const database = client.db("touristDB");
    const touristsCollection = database.collection("touristsCollection");

    app.get("/tourists", async (req, res) => {
      const cursor = touristsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/tourists/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristsCollection.findOne(query);
      res.send(result);
    });
    app.get("/tourists/email/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email); 
      const query = { email: email };
      const cursor =  touristsCollection.find(query);
      const result = await cursor.toArray()
      res.send(result);  
    });

    app.get("/tourists/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristsCollection.findOne(query);
      res.send(result);
    });

    app.post("/tourists", async (req, res) => {
      const newTourist = req.body;
      console.log(newTourist);
      const result = await touristsCollection.insertOne(newTourist);
      res.send(result);
    });

    app.put("/tourists/update/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateTourists = req.body
      const tourists = {
        $set: {
          name: updateTourists.name,
          email: updateTourists.email,
          spotName: updateTourists.spotName,
          countryName: updateTourists.countryName,
          image: updateTourists.image,
          location: updateTourists.location,
          cost: updateTourists.cost,
          season: updateTourists.season,
          time: updateTourists.time,
          visitor: updateTourists.visitor,
          description: updateTourists.description,
        },
      };
      const result = touristsCollection.updateOne(filter, tourists, option)
      res.send(result)
    });


    // app.delete("/tourists/delete/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await touristsCollection.deleteOne(query);
    //   res.send(result);
    // });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("tourismManagement server is running");
  });
  
  app.listen(port, () => {
    console.log(`tourismManagement server is running on port ${port}`);
  });