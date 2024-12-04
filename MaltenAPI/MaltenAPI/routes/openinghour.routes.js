const express = require('express');
const router = express.Router();

const Openinghours = require('../models/openinghours.model');

const requireAuth = require('../middleware/authRequired')

// GET ALL OPENING HOURS
router.get('/', async (req, res) => {
    console.log("GET - Get all opening hours");
    try {
        const openinghours = await Openinghours.find();
        return res.status(200).json({ openinghours: openinghours });
    } catch (error) {
        return res.status(400).json({ message: "Der er opstået en fejl", error: error.message, openinghours: null });
    }
});

// POST OPENING HOURS
router.post("/", requireAuth, async (req, res) => {
    console.log("POST - Create Openinghours");
    try {
        const openinghours = new Openinghours(req.body);
        await openinghours.save();
        res.status(201).json({ message: "Åbningstiden er oprettet", openinghours: openinghours });
    } catch (error) {
        res.status(400).json({ message: "Der er sket en fejl", error: error.message, openinghours: null });
    }
});

// PUT OPENING HOURS
router.put("/:ID", requireAuth, async (req, res) => {

    console.log("Put - edit product");
    try {

        const openinghours = await Openinghours.findByIdAndUpdate(req.params.ID, req.body, { new: true });

        if (openinghours == null) {
            return res.status(404).json({ message: "Ingen åbningstider matcher ID - intet rettet", openinghours: null });
        }

        res.status(201).json({ message: "Åbningstiden er rettet", openinghours: openinghours });

    } catch (error) {

        console.log(error.message);
        res.status(400).json({ message: "Der er sket en fejl", error: error.message, openinghours: null });

    }
});

router.delete("/:ID", requireAuth, async (req, res) => {
    console.log("DELETE - delete");
    try {
        const openinghours = await Openinghours.findByIdAndDelete(req.params.ID);
        if (openinghours == null) {
            return res.status(404).json({ message: "Ingen åbningstider matcher ID - intet slettet", openinghours: null });
        }
        return res.status(200).json({ message: "Åbningstiden er slettet", openinghours: req.params.ID });
    } catch (error) {
        return res.status(400).json({ message: "Der er opstået en fejl", error: error.message, openinghours: null });
    }
});

module.exports = router;