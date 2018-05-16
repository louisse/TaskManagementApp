const express = require('express');
const db = require('./db')
const app = express();


app.get('/tasks', (req, res) => {
  console.log("/tasks");
  db.query('SELECT * FROM tasks', (err, result) => {
    if(result.rowCount == 0){
      return res.status(404).send('The task with the given id was not found.');
    } else{
      res.send(result.rows);
    }
  });
});

app.get('/tasks/:id', (req, res) => {
  db.query('SELECT * FROM tasks WHERE id = $1', [req.params.id], (err, result)=> {
    if(result.rowCount == 0){
      return res.status(404).send('The task with the given id was not found.');
    } else{
      res.send(result.rows);
    }
  });
});



app.listen(3000, () => console.log('Listening on port 3000...'));