const RecipeApp = (function() {
    
    const recipes = [
        { 
            id: 1, 
            title: "Spaghetti Carbonara", 
            time: 20, 
            difficulty: "easy", 
            description: "A classic Italian pasta dish with eggs, cheese, and pancetta.", 
            category: "pasta",
            ingredients: ["Spaghetti", "2 Eggs", "Pancetta", "Parmesan Cheese", "Black Pepper"],
            steps: [
                { text: "Boil a large pot of salted water." },
                { text: "Cook the spaghetti until al dente." },
                { 
                    text: "Prepare the sauce (The Tricky Part):", 
                    subSteps: [
                        { text: "Whisk eggs in a bowl." },
                        { text: "Mix in grated parmesan and freshly cracked pepper." }
                    ]
                },
                { text: "Fry pancetta until crisp, then toss with pasta and sauce." }
            ]
        },
        { 
            id: 2, 
            title: "Chicken Tikka Masala", 
            time: 45, 
            difficulty: "medium", 
            description: "Roasted marinated chicken chunks in a spiced sauce.", 
            category: "curry",
            ingredients: ["Chicken Breast", "Yogurt", "Spices (Cumin, Coriander)", "Tomato Puree", "Cream"],
            steps: [
                { text: "Marinate chicken in yogurt and spices for 30 mins." },
                { text: "Grill chicken pieces until cooked." },
                { text: "Simmer tomato sauce with spices and add cream." },
                { text: "Combine chicken with sauce and serve." }
            ]
        },
        { 
            id: 3, 
            title: "Garden Salad", 
            time: 10, 
            difficulty: "easy", 
            description: "Fresh greens with a light balsamic vinaigrette.", 
            category: "salad",
            ingredients: ["Lettuce", "Tomatoes", "Cucumber", "Olive Oil", "Balsamic Vinegar"],
            steps: [
                { text: "Chop all vegetables." },
                { text: "Whisk oil and vinegar together." },
                { text: "Toss vegetables with dressing." }
            ]
        },
        { 
            id: 4, 
            title: "Beef Wellington", 
            time: 90, 
            difficulty: "hard", 
            description: "Beef fillet wrapped in puff pastry with mushroom duxelles.", 
            category: "meat",
            ingredients: ["Beef Fillet", "Puff Pastry", "Mushrooms", "Prosciutto", "Egg Wash"],
            steps: [
                { text: "Sear the beef fillet on all sides." },
                { 
                    text: "Prepare the Mushroom Duxelles:", 
                    subSteps: [
                        { text: "Finely chop mushrooms." },
                        { text: "Fry in pan until all moisture evaporates." }
                    ] 
                },
                { text: "Wrap beef in prosciutto and mushroom mixture." },
                { text: "Wrap in puff pastry and bake until golden." }
            ]
        },
        { 
            id: 5, 
            title: "Vegetable Stir Fry", 
            time: 15, 
            difficulty: "easy", 
            description: "Quick and healthy veggies sautéed in ginger and soy.", 
            category: "vegetarian",
            ingredients: ["Broccoli", "Carrots", "Soy Sauce", "Ginger", "Garlic"],
            steps: [
                { text: "Heat oil in a wok." },
                { text: "Stir fry ginger and garlic." },
                { text: "Add vegetables and soy sauce, cook until tender." }
            ]
        },
        { 
            id: 6, 
            title: "Chocolate Soufflé", 
            time: 40, 
            difficulty: "hard", 
            description: "A light, airy French dessert that is a true test of timing.", 
            category: "dessert",
            ingredients: ["Dark Chocolate", "Butter", "Sugar", "Eggs"],
            steps: [
                { text: "Melt chocolate and butter." },
                { text: "Separate egg whites and yolks." },
                { text: "Whip egg whites until stiff peaks form." },
                { text: "Fold whites into chocolate mixture and bake." }
            ]
        },
        { 
            id: 7, 
            title: "Classic Cheeseburger", 
            time: 25, 
            difficulty: "medium", 
            description: "Juicy beef patty with melted cheddar on a brioche bun.", 
            category: "meat",
            ingredients: ["Ground Beef", "Cheddar Slice", "Brioche Bun", "Lettuce", "Tomato"],
            steps: [
                { text: "Form beef into patties." },
                { text: "Grill patty for 4 mins per side." },
                { text: "Add cheese in the last minute to melt." },
                { text: "Assemble burger with toppings." }
            ]
        },
        { 
            id: 8, 
            title: "Lentil Soup", 
            time: 35, 
            difficulty: "easy", 
            description: "Hearty and warming soup packed with protein.", 
            category: "soup",
            ingredients: ["Lentils", "Carrots", "Celery", "Vegetable Broth", "Onion"],
            steps: [
                { text: "Sauté onions, carrots, and celery." },
                { text: "Add lentils and broth." },
                { text: "Simmer for 30 minutes until lentils are soft." }
            ]
        }
    ];

    const recipeContainer = document.querySelector('#recipe-container');
    const sortAlphaBtn = document.querySelector('#sort-alpha'); 
    const sortTimeBtn = document.querySelector('#sort-time');

    const filterAllBtn = document.querySelector('#filter-all');
    const filterEasyBtn = document.querySelector('#filter-easy');
    const filterMediumBtn = document.querySelector('#filter-medium');
    const filterHardBtn = document.querySelector('#filter-hard');
    const filterQuickBtn = document.querySelector('#filter-quick');

    // Track current state
    let currentSort = 'none';
    let currentFilter = 'all';

    const sortByTitle = (data) => [...data].sort((a, b) => a.title.localeCompare(b.title));
    const sortByTime = (data) => [...data].sort((a, b) => a.time - b.time);

    const renderSteps = (steps) => {
        if (!steps || steps.length === 0) return '';
        
        let html = '<ul class="steps-list">';
        steps.forEach(step => {
            html += `<li>${step.text}`;
            // RECURSION: Check for nested steps
            if (step.subSteps && step.subSteps.length > 0) {
                html += renderSteps(step.subSteps);
            }
            html += `</li>`;
        });
        html += '</ul>';
        return html;
    };

    const renderIngredients = (ingredients) => {
        if (!ingredients) return '';
        return `<ul>${ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>`;
    };

    const createRecipeCard = (recipe) => {
        return `
            <div class="recipe-card" data-id="${recipe.id}">
                <h3>${recipe.title}</h3>
                <div class="recipe-meta">
                    <span>${recipe.time} min</span>
                    <span class="difficulty ${recipe.difficulty}">${recipe.difficulty}</span>
                </div>
                <p>${recipe.description}</p>
                
                <button class="toggle-btn" onclick="RecipeApp.toggleDetails(${recipe.id}, 'ing')">Ingredients</button>
                <button class="toggle-btn" onclick="RecipeApp.toggleDetails(${recipe.id}, 'steps')">Show Steps</button>
                
                <div id="ing-${recipe.id}" class="details hidden">
                    <h4>Ingredients:</h4>
                    ${renderIngredients(recipe.ingredients)}
                </div>

                <div id="steps-${recipe.id}" class="details hidden">
                    <h4>Instructions:</h4>
                    ${renderSteps(recipe.steps)} </div>
            </div>
        `;
    };

    const renderRecipes = (recipeList) => {
        const recipeHTML = recipeList.map(recipe => createRecipeCard(recipe)).join('');
        recipeContainer.innerHTML = recipeHTML;
    };

    const updateDisplay = () => {
        let result = [...recipes];

        if (currentFilter === 'easy') {
            result = result.filter(r => r.difficulty === 'easy');
        } else if (currentFilter === 'medium') {
            result = result.filter(r => r.difficulty === 'medium');
        } else if (currentFilter === 'hard') {
            result = result.filter(r => r.difficulty === 'hard');
        } else if (currentFilter === 'quick') {
            result = result.filter(r => r.time < 30);
        }


        if (currentSort === 'alpha') {
            result = sortByTitle(result);
        } else if (currentSort === 'time') {
            result = sortByTime(result);
        }

        renderRecipes(result);
    };

    const setupEventListeners = () => {
        sortAlphaBtn.addEventListener('click', () => {
            currentSort = 'alpha';
            updateDisplay();
        });

        sortTimeBtn.addEventListener('click', () => {
            currentSort = 'time';
            updateDisplay();
        });

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
    };

    return {
        init: () => {
            setupEventListeners();
            updateDisplay();
        },
        toggleDetails: (id, type) => {
            const element = document.getElementById(`${type}-${id}`);
            if (element) {
                element.classList.toggle('hidden');
            }
        }
    };

})();


document.addEventListener('DOMContentLoaded', RecipeApp.init);