console.log("Recommendation JS loaded");

const recommendBtn = document.getElementById("recommendBtn");
const occasionSelect = document.getElementById("recommendOccasion");
const outfitResult = document.getElementById("recommendationResult");

// Clear initial state on page load so no error message shows up prematurely
if (outfitResult) {
  outfitResult.innerHTML = "";
}

if (recommendBtn) {
  recommendBtn.addEventListener("click", async () => {
    const occasion = occasionSelect ? occasionSelect.value : "casual";

    // 🔒 Synchronized: Reading updated "userId" key from localStorage
    const userId = localStorage.getItem("userId") || "";

    // Show loading indicator when user clicks
    if (outfitResult) {
      outfitResult.innerHTML = `
        <p class="text-pink-600 font-bold text-center animate-pulse">
          Curating outfits for you... ✨
        </p>
      `;
    }

    try {
      // Fetch recommendations passing userId and cache-busting timestamp
      const response = await fetch(
        `https://dream-closet-cd49.onrender.com/recommendation/${occasion}?userId=${userId}&_t=${Date.now()}`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      let outfits = await response.json();

      console.log("JSON received:", outfits);

      if (outfits && outfits.outfits) {
        outfits = outfits.outfits;
      }

      console.log("Final outfits array to display:", outfits);

      displayOutfits(outfits);
    } catch (error) {
      console.error("Fetch error:", error);

      if (outfitResult) {
        outfitResult.innerHTML = `
          <p class="text-red-500 font-bold text-center">
            Unable to generate outfit 😢
          </p>
        `;
      }
    }
  });
}

function displayOutfits(outfits) {
  if (!outfitResult) return;

  if (!outfits || !Array.isArray(outfits) || outfits.length === 0) {
    outfitResult.innerHTML = `
      <h3 class="text-pink-700 font-bold text-center">
        No matching outfit found 😢
      </h3>
    `;
    return;
  }

  outfitResult.innerHTML = "";

  outfits.forEach((item, index) => {
    const outfit = item.outfit || item;

    const top = outfit.top || {};
    const bottom = outfit.bottom || {};
    const shoe = outfit.shoe || {};

    const topImg = getImage(top.image);
    const topName = top.name || "Top";

    const bottomImg = getImage(bottom.image);
    const bottomName = bottom.name || "Bottom";

    const shoeImg = getImage(shoe.image);
    const shoeName = shoe.name || "Shoes";

    const score = item.score !== undefined ? item.score : 100;

    const card = document.createElement("div");
    card.className = "outfit-card bg-white p-5 rounded-3xl shadow-lg mb-4";

    card.innerHTML = `
      <h3 class="text-xl font-bold text-pink-900 mb-4 text-center">
        🏆 Outfit ${index + 1}
      </h3>

      <div class="space-y-3">
        <div>
          ${topImg ? `<img src="${topImg}" class="w-32 h-32 object-cover rounded-2xl mx-auto">` : ""}
          <p class="font-bold text-center">👕 ${topName}</p>
        </div>

        <div>
          ${bottomImg ? `<img src="${bottomImg}" class="w-32 h-32 object-cover rounded-2xl mx-auto">` : ""}
          <p class="font-bold text-center">👖 ${bottomName}</p>
        </div>

        <div>
          ${shoeImg ? `<img src="${shoeImg}" class="w-32 h-32 object-cover rounded-2xl mx-auto">` : ""}
          <p class="font-bold text-center">👟 ${shoeName}</p>
        </div>
      </div>

      <h3 class="text-center mt-5 text-pink-600 font-bold">
        ✨ Style Score: ${score}/100
      </h3>
    `;

    outfitResult.appendChild(card);
  });
}

function getImage(image) {
  if (!image) {
    return "";
  }

  image = image.replace(/\\/g, "/");

  if (image.startsWith("http")) {
    return image;
  }

  if (image.startsWith("db/uploads/")) {
    return "https://dream-closet-cd49.onrender.com/" + image;
  }

  if (image.startsWith("uploads/")) {
    return "https://dream-closet-cd49.onrender.com/" + image;
  }

  if (image.startsWith("/uploads/")) {
    return "https://dream-closet-cd49.onrender.com" + image;
  }

  return "https://dream-closet-cd49.onrender.com/db/uploads/" + image;
}