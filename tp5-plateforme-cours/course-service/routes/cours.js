const express=require('express')
const jwt=require('jsonwebtoken')
const Cours=require('../models/coursModel')
const verifyToken=require('../middleware/verifyToken')
const router=express.Router()
router.use(express.json())
router.get('/all',verifyToken,(req,res)=>{
    Cours.find().then(cours=>res.json(cours))
    .catch(err=>{
        console.log(err.message)
        res.status(500).send('erreur')
    })
})
router.post('/add',verifyToken,(req,res)=>{
    const{titre,professeur_id,description,prix}=req.body
    const newcours=new Cours({
        titre,professeur_id,description,prix
    })
    newcours.save()
    .then(()=>res.status(201).json('ajouté avec succes'))
    .catch(err=>{
        console.error(err.message)
        res.status(500).send('erreur du serveur')
    })
})
router.put('/update/:id',verifyToken,(req,res)=>{
    const idcours=req.params.id
    const{titre,professeur_id,description,prix}=req.body
    Cours.findByIdAndUpdate(
        idcours,
        {titre,professeur_id,description,prix},
        {new:true}
    )
    .then(elt=>{
        if(!elt){
            return res.status(404).json({msg:'cours non trouvé'})
        }
        res.json({msg:'cours mis à jour avec succès'})
    })
    .catch(err=>{
        console.error(err.message)
        res.status(500).send('erreur du service')
    })
})
router.delete('/delete/:id',verifyToken,(req,res)=>{
    const idcours=req.params.id
    Cours.findByIdAndDelete(idcours)
    .then(elt=>{
        if(!elt){
            return res.status(404).json({msg:'cours non trouvé'})
        }
        res.json({msg:'supprimé avec succès'})
    })
    .catch(err=>{
        console.error(err.message)
        res.status(500).send('erreur du serveur')
    })
})
router.get('/search',verifyToken,(req,res)=>{
    const {q}=req.query
    if(!q){
        return res.status(400).json({msg:'terme invalide'})
    }
    Cours.find({
        $or:[
            {titre:{$regex:q,$options:'i'}},
            {description:{$regex:q,$options:'i'}}
        ]
    })
    .then(cours=>{
        if(cours.length===0){
            return res.status(404).json({msg:'cours non trouvé'})
        }
        res.json(cours)
    })
    .catch(err=>{
        console.error(err.message)
        res.status(500).send('erreur de serveur')
    })
})
module.exports=router