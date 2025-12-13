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

const SHOPPING_STORAGE_KEY = "shoppingList_v1";

function saveShoppingList() {
  try {
    localStorage.setItem(SHOPPING_STORAGE_KEY, JSON.stringify(shoppingList));
  } catch (err) {
    console.error("Couldn't save shopping list");
  }
}

function loadShoppingList() {
  const raw = localStorage.getItem(SHOPPING_STORAGE_KEY);

  if (!raw) {
    return false;
  }

  try {
    const parse = JSON.parse(raw);
    if (!Array.isArray(parse)) {
      return false;
    }
    shoppingList = parse;
    return true;
  } catch {
    return false;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const listNode = document.getElementById("shopping-UL");
  const inputNode = document.getElementById("myInput");
  const addBtn = document.querySelector(".addBtn");
  const recipesGrid = document.getElementById("recipes-grid");
  //   const pantrySearch = document.getElementById("pantry-search");
  //   const pantryResults = document.getElementById("pantry-results");
  //   const downloadBtn = document.getElementById("download-list");

  if (!listNode) {
    console.error("Couldn't find shopping list");
    return;
  }

  await loadRecipesData();

  const loaded = loadShoppingList();
  if (!loaded) {
    bootstrapInitialList(listNode);
    saveShoppingList();
  }

  //   bootstrapInitialList(listNode);

  renderShoppingList(listNode);
  syncRecipeButtons();

  if (addBtn && inputNode) {
    addBtn.addEventListener("click", () => {
      handleAddCustomItem(inputNode, listNode);
    });

    inputNode.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleAddCustomItem(inputNode, listNode);
      }
    });
  }

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
      return;
    }

    toggleItemChecked(key, listNode);
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
  saveShoppingList();
  renderShoppingList(listNode);
}

function toggleItemChecked(key, listNode) {
  const item = shoppingList.find((it) => it.key === key);
  if (!item) {
    return;
  }

  item.checked = !item.checked;
  saveShoppingList();
  renderShoppingList(listNode);
}

function removeItemFromShoppingList(key, listNode) {
  shoppingList = shoppingList.filter((item) => item.key !== key);
  saveShoppingList();
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
  saveShoppingList();
  renderShoppingList(listNode);
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

  saveShoppingList();
  renderShoppingList(listNode);
  return true;
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
