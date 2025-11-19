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

