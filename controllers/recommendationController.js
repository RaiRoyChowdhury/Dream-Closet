const Item = require("../models/Item");

const {
    generateOutfits
}=require("../utils/recommendation");


exports.getRecommendation = async(req,res)=>{

    try{

        const occasion=req.params.occasion;

        console.log("Occasion received:", occasion);

        const items = await Item.find();

        console.log("Items count:", items.length);

        const result = generateOutfits(
            items,
            occasion
        );

        console.log("FINAL RESULT:", JSON.stringify(result, null, 2));

        console.log("Generated result:", result);

        res.json(result);

    }
    catch(err){

        console.log(err);

        res.status(500)
        .json({
            message:err.message
        });

    }

};

