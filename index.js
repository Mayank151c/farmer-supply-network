// app.js

const express = require('express');
const mongoose = require('mongoose');
const chainController = require('./controllers/chainController');
const userController = require('./controllers/userController');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); 

app.use((req, res, next)=> {console.log(req.url); next()})
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error(error));
 

app.get('/', (req,res)=>{
    res.render('home',{login: 0});
})
app.get('/login', async(req,res)=>{
    res.render('home',{login: 1});
})
app.get('/main', userController.auth, (req,res)=>{
    console.log(req.viewdata);
    res.render('main',req.viewdata);
})



app.post('/login', userController.login);
app.post('/signup', userController.signup);
app.post('/addcrop', chainController.addcrop);


app.get('/mycrop/:id', chainController.mycrop);
app.get('/allcrop', chainController.allcrop);
app.get('/alldistributor', userController.alldistributer);
app.get('/buycrop', chainController.buycrop);
app.put('/updatecrop', chainController.updatecrop);



app.post('/user', userController.create);
app.get('/user/:id', userController.readById);
app.put('/user/:id', userController.update);





app.listen(3000, () => console.log('Server started on port 5000'));
