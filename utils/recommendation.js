const colorScore = require("./colorScore");
const styleScore = require("./styleScore");


function getColorPoints(color1,color2){

    if(
        colorScore[color1] &&
        colorScore[color1][color2]
    ){
        return colorScore[color1][color2];
    }

    return 5;
}



function getStylePoints(style1,style2){

    if(
        styleScore[style1] &&
        styleScore[style1][style2]
    ){
        return styleScore[style1][style2];
    }

    return 5;
}



function calculateOutfitScore(top,bottom,shoes,occasion){


    let score = 0;



    // OCCASION SCORE (40)

    if(top.occasion.includes(occasion))
        score += 15;


    if(bottom.occasion.includes(occasion))
        score += 15;


    if(shoes.occasion.includes(occasion))
        score += 10;



    // COLOR SCORE (30)

    let topBottomColor =
    getColorPoints(
        top.color,
        bottom.color
    );


    let bottomShoesColor =
    getColorPoints(
        bottom.color,
        shoes.color
    );


    score += topBottomColor * 1.5;

    score += bottomShoesColor * 1.5;



    // STYLE SCORE (30)

    let topBottomStyle =
    getStylePoints(
        top.style,
        bottom.style
    );


    let bottomShoesStyle =
    getStylePoints(
        bottom.style,
        shoes.style
    );


    score += topBottomStyle;

    score += bottomShoesStyle;



    return Math.round(score);

}




function generateOutfits(items,occasion){

    let tops =
    items.filter(
        item=>item.category==="Top"
    );


    let bottoms =
    items.filter(
        item=>item.category==="Bottom"
    );


    let shoes =
    items.filter(
        item=>item.category==="Shoes"
    );



    let outfits=[];



    for(let top of tops){

        for(let bottom of bottoms){

            for(let shoe of shoes){


                let score =
                calculateOutfitScore(
                    top,
                    bottom,
                    shoe,
                    occasion
                );


                outfits.push({

                    outfit:{
                        top,
                        bottom,
                        shoe
                    },

                    score

                });


            }

        }

    }



    return outfits
    .sort(
        (a,b)=>b.score-a.score
    )
    .slice(0,3);


}



module.exports={
    generateOutfits
};