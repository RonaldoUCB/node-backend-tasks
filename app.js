const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        res.status(200).json({});
    }
    next();
});

//---------------------------------------------------------------------

var tasks = []

app.get("/tasks", (req, res, next) => {
    res.status(200).json({
        message: "Listado OK",
        list: tasks
    });
});

app.get("/tasks/:id", (req, res, next) => {
        const id = req.params.id
        const obj = tasks.find(o => o.id == id);
        res.status(200).json({
            message: "Obtener OK",
            object: obj
        });
});

app.post("/tasks", (req, res, next) => {
    req.body.id = tasks.length + 1;
    tasks.push(req.body);
    res.status(200).json({
        message: "Crear OK",
        object: tasks[tasks.length - 1]
    });
});

app.put("/tasks/:id", (req, res, next) => {
    const id = req.params.id
    const state = req.query.state
    if(state==null){
        const ind = tasks.findIndex(o => o.id == id);
        tasks[ind] = req.body
        tasks[ind].id = id
        res.status(200).json({
            message: "Editar OK",
            object: tasks[ind]
        });
    }
    if(state==="completed"){
        const ind = tasks.findIndex(o => o.id == id);
        tasks[ind].state = state
        res.status(200).json({
            message: "Completado OK",
            object: tasks[ind]
        });
    }
    if(state==="pending"){
        const ind = tasks.findIndex(o => o.id == id);
        tasks[ind].state = state
        res.status(200).json({
            message: "Pendiente OK",
            object: tasks[ind]
        });
    }
});

app.delete("/tasks/:id", (req, res, next) => {
    const id = req.params.id
    const ind = tasks.findIndex(o => o.id == id);
    tasks.splice(ind, 1);
    res.status(200).json({
        message: "Eliminado OK"
    });
});

//---------------------------------------------------------------------

app.use((req,res,next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;