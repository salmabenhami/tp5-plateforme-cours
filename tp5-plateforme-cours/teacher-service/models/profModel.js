const mongoose=require('mongoose')
const profSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    bio:{
        type:String
    },
    cours:[{ 
        type:mongoose.Schema.Types.ObjectId, 
        ref:"Cours"
    }]
})
module.exports=mongoose.model('Professeur',profSchema)