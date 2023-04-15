const express = require('express');
const errorMiddleware = require('./Middlewares/error.js')
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path')

const corsConfig = {
    origin: true,
    credentials: true,
};
  
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb',extended:true}));
app.use(fileUpload());
app.use(express.json());
app.use(cookieParser());
//router import
const product = require('./Routers/ProductRouter');
const user = require('./Routers/UserRouter');
const order = require('./Routers/OrderRouter');
const contact = require('./Routers/ContactRouter.js');
const admin = require('./Routers/DashboardRouter.js')

app.use('/api/v1',product);
app.use('/api/v1',user);
app.use('/api/v1',order);
app.use('/api/v1',contact);
app.use('/api/v1',admin);

app.use(express.static(path.join(__dirname,'../frontend/build')));

app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'../frontend/build/index.html'))
})

//middlewares for errors
app.use(errorMiddleware);

module.exports =   app;