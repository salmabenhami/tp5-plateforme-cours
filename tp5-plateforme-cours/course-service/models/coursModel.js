const mongoose=require('mongoose')
const coursSchema=new mongoose.Schema({
    titre:{
        type:String,
        required:true
    },
    professeur_id:{
        type:String,
        ref:'Professeur',
        required:true
    },
    description:{
        type:String,
        required:true
    },
    prix:{
        type:Number,
        required:true
    },
    disponible: {
        type: Boolean,
        default: true, 
    }
})
module.exports=mongoose.model('Cours',coursSchema)