'use strict';

require('dotenv').config();
const express= require('express');
const pg= require('pg');
const superagent= require('superagent');
const methodOverride= require("method-override");
const PORT = process.env.PORT||3000 ;
const app= express();


app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

const client = new pg.Client({ connectionString: process.env.DATABASE_URL,
       ssl: { rejectUnauthorized: false }
});

// Rout 

app.get('/',homeHandler);
app.post('/save',saveHandler);
app.get('/favorite-quotes',favHnadler);
app.get('/favorite-quotes/:id',detailHandler);
app.put('/update/:id',updateHandler);
app.delete('/delete/:id',deleteHandler);
app.get('*',errorHandler);


//ROut HandLER
function homeHandler(req ,res){
    // res.send('yew server is work')
    let url =`https://thesimpsonsquoteapi.glitch.me/quotes?count=10`;
    superagent.get(url).set('User-Agent', '1.0')
    .then(data=>{
        // res.send(data.body);
        res.render('index',{myData:data.body});
    })
}

function saveHandler(req ,res){
    // res.send('yew server is work')
    let {character,quote,image} =req.body;
    let sql =`INSERT INTO simpsons (character,quote,image) VALUES ($1,$2,$3) RETURNING *;`;
    let saveValues =[character,quote,image];
    client.query(sql,saveValues)
    .then(result=>{
        console.log(result.rows);
        res.redirect(`/favorite-quotes`)
    })
}

function favHnadler(req,res){
    let sql = `SELECT * FROM simpsons;`;
    client.query(sql)
    .then(data=>{
        res.render('favorite-quotes',{myData:data.rows})
    })
}
function detailHandler (req,res){
    let sql =`SELECT * FROM simpsons WHERE id=$1;`;
    let saveValues =[req.params.id];
    client.query(sql,saveValues)
    .then(data=>{
        res.render('detail',{myData:data.rows[0]})
    })
}

function updateHandler (req ,res){
    
    let {quote} =req.body;
    let sql = `UPDATE simpsons SET quote=$1 WHERE id=$2;`;
    let saveValues= [quote,req.params.id];
    client.query(sql,saveValues)
    .then(data=>{
        res.redirect(`/favorite-quotes/${req.params.id}`);
    })
    
}

function deleteHandler (req ,res){
    
    // let {character,quote,image} =req.query;
    let sql = `UPDATE simpsons SET quote=null WHERE id=$1;`;
    let saveValues= [req.params.id];
    client.query(sql,saveValues)
    .then(data=>{
        res.redirect(`/favorite-quotes/${req.params.id}`);
    })
    
}
function errorHandler(req ,res){
    res.send('yeu have error حبيبي');
}
// Constructor

     
client.connect()
 .then(()=>{
     app.listen(PORT,()=>{
         console.log(`listening on PORT ${PORT}`);
     });
 })    