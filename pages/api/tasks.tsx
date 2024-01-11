import { NextApiRequest, NextApiResponse } from 'next';

let tasks = [
    {id: 123, text: 'Task from backend', checked: false},
    {id: 432, text: 'Another task', checked: true},
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            getTasks(req, res);
            break;
        case 'POST':
            addTask(req, res)
            break;
        case 'DELETE':
            removeTask(req, res)
        case 'PATCH':
            completeTask(req, res)
        default:
            break;
    }
}

function getTasks(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json(tasks)
}

function addTask(req: NextApiRequest, res: NextApiResponse) {
    tasks = [...tasks, {id: Math.random(), text: req.body.text, checked: false}]

    res.status(201).json(tasks);
}

function removeTask(req: NextApiRequest, res: NextApiResponse) {
    const id = req.body.id;
    tasks = tasks.filter(t => t.id !== id);

    res.status(200).json(tasks);
}

function completeTask(req: NextApiRequest, res: NextApiResponse) {
    const id = req.body.id;
    const newList = tasks.map(t => {
        if (t.id=== id) {
          t.checked = !t.checked
        }
  
        return t
      })
  
    tasks = newList;

    res.status(200).json(tasks);
}