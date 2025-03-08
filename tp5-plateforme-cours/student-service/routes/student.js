const express = require('express')
const jwt = require('jsonwebtoken')
const Etudiant = require('../models/etudiantModel')
const Cours = require('../../course-service/models/coursModel')
const verifyToken = require('../middleware/verifyToken')
const router = express.Router()
router.use(express.json())

router.get('/all', verifyToken, (req, res) => {
    Etudiant.find().then((etudiant) => res.json(etudiant))
    .catch(err => {
        console.error(err.message)
        res.status(500).send('erreur du serveur')
    })
})

router.post('/add', verifyToken, (req, res) => {
    const { nom, email, cours } = req.body
    const newEtudiant = new Etudiant({
        nom, email, cours
    })
    newEtudiant.save()
    .then(() => res.status(201).json('etudiant ajouté avec succes'))
    .catch(err => {
        console.error(err.message)
        res.status(500).send('erreur du serveur')
    })
})

router.post('/enroll/:etudiant_id/:cours_id', verifyToken, (req, res) => {
    const { etudiant_id, cours_id } = req.params
    Etudiant.findById(etudiant_id).then((etudiant) => {
        if (!etudiant) {
            return res.status(404).json({ message: 'Étudiant non trouvé' })
        }
        if (!Array.isArray(etudiant.cours)) {
            etudiant.cours = []
        }
        if (etudiant.cours.includes(cours_id)) {
            return res.status(400).json({ message: 'L\'étudiant est déjà inscrit à ce cours' })
        }
        Cours.findById(cours_id).then((cours) => {
            if (!cours) {
                return res.status(404).json({ message: 'Cours non trouvé' })
            }
            if (!cours.disponible) { // Si le cours n'est pas disponible (false)
                return res.status(400).json({ message: 'Le cours n\'est pas disponible' })
            }
            etudiant.cours.push(cours_id)
            etudiant.save().then(() => {
                cours.disponible = false // Cours devient indisponible après inscription
                cours.save().then(() => {
                    res.json({ message: 'Inscription réussie' })
                }).catch((err) => {
                    res.status(500).json({ message: 'Erreur lors de la mise à jour du cours', error: err.message })
                })
            }).catch((err) => {
                res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'étudiant', error: err.message })
            })
        }).catch((err) => {
            res.status(500).json({ message: 'Erreur lors de la recherche du cours', error: err.message })
        })
    }).catch((err) => {
        res.status(500).json({ message: 'Erreur lors de la recherche de l\'étudiant', error: err.message })
    })
})

router.get('/enrolledCourses/:etudiant_id', verifyToken, (req, res) => {
    const { etudiant_id } = req.params
    Etudiant.findById(etudiant_id).then((etudiant) => {
        if (!etudiant) {
            return res.status(404).json({ message: 'Étudiant non trouvé' })
        }
        Cours.find({ '_id': { $in: etudiant.cours } }).then((cours) => {
            const validCours = etudiant.cours.filter(coursId => cours.some(c => c._id.toString() === coursId.toString()))
            etudiant.cours = validCours
            etudiant.save().then(() => {
                res.json(cours)
            }).catch((err) => {
                res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'étudiant', error: err.message })
            })
        }).catch((err) => {
            res.status(500).json({ message: 'Erreur lors de la récupération des cours', error: err.message })
        })
    }).catch((err) => {
        res.status(500).json({ message: 'Erreur lors de la recherche de l\'étudiant', error: err.message })
    })
})

module.exports = router;
