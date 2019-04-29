const express = require('express');
const graphqlHttp = require('express-graphql');
const app = express();
const path = require('path')
//Firebase Setup
var firebaseAdmin = require("firebase-admin");

var serviceAccount = require("./serviceKey/clothingstore-ec64e-firebase-adminsdk-g5gaq-30bb618edf.json");

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://clothingstore-ec64e.firebaseio.com"
});/*  */
// Firebase Setup
const graphqlSchema =require('./graphql/schema/index') 
const graphqlResolvers = require('./graphql/resolvers/index')
const isAuth = require('./middleware/is-auth')


app.use(express.json());

app.use('/',(req,res,next)=>{
    res.sendFile(path.join(__dirname,'./web','build','indexes.html'))
})

app.use((req,res,next)=>{
    
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','*');
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
    if(req.method==='OPTIONS'){
        return res.sendStatus(200);
    }
    next()
})

app.use(isAuth)

app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
}));

app.listen(5000);


