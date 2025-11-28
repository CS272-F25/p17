document.addEventListener("DOMContentLoaded", async () => {
  const carouselInner = document.querySelector(
    "#recipesCarousel .carousel-inner"
  );
  if (!carouselInner) return;

  try {
    const res = await fetch("recipes.json");
    const recipes = await res.json();

    const featured = recipes.slice(0, 6);
    const CARDS_PER_SLIDE = 3;

    // featured.forEach((recipe, index) => {
    //   const item = document.createElement("div");
    //   item.className = "carousel-item";
    //   if (index === 0) item.classList.add("active");

    //   const wrapper = document.createElement("div");
    //   wrapper.className = "d-flex justify-content-center py-3";

    //   const card = createRecipeCard(recipe);

    //   wrapper.appendChild(card);
    //   item.appendChild(wrapper);
    //   carouselInner.appendChild(item);
    // });
    for (let i = 0; i < featured.length; i += CARDS_PER_SLIDE) {
      const group = featured.slice(i, i + CARDS_PER_SLIDE);

      const item = document.createElement("div");
      item.className = "carousel-item";
      if (i === 0) item.classList.add("active");

      const row = document.createElement("div");
      row.className =
        "d-flex justify-content-center gap-4 py-3 flex-wrap recipes-carousel-row";

      group.forEach((recipe) => {
        const card = createRecipeCard(recipe);
        row.appendChild(card);
      });
      item.appendChild(row);
      carouselInner.appendChild(item);
    }
  } catch (err) {
    console.error(err);
  }
});
