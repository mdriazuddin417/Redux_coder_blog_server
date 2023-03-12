require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://moontech:hswk8ZJ55M8bkSIm@cluster0.3iomypj.mongodb.net/?retryWrites=true&w=majority";
// const uri = "mongodb://localhost:27017/coderBlog";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("moontech");
    const productCollection = db.collection("blogs");

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const cursor = productCollection.find({ _id: ObjectId(id) });
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.post("/product", async (req, res) => {
      const product = req.body;

      const result = await productCollection.insertOne(product);

      res.send(result);
    });

    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;

      const result = await productCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
    app.patch("/product/:id", async (req, res) => {
      const id = req.params.id;

      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const product = req.body;
      const updateDoc = {
        $set: {
          ...product,
        },
      };

      const result = await productCollection.updateOne(
        filter,
        updateDoc,
        options,
      );
      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
