const emptyListText = document.getElementById("empty_list_text");
const pantryList = document.getElementById("pantry_list");
const recommendationsButton = document.getElementById("show_me_recommendations_button");
const clearPantryButton = document.getElementById("clear_pantry_button");
const removeRecentItemButton = document.getElementById("remove_recent_item_button");
const recommendationsGrid = document.getElementById("recipe_recommendations_grid");
const ingredientInput = document.getElementById("ingredient_input");
const addIngredientButton = document.getElementById("add_ingredient_button");
const addToPantryButton = document.getElementById("add_to_pantry_button");
const commonIngredientsSelection = document.getElementById("common_ingredients_select");
const emptyRecipeRecsText = document.getElementById("empty_recipe_recs_text");
const pantryListContainer = document.getElementById("pantry_list_container");
const errorText = document.getElementById("error_text");
const noRecipesFoundText = document.getElementById("no_recipes_found_text");
let recipes = []; 


// Add Individual items to pantry list 
addToPantryButton.addEventListener("click", () => {

        if (ingredientInput.value === "" && commonIngredientsSelection.value === ""){
            errorText.style.color = "white"; 
            errorText.innerText = "Please either enter an ingredient or select one from the dropdown menu of common ingredients"; 
            emptyListText.style.display = "none";
        }

        if (ingredientInput.value !== "" && commonIngredientsSelection.value !== ""){
            errorText.style.color = "white"; 
            errorText.innerText = "Please only enter an ingredient or select one from the dropdown menu of common ingredients, not both"; 
            emptyListText.style.display = "none";
        }

         else if (ingredientInput.value !== "" || commonIngredientsSelection.value !== ""){
            if (ingredientInput.value !== ""){
                const newManualIngredient = document.createElement("li");
                newManualIngredient.innerText = ingredientInput.value;
                pantryList.append(newManualIngredient);
                ingredientInput.value = "";
                emptyListText.style.display = "none";
                errorText.innerText = "";
            }

        else if (commonIngredientsSelection.value !== ""){
                const newCommonIngredient = document.createElement("li");
                newCommonIngredient.innerText = commonIngredientsSelection.value.charAt(0).toUpperCase() + commonIngredientsSelection.value.slice(1);
                pantryList.append(newCommonIngredient);
                commonIngredientsSelection.value = "";
                emptyListText.style.display = "none";
                errorText.innerText = "";
            }
        }
}); 


// Clear entire Pantry and Recommendations Button 
clearPantryButton.addEventListener("click", () => {
    pantryList.innerHTML = "";
    emptyListText.style.display = "flex";
    emptyListText.style.justifyContent = "center";
    recommendationsGrid.innerHTML = "";
    emptyRecipeRecsText.style.display = "flex";
    emptyRecipeRecsText.style.justifyContent = "center";
    noRecipesFoundText.innerText = "";
    errorText.innerText = "";
});


// Remove Most Recent Item Button
removeRecentItemButton.addEventListener("click", async () => {
    pantryList.removeChild(pantryList.lastElementChild);



     try {
        const res = await fetch("recipes.json"); 
        recipes = await res.json(); 

        const pantryItemsArray = Array.from(pantryList.children)
        .map(li => li.innerText.toLowerCase().trim()); 


        const recipesWithIngredient = recipes.filter(recipe => {
            return recipe.ingredients.some(ingredient => {
                const ingredientName = ingredient.name.toLowerCase(); 
                const ingredientNameMatch = pantryItemsArray.some (pantryItem => 
                    ingredientName.includes(pantryItem) || pantryItem.includes(ingredientName)
                ); 
                return ingredientNameMatch; 
            }); 
        }); 

        recommendationsGrid.innerHTML = "";
    
            recipesWithIngredient.forEach(recipe => {
                const card = createRecipeCard(recipe); 
                recommendationsGrid.appendChild(card); 
                emptyRecipeRecsText.style.display = "none"; 
                noRecipesFoundText.innerText = "";
            }); 
        }
    
    catch (err) {
        console.error(err);
    }




}); 


recommendationsButton.addEventListener("click", async () => {

    try {
        const res = await fetch("recipes.json"); 
        recipes = await res.json(); 

        const pantryItemsArray = Array.from(pantryList.children)
        .map(li => li.innerText.toLowerCase().trim()); 


        const recipesWithIngredient = recipes.filter(recipe => {
            return recipe.ingredients.some(ingredient => {
                const ingredientName = ingredient.name.toLowerCase(); 
                const ingredientNameMatch = pantryItemsArray.some (pantryItem => 
                    ingredientName.includes(pantryItem) || pantryItem.includes(ingredientName)
                ); 

                if(!ingredientNameMatch) {
                    emptyRecipeRecsText.style.display = "none"; 
                    noRecipesFoundText.innerText = "No recipes were found with any of the ingredients in your pantry. Please try adding some different ingredients!"; 
                    noRecipesFoundText.style.color = "red";
                    

                }

                return ingredientNameMatch; 
            }); 
        }); 

        recommendationsGrid.innerHTML = "";
    
            recipesWithIngredient.forEach(recipe => {
                const card = createRecipeCard(recipe); 
                recommendationsGrid.appendChild(card); 
                emptyRecipeRecsText.style.display = "none"; 
                noRecipesFoundText.innerText = "";
            }); 
        }
    
    catch (err) {
        console.error(err);
    }

}); 



