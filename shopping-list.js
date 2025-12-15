// Game plan for this page/file

//Will include shopping list that can either be created by:
// I believe this will be an array that will be appended to based on user interaction

/* Give the users 3 option in the DOM: recipe selection card, pantry search, custom input field 
    The recipe selection card should be pulling in the JSON file information (using fetch) and mapping the data into an array that can be iterated through when the user selects a recipe 
    So this recipe selection should have some code that matches up ingredients in the recipe lists to ingredients in the recipe selection card 


    The pantry search should do a similar thing: pull in the JSON information from the pantry file 
    But then, I will create js that will connect what the user types into the search bar to the id's in the pantry JSON file
    So when the user types in an ingredient, it will match the id and add that to the shopping list array


    The custom input field should just take the value of what the user inputs and type that into the array */

//1. entire recipe selection (will try to make iterative/can select multiple recipes)
//  Will include id's that automatically add to array upon user selection
// I believe I also need to find some way to remove them when the user unclicks

//2. can search and add items from pantry
// Search function that matches the text and adds the item to list based on id
// Should again add functionality to remove the item

//3. custom user input
// Adds the value to the array

// Will include customizable checklist
// event listener that allows checklist to be clicked/unclicked

// Will include ability to download checklist

let shoppingList = [];
let RECIPES_DATA = [];
let PANTRY_DATA = [];

const GUEST_SHOPPING_KEY = "shoppingList_guest_v1";
const PANTRY_STORAGE_KEY = "pantryList";

// === API Helpers & Auth ===

function getAuthToken() {
  return localStorage.getItem("authToken");
}

function isLoggedIn() {
  return !!getAuthToken();
}

async function apiGetShoppingList() {
  const token = getAuthToken();
  const res = await fetch("/api/shopping-list", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw new Error("unauthorized");
  if (!res.ok) throw new Error(`load_failed_${res.status}`);
  return res.json();
}

async function apiSaveShoppingList(items) {
  const token = getAuthToken();
  const res = await fetch("/api/shopping-list", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ items }),
  });
  if (res.status === 401) throw new Error("unauthorized");
  if (!res.ok) throw new Error(`load_failed_${res.status}`);
  return res.json();
}

let saveTimer = null;
function scheduleSave(listNode) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    saveShoppingList(listNode);
  }, 350);
}

function loadGuestShoppingList() {
  const raw = localStorage.getItem(GUEST_SHOPPING_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveGuestShoppingList(items) {
  try {
    localStorage.setItem(GUEST_SHOPPING_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Couldn't save guest shopping list", err);
  }
}

function clearGuestShoppingList() {
  localStorage.removeItem(GUEST_SHOPPING_KEY);
}

function mergeShoppingLists(primary, incoming) {
  const base = Array.isArray(primary) ? [...primary] : [];
  const seen = new Set(base.map((x) => String(x.key)));

  (incoming || []).forEach((item) => {
    const k = item && item.key != null ? String(item.key) : "";
    if (!k) return;
    if (seen.has(k)) return;
    seen.add(k);
    base.push(item);
  });

  return base;
}

// If logged in, load from API and merge guest list once
async function loadShoppingList(listNode) {
  if (isLoggedIn()) {
    let serverItems = [];
    try {
      const data = await apiGetShoppingList();
      serverItems = Array.isArray(data.items) ? data.items : [];
    } catch (err) {
      console.error("Auth/load error:", err);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
      window.location.href = "login.html";
      return false;
    }

    const guestItems = loadGuestShoppingList();
    if (guestItems && guestItems.length) {
      shoppingList = mergeShoppingLists(serverItems, guestItems);
      clearGuestShoppingList();
      try {
        await apiSaveShoppingList(shoppingList);
      } catch (err) {
        console.error("Could not save merged list to server:", err);
      }
    } else {
      shoppingList = serverItems;
    }

    if (!shoppingList.length) {
      bootstrapInitialList(listNode);
      try {
        await apiSaveShoppingList(shoppingList);
      } catch (err) {
        console.error("Could not bootstrap-save list:", err);
      }
    }

    return true;
  }

  const guest = loadGuestShoppingList();
  if (guest && guest.length) {
    shoppingList = guest;
    return true;
  }

  bootstrapInitialList(listNode);
  saveGuestShoppingList(shoppingList);
  return true;
}

function saveShoppingList() {
  if (isLoggedIn()) {
    apiSaveShoppingList(shoppingList).catch((err) => {
      console.error("Couldn't save shopping list to server:", err);
    });
    return;
  }
  saveGuestShoppingList(shoppingList);
}

// === LocalStorage Helpers (Pantry Items) ===

function loadPantryListFromStorage() {
  const raw = localStorage.getItem(PANTRY_STORAGE_KEY);
  if (!raw) {
    PANTRY_DATA = [];
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      PANTRY_DATA = [];
      return;
    }
    PANTRY_DATA = parsed
      .map((x) => String(x || "").trim())
      .filter((x) => x.length > 0)
      .map((name) => ({ id: name.toLowerCase(), name: name }));
  } catch (err) {
    console.error("Couldn't parse pantry list from localStorage");
    PANTRY_DATA = [];
  }
}

function filterPantry(q) {
  const query = String(q || "")
    .toLowerCase()
    .trim();
  if (!query) return [];

  return PANTRY_DATA.filter((it) => {
    const name = String(it.name || it.label || it.title || "").toLowerCase();
    return name.includes(query);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const listNode = document.getElementById("shopping-UL");
  const inputNode = document.getElementById("myInput");
  const addBtn = document.querySelector(".addBtn");
  const recipesGrid = document.getElementById("recipes-grid");

  if (!listNode) {
    console.error("Couldn't find shopping list");
    return;
  }

  await loadRecipesData();
  loadPantryListFromStorage();

  await loadShoppingList(listNode);

  renderShoppingList(listNode);
  syncRecipeButtons();
  setupPantrySearch(listNode);

  // Add custom item
  if (addBtn && inputNode) {
    addBtn.addEventListener("click", () => {
      handleAddCustomItem(inputNode, listNode);
      scheduleSave();
    });

    inputNode.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleAddCustomItem(inputNode, listNode);
        scheduleSave();
      }
    });
  }

  // Toggle complete or remove item
  listNode.addEventListener("click", (event) => {
    const listItem = event.target.closest("li");
    if (!listItem) {
      return;
    }

    const key = listItem.dataset.key;
    if (!key) {
      return;
    }

    if (event.target.classList.contains("close")) {
      removeItemFromShoppingList(key, listNode);
      scheduleSave();
      return;
    }

    toggleItemChecked(key, listNode);
    scheduleSave();
  });

  // Add pantry list changes from other tabs
  window.addEventListener("storage", (e) => {
    if (e.key !== PANTRY_STORAGE_KEY) {
      return;
    }

    loadPantryListFromStorage();

    const pantryInput = document.getElementById("pantry-input");
    const pantryResults = document.getElementById("pantry-results");
    if (!pantryInput || !pantryResults) return;

    const q = String(pantryInput.value || "")
      .toLowerCase()
      .trim();

    if (!q) {
      renderPantryMessage(
        pantryResults,
        "Start typing to search Pantry items."
      );
      return;
    }

    const filtered = filterPantry(q);
    renderPantryResults(filtered, pantryResults, listNode);
  });

  if (recipesGrid) {
    injectAddIngredientsButtons(recipesGrid);
    syncRecipeButtons();

    const observer = new MutationObserver(() => {
      injectAddIngredientsButtons(recipesGrid);
      syncRecipeButtons();
    });
    observer.observe(recipesGrid, { childList: true });
  }
});

async function loadRecipesData() {
  try {
    const res = await fetch("recipes.json");
    RECIPES_DATA = await res.json();
  } catch (err) {
    console.error("Failed to load recipes.json for shopping list:", err);
    RECIPES_DATA = [];
  }
}

function setupPantrySearch(listNode) {
  const input = document.getElementById("pantry-input");
  const results = document.getElementById("pantry-results");

  if (!input || !results) {
    return;
  }

  renderPantryMessage(results, "Start typing to search Pantry items.");

  input.addEventListener("input", () => {
    const q = (input.value || "").toLowerCase().trim();

    if (!q) {
      renderPantryMessage(results, "Start typing to search Pantry items.");
      return;
    }

    const filtered = PANTRY_DATA.filter((it) => {
      const name = String(it.name || it.label || it.title || "").toLowerCase();
      return name.includes(q);
    });
    renderPantryResults(filtered, results, listNode);
  });
}

function renderPantryMessage(resultsNode, message) {
  clearElement(resultsNode);

  const p = document.createElement("p");
  p.textContent = message;
  p.style.margin = "0.25rem 0 0 ";
  resultsNode.appendChild(p);
}

function renderPantryResults(items, resultsNode, listNode) {
  clearElement(resultsNode);

  if (!items.length) {
    renderPantryMessage(resultsNode, "No Pantry items found.");
    return;
  }

  items.slice(0, 8).forEach((item) => {
    const row = document.createElement("div");
    row.className = "pantry-result";

    const name = document.createElement("p");
    name.className = "pantry-result-name";
    name.textContent = String(
      item.name || item.label || item.title || ""
    ).trim();

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pantry-add-btn";
    btn.textContent = "Add";

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const label = String(item.name || item.label || item.title || "").trim();
      if (!label) {
        return;
      }

      addPantryItemToShoppingList(item, label, listNode);
      scheduleSave();
    });

    row.appendChild(name);
    row.appendChild(btn);
    resultsNode.appendChild(row);
  });
}

function addPantryItemToShoppingList(item, label, listNode) {
  const pantryId = item.id != null ? String(item.id) : label.toLowerCase();
  const key = "pantry:" + pantryId;

  const exists = shoppingList.some((x) => x.key === key);
  if (exists) {
    return;
  }

  shoppingList.push({
    key: key,
    label: label,
    checked: false,
    source: "pantry",
    recipeId: null,
    pantryId: pantryId,
  });

  renderShoppingList(listNode);
  syncRecipeButtons();
}

function syncRecipeButtons() {
  const recipeIdsInList = new Set(
    shoppingList
      .filter((item) => item.source === "recipe")
      .map((item) => String(item.recipeId))
  );

  document.querySelectorAll(".add-ingredients-btn").forEach((btn) => {
    const recipeId = btn.dataset.recipeId;
    if (!recipeId) {
      return;
    }

    if (recipeIdsInList.has(String(recipeId))) {
      btn.classList.add("added");
      btn.textContent = "Remove Ingredients";
    } else {
      btn.classList.remove("added");
      btn.textContent = "Add Ingredients";
    }
  });
}

function bootstrapInitialList(listNode) {
  const listItems = listNode.querySelectorAll("li");

  listItems.forEach((li) => {
    const text = li.firstChild ? li.firstChild.textContent.trim() : "";
    if (!text) {
      return;
    }

    const checked = li.classList.contains("checked");
    const key = "initial:" + text.toLowerCase();

    shoppingList.push({
      key: key,
      label: text,
      checked: checked,
      source: "initial",
      recipeId: null,
      pantryId: null,
    });
  });
}

function renderShoppingList(listNode) {
  while (listNode.firstChild) {
    listNode.removeChild(listNode.firstChild);
  }

  shoppingList.forEach((item) => {
    const li = document.createElement("li");
    li.dataset.key = item.key;

    if (item.checked) {
      li.classList.add("checked");
    }

    const textNode = document.createTextNode(item.label);
    li.appendChild(textNode);

    const closeSpan = document.createElement("span");
    closeSpan.className = "close";
    closeSpan.appendChild(document.createTextNode("×"));
    li.appendChild(closeSpan);

    listNode.appendChild(li);
  });
}

function handleAddCustomItem(inputNode, listNode) {
  const value = inputNode.value.trim();
  if (!value) {
    return;
  }

  const key = "custom:" + value.toLowerCase();

  const existing = shoppingList.find((item) => item.key === key);
  if (existing) {
    inputNode.value = "";
    return;
  }

  shoppingList.push({
    key: key,
    label: value,
    checked: false,
    source: "custom",
    recipeId: null,
    pantryId: null,
  });

  inputNode.value = "";
  renderShoppingList(listNode);
  syncRecipeButtons();
}

function toggleItemChecked(key, listNode) {
  const item = shoppingList.find((it) => it.key === key);
  if (!item) {
    return;
  }

  item.checked = !item.checked;
  renderShoppingList(listNode);
}

function removeItemFromShoppingList(key, listNode) {
  shoppingList = shoppingList.filter((item) => item.key !== key);
  renderShoppingList(listNode);
  syncRecipeButtons();
}

function injectAddIngredientsButtons(recipesGrid) {
  const cards = recipesGrid.querySelectorAll(".recipe-card");

  cards.forEach((card) => {
    if (card.querySelector(".add-ingredients-btn")) {
      return;
    }

    const favBtn = card.querySelector(".favorite-btn");

    const recipeId = favBtn ? favBtn.getAttribute("data-id") : null;
    if (!recipeId) {
      return;
    }

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "add-ingredients-btn";
    btn.dataset.recipeId = recipeId;
    btn.appendChild(document.createTextNode("Add Ingredients"));

    btn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const listNode = document.getElementById("shopping-UL");
      if (!listNode) {
        return;
      }

      const isAdded = btn.classList.contains("added");

      if (!isAdded) {
        const added = addRecipeToShoppingList(recipeId, listNode);
        if (!added) {
          return;
        }
        btn.classList.add("added");
        btn.textContent = "Remove Ingredients";
      } else {
        removeRecipeFromShoppingList(recipeId, listNode);
        btn.classList.remove("added");
        btn.textContent = "Add Ingredients";
      }
      scheduleSave();
    });

    card.appendChild(btn);
  });
}

function removeRecipeFromShoppingList(recipeId, listNode) {
  shoppingList = shoppingList.filter((item) => {
    return !(
      item.source === "recipe" && String(item.recipeId) === String(recipeId)
    );
  });
  renderShoppingList(listNode);
  syncRecipeButtons();
}

function addRecipeToShoppingList(recipeId, listNode) {
  const recipe = RECIPES_DATA.find((r) => String(r.id) === String(recipeId));
  if (!recipe) {
    console.error("Recipe not found:", recipeId);
    return false;
  }

  if (!Array.isArray(recipe.ingredients)) {
    console.error("Ingredients missing or not an array", recipeId);
    return false;
  }

  recipe.ingredients.forEach((ing) => {
    const name = ing.name ? String(ing.name).trim() : "";

    if (!name) {
      return;
    }

    const amount =
      ing.amount === null || ing.amount === undefined
        ? ""
        : String(ing.amount).trim();
    const unit =
      ing.unit === null || ing.unit === undefined
        ? ""
        : String(ing.unit).trim();

    const label = formatIngredientLabel(name, amount, unit);

    const key = "recipe:" + String(recipeId) + ":" + name.toLowerCase();

    const existing = shoppingList.find((item) => item.key === key);
    if (existing) {
      return;
    }

    shoppingList.push({
      key: key,
      label: label,
      checked: false,
      source: "recipe",
      recipeId: recipeId,
      pantryId: null,
    });
  });

  renderShoppingList(listNode);
  syncRecipeButtons();
  return true;
}

function clearElement(node) {
  while (node && node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function formatIngredientLabel(name, amount, unit) {
  if (!amount && !unit) {
    return name;
  }

  if (amount && !unit) {
    return amount + " " + name;
  }

  if (amount && unit) {
    return amount + " " + unit + " " + name;
  }

  return unit + " " + name;
}
