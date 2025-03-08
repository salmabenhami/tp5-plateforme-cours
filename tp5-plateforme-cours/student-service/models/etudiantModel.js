const mongoose=require('mongoose')
const etudiantSchema=new mongoose.Schema({
    nom:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    cours:[{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:"Cours"
    }]
})
module.exports=mongoose.model('Etudiant',etudiantSchema)