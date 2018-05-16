const express = require('express');
const Joi = require('joi');
const db = require('./db')
const app = express();

app.use(express.json());

app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, result) => {
    if(!result.rowCount){
      return res.status(404).send('Error: ', err);
    } else{
      res.send(result.rows);
    }
  });
});

app.get('/tasks/:id', (req, res) => {
  db.query('SELECT * FROM tasks WHERE id = $1', [req.params.id], (err, result)=> {
    if(!result.rowCount){
      return res.status(404).send('Error: ', err);
    } else{
      res.send(result.rows);
    }
  });
});

app.post('/tasks/', (req, res) => {
  const schema = {
    name: Joi.string().min(3).max(150).required(),
     description: Joi.string().min(3).max(255).required(),
  };
  Joi.validate(req.body, schema, (err, value) => {
    if(err){
      res.status(400).send(err.details[0].message);
    } else{
      const { name, description} = value;
      db.query('INSERT INTO tasks(name, description) VALUES($1, $2) RETURNING id', [name, description], (err, result)=> {
        if(!result.rowCount){
          return res.status(404).send('Error: ', err);
        } else{
          res.send({
            id: result.rows[0].id,
            name: name,
            description: description
          });
        }
      });
    }
  });
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM tasks WHERE id = $1', [id], (err, result)=> {
    if(!result.rowCount){
      return res.status(404).send('Error: ', err);
    } else{
      const task = result.rows[0];
      db.query('DELETE FROM tasks WHERE id=$1', [id], (err, result)=> {
        if(!result.rowCount){
          return res.status(404).send('Error: ', err);
        } else{
          res.send(task);
        }
      });
    }
  });
});


app.listen(3000, () => console.log('Listening on port 3000...'));
