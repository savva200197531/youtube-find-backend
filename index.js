const express = require('express');
const cors = require('cors');
const lowDb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const bodyParser = require('body-parser');
// const { nanoid } = require('nanoid');

const db = lowDb(new FileSync('db.json'));

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = 4000;

app.get('/users', (req, res) => {
  const data = db.get('users').value();
  return res.json(data);
});

app.get('/favorites', (req, res) => {
  const data = db.get('favorites').value();
  return res.json(data);
});

app.post('/users/new', (req, res) => {
  const userDetails = req.body;
  db.set(`users.${userDetails.id}`, userDetails).write();
  res.json({ success: true });
});

app.post('/favorites/new', (req, res) => {
  const data = req.body;
  db.set(`favorites.${data.userId}.${data.id}`, data).write();
  res.json({ success: true });
});

app.post('/favorites/remove', (req, res) => {
  const data = req.body;
  console.log(data.userId);
  console.log(data.id);
  db.get(`favorites.${data.userId}`)
    .unset(data.id)
    .value();
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});
