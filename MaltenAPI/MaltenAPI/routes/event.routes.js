const express = require('express');
const router = express.Router();

// Henter category model
const Event = require('../models/event.model');

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

// GET ALL EVENTS - With count
router.get('/', async (req, res) => {
    console.log("GET - all events - med mulighed for count/antal");
    try {

        let count = parseInt(req.query.count, 10)
        let events
        // Count skal være tal (ingen bogstaver), det skal være et heltal (ingen decimaltal) og det skal være større end 0
        if (isNaN(count)|| !Number.isInteger(count) || count <= 0) {
            // Hvis count er forkert bliver den sat til at finde alle
            events = await Event.find()
        } else {
            //const products = await Product.find();
            events = await Event.find().limit(count) // POSTMAN - ?count=2 for at kalde den, ? fordi det er en query string
        }


        return res.status(200).json({ events: events });
    } catch (error) {
        return res.status(400).json({ message: "Der er opstået en fejl", error: error.message, events: null });
    }
});

// GET EVENT BY ID
router.get('/:ID', async (req, res) => {
    console.log('GET - event/:ID - event ud fra ID');
    try {
        const event = await Event.findById(req.params.ID).populate('category')
        return res.status(200).json({ event: event });
    } catch (error) {
        return res.status(400).json({ message: "der er opstået en fejl", error: error.message, event: null });
    }
});

// GET - SEARCH FOR EVENT
router.get('/search/:searchkey', async (req, res) => {
    console.log('GET - event/:searchkey - event ud fra søgeord');
    try {
        const event = await Event.find({
            $or: [
                // søg i følgende felter - og med "små bogstaver" så fx HesT matcher hest
                { "location": { "$regex": req.params.searchkey, "$options": "i" } }                
            ]
        }).populate('category')

        return res.status(200).json({ event: event });
    } catch (error) {
        return res.status(400).json({ message: "der er opstået en fejl", error: error.message, event: null });
    }
});

// POST EVENT
router.post("/", requireAuth, upload.single('eventimage'), async (req, res) => {
    console.log("POST - Create event");
    try {
        
        const event = new Event(req.body);
        event.eventimage = req.file.filename // Filnavn fra Multer
        
        await event.save();
        res.status(201).json({ message: "Eventet er oprettet", event: event });

    } catch (error) {

        console.log(error.message);
        res.status(400).json({ message: "Der er sket en fejl", error: error.message, event: null });

    }
});

// PUT EDIT EVENT
router.put("/:ID", requireAuth, upload.single('eventimage'), async (req, res) => {

        console.log("Put - edit product");
        try {
    
            // Billede sendt ind til rettelse - Mas evt. image ind i requestet
            if (req.file) {
                req.body.eventimage = req.file.filename
            } 

            const event = await Event.findByIdAndUpdate(req.params.ID, req.body, { new: true });
    
            if (event == null) {
                return res.status(404).json({ message: "Ingen events matcher ID - intet rettet", event: null });
            }
    
            //product.coverimage = req.file.filename // Filnavn fra Multer
            res.status(201).json({ message: "Eventet er rettet", event: event });
    
        } catch (error) {
    
            console.log(error.message);
            res.status(400).json({ message: "Der er sket en fejl", error: error.message, event: null });
    
        }
    });

// DELETE EVENT
router.delete("/:ID", requireAuth, async (req, res) => {
    console.log("DELETE - delete");
    try {
        const event = await Event.findByIdAndDelete(req.params.ID);
        if (event == null) {
            return res.status(404).json({ message: "Ingen events matcher ID - intet slettet", event: null });
        }
        return res.status(200).json({ message: "Eventet er slettet", event: req.params.ID });
    } catch (error) {
        return res.status(400).json({ message: "Der er opstået en fejl", error: error.message, event: null });
    }
});

module.exports = router;