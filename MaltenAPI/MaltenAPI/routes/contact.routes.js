const express = require('express');
const router = express.Router();

const Contact = require('../models/contact.model');

const requireAuth = require('../middleware/authRequired')

// Multer til håndtering af filer
const multer = require('multer')
const upload = multer({

    storage: multer.diskStorage({
        destination: function(req, file, cb){
            cb(null, 'public/images')
        },
        filename: function(req, file, cb){
            //cb(null, file.originalname)
            cb(null, Date.now() + "-" + file.originalname)
        },
    })

})

// GET ALL CONTACTS
router.get('/', async (req, res) => {
    console.log("GET - Get all opening hours");
    try {
        const contact = await Contact.find();
        return res.status(200).json({ contact: contact });
    } catch (error) {
        return res.status(400).json({ message: "Der er opstået en fejl", error: error.message, contact: null });
    }
});

// POST CONTACT
router.post("/", requireAuth, upload.single('contactimage'), async (req, res) => {
    console.log("POST - Create Contact");
    try {
        
        const contact = new Contact(req.body);
        contact.contactimage = req.file.filename // Filnavn fra Multer
        
        await contact.save();
        res.status(201).json({ message: "Kontakt er oprettet", contact: contact });

    } catch (error) {

        console.log(error.message);
        res.status(400).json({ message: "Der er sket en fejl", error: error.message, contact: null });

    }
});

// PUT EDIT CONTACT
router.put("/:ID", requireAuth, upload.single('contactimage'), async (req, res) => {

    console.log("Put - edit kontakt");
    try {

        // Billede sendt ind til rettelse - Mas evt. image ind i requestet
        if (req.file) {
            req.body.contactimage = req.file.filename
        } 

        const contact = await Contact.findByIdAndUpdate(req.params.ID, req.body, { new: true });

        if (contact == null) {
            return res.status(404).json({ message: "Ingen kontakter matcher ID - intet rettet", contact: null });
        }

        res.status(201).json({ message: "Kontakten er rettet", contact: contact });

    } catch (error) {

        console.log(error.message);
        res.status(400).json({ message: "Der er sket en fejl", error: error.message, contact: null });

    }
});

// DELETE CONTACT
router.delete("/:ID", requireAuth, async (req, res) => {
    console.log("DELETE - delete");
    try {
        const contact = await Contact.findByIdAndDelete(req.params.ID);
        if (contact == null) {
            return res.status(404).json({ message: "Ingen kontakter matcher ID - intet slettet", contact: null });
        }
        return res.status(200).json({ message: "Kontakten er slettet", contact: req.params.ID });
    } catch (error) {
        return res.status(400).json({ message: "Der er opstået en fejl", error: error.message, contact: null });
    }
});

module.exports = router;