const Joi = require('joi');

const db = require('./db')

const express = require('express');
const app = express();

app.use(express.json());

const tasks = [
	{ id: 1, name: 'task1' },
	{ id: 2, name: 'task2' },
	{ id: 3, name: 'task3' },
];

app.get('/tasks', (req, res) => {
	console.log("/tasks");
	db.query('SELECT * FROM tasks', (err, result) => {
		if(err){
			return res.status(404).send('Error', err);
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