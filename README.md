# Baking Club Website

## Purpose

This website serves as a comprehensive baking assistant platform for the UW Madison Baking Club. It provides tools and resources to help users discover recipes, manage ingredients, create shopping lists, convert units, and follow step-by-step recipe instructions.

## Features

### 1. Homepage
- Welcoming overview of the Baking Club
- Quick access to key tools
- Global theme toggle (light/dark mode)
- Featured recipes carousel
- Social media links:

### 2. Recipes
- Central page for browsing available recipes
- Recipe cards generated dynamically from JSON database
- Search and filter functionality
- Save/like recipes (stored in localStorage)
- Tag-based filtering

### 3. Recipe Details
- Full instructions for individual recipes
- Template page that loads content based on recipe ID
- Step-by-step instructions with images
- Ingredients list and notes
- Link to Recipe Coach for guided walkthrough

### 4. Coach
- Step-by-step guided walkthrough of recipes
- Flashcard-style card navigation
- Keyboard navigation support
- Integrated timer with alerts
- Interactive progress tracker

### 5. Pantry
- Track ingredients users have available
- Get recipe recommendations based on ingredient matches
- Edit and manage pantry items
- Persistent storage using localStorage

### 6. Shopping List
- Generate and manage shopping lists
- Add items from recipes or pantry
- Customizable checklist
- Export functionality

### 7. Convert
- Unit conversion tool for baking
- Temperature conversion (Celsius ↔ Fahrenheit)
- Weight conversion (grams, kilograms, ounces, pounds)
- Liquid volume conversion
- Length conversion
- Baking-specific unit conversions

### 8. Membership
- User input form for club membership
- Leadership position information
- Club benefits and rights

## How We Meet Project Requirements

### 1. README.md File
You are reading it!

### 2. CSS Library (Bootstrap)
All HTML pages consistently use **Bootstrap 5.3.3** for responsive design and UI components. 

### 3. Global Stylesheet
All HTML pages link to `styles.css` as the global stylesheet. Additional page-specific stylesheets (e.g., `recipe.css`, `pantry.css`) are used where needed.

### 4. HTML Pages
The project contains **8 HTML pages** (exceeding the minimum requirement of 7):
- index.html (Homepage)
- recipes.html (Recipe browsing)
- recipe.html (Recipe details)
- coach.html (Recipe coach)
- pantry.html (Pantry management)
- shopping-list.html (Shopping list)
- convert.html (Unit converter)
- membership.html (Membership form)

### 5. Consistent Navigation Bar
All pages use a consistent primary navigation bar implemented through the `header-footer.js` custom element (`<my-header>`). The navigation includes links to all major sections of the website.

### 6. HTML Tags 
The project uses multiple HTML5 semantic tags and modern features:
- `<article>` - For recipe content blocks
- `<section>` - For content sections
- `<aside>` - For sidebar navigation
- `<nav>` - For navigation menus
- `<main>` - For main content areas
- `<header>` - For page headers
- `<footer>` - For page footers
- `<svg>` - For inline SVG graphics
- `hidden` attribute - For conditionally hidden elements
- ARIA attributes - For accessibility (`aria-label`, `aria-hidden`)

### 7. JavaScript Dynamic Updates
JavaScript dynamically updates content on multiple pages:
- **recipes.js**: Dynamically generates recipe cards, implements search/filter functionality
- **recipe.js**: Dynamically loads and renders recipe details based on URL parameters
- **pantry.js**: Dynamically updates pantry list and recipe recommendations
- **coach.js**: Dynamically loads and displays recipe steps as flashcards
- **convert.js**: Real-time unit conversion calculations
- **home-featured.js**: Dynamically generates homepage carousel

### 8. Forms and User Input
The **membership.html** page contains a comprehensive form with:
- Text inputs (name, email, major, dietary restrictions)
- Select dropdown (year of study)
- Submit button with validation
- Form data processing via JavaScript

Additional input controls:
- Pantry page: ingredient input and selection
- Shopping list: item input fields
- Convert page: number inputs for conversions

### 9. Data Persistence (localStorage)
The project extensively uses **localStorage** to persist user data:
- **darkmode.js**: Stores theme preference (`darkmode` key)
- **recipes.js**: Stores favorite recipes (`favoriteRecipes` key)
- **pantry.js**: Stores pantry list (`pantryList` key) and recipe recommendations (`savedRecipes` key)
- **shopping-list.js**: Stores shopping list data

### 10. Fetch API for External Data
The **fetch API** is used to dynamically load recipe data from the external `recipes.json` file:
- **recipes.js**: Loads all recipes for browsing and filtering
- **recipe.js**: Loads individual recipe details based on URL parameters
- **pantry.js**: Loads recipes for ingredient-based recommendations
- **coach.js**: Loads recipe steps for guided walkthrough
- **home-featured.js**: Loads featured recipes for homepage carousel
- **shopping-list.js**: Loads recipes for adding ingredients to shopping list

All fetch calls use async/await pattern with proper error handling to ensure robust data loading.
