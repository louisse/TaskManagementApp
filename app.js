const path = require('path');
const express = require('express');
const Joi = require('joi');
const db = require('./db')
const bodyParser = require('body-parser');

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.json());


app.get('/test', (req, res) => {
  //res.sendFile(path.join(__dirname, 'test.html'));
  res.render('index', { title: 'Cool, huh!', condition: true, anyArray: [1,2,3] });
});


app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks ORDER BY id', (err, result) => {
    if(!result.rowCount){
      return res.status(404).send('Error: ', err);
    } else{
      //res.send(result.rows);
      res.render('index', { title: 'Tasks DB', rows: result.rows });
    }
  });
});

app.get('/tasks/add', (req, res) => {
  res.render('add_form', { title: 'Add Task Form', action: '/tasks/' });
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

app.post('/tasks/', urlencodedParser, (req, res, next) => {
  const schema = {
    name: Joi.string().min(3).max(150).required(),
     description: Joi.string().min(3).max(255).required(),
  };
  Joi.validate(req.body, schema, (err, value) => {
    if(err){
      return res.status(400).send(err.details[0].message);
    } else{
      const { name, description} = value;
      db.query('INSERT INTO tasks(name, description) VALUES($1, $2) RETURNING id, name, description', [name, description], (err, result)=> {
        if(!result.rowCount){
          return res.status(404).send('Error: ', err);
        } else{
          res.redirect('/tasks');
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

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM tasks WHERE id = $1', [id], (err, result)=> {
    if(!result.rowCount){
      return res.status(404).send('Error: ', err);
    } else{
      const schema = {
        name: Joi.string().min(3).max(150).required(),
         description: Joi.string().min(3).max(255).required(),
      };
      Joi.validate(req.body, schema, (err, value) => {
        if(err){
          return res.status(400).send(err.details[0].message);
        } else{
          const { name, description } = value;
          db.query('UPDATE tasks SET name=$1, description=$2 WHERE id=$3 RETURNING id, name, description', [name, description, id], (err, result)=> {
            if(!result.rowCount){
              return res.status(404).send('Error: ', err);
            } else{
              res.send(result.rows[0]);
            }
          });
        }
      });
    }
  });
});


app.listen(3000, () => console.log('Listening on port 3000...'));
