const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const tasks = [
	{ id: 1, name: 'task1' },
	{ id: 2, name: 'task2' },
	{ id: 3, name: 'task3' },
];

app.get('/tasks', (req, res) => {
	res.send(tasks);
});

app.get('/tasks/:id', (req, res) => {
	const task = tasks.find(c => c.id === parseInt(req.params.id));
	if(!task) return res.status(404).send('The task with the given id was not found.');
	res.send(task);
});

app.listen(3000, () => console.log('Listening on port 3000...'));