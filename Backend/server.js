const app = require('./app.js');
const connection = require('./configuration/database.js');
const cloudinary = require('cloudinary');

//config.env
if(process.env.NODE_ENV !== 'PRODUCTION'){
    require('dotenv').config({path:"Backend/configuration/config.env"});
}

//Uncaught Error
process.on('uncaughtException',err=>{
    console.log(`message:${err.message}`);
    console.log('Shutting down the server due to the Unhandled Promise Rejection');
    process.exit(1);
})

// db connection
connection();
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

//port 
const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
})

//Unhandled promise rejection
process.on("unhandledRejection",err=>{
    console.log(`message:${err.message}`);
    console.log('Shutting down the server due to the Unhandled Promise Rejection');
    server.close(()=>{
        process.exit(1);
    })
})