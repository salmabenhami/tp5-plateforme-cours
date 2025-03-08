const express = require('express')
const jwt = require('jsonwebtoken')
const Professeur = require('../models/profModel')
const Cours = require('../../course-service/models/coursModel')
const Etudiant = require('../../student-service/models/etudiantModel')
const verifyToken = require('../middleware/verifyToken')
const router = express.Router()

router.use(express.json())

router.get('/all', verifyToken, (req, res) => {
    Professeur.find()
        .then((professeurs) => {
            res.json(professeurs)
        })
        .catch((err) => {
            res.status(500).json({ message: 'Erreur lors de la récupération des professeurs', error: err.message })
        })
})

router.post('/add', verifyToken, (req, res) => {
    const { name, bio } = req.body
    const newProfesseur = new Professeur({
        name,
        bio
    })
    newProfesseur.save()
        .then(() => {
            res.status(201).json({ message: 'Professeur ajouté avec succès' })
        })
        .catch((err) => {
            res.status(500).json({ message: 'Erreur lors de l\'ajout du professeur', error: err.message })
        })
})

router.post('/assign/:professeur_id/:cours_id', verifyToken, async (req, res) => {
    const { professeur_id, cours_id } = req.params;

    try {
        const cours = await Cours.findById(cours_id);
        if (!cours) {
            return res.status(404).json({ message: 'Cours non trouvé' });
        }

        if (!cours.disponible) {
            return res.status(400).json({ message: 'Le cours n\'est pas disponible' });
        }

        const professeur = await Professeur.findById(professeur_id);
        if (!professeur) {
            return res.status(404).json({ message: 'Professeur non trouvé' });
        }

        professeur.cours.push(cours_id);
        await professeur.save();

        res.json({ message: 'Cours attribué au professeur avec succès' });

    } catch (err) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
})
router.get('/enrolledStudents/:cours_id', verifyToken, (req, res) => {
    const { cours_id } = req.params
    Etudiant.find({ cours: cours_id })
        .then((etudiants) => {
            if (etudiants.length === 0) {
                return res.status(404).json({ message: 'Aucun étudiant inscrit à ce cours' })
            }
            res.json(etudiants)
        })
        .catch((err) => {
            res.status(500).json({ message: 'Erreur lors de la récupération des étudiants', error: err.message })
        })
})

module.exports = router
