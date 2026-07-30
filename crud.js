const API_URL = "https://dream-closet-cd49.onrender.com/api/items";
const IMAGE_URL = "https://dream-closet-cd49.onrender.com/db/uploads/";


// ELEMENTS

const form = document.getElementById("itemForm");

const wardrobeList = document.getElementById("wardrobeList");

const itemCount = document.getElementById("itemCount");

const statusMessage = document.getElementById("statusMessage");

const imageInput = document.getElementById("image");

const preview = document.getElementById("preview");


const filterCategory =
document.getElementById("filterCategory");

const filterOccasion =
document.getElementById("filterOccasion");

const sort =
document.getElementById("sort");





// IMAGE PREVIEW FOR ADD FORM

imageInput.addEventListener("change",()=>{

    const file=imageInput.files[0];


    if(file){

        preview.src =
        URL.createObjectURL(file);

        preview.classList.remove("hidden");

    }

});







// FETCH ITEMS

async function fetchItems(query=""){


    try{


        const res =
        await fetch(`${API_URL}${query}`);


        const items =
        await res.json();



        itemCount.innerHTML =
        `${items.length} Items 🛍️`;



        renderItems(items);


    }


    catch(err){


        console.log(err);


        wardrobeList.innerHTML =
        `
        <p class="text-red-500">
        Server connection failed
        </p>
        `;


    }


}









// RENDER CARDS

function renderItems(items){


    wardrobeList.innerHTML="";



    if(items.length===0){


        wardrobeList.innerHTML=
        `
        <div class="text-center text-pink-400 col-span-2">

        ✨ Your closet is empty

        </div>
        `;


        return;


    }






    items.forEach(item=>{


        const card =
        document.createElement("div");



        card.className =
        `
        card
        glass
        rounded-[2rem]
        p-5
        flex
        flex-col
        gap-4
        `;



        card.id =
        `card-${item._id}`;



        card.innerHTML =

        `

        <div class="w-full h-72 bg-white rounded-3xl overflow-hidden">


        ${
            item.image

            ?

            `
            <img
           src="${
item.image
? item.image.replace(/\\/g, "/").startsWith("http")
    ? item.image.replace(/\\/g, "/")
    : item.image.replace(/\\/g, "/").startsWith("db/uploads/")
    ? "https://dream-closet-cd49.onrender.com/" + item.image.replace(/\\/g, "/")
    : item.image.replace(/\\/g, "/").startsWith("/uploads/")
    ? "https://dream-closet-cd49.onrender.com" + item.image.replace(/\\/g, "/")
    : item.image.replace(/\\/g, "/").startsWith("uploads/")
    ? "https://dream-closet-cd49.onrender.com/" + item.image.replace(/\\/g, "/")
    : IMAGE_URL + item.image.replace(/\\/g, "/")
: ""
}"
            class="w-full h-full object-contain">
            `

            :

            `
            <div class="h-full flex items-center justify-center">
            No Image
            </div>
            `

        }


        </div>




        <h3 class="text-xl font-bold">

        ${item.name}

        </h3>




        <p>

        👚 ${item.category}

        </p>



        <p>

        🎨 ${item.color}

        </p>




        <p>

        ✨ ${item.occasion?.join(", ") || "No occasion"}

        </p>



        <p>

        🌸 ${item.season?.join(", ") || "All Season"}

        </p>




        <p>

        〰 ${item.pattern}

        </p>





        <div class="flex gap-3">


        <button

        onclick="openEditCard('${item._id}')"

        class="
        flex-1
        bg-indigo-100
        text-indigo-600
        p-3
        rounded-xl
        font-bold">

        ✏️ Edit

        </button>





        <button

        onclick="deleteItem('${item._id}')"

        class="
        flex-1
        bg-red-100
        text-red-500
        p-3
        rounded-xl
        font-bold">

        Delete

        </button>


        </div>


        `;



        wardrobeList.appendChild(card);


    });


}
// ADD NEW ITEM (POST)

form.addEventListener(
"submit",
async(e)=>{


e.preventDefault();



const formData = new FormData();



formData.append(
"name",
document.getElementById("name").value
);



formData.append(
"category",
document.getElementById("category").value
);



formData.append(
"color",
document.getElementById("color").value
);



formData.append(
"pattern",
document.getElementById("pattern").value
);




formData.append(
"season",
JSON.stringify([

document.getElementById("season").value

])
);





const occasions=[];


document
.querySelectorAll(".occasion:checked")
.forEach(box=>{

    occasions.push(box.value);

});



formData.append(
"occasion",
JSON.stringify(occasions)
);





const image =
imageInput.files[0];



if(!image){

    statusMessage.innerHTML =
    "📸 Please upload an image";


    return;

}



formData.append(
"image",
image
);





try{


const res =
await fetch(

API_URL,

{

method:"POST",

body:formData

}

);




const data =
await res.json();




if(res.ok){


    statusMessage.innerHTML =
    "Saved successfully ❤️";


    statusMessage.className =
    "text-green-500 text-center mt-4";


    form.reset();


    preview.classList.add("hidden");


    fetchItems();


}



else{


    console.log(data);


}



}



catch(err){

console.log(err);

}



});
// OPEN INLINE EDIT MODE

function openEditCard(id){


    fetch(`${API_URL}/${id}`)
    .then(res=>res.json())
    .then(item=>{


        const card =
        document.getElementById(`card-${id}`);



        card.innerHTML = `


        <div class="w-full h-48 bg-white rounded-3xl overflow-hidden">

        ${
    item.image

    ?

    `
    <img
    src="${
        item.image.startsWith("http")
        ? item.image
        : item.image.startsWith("/uploads/")
        ? "https://dream-closet-cd49.onrender.com" + item.image
        : item.image.startsWith("uploads/")
        ? "https://dream-closet-cd49.onrender.com/" + item.image
        : IMAGE_URL + item.image
    }"
    class="w-full h-full object-contain"
    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">

    <div 
    style="display:none"
    class="h-full flex items-center justify-center text-pink-400">

    Image not found

    </div>
    `

    :

    `
    <div class="h-full flex items-center justify-center text-pink-300">
    No Image
    </div>
    `

}

        </div>




        <input

        id="edit-name-${id}"

        value="${item.name}"

        class="
        w-full
        p-3
        rounded-xl
        input-box">

        </input>





        <select

        id="edit-category-${id}"

        class="
        w-full
        p-3
        rounded-xl
        input-box">

        <option ${item.category==="Top"?"selected":""}>
        Top
        </option>

        <option ${item.category==="Bottom"?"selected":""}>
        Bottom
        </option>


        <option ${item.category==="Dress"?"selected":""}>
        Dress
        </option>


        <option ${item.category==="Outerwear"?"selected":""}>
        Outerwear
        </option>


        <option ${item.category==="Shoes"?"selected":""}>
        Shoes
        </option>


        <option ${item.category==="Accessory"?"selected":""}>
        Accessory
        </option>


        </select>







        <select

        id="edit-color-${id}"

        class="
        w-full
        p-3
        rounded-xl
        input-box">

        
        <option ${item.color==="Black"?"selected":""}>
        Black
        </option>

        <option ${item.color==="White"?"selected":""}>
        White
        </option>

        <option ${item.color==="Blue"?"selected":""}>
        Blue
        </option>

        <option ${item.color==="Pink"?"selected":""}>
        Pink
        </option>

        <option ${item.color==="Red"?"selected":""}>
        Red
        </option>


        </select>





        <div class="grid grid-cols-2 gap-2 text-sm">


        ${
        ["Party","Date","Office","College","Wedding","Travel"]
        .map(place=>


        `

        <label>

        <input

        type="checkbox"

        class="edit-occasion-${id}"

        value="${place}"

        ${item.occasion?.includes(place)?"checked":""}

        >

        ${place}

        </label>


        `

        ).join("")

        }


        </div>







        <select

        id="edit-season-${id}"

        class="
        w-full
        p-3
        rounded-xl
        input-box">


        ${
        ["Summer","Winter","Monsoon","Spring","Autumn","All Season"]
        .map(season=>

        `

        <option

        ${item.season?.[0]===season?"selected":""}

        >

        ${season}

        </option>

        `

        ).join("")

        }


        </select>






        <select

        id="edit-pattern-${id}"

        class="
        w-full
        p-3
        rounded-xl
        input-box">


        ${
        ["Solid","Striped","Checked","Floral","Printed","Graphic"]
        .map(pattern=>

        `

        <option

        ${item.pattern===pattern?"selected":""}

        >

        ${pattern}

        </option>

        `

        ).join("")

        }


        </select>






        <input

        id="edit-image-${id}"

        type="file"

        accept="image/*"

        class="
        w-full
        p-3
        rounded-xl
        input-box">


        </input>






        <div class="flex gap-3">


        <button

        onclick="saveEdit('${id}')"

        class="
        flex-1
        bg-green-100
        text-green-600
        p-3
        rounded-xl
        font-bold">


        💾 Save


        </button>





        <button

        onclick="fetchItems()"

        class="
        flex-1
        bg-gray-100
        text-gray-600
        p-3
        rounded-xl
        font-bold">


        Cancel


        </button>


        </div>



        `;



    });


}






// SAVE INLINE EDIT

async function saveEdit(id){


    const formData =
    new FormData();



    formData.append(

    "name",

    document.getElementById(`edit-name-${id}`).value

    );




    formData.append(

    "category",

    document.getElementById(`edit-category-${id}`).value

    );





    formData.append(

    "color",

    document.getElementById(`edit-color-${id}`).value

    );





    formData.append(

    "pattern",

    document.getElementById(`edit-pattern-${id}`).value

    );





    formData.append(

    "season",

    JSON.stringify([

    document.getElementById(`edit-season-${id}`).value

    ])

    );





    const occasions=[];



    document

    .querySelectorAll(`.edit-occasion-${id}:checked`)

    .forEach(box=>{

        occasions.push(box.value);

    });





    formData.append(

    "occasion",

    JSON.stringify(occasions)

    );





    const image =

    document.getElementById(`edit-image-${id}`).files[0];



    if(image){

        formData.append(
            "image",
            image
        );

    }






    try{


        const res =
        await fetch(

        `${API_URL}/${id}`,

        {

        method:"PATCH",

        body:formData

        }

        );



        if(res.ok){

            fetchItems();

        }


    }


    catch(err){

        console.log(err);

    }


}

// DELETE ITEM

async function deleteItem(id){

    const confirmDelete =
    confirm("Delete this item?");


    if(!confirmDelete)
    return;



    try{


        const res =
        await fetch(

        `${API_URL}/${id}`,

        {

        method:"DELETE"

        }

        );



        if(res.ok){

            fetchItems();

        }


    }


    catch(err){

        console.log(err);

    }


}








// FILTER + SORT

function applyFilters(){


    const params =
    new URLSearchParams();



    if(filterCategory.value){

        params.append(
            "category",
            filterCategory.value
        );

    }





    if(filterOccasion.value){

        params.append(
            "occasion",
            filterOccasion.value
        );

    }





    if(sort.value){

        params.append(
            "sort",
            sort.value
        );

    }






    const query =

    params.toString()

    ?

    `?${params.toString()}`

    :

    "";




    fetchItems(query);



}






filterCategory.addEventListener(
"change",
applyFilters
);



filterOccasion.addEventListener(
"change",
applyFilters
);



sort.addEventListener(
"change",
applyFilters
);









// MAKE INLINE FUNCTIONS AVAILABLE TO HTML BUTTONS

window.openEditCard = openEditCard;

window.saveEdit = saveEdit;

window.deleteItem = deleteItem;









// INITIAL LOAD

fetchItems();