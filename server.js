const express = require('express');
const passport = require('passport');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;
const path = require("path"); //Es para poner dirname, es una libreria de node
require('dotenv').config({path:'./.env'}); //Esto es para poder traerlo desde el env
require('dotenv').config(); //Con esto lo puedo leer como texto plano

const usuario = process.env.user; //Declaro que le voy a poner usuario a lo que traiga desde env
const contraseña = process.env.password; //Declaro que le voy a poner contraseña a lo que traiga desde env


//comando para ejectuarlo nodemon: npm run start
//comando para ejecutarlo con node: node app.js (app es el nombre del archivo)

app.use(express.urlencoded({extended: true}));

app.use(cookieParser('Un secreto'));

app.use(session({
    secret: "Un secreto",
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new PassportLocal(function(username,password,done){
    if(username === "nicolas" && password === "123456")
    return done(null, {id: 1, name: "Nico"});

    else if(username === "fabrizio" && password === "123456")
    return done(null, {id: 2, name: "Fabri"});

    else if(username === usuario && password === contraseña) //De esta manera obtengo las credenciales con el .env y no declarandolo en el array
    return done(null, {id: 3, name: "Sergio"});

    done(null,false);
}))

passport.serializeUser(function(user,done){
    done(null,user.id)
})

passport.deserializeUser(function(id,done){
    done(null,{id: 1, name: "Nico"});
})

app.set('view engine','ejs')

app.get('/',(req,res)=>{
    res.render("index");
}) 

app.get("/",  (req,res,next) =>{
    if(req.isAuthenticated()) return next(); //Eso lo que hace es, si está bien que siga para adelante con next. Si no vuelva a la pagina principal (en mi caso va a ser error)

    res.redirect("/login");
}   ,(req,res)=>{
    res.render("mensajes");
})

app.get("/login",(req,res)=>{
   //Mostrar el formulario

   res.render("login");
})

app.post("/login",passport.authenticate('local',{
    successRedirect: "/mensajes",
    failureRedirect: "/login"
}));

app.listen(3000,()=>{
    console.log("Servidor corriendo",3000); //Muestra por consola que el servidor está corriendo
});

//Hasta aca funciona bien el login.

app.get('/contacto',(req,res)=>{
    res.render("contacto");
})

app.get('/index',(req,res)=>{
    res.render("index");
})

 app.get('/mensajes',(req,res)=>{
    res.render("mensajes");
}) 

