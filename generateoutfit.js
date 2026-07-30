console.log("Recommendation JS loaded");
const recommendBtn = document.getElementById("recommendBtn");
console.log(recommendBtn);
const occasionSelect = document.getElementById("recommendOccasion");

const outfitResult = document.getElementById("recommendationResult");



if(recommendBtn){


recommendBtn.addEventListener(
"click",
async()=>{


    const occasion = occasionSelect.value;



    try{


        const response = await fetch(
        `http://localhost:3999/recommendation/${occasion}`
        );


      let outfits = await response.json();

console.log("JSON received:", outfits);

if(outfits.outfits){
    outfits = outfits.outfits;
}
       

console.log("JSON received:", outfits);

try {
    displayOutfits(outfits);
}
catch(err){
    console.log("Display error:", err);
}


    }


    catch(error){


        console.log(error);


        outfitResult.innerHTML =
        `
        <p class="text-red-500 font-bold">
        Unable to generate outfit 😢
        </p>
        `;


    }



});


}






function displayOutfits(outfits){



    if(!outfits || outfits.length === 0){


        outfitResult.innerHTML =
        `
        <h3 class="text-pink-700 font-bold">
        No matching outfit found 😢
        </h3>
        `;


        return;


    }



    outfitResult.innerHTML = "";





    outfits.forEach((item,index)=>{


        const outfit = item.outfit;



        const card = document.createElement("div");


        card.className =
        "outfit-card bg-white p-5 rounded-3xl shadow-lg";





        card.innerHTML =

        `

        <h3 class="text-xl font-bold text-pink-900 mb-4">

        🏆 Outfit ${index+1}

        </h3>




        <div class="space-y-3">



        <div>

        <img 
        src="${getImage(outfit.top.image)}"
        class="w-32 h-32 object-cover rounded-2xl mx-auto">


        <p class="font-bold text-center">

        👕 ${outfit.top.name}

        </p>

        </div>





        <div>

        <img 
        src="${getImage(outfit.bottom.image)}"
        class="w-32 h-32 object-cover rounded-2xl mx-auto">


        <p class="font-bold text-center">

        👖 ${outfit.bottom.name}

        </p>

        </div>





        <div>

        <img 
        src="${getImage(outfit.shoe.image)}"
        class="w-32 h-32 object-cover rounded-2xl mx-auto">


        <p class="font-bold text-center">

        👟 ${outfit.shoe.name}

        </p>

        </div>




        </div>





        <h3 class="text-center mt-5 text-pink-600 font-bold">

        ✨ Style Score:
        ${item.score}/100

        </h3>


        `;




        outfitResult.appendChild(card);



    });



}







function getImage(image){

    if(!image){
        return "";
    }

    image = image.replace(/\\/g, "/");

    if(image.startsWith("http")){
        return image;
    }

    if(image.startsWith("db/uploads/")){
        return "http://localhost:3999/" + image;
    }

    if(image.startsWith("uploads/")){
        return "http://localhost:3999/" + image;
    }

    if(image.startsWith("/uploads/")){
        return "http://localhost:3999" + image;
    }

    return "http://localhost:3999/db/uploads/" + image;

}