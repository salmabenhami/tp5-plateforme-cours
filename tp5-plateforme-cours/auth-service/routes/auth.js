const express=require('express')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const User=require('../models/utilisateur')
const verifyToken=require('../middleware/verifyToken')
const router=express.Router()
router.use(express.json())
router.post('/register',(req,res)=>{
    const{email,name,password}=req.body
    bcrypt.hash(password,10)
        .then((hashedPassword)=>{
            const newUser=new User({
                email,
                name,
                password:hashedPassword
            })
            newUser.save()
                .then(()=>{
                    res.status(201).json({msg:'Utilisateur créé avec succès'})
                })
                .catch(err=>{
                    console.error(err.message)
                    res.status(500).send('Erreur du serveur')
                })
        })
        .catch(err=>{
            console.error(err.message)
            res.status(500).send('Erreur de chiffrement du mot de passe')
        })
})
router.post('/login',(req,res)=>{
    const{email,password}=req.body
    User.findOne({email})
        .then((user)=>{
            if(!user){
                return res.status(400).json({msg:'Utilisateur non trouvé'})
            }
            bcrypt.compare(password,user.password)
                .then((isMatch)=>{
                    if(!isMatch){
                        return res.status(400).json({msg:'Mot de passe incorrect'})
                    }
                    const token=jwt.sign({email:user.email,name:user.name},process.env.JWT_SECRET)
                    res.json({token})
                })
                .catch(err=>{
                    console.error(err.message)
                    res.status(500).send('Erreur lors de la comparaison des mots de passe')
                })
        })
        .catch(err=>{
            console.error(err.message)
            res.status(500).send('Erreur du serveur')
        })
})

router.get('/profil',verifyToken,(req,res)=>{
    const userId=req.user.userid
    User.findById(userId)
        .then((user)=>{
            if(!user){
                return res.status(404).json({msg:'Utilisateur non trouvé'})
            }
            res.json({
                email:user.email,
                name:user.name
            })
        })
        .catch((err)=>{
            console.error(err.message)
            res.status(505).send('rreur du serveur')
        })
})

module.exports=router
