const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { Client } = require("@elastic/elasticsearch");
dotenv.config();

const {
  port,
  elastic_node,
  elastic_username,
  elastic_password,
  elastic_fingerprint,
} = process.env;

const client = new Client({
  node: elastic_node,
  auth: {
    username: elastic_username,
    password: elastic_password,
  },
  caFingerprint: elastic_fingerprint,
  tls: {
    rejectUnauthorized: false,
  },
});

app.use(express.json());

app.get("/", (req, res) => {
  res.json("Hello World!");
});

app.post("/elastic/create-index", async (req, res) => {
  try {
    let { index } = req.body;

    await client.indices.create({
      index: index,
    });

    res.status(200).json({
      message: "success",
      data: null,
    });
  } catch (error) {
    console.log("error", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

app.post("/elastic/delete-index", async (req, res) => {
  try {
    let { index } = req.body;

    await client.indices.delete({
      index: index,
    });

    res.status(200).json({
      message: "success",
      data: null,
    });
  } catch (error) {
    console.log("error", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

app.post("/elastic/get-document", async (req, res) => {
  try {
    let { index, document_id } = req.body;

    let response = await client.get({
      index: index,
      id: document_id,
    });

    console.log("object", response);

    res.status(200).json({
      message: "success",
      data: response,
    });
  } catch (error) {
    console.log("error", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

app.post("/elastic/create-document", async (req, res) => {
  try {
    let { index, document_id, data } = req.body;

    await client.create({
      index: index,
      id: document_id,
      document: data,
    });

    res.status(200).json({
      message: "success",
      data: null,
    });
  } catch (error) {
    console.log("error", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

app.post("/elastic/update-document", async (req, res) => {
  try {
    let { index, document_id, data } = req.body;

    await client.update({
      index: index,
      id: document_id,
      doc: data,
    });

    res.status(200).json({
      message: "success",
      data: null,
    });
  } catch (error) {
    console.log("error", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

app.post("/elastic/search-document", async (req, res) => {
  try {
    let response = await client.search({
      query: {
        match: req.body,
      },
    });

    res.status(200).json({
      message: "success",
      data: response,
    });
  } catch (error) {
    console.log("error", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

app.post("/elastic/delete-document", async (req, res) => {
  try {
    let { index, document_id } = req.body;

    await client.delete({
      index: index,
      id: document_id,
    });

    res.status(200).json({
      message: "success",
      data: null,
    });
  } catch (error) {
    console.log("error", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
