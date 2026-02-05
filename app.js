// 1. Recipe Data Array
const recipes = [
    { id: 1, title: "Spaghetti Carbonara", time: 20, difficulty: "easy", description: "A classic Italian pasta dish with eggs, cheese, and pancetta.", category: "pasta" },
    { id: 2, title: "Chicken Tikka Masala", time: 45, difficulty: "medium", description: "Roasted marinated chicken chunks in a spiced sauce.", category: "curry" },
    { id: 3, title: "Garden Salad", time: 10, difficulty: "easy", description: "Fresh greens with a light balsamic vinaigrette.", category: "salad" },
    { id: 4, title: "Beef Wellington", time: 90, difficulty: "hard", description: "Beef fillet wrapped in puff pastry with mushroom duxelles.", category: "meat" },
    { id: 5, title: "Vegetable Stir Fry", time: 15, difficulty: "easy", description: "Quick and healthy veggies sautéed in ginger and soy.", category: "vegetarian" },
    { id: 6, title: "Chocolate Soufflé", time: 40, difficulty: "hard", description: "A light, airy French dessert that is a true test of timing.", category: "dessert" },
    { id: 7, title: "Classic Cheeseburger", time: 25, difficulty: "medium", description: "Juicy beef patty with melted cheddar on a brioche bun.", category: "meat" },
    { id: 8, title: "Lentil Soup", time: 35, difficulty: "easy", description: "Hearty and warming soup packed with protein.", category: "soup" }
];

// 2. DOM Selection
const recipeContainer = document.querySelector('#recipe-container');
const sortAlphaBtn = document.querySelector('#sort-alpha'); 
const sortTimeBtn = document.querySelector('#sort-time');

// --- NEW: Filter Button Selections ---
const filterAllBtn = document.querySelector('#filter-all');
const filterEasyBtn = document.querySelector('#filter-easy');
const filterMediumBtn = document.querySelector('#filter-medium');
const filterHardBtn = document.querySelector('#filter-hard');
const filterQuickBtn = document.querySelector('#filter-quick');

// Track current state
let currentSort = 'none';
let currentFilter = 'all'; // NEW: Track filter state

// 3. Sorting and Filtering Functions
const sortByTitle = (data) => [...data].sort((a, b) => a.title.localeCompare(b.title));
const sortByTime = (data) => [...data].sort((a, b) => a.time - b.time);

// 4. Create Recipe Card Function
const createRecipeCard = (recipe) => {
    return `
        <div class="recipe-card" data-id="${recipe.id}">
            <h3>${recipe.title}</h3>
            <div class="recipe-meta">
                <span>${recipe.time} min</span>
                <span class="difficulty ${recipe.difficulty}">${recipe.difficulty}</span>
            </div>
            <p>${recipe.description}</p>
        </div>
    `;
};

// 5. Render Function
const renderRecipes = (recipeList) => {
    const recipeHTML = recipeList.map(recipe => createRecipeCard(recipe)).join('');
    recipeContainer.innerHTML = recipeHTML;
};

// 6. Update Display Logic (Combines Filtering and Sorting)
const updateDisplay = () => {
    let result = [...recipes];

    // --- NEW: Filter Logic ---
    if (currentFilter === 'easy') {
        result = result.filter(r => r.difficulty === 'easy');
    } else if (currentFilter === 'medium') {
        result = result.filter(r => r.difficulty === 'medium');
    } else if (currentFilter === 'hard') {
        result = result.filter(r => r.difficulty === 'hard');
    } else if (currentFilter === 'quick') {
        result = result.filter(r => r.time < 30);
    }

    // Sort Logic
    if (currentSort === 'alpha') {
        result = sortByTitle(result);
    } else if (currentSort === 'time') {
        result = sortByTime(result);
    }

    renderRecipes(result);
};

// 7. Event Listeners for Sorting Buttons
sortAlphaBtn.addEventListener('click', () => {
    currentSort = 'alpha';
    updateDisplay();
});

sortTimeBtn.addEventListener('click', () => {
    currentSort = 'time';
    updateDisplay();
});

// --- NEW: Event Listeners for Filter Buttons ---
filterAllBtn.addEventListener('click', () => {
    currentFilter = 'all';
    updateDisplay();
});

filterEasyBtn.addEventListener('click', () => {
    currentFilter = 'easy';
    updateDisplay();
});

filterMediumBtn.addEventListener('click', () => {
    currentFilter = 'medium';
    updateDisplay();
});

filterHardBtn.addEventListener('click', () => {
    currentFilter = 'hard';
    updateDisplay();
});

filterQuickBtn.addEventListener('click', () => {
    currentFilter = 'quick';
    updateDisplay();
});

// 8. Initialize the App
updateDisplay();