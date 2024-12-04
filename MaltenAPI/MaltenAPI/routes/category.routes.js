const express = require('express');
const router = express.Router();

// Henter category model
const Category = require('../models/category.model');
//const Product = require('../models/product.model'); // For at tjekke om en kategori har produkter 

const requireAuth = require('../middleware/authRequired')

const formData = require('express-form-data');
router.use(formData.parse());

// GET ALL CATEGORY
router.get('/', async (req, res) => {
    console.log("GET - all categories");
    try {
        const categories = await Category.find();
        return res.status(200).json({ categories: categories });
    } catch (error) {
        return res.status(400).json({ message: "Der er opstået en fejl", error: error.message, categories: null });
    }
});

// GET CATEGORY BY ID
router.get('/:ID', async (req, res) => {
    console.log('GET - category/:ID - kategory ud fra ID');
    try {
        const category = await Category.findById(req.params.ID);
        return res.status(200).json({ category: category });
    } catch (error) {
        return res.status(400).json({ message: "der er opstået en fejl", error: error.message, category: null });
    }
});

// POST CATEGORY
router.post("/", requireAuth, async (req, res) => {
    console.log("POST - Create Category");
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json({ message: "kategorien er oprettet", category: category });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: "Der er sket en fejl", error: error.message, category: null });
    }
});

// PUT/PATCH CATEGORIES
router.put("/:ID", requireAuth, async (req, res) => {
    console.log("PUT - editcategory");
    try {
        const category = await Category.findByIdAndUpdate(req.params.ID, req.body, { new: true });
        if (category == null) {
            return res.status(404).json({ message: "Ingen kategorier matcher ID - intet rettet", category: null });
        }
        return res.status(200).json({ message: "Kategorien er rettet", category: category });
    } catch (error) {
        return res.status(400).json({ message: "Der er opstået en fejl", error: error.message, category: null });
    }
});

// DELETE category
router.delete("/:ID", requireAuth, async (req, res) => {
    console.log("DELETE - delete category");
    try {
        const category = await Category.findByIdAndDelete(req.params.ID);
        if (category == null) {
            return res.status(404).json({ message: "Ingen kategorier matcher ID - intet slettet", category: null });
        }
        return res.status(200).json({ message: "kategorien er slettet", category: req.params.ID });
    } catch (error) {
        return res.status(400).json({ message: "Der er opstået en fejl", error: error.message, category: null });
    }
});

module.exports = router;
