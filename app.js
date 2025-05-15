const express=require('express');
const mongoose=require('mongoose'); 
const ejs=require('ejs');
const bodyParser=require('body-parser');
require('dotenv').config();
const app=express();    

mongoose.connect(process.env.MONGO_URL)
app.use(express.json());
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

require('./models/todo');
app.use(express.static('public'));
const todo=mongoose.model('Todo');

app.get('/',async(req,res)=>{
    const data=await todo.find({}).exec();
    res.render('index',{todos:data});
});

app.post('/',async(req,res)=>{
    let data=new todo({
        task:req.body.task,
        completed:false
    });
    const savedata=await data.save();
    res.redirect('/');
});

app.post('/:id',async(req,res)=>{
    const id=req.params.id;
    const data=await todo.findById(id);
    await data.deleteOne()
    res.redirect('/');
});

app.get('/edit/:id',async(req,res)=>{
    const id=req.params.id;
    const data=await todo.findById(id);
    res.render('edit',{task: data});
});

app.post('/edit/:id',async(req,res)=>{
    const id=req.params.id;
    const newtask=req.body.task;
    await todo.findByIdAndUpdate(id,{task:newtask});
    res.redirect('/');
});

app.listen(3000, () => {
    console.log("Click on the link to open the app: http://localhost:3000");
    console.log("Server is running on port 3000");
});
