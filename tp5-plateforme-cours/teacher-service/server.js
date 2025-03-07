require('dotenv').config()
const express=require('express')
const mongoose=require('mongoose')
const server=express()
server.use(express.json())
const verifyToken=require('./middleware/verifyToken')
const mongoURI=`${process.env.URL_MONGOOSE}/${process.env.DBNAME}`
mongoose.connect(mongoURI)
  .then(()=>console.log(`Connexion réussie à MongoDB à l'URL: ${mongoURI}`))
  .catch((err)=>console.error("Erreur de connexion à MongoDB:",err))

const PORT=process.env.PORT||3004
server.get('/',(req,res)=>{
  res.send('teacher server')
})
server.listen(PORT,()=>{
  console.log(`Serveur en écoute sur le port ${PORT}`)
})
