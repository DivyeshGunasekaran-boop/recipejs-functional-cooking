(() => {
    // --- DATA ---
    const recipes = [
        { 
            id: 1, title: "Spaghetti Carbonara", difficulty: "Easy", time: 20, 
            description: "A classic Italian pasta dish with eggs, cheese, and pancetta.",
            ingredients: ["Pasta", "Eggs", "Pancetta", "Parmesan", "Pepper"],
            steps: ["Boil pasta.", "Fry pancetta.", "Mix eggs and cheese.", "Combine."]
        },
        { 
            id: 2, title: "Chicken Tikka Masala", difficulty: "Medium", time: 45, 
            description: "Roasted marinated chicken chunks in a spiced sauce.",
            ingredients: ["Chicken", "Yogurt", "Spices", "Tomato Sauce"],
            steps: ["Marinate.", "Grill.", "Simmer in sauce."]
        },
        { 
            id: 3, title: "Garden Salad", difficulty: "Easy", time: 10, 
            description: "Fresh greens with a light balsamic vinaigrette.",
            ingredients: ["Lettuce", "Tomato", "Cucumber", "Vinaigrette"],
            steps: ["Chop veggies.", "Whisk dressing.", "Toss."]
        },
        { 
            id: 4, title: "Beef Wellington", difficulty: "Hard", time: 90, 
            description: "Beef fillet wrapped in puff pastry with mushroom duxelles.",
            ingredients: ["Beef", "Mushrooms", "Puff Pastry", "Prosciutto"],
            steps: ["Sear beef.", "Prep mushrooms.", "Wrap.", "Bake."]
        },
        { 
            id: 5, title: "Vegetable Stir Fry", difficulty: "Easy", time: 15, 
            description: "Quick and healthy veggies sautéed in ginger and soy.",
            ingredients: ["Broccoli", "Carrots", "Soy Sauce", "Ginger"],
            steps: ["Heat oil.", "Stir fry veggies.", "Add sauce."]
        },
        { 
            id: 6, title: "Chocolate Soufflé", difficulty: "Hard", time: 40, 
            description: "A light, airy French dessert that is a true test of timing.",
            ingredients: ["Chocolate", "Eggs", "Sugar", "Butter"],
            steps: ["Melt chocolate.", "Whip egg whites.", "Fold.", "Bake."]
        },
        { 
            id: 7, title: "Classic Cheeseburger", difficulty: "Medium", time: 25, 
            description: "Juicy beef patty with melted cheddar on a brioche bun.",
            ingredients: ["Beef Patty", "Cheddar", "Bun", "Lettuce"],
            steps: ["Grill patty.", "Toast bun.", "Assemble."]
        },
        { 
            id: 8, title: "Lentil Soup", difficulty: "Easy", time: 35, 
            description: "Hearty and warming soup packed with protein.",
            ingredients: ["Lentils", "Carrots", "Onion", "Broth"],
            steps: ["Sauté aromatics.", "Add lentils/broth.", "Simmer."]
        }
    ];

    // --- STATE ---
    let favorites = JSON.parse(localStorage.getItem('recipeFavorites')) || [];
    let currentFilter = 'all';
    let currentSort = null; 
    let searchQuery = '';
    let showFavoritesOnly = false;

    // --- DOM ---
    const container = document.getElementById('recipe-container');
    const countDisplay = document.getElementById('recipe-count');
    const searchInput = document.getElementById('search-bar');
    const favToggle = document.getElementById('show-favorites-btn');
    const sortAlpha = document.getElementById('sort-alpha');
    const sortTime = document.getElementById('sort-time');
    const filterBtns = document.querySelectorAll('.group button[id^="filter-"]');

    // --- FUNCTIONS ---
    function debounce(func, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    function getRecipes() {
        let result = recipes.filter(r => {
            // Filter Logic
            let matchFilter = true;
            if (currentFilter === 'easy') matchFilter = r.difficulty === 'Easy';
            else if (currentFilter === 'medium') matchFilter = r.difficulty === 'Medium';
            else if (currentFilter === 'hard') matchFilter = r.difficulty === 'Hard';
            else if (currentFilter === 'quick') matchFilter = r.time < 30;

            // Search Logic
            const term = searchQuery.toLowerCase();
            const matchSearch = r.title.toLowerCase().includes(term) || 
                                r.ingredients.some(i => i.toLowerCase().includes(term));
            
            // Favorites Logic
            const matchFav = showFavoritesOnly ? favorites.includes(r.id) : true;

            return matchFilter && matchSearch && matchFav;
        });

        // Sort Logic
        if (currentSort === 'alpha') result.sort((a, b) => a.title.localeCompare(b.title));
        else if (currentSort === 'time') result.sort((a, b) => a.time - b.time);

        return result;
    }

    function render() {
        container.innerHTML = '';
        const data = getRecipes();
        
        countDisplay.textContent = `Showing ${data.length} of ${recipes.length} recipes`;

        if (data.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:white; width:100%;">No recipes found.</p>`;
            return;
        }

        data.forEach(r => {
            const isFav = favorites.includes(r.id);
            const card = document.createElement('div');
            card.className = 'recipe-card';
            
            card.innerHTML = `
                <div class="card-header">
                    <h3>${r.title}</h3>
                    <button class="heart-btn" data-id="${r.id}">
                        ${isFav ? '❤️' : '🤍'}
                    </button>
                </div>
                
                <div class="meta-row">
                    <span>${r.time} min</span>
                    <span class="badge ${r.difficulty.toLowerCase()}">${r.difficulty}</span>
                </div>
                
                <p class="description">${r.description}</p>
                
                <button class="action-btn toggle-ing">Ingredients</button>
                <div class="details-box hidden">
                    <strong>Ingredients:</strong> ${r.ingredients.join(', ')}
                </div>

                <button class="action-btn toggle-steps">Show Steps</button>
                <div class="details-box hidden">
                    <strong>Steps:</strong> ${r.steps.join(' -> ')}
                </div>
            `;
            container.appendChild(card);
        });
    }

    function toggleFavorite(id) {
        if (favorites.includes(id)) favorites = favorites.filter(fid => fid !== id);
        else favorites.push(id);
        
        localStorage.setItem('recipeFavorites', JSON.stringify(favorites));
        render();
    }

    // --- EVENTS ---
    searchInput.addEventListener('input', debounce((e) => {
        searchQuery = e.target.value;
        render();
    }, 300));

    favToggle.addEventListener('change', (e) => {
        showFavoritesOnly = e.target.checked;
        render();
    });

    sortAlpha.addEventListener('click', () => { currentSort = 'alpha'; render(); });
    sortTime.addEventListener('click', () => { currentSort = 'time'; render(); });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            if (e.target.id === 'filter-easy') currentFilter = 'easy';
            else if (e.target.id === 'filter-medium') currentFilter = 'medium';
            else if (e.target.id === 'filter-hard') currentFilter = 'hard';
            else if (e.target.id === 'filter-quick') currentFilter = 'quick';
            else currentFilter = 'all';
            
            render();
        });
    });

    container.addEventListener('click', (e) => {
        if (e.target.closest('.heart-btn')) {
            toggleFavorite(parseInt(e.target.closest('.heart-btn').dataset.id));
        }
        if (e.target.classList.contains('action-btn')) {
            e.target.nextElementSibling.classList.toggle('hidden');
        }
    });

    // Init
    render();
})();