let allRecipes = [];
let favoriteIds = new Set();
let selectedTags = new Set();

// favorites in localStorage
function loadFavorites() {
  const raw = localStorage.getItem("favoriteRecipes");
  if (!raw) return;
  try {
    favoriteIds = new Set(JSON.parse(raw));
  } catch {
    favoriteIds = new Set();
  }
}

function saveFavorites() {
  localStorage.setItem(
    "favoriteRecipes",
    JSON.stringify(Array.from(favoriteIds))
  );
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function createRecipeCard(recipe) {
  const card = document.createElement("article");
  card.className = "recipe-card";

  const isFav = favoriteIds.has(recipe.id);

  // wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "recipe-image-wrapper";

  // images
  const img = document.createElement("img");
  img.className = "recipe-image";
  img.src = recipe.image?.src || "";
  img.alt = recipe.image?.alt || recipe.title || "";

  // favorite button
  const favBtn = document.createElement("button");
  favBtn.type = "button";
  favBtn.className = "favorite-btn";
  if (isFav) {
    favBtn.classList.add("is-favorited");
  }
  favBtn.setAttribute("aria-label", "Toggle favorite");
  favBtn.setAttribute("data-id", recipe.id);

  const icon = document.createElement("i");
  icon.classList.add("bi", "heart-icon");
  icon.classList.add(isFav ? "bi-heart-fill" : "bi-heart");
  favBtn.appendChild(icon);

  // assemble wrapper
  wrapper.appendChild(img);
  wrapper.appendChild(favBtn);

  // title
  const titleEl = document.createElement("h2");
  titleEl.className = "recipe-title";
  titleEl.textContent = recipe.title || "";

  // assemble card
  card.appendChild(wrapper);
  card.appendChild(titleEl);

  // click for specific recipe page
  card.addEventListener("click", (e) => {
    const isFavButton = e.target.closest(".favorite-btn");
    if (isFavButton) return;
    window.location.href = `recipe.html?id=${encodeURIComponent(recipe.id)}`;
  });

  // click heart icon to save recipe as favorite
  favBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const id = favBtn.getAttribute("data-id");
    const currentlyFav = favoriteIds.has(id);
    updateFavoriteButton(favBtn, !currentlyFav, true);
  });

  return card;
}

function updateFavoriteButton(btn, isFav, withAnimation = false) {
  const icon = btn.querySelector(".heart-icon");
  const id = btn.getAttribute("data-id");

  // update favoriteIds & localStorage
  if (isFav) {
    favoriteIds.add(id);
  } else {
    favoriteIds.delete(id);
  }
  saveFavorites();

  btn.classList.toggle("is-favorited", isFav);

  if (icon) {
    icon.classList.remove("bi-heart", "bi-heart-fill");
    icon.classList.add(isFav ? "bi-heart-fill" : "bi-heart");
  }

  if (withAnimation && isFav) {
    btn.classList.add("just-favorited");
    setTimeout(() => {
      btn.classList.remove("just-favorited");
    }, 250);
  }
}

// tags filter
function buildTagFilter() {
  const container = document.getElementById("tag-filter");
  if (!container) return;

  const tagSet = new Set();
  allRecipes.forEach((r) => {
    (r.tags || []).forEach((t) => {
      if (t && typeof t === "string") {
        tagSet.add(t);
      }
    });
  });
  const tags = Array.from(tagSet).sort();

  clearElement(container);

  const allBtn = document.createElement("button");
  allBtn.type = "button";
  allBtn.textContent = "All";
  allBtn.className = "tag-chip tag-chip--all tag-chip--active";
  allBtn.addEventListener("click", () => {
    selectedTags.clear();

    container
      .querySelectorAll(".tag-chip")
      .forEach((btn) => btn.classList.remove("tag-chip--active"));

    allBtn.classList.add("tag-chip--active");
    renderCards();
  });
  container.appendChild(allBtn);

  tags.forEach((tag) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = tag;
    btn.className = "tag-chip";
    btn.dataset.tag = tag;

    btn.addEventListener("click", () => {
      if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
        btn.classList.remove("tag-chip--active");
      } else {
        selectedTags.add(tag);
        btn.classList.add("tag-chip--active");
      }

      if (selectedTags.size > 0) {
        allBtn.classList.remove("tag-chip--active");
      } else {
        allBtn.classList.add("tag-chip--active");
      }

      renderCards();
    });

    container.appendChild(btn);
  });
}

// render cards
function renderCards() {
  const grid = document.getElementById("recipes-grid");
  if (!grid) return;

  clearElement(grid);

  const searchInput = document.getElementById("search-input");
  const showFavCheckbox = document.getElementById("show-liked-only");

  const search = (searchInput?.value || "").toLowerCase().trim();
  const showFavOnly = !!(showFavCheckbox && showFavCheckbox.checked);
  const activeTags = Array.from(selectedTags);

  const filtered = allRecipes.filter((r) => {
    if (showFavOnly && !favoriteIds.has(r.id)) return false;

    if (activeTags.length > 0) {
      const recipeTags = r.tags || [];
      const hasTag = recipeTags.some((t) => selectedTags.has(t));
      if (!hasTag) return false;
    }

    if (!search) return true;

    const text =
      (r.title || "") +
      " " +
      (r.description || "") +
      " " +
      (r.tags || []).join(" ");
    return text.toLowerCase().includes(search);
  });

  if (!filtered.length) {
    const p = document.createElement("p");
    p.textContent = "No recipes found.";
    grid.appendChild(p);
    return;
  }

  filtered.forEach((recipe) => {
    const card = createRecipeCard(recipe);
    grid.appendChild(card);
  });
}

// load JSON
async function loadRecipes() {
  try {
    const res = await fetch("recipes.json");
    allRecipes = await res.json();
    buildTagFilter();
    renderCards();
  } catch (err) {
    console.error(err);
    const grid = document.getElementById("recipes-grid");
    if (grid) {
      clearElement(grid);
      const p = document.createElement("p");
      p.textContent = "Failed to load recipes.";
      grid.appendChild(p);
    }
  }
}

// wire up events
document.addEventListener("DOMContentLoaded", () => {
  loadFavorites();
  loadRecipes();

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", renderCards);
  }

  const favCheckbox = document.getElementById("show-liked-only");
  if (favCheckbox) {
    favCheckbox.addEventListener("change", renderCards);
  }
});

