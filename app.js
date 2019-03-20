const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const PORT = 3000;

const app = express();
app.use(bodyParser.json());

const db = require('./db');
const collection = 'todo';

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/todos', (req, res, next) => {
  db.getDB()
    .collection(collection)
    .find({})
    .toArray((err, documents) => {
      if (err) {
        console.error(err);
      } else {
        console.log(documents);
        res.json(documents);
      }
    });
});

app.post('/', (req, res, next) => {
  const userInput = req.body;
  db.getDB()
    .collection(collection)
    .insertOne(userInput, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        res.json({ result, document: result.ops[0] });
      }
    });
});

app.put('/:id', (req, res, next) => {
  const todoID = req.params.id;
  const userInput = req.body;

  db.getDB()
    .collection(collection)
    .findOneAndUpdate(
      { _id: db.getPrimaryKey(todoID) },
      { $set: { todo: userInput.todo } },
      { returnOriginal: false },
      (err, result) => {
        if (err) {
          console.error(err);
        } else {
          res.json(result);
        }
      }
    );
});

db.connect(err => {
  if (err) {
    console.log('Unable to connect to database');
    process.exit(1);
  } else {
    app.listen(PORT, () => {
      console.log('Connected to database! App listening on port ', PORT);
    });
  }
});
