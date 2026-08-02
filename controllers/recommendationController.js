const Item = require("../models/Item");

const {
    generateOutfits
}=require("../utils/recommendation");


exports.getRecommendation = async(req,res)=>{

    try{

        const occasion = req.params.occasion;

const { userId } = req.query;

console.log("Occasion received:", occasion);
console.log("User ID received:", userId);

if (!userId) {
    return res.status(400).json({
        message: "User ID missing"
    });
}

const items = await Item.find({
    userId: userId
});

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

