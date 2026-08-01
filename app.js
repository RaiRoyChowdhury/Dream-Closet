const path = require('path'); // Added for path handling
console.log(__dirname);
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const Item = require('./models/Item'); 
const recommendationRoutes = require("./routes/recommendationRoutes");
const upload = require("./db/uploads/middleware/upload.js");





app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
// 1. SERVE UPLOADED IMAGES
app.use("/db/uploads", express.static(path.join(__dirname, "db/uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 2. SERVE STATIC FRONTEND FILES (index.html, script2.js, CSS)
app.use(express.static(__dirname));
app.use(
    "/recommendation",
    recommendationRoutes
);



app.get("/api/items", async (req, res) => {

    
  try {
    // Get query parameters
    const { category, color, occasion, sort , userId } = req.query;

    if (!userId) {
      return res.status(200).json([]);
    }

    // Empty filter object
    let filter = {};

    filter.userId = userId;

    // Apply filters only if user has selected them
    if (category) {
      filter.category = category;
    }

    if (color) {
      filter.color = color;
    }

    if (occasion) {
      filter.occasion = occasion;
    }

    // Create query
    let query = Item.find(filter);

    // Sorting
    if (sort === "az") {
      query = query.sort({ name: 1 }); // A-Z
    } else if (sort === "za") {
      query = query.sort({ name: -1 }); // Z-A
    } else if (sort === "newest") {
      query = query.sort({ createdAt: -1 }); // Newest first
    } else if (sort === "oldest") {
      query = query.sort({ createdAt: 1 }); // Oldest first
    }

    // Execute query
    const items = await query;

    res.status(200).json(items);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// --- module.exports = app; should be below this ---

app.post('/api/items', upload.single("image"), async(req,res)=>{

console.log("BODY:", req.body);
console.log("FILE:", req.file);
try{


const newItem = new Item({

    ...req.body,
 userId: req.body.userId,
 image: req.file ? req.file.path : "",
occasion: req.body.occasion 
? JSON.parse(req.body.occasion)
: [],

season: req.body.season
? JSON.parse(req.body.season)
: [],
});


await newItem.save();


res.status(201).json(newItem);


}
catch(err){

console.log(err);

res.status(500).json({
    message:err.message
});

}

});

app.get("/api/items/:id", async(req,res)=>{

    try{

        const item = await Item.findById(req.params.id);


        if(!item){

            return res.status(404).json({
                message:"Item not found"
            });

        }


        res.status(200).json(item);


    }
    catch(err){

        console.log(err);

        res.status(500).json({
            message:err.message
        });

    }

});
app.patch("/api/items/:id", upload.single("image"), async (req, res) => {

    try {

        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,

                occasion: req.body.occasion 
? JSON.parse(req.body.occasion)
: [],

                season: req.body.season
? JSON.parse(req.body.season)
: [],

                ...(req.file && {
                    image: req.file.filename
                })

            },
            {
                new:true,
                runValidators:true
            }
        );


        if(!updatedItem){

            return res.status(404).json({
                message:"Item not found"
            });

        }


        res.status(200).json(updatedItem);


    }
    catch(err){

        console.log(err);

        res.status(500).json({
            message:err.message
        });

    }

});
app.delete('/api/items/:id', async (req, res) => {
    try { 
        const deletedItem = await Item.findByIdAndDelete(req.params.id); 
        if (!deletedItem) { 
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

                                                   
console.log("--- APP.JS HAS LOADED ROUTES ---");
// 3. CATCH-ALL ROUTE TO SERVE INDEX.HTML AT ROOT "/"
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
module.exports = app;

 



