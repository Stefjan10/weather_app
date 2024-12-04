const express = require('express');
const router = express.Router();

const Product = require('../models/product.model');

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

// GET ALL PRODUCTS
router.get('/', async (req, res) => {
    console.log("GET - Get all opening hours");
    try {
        const product = await Product.find();
        return res.status(200).json({ product: product });
    } catch (error) {
        return res.status(400).json({ message: "Der er opstået en fejl", error: error.message, product: null });
    }
});

// GET PRODUCT BY ID
router.get('/:ID', async (req, res) => {
    console.log('GET - product/:ID - produkt ud fra ID');
    try {
        const product = await Product.findById(req.params.ID)
        return res.status(200).json({ product: product });
    } catch (error) {
        return res.status(400).json({ message: "der er opstået en fejl", error: error.message, product: null });
    }
});

// PUT PRODUCT
router.put("/:ID", requireAuth, upload.fields([{name: "coverimage", maxCount: 1}, {name: "gallery", maxCount: 3}]), async (req, res) => {

    console.log("Put - edit product");
    try {

        //coverimage
        if (req.files['coverimage']) {
            req.body.coverimage = req.files['coverimage'][0].filename
        }

        // gallery
        let gallery = req.files['gallery']?.map(function (file){
            return file.filename
        })
        req.body.gallery = gallery ? gallery : req.body.gallery
        
        const product = await Product.findByIdAndUpdate(req.params.ID, req.body, { new: true });

        if (product == null) {
            return res.status(404).json({ message: "Ingen produkter matcher ID - intet rettet", product: null });
        }

        //product.coverimage = req.file.filename // Filnavn fra Multer
        res.status(201).json({ message: "Produktet er oprettet", product: product });

    } catch (error) {

        console.log(error.message);
        res.status(400).json({ message: "Der er sket en fejl", error: error.message, product: null });

    }
});

// POST PRODUCT - Med flere billeder / filer (Gallery)
router.post("/", requireAuth, upload.fields([{name: "coverimage", maxCount: 1}, {name: "gallery", maxCount: 3}]), async (req, res) => {
    console.log("POST - createproduct");
    try {
        
        const product = new Product(req.body);

        product.coverimage = req.files['coverimage'][0].filename
        
        //gallery flere filer/images
        let gallery = req.files['gallery']?.map(function (file){
            return file.filename
        })
        product.gallery = gallery ? gallery : []; // hvis der var billeder tilføjes de og ellers ingenting
        
        await product.save();
        res.status(200).json({ message: "Produktet er oprettet", product: product });

    } catch (error) {

        console.log(error.message);
        res.status(400).json({ message: "Der er sket en fejl", error: error.message, product: null });

    }
});

// DELETE PRODUCT
router.delete("/:ID", requireAuth, async (req, res) => {
    console.log("DELETE - delete");
    try {
        const product = await Product.findByIdAndDelete(req.params.ID);
        if (product == null) {
            return res.status(404).json({ message: "Ingen produkter matcher ID - intet slettet", product: null });
        }
        return res.status(200).json({ message: "Produktet er slettet", product: req.params.ID });
    } catch (error) {
        return res.status(400).json({ message: "Der er opstået en fejl", error: error.message, product: null });
    }
});

module.exports = router;
