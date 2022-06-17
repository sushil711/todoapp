//Require express
const express = require("express");
const app = express();

const Todo = require("./models/TodoTask");

const dotenv = require("dotenv");
dotenv.config();

app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));
//View Engine Configuration
app.set("view engine", "ejs");

const mongoose = require("mongoose");


mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
   
});




app.get("/", (req, res) => {
    console.log("sushil");
    Todo.find({}, null, {sort: {_id: -1}} ,(err, tasks) => {
        
        if (err) {
            console.log({err});
        }
        if (tasks) {
            console.log({ tasks });
            res.render("todo.ejs",{todoTasks :tasks});
        }
        else {
            res.render("todo.ejs",{todoTasks : []});
        }
    });
    
});

app.post('/', async (req, res) => {
    const todoTask = new Todo({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

//UPDATE
app
.route("/edit/:id")
.post((req, res) => {
const id = req.params.id;
Todo.findByIdAndUpdate(id, { content: req.body.content }, err => {
if (err) return res.send(500, err);
res.redirect("/");
});
});

//DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    Todo.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
});
    



app.listen(3000, () => console.log("Server Up and running yahoooo!!"));
