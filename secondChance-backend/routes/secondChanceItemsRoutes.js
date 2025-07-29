const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const connectToDatabase = require('../models/db');
const logger = require('../logger');

// Define the upload directory path
const directoryPath = 'public/images';

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, directoryPath); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage: storage });


// Get all secondChanceItems
router.get('/', async (req, res, next) => {
    logger.info('/ called');
    try {
        //Step 2: task 1 - Retrieve the database connection from db.js and store the connection to db constant
        const db = await connectToDatabase();
        
        //Step 2: task 2 - Use the collection() method to retrieve the secondChanceItems collection
        const collection = db.collection("secondChanceItems");
        
        //Step 2: task 3 - Fetch all secondChanceItems using the collection.find() method. Chain it with the toArray() method to convert to a JSON array
        const secondChanceItems = await collection.find({}).toArray();
        
        // Debug: Log the IDs to see what format they're in
        console.log('Available IDs:', secondChanceItems.map(item => ({ id: item.id, type: typeof item.id })));
        
        //Step 2: task 4 - Return the secondChanceItems using the res.json() method
        res.json(secondChanceItems);
    } catch (e) {
        logger.console.error('oops something went wrong', e)
        next(e);
    }
});

// Add a new item
router.post('/', upload.single('file'), async(req, res,next) => {
    try {
        //Step 3: task 1 - Retrieve the database connection from db.js and store the connection to db constant
        const db = await connectToDatabase();
        
        //Step 3: task 2 - Use the collection() method to retrieve the secondChanceItems collection
        const collection = db.collection("secondChanceItems");
        
        //Step 3: task 3 - Create a new secondChanceItem from the request body
        const secondChanceItem = req.body;
        
        //Step 3: task 4 - Get the last id, increment it by 1, and set it to the new secondChanceItem
        const lastItem = await collection.find({}).sort({id: -1}).limit(1).toArray();
        const lastId = lastItem.length > 0 ? lastItem[0].id : 0;
        secondChanceItem.id = lastId + 1;
        
        //Step 3: task 5 - Set the current date in the new item
        secondChanceItem.date_added = new Date();
        
        //Step 3: task 6 - Add the secondChanceItem to the database
        const result = await collection.insertOne(secondChanceItem);
        
        res.status(201).json(result.insertedId);
    } catch (e) {
        next(e);
    }
});

// Get a single secondChanceItem by ID
router.get('/:id', async (req, res, next) => {
    try {
        console.log('Route params:', req.params);
        console.log('Looking for ID:', req.params.id);
        
        //Step 4: task 1 - Retrieve the database connection from db.js and store the connection in the db constant
        const db = await connectToDatabase();
        
        //Step 4: task 2 - Use the collection() method to retrieve the secondChanceItems collection
        const collection = db.collection("secondChanceItems");
        
        //Step 4: task 3 - Find a specific secondChanceItem by its ID using the collection.findOne() method. Store it in a constant called secondChanceItem
        const secondChanceItem = await collection.findOne({ id: req.params.id });
        console.log('Found item:', secondChanceItem);
        
        //Step 4: task 4 - Return the secondChanceItem as a JSON object. Return an error message if the item is not found
        if (!secondChanceItem) {
            return res.status(404).json({ message: 'secondChanceItem not found' });
        }
        res.json(secondChanceItem);
    } catch (e) {
        next(e);
    }
});

// Update and existing item
router.put('/:id', async(req, res,next) => {
    try {
        //Step 5: task 1 - Retrieve the database connection from db.js and store the connection to a db constant
        const db = await connectToDatabase();
        
        //Step 5: task 2 - Use the collection() method to retrieve the secondChanceItems collection
        const collection = db.collection("secondChanceItems");
        
        //Step 5: task 3 - Check if the secondChanceItem exists and send an appropriate message if it doesn't exist
        const existingItem = await collection.findOne({ id: req.params.id });
        if (!existingItem) {
            return res.status(404).json({ message: 'secondChanceItem not found' });
        }
        
        //Step 5: task 4 - Update the item's attributes
        const updateData = {
            category: req.body.category,
            condition: req.body.condition,
            age_days: req.body.age_days,
            description: req.body.description,
            age_years: (req.body.age_days / 365).toFixed(1),
            updatedAt: new Date()
        };
        
        const result = await collection.updateOne(
            { id: req.params.id },
            { $set: updateData }
        );
        
        //Step 5: task 5 - Send confirmation
        res.json({ message: 'secondChanceItem updated successfully', modifiedCount: result.modifiedCount });
    } catch (e) {
        next(e);
    }
});

// Delete an existing item
router.delete('/:id', async(req, res,next) => {
    try {
        //Step 6: task 1 - Retrieve the database connection from db.js and store the connection to the db constant
        const db = await connectToDatabase();
        
        //Step 6: task 2 - Use the collection() method to retrieve the secondChanceItem collection
        const collection = db.collection("secondChanceItems");
        
        //Step 6: task 3 - Find a specific secondChanceItem by ID using the collection.findOne() method and send an appropriate message if it doesn't exist
        const secondChanceItem = await collection.findOne({ id: req.params.id });
        if (!secondChanceItem) {
            return res.status(404).json({ message: 'secondChanceItem not found' });
        }
        
        //Step 6: task 4 - Delete the object and send an appropriate message
        const result = await collection.deleteOne({ id: req.params.id });
        res.json({ message: 'secondChanceItem deleted successfully', deletedCount: result.deletedCount });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
