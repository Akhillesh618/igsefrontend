const express = require('express');
const app = express();

app.listen(5000, () => {
  console.log('Server listening on port 3000');
});

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://akhil:8686Amma@cluster0.9ha2pr2.mongodb.net/cluster0?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set('strictQuery', false)

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Successfully connected to MongoDB!');
});




app.get('/', (req, res) => {
    res.send('Hello, World!');
  });
  