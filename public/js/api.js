const baseUrl = 'https://my-chowdeck.onrender.com/api';  
const originBaseUrl = 'https://my-chowdeck.onrender.com';  
// const baseUrl = 'http://localhost:3000/api';
// const originBaseUrl = 'http://localhost:3000';

// Helper function to get headers with JWT token
const getHeaders = () => {
    const token = localStorage.getItem('jwt');
    return {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
    };
};

function showAlert(message, duration = 3000, type) {
    return new Promise((resolve) => {
        const alertBox = document.createElement('div');
        alertBox.classList.add('floating-alert');
        alertBox.classList.add(type ? 'btn-green' : 'btn-red');
        alertBox.innerHTML = `<strong>${type ? "Success!" : "Error!"}!</strong> ${message}`;
        document.body.appendChild(alertBox);

        setTimeout(() => {
            alertBox.classList.add('show-alert');
        }, 10);

        setTimeout(() => {
            alertBox.classList.remove('show-alert');
            setTimeout(() => {
                alertBox.remove();
                resolve(); // Resolve the promise after alert is removed
            }, 500);
        }, duration);
    });
}

const customAxios = async (endpoint, method, bodyObj, err_cb) => {
    const requestObj = {
        method,
        headers: getHeaders(),
        body: JSON.stringify(bodyObj)
    }


    const response = await fetch(`${baseUrl}${endpoint}`, requestObj);

    const data = await response.json();

    if (!response.ok) {
        err_cb(data)
        return false
    } else {
        return data
    }
}

// REQUESTS

// Handle User Registration
const sendRegisterRequest = async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const success = await customAxios('/auth/register', 'POST', { username, email, password }, (data) => { showAlert(`${data.message}`, 3000, false) })

    if (!success) {
        return
    }

    showAlert('Registration successful. Please log in.', 3000, true);
    location.href = '/login'
}

// Handle User Login
const sendLoginRequest = async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const success = await customAxios('/auth/login', 'POST', { email, password }, (data) => { showAlert(`${data.message}`, 3000, false) })

    if (!success) {
        return
    }
    localStorage.setItem('jwt', success.token);  // Store JWT token in localStorage
    await showAlert(`${success.message}`, 5000, true);
    location.href = "/profile";  // Fetch profile after successful login
}

// Function to fetch data from your API (e.g., user info, authentication status)
async function fetchUserData() {
    const userData = await customAxios('/users/me', "GET", undefined, showLoginSignupOptions());  // Adjust the endpoint as necessary

    if (!userData) {
        return
    }

    console.log("something")

    updateNavbarForAuthenticatedUser(userData.user);
}

// Function to search for dishes
async function searchDishes(name, allergies, page) {
    allergies = (allergies === "Select your allergies") ? undefined : allergies
    endpoint = `/dishes?name[regex]=${name}&name[options]=i&${allergies ? 'ingredients[nin]=' + allergies + '&' : ''}page=${page}`

    const success = await customAxios(endpoint, 'GET', undefined, (data) => { showAlert(`${data.message}`, 3000, false) })
    // const success = await customAxios(`/dishes?name[regex]=${name}&ingredients[nin]=${allergies}&ingredients[in]=${preferredIngredients}`, 'GET', undefined, (data) => { showAlert(`${data.message}`, 3000, false) })

    if (!success) {
        return
    }

    const dishes = success.data.documents;  // Array of dish objects
    const totalPages = success.data.meta.last_page;

    updateDishesSection(dishes);
    updatePagination(1, 1);

}

async function fetchDishes(page = 1) {
    const success = await customAxios('/dishes', 'GET', undefined, (data) => { showAlert(`${data.message}`, 3000, false);
    document.getElementById('dishes-container').innerHTML = '<p>Failed to load dishes.</p>';
})

    if (!success) {
        return
    }

    const dishes = success.data.documents;  // Array of dish objects
    const totalPages = success.data.meta.last_page;  // Total pages for pagination
    console.log(dishes)

    updateDishesSection(dishes);
    updatePagination(totalPages, page);
}

async function createRestaurant(event) {
    event.preventDefault();  // Prevent the form from submitting the default way

    // Collect form data
    const name = document.getElementById('restaurantName').value;
    const address = document.getElementById('address').value;
    const description = document.getElementById('description').value;
    const logo = document.getElementById('logo').value;

    // Get the current location
    navigator.geolocation.getCurrentPosition(async function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Construct the restaurant data as per the schema
        const restaurantData = {
            name,
            address,
            description,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]  // Longitude first, then latitude as per GeoJSON standard
            },
            logo
            // You can also add `dishes` and `owner` if necessary based on your API structure
        };

        const success = await customAxios('/restaurants', 'POST', restaurantData, (data) => { showAlert(`${data.message}`, 3000, false) })

        if (!success) {
            return
        }
        console.log('Restaurant registered:', success.data);

        // Optionally close the modal and reset the form
        document.getElementById('restaurantForm').reset();
        document.querySelector('#restaurantModal').modal('hide');  // Assuming you use Bootstrap
    }, function (error) {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location. Please enter the coordinates manually.');
    });
};

// Function to fetch restaurant details
async function fetchRestaurantDetails() {
    const restaurantId = document.URL.match(/\/restaurant\/([a-zA-Z0-9]+)/)[1];; // Get this from the URL or context
    try {
        const success = await customAxios(`/restaurants/${restaurantId}?populate=dishes`, "GET", undefined, (data) => alert(data.message))
        if (!success) {
            return
        }

        const restaurant = success.data.document
        console.log(restaurant)

        // Update the page with restaurant details
        document.getElementById('restaurantName').innerText = restaurant.name;
        document.getElementById('restaurantAddress').innerText = restaurant.address;
        document.getElementById('restaurantLogo').src = restaurant.logo;



        const dishesContainer = document.getElementById('dishesContainer');
        dishesContainer.innerHTML = ''; // Clear any existing dishes

        restaurant.dishes.forEach(dish => {
            const dishCard = document.createElement('div');
            dishCard.className = 'col-lg-4 col-md-6 mb-4';
            dishCard.innerHTML = `
                <div class="card">
                    <img src="${dish.images[0]}" class="card-img-top" alt="${dish.name}">
                    <div class="card-body">
                        <h5 class="card-title">${dish.name}</h5>
                        <p class="card-text">${dish.description}</p>
                        <a href="#" class="btn btn-dark rounded-pill">Order Now</a>
                    </div>
                </div>
            `;
            dishesContainer.appendChild(dishCard);
        })
    } catch (error) {
        console.error(error);
        alert('Error loading restaurant details. Please try again later.');
    }
}

async function fetchOwnerRestaurant() {
    try {
        const success = await customAxios(`/restaurants/me?populate=dishes`, "GET", undefined, (data) => alert(data.message))
        if (!success) {
            return
        }

        const restaurant = success.data.document
        console.log(restaurant)

        const restaurantDetails = document.getElementById('restaurantDetails');
        const logo = document.getElementById('logo');
        restaurantDetails.innerHTML = `
                <p><strong>Name:</strong> ${restaurant.name}</p>
                <p><strong>Address:</strong> ${restaurant.address}</p>
                <p><strong>Status:</strong> Open</p>
                <p><strong>Total Dishes:</strong> ${restaurant.dishes.length}</p>
            `;

        logo.innerHTML = `
        <img id="restaurantLogo" class="img-fluid" alt="Restaurant Logo" style="max-width: 200px;" src="${restaurant.logo}">`

        const dishesContainer = document.getElementById('dishes-container');

        restaurant.dishes.forEach(dish => {
            const dishCard = document.createElement('div');
            dishCard.className = 'col-lg-4 col-md-6 mb-4';
            dishCard.innerHTML = `
                <div class="card">
                    <img src="${dish.images[0]}" class="card-img-top" alt="${dish.name}">
                    <div class="card-body">
                        <h5 class="card-title">${dish.name}</h5>
                        <p class="card-text">${dish.description}</p>
                        <button class="btn btn-dark rounded-pill edit-btn" 
                            data-id="${dish._id}" 
                            data-name="${dish.name}" 
                            data-description="${dish.description}" 
                            data-price="${dish.price}" 
                            data-ingredients="${dish.ingredients.join(',')}" 
                            data-images="${dish.images[0]}">
                            Edit
                        </button>
                    </div>
                </div>
            `;
            dishesContainer.appendChild(dishCard);
        })

        document.addEventListener('DOMContentLoaded', dishModalFunc())
    } catch (error) {
        console.error(error);
        alert('Error loading restaurant details. Please try again later.');
    }
}

// Fetch the cart from the API and update the UI
async function fetchCart() {
    const success = await customAxios('/cart/me', 'GET', undefined, (data) => { showAlert(`${data.message}`, 3000, false) })

    if (!success) {
        return
    }

    updateCartUI(success.data);
}

// Remove item from cart
async function removeFromCart(dishId) {

    const success = await customAxios('/cart/remove', 'POST', { dishId }, (data) => { showAlert(`${data.message}`, 3000, false) })

    if (!success) {
        return
    }

    await showAlert(`${success.message}`, 5000, true);
}

async function updateAllergies(allergies) {
    const success = await customAxios('/users/allergies', 'POST', {allergies}, (data) => { showAlert(`${data.message}`, 3000, false) })

    if (!success) {
        return
    }

    showAlert(success.message, 3000, true)
}


// DOM MANIPULATION

// Update the UI with cart data
function updateCartUI(cart) {
    const cartItemsElement = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const checkoutButton = document.getElementById('checkoutButton');
    const emptyCartMessage = document.getElementById('emptyCartMessage');

    cartItemsElement.innerHTML = ''; // Clear existing cart items
    if (cart && cart.items.length > 0) {
        let total = 0;
        cart.items.forEach(item => {
            const itemElement = document.createElement('li');
            itemElement.classList.add('card', 'mb-3');
            itemElement.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${item.dish.name} - Quantity: ${item.quantity}</h5>
                    <p class="card-text">Price: $${item.dish.price} each</p>
                    <button class="btn btn-dark rounded-pill" onclick="removeFromCart('${item.dish._id}')">Remove</button>
                </div>
            `;
            cartItemsElement.appendChild(itemElement);

            total += item.dish.price * item.quantity;
        });
        cartTotalElement.textContent = total.toFixed(2);
        checkoutButton.style.display = 'block';
        emptyCartMessage.style.display = 'none';
    } else {
        cartTotalElement.textContent = '0.00';
        checkoutButton.style.display = 'none';
        emptyCartMessage.style.display = 'block';
    }
}

async function searchDishForm(e) {
    e.preventDefault(); // Prevent the default form submission behavior

    // Get the values from the input fields
    const name = document.getElementById('dish-search').value;
    const allergy = document.getElementById('allergy-select').value;

    // Call your function with the input values as parameters
    searchDishes(name, allergy, 1);
};

// Function to update user allergies

function updateNavbarForAuthenticatedUser(user) {
    const navbarItems = document.getElementById('navbar-items');

    // Define common items
    const commonItems = `
        <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="/dishes">Dishes</a></li>
        <li class="nav-item"><a class="nav-link" href="/restaurants">Restaurants</a></li>
    `;

    // Define role-specific items
    let roleSpecificItems = '';

    if (user.role === 'admin') {
        roleSpecificItems = `
            <li class="nav-item"><a class="nav-link" href="/admin/dashboard">Admin Dashboard</a></li>
        `;
    } else if (user.role === 'owner') {
        roleSpecificItems = `
            <li class="nav-item"><a class="nav-link" href="/owner/dashboard">Owner Dashboard</a></li>
        `;
    } else if (user.role === 'user') {
        roleSpecificItems = `
            <li class="nav-item"><a class="nav-link" href="/profile">Profile</a></li>
        `;
    }

    // Define login/logout items based on user authentication status
    const authItems = user.username ? `
    <li class="nav-item">
        <a class="nav-link" href="/logout">
            <i class="bi bi-box-arrow-right" style="font-size: 1rem;"></i>
        </a>
    </li>
    ` : `
        <li class="nav-item"><a class="nav-link" href="/login">Login</a></li>
        <li class="nav-item"><a class="nav-link" href="/register">Sign Up</a></li>
    `;

    // Populate navbar items
    navbarItems.innerHTML = commonItems + roleSpecificItems + authItems;
}

// Function to display login/signup options when the user is not authenticated
function showLoginSignupOptions() {
    const navbar = document.querySelector('.navbar-nav');

    // Clear the current navbar links
    navbar.innerHTML = '';

    // Show login/signup links for non-authenticated users
    navbar.innerHTML = `
      <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
      <li class="nav-item"><a class="nav-link" href="/dishes">Dishes</a></li>
      <li class="nav-item"><a class="nav-link" href="/restaurants">Restaurants</a></li>
      <div class="d-flex">
        <li class="nav-item"><a class="nav-link" href="/login">Login</a></li>
        <li class="nav-item"><a class="nav-link" href="/register">Sign Up</a></li>
      </div>
    `;
}


// Function to dynamically update the dishes section
function updateDishesSection(dishes) {
    const dishesContainer = document.getElementById('dishes-container');
    dishesContainer.innerHTML = '';  // Clear current dishes

    dishes.forEach(dish => {
        // Assuming you want to display the first image from the "images" array
        const imageUrl = dish.images.length > 0 ? dish.images[0] : '/default-image.jpg';

        // Create HTML structure for each dish and add to the container
        const dishHTML = `
    <div class="col-lg-4 col-md-6 mb-4">
      <div class="card">
        <img src="${imageUrl}" class="card-img-top" alt="${dish.name}">
        <div class="card-body">
          <h5 class="card-title">${dish.name}</h5>
          <p class="card-text">${dish.description}</p>
          <p class="card-text"><strong>Price: $${dish.price.toFixed(2)}</strong></p> <!-- Added Price Display -->
          <div class="d-flex justify-content-between">
            <button class="btn btn-dark rounded-pill add-btn" data-id="${dish._id}" >Add to cart</button>
            <button class="btn btn-dark rounded-pill view-btn" 
                data-id="${dish._id}" 
                data-name="${dish.name}" 
                data-description="${dish.description}" 
                data-price="${dish.price}" 
                data-ingredients="${dish.ingredients.join(',')}" 
                data-images="${dish.images[0]}">
                View
            </button>
          </div>
        </div>
      </div>
    </div>
`;

        dishesContainer.innerHTML += dishHTML;
    });

    const dishModal = document.getElementById('dishModal');
    const dishModalLabel = document.getElementById('dishModalLabel');
    const dishNameField = document.getElementById('modalDishName');
    const dishPriceField = document.getElementById('modalDishPrice');
    const dishDescriptionField = document.getElementById('modalDishDescription');
    const dishIngredientsField = document.getElementById('modalDishIngredients');
    const dishImagesField = document.getElementById('modalDishImage');

    function populateModal(dish) {
        dishNameField.textContent = dish.name;
        dishPriceField.textContent = `$${dish.price}`;
        dishDescriptionField.textContent = dish.description;
        dishIngredientsField.textContent = dish.ingredients.join(', '); // Assuming it's an array
        dishImagesField.src = dish.images.join(', '); // Assuming it's an array
        dishModalLabel.textContent = 'Dish Information';

        console.log("done")
    }



    document.querySelectorAll('.add-btn').forEach(function (button) {
        button.addEventListener('click', async function () {
            const dishId = this.getAttribute('data-id')
            const userData = await customAxios('/cart/me/add', "POST", { dishId }, (data) => { showAlert(`${data.message}`, 3000, false) });  // Adjust the endpoint as necessary

            if (!userData) {
                return
            }

            alert(`Dish added to cart`)
        });
    })

    document.querySelectorAll('.view-btn').forEach(function (button) {
        button.addEventListener('click', function () {
            const dish = {
                id: this.getAttribute('data-id'),
                name: this.getAttribute('data-name'),
                description: this.getAttribute('data-description'),
                price: this.getAttribute('data-price'),
                ingredients: this.getAttribute('data-ingredients').split(',').map(ingredient => ingredient.trim()), // Split and trim
                images: this.getAttribute('data-images').split(',').map(image => image.trim()) // Split and trim
            };
            populateModal(dish);
            const modal = new bootstrap.Modal(dishModal);
            modal.show(); // Show the modal
        });
    })
}

// Function to dynamically update the pagination
function updatePagination(totalPages, currentPage) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';  // Clear current pagination

    // Create "Previous" button
    paginationContainer.innerHTML += `
      <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" tabindex="-1" onclick="fetchDishes(${currentPage - 1})">Previous</a>
      </li>
    `;

    // Create page numbers
    for (let i = 1; i <= totalPages; i++) {
        paginationContainer.innerHTML += `
        <li class="page-item ${currentPage === i ? 'active' : ''}">
          <a class="page-link" href="#" onclick="fetchDishes(${i})">${i}</a>
        </li>
      `;
    }

    // Create "Next" button
    paginationContainer.innerHTML += `
      <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="fetchDishes(${currentPage + 1})">Next</a>
      </li>
    `;
}

async function fetchRestaurants() {
    try {
        // Make a request to your API to fetch the restaurants
        const response = await fetch('/api/restaurants');  // Adjust to your API endpoint
        const data = await response.json();

        console.log(data)

        const restaurants = data.data.documents;  // Array of restaurant objects
        updateRestaurantSection(restaurants);
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        document.getElementById('restaurant-container').innerHTML = '<p>Failed to load restaurants.</p>';
    }
}

// Function to dynamically update the restaurant section
function updateRestaurantSection(restaurants) {
    const restaurantContainer = document.getElementById('restaurant-container');
    restaurantContainer.innerHTML = '';  // Clear current restaurant cards

    restaurants.forEach(restaurant => {
        // Create HTML structure for each restaurant and add it to the container
        const restaurantHTML = `
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="card">
            <img src="${restaurant.logo}" class="card-img-top" alt="${restaurant.name}">
            <div class="card-body">
              <h5 class="card-title"><a class="card-title" href="/restaurant/${restaurant._id}">${restaurant.name}</a></h5>
              <p class="card-text">${restaurant.address}</p>
            </div>
          </div>
        </div>
      `;
        restaurantContainer.innerHTML += restaurantHTML;
    });
}


function dishModalFunc() {
    const dishModal = document.getElementById('dishModal');
    const dishModalLabel = document.getElementById('dishModalLabel');
    const dishForm = document.getElementById('dishForm');
    const dishIdField = document.getElementById('dishId');
    const dishNameField = document.getElementById('dishName');
    const dishPriceField = document.getElementById('dishPrice');
    const dishDescriptionField = document.getElementById('dishDescription');
    const dishIngredientsField = document.getElementById('dishIngredients');
    const dishImagesField = document.getElementById('dishImages');

    // Clear modal for adding new dish
    function clearModal() {
        dishIdField.value = '';
        dishNameField.value = '';
        dishDescriptionField.value = '';
        dishIngredientsField.value = '';
        dishImagesField.value = '';
        dishModalLabel.textContent = 'Add New Dish';
    }

    // Populate modal with dish data for editing
    function populateModal(dish) {
        console.log(dishPriceField, dish.price)

        dishIdField.value = dish.id;
        dishNameField.value = dish.name;
        dishPriceField.value = dish.price;
        dishDescriptionField.value = dish.description;
        dishIngredientsField.value = dish.ingredients.join(', '); // Assuming it's an array
        dishImagesField.value = dish.images.join(', '); // Assuming it's an array
        dishModalLabel.textContent = 'Edit Dish';

        console.log("done")
    }

    // Handle Add Dish button click
    document.getElementById('addDishBtn').addEventListener('click', function () {
        clearModal();
        const modal = new bootstrap.Modal(dishModal);
        modal.show(); // Show the modal
    });

    // Handle Edit Dish button click using data attributes
    document.querySelectorAll('.edit-btn').forEach(function (button) {
        button.addEventListener('click', function () {
            const dish = {
                id: this.getAttribute('data-id'),
                name: this.getAttribute('data-name'),
                description: this.getAttribute('data-description'),
                price: this.getAttribute('data-price'),
                ingredients: this.getAttribute('data-ingredients').split(',').map(ingredient => ingredient.trim()), // Split and trim
                images: this.getAttribute('data-images').split(',').map(image => image.trim()) // Split and trim
            };
            console.log("start")
            populateModal(dish);
            const modal = new bootstrap.Modal(dishModal);
            modal.show(); // Show the modal
        });
    });

    // Handle form submission (both Add and Edit)
    dishForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const dishId = dishIdField.value;
        const dishName = dishNameField.value.trim();
        const dishPrice = dishPriceField.value.trim();
        const dishDescription = dishDescriptionField.value.trim();
        const dishIngredients = dishIngredientsField.value.trim().split(',').map(ingredient => ingredient.trim());
        const dishImages = dishImagesField.value.trim().split(',').map(image => image.trim());

        const dishData = {
            name: dishName,
            description: dishDescription,
            ingredients: dishIngredients,
            images: dishImages,
            price: dishPrice
        };

        if (dishId) {
            // Editing an existing dish (PUT request)
            const success = await customAxios(`/dishes/${dishId}`, "PATCH", dishData, (data) => alert(data.message))

            if (!success) {
                return
            }
            alert('Dish updated successfully!');
            location.reload(); // Reload the page to see the updated dish list
        } else {
            // Adding a new dish (POST request)
            const success = await customAxios(`/dishes`, "POST", dishData, (data) => alert(data.message))

            if (!success) {
                return
            }
            alert('Dish added successfully!');
            location.reload(); // Reload the page to see the new dish
        }
    });
};


function populateStatistics() {
    const statisticsDetails = document.getElementById('statisticsDetails');
    statisticsDetails.innerHTML = `
        <p><strong>Total Sales:</strong> $${restaurant.totalSales}</p>
        <p><strong>Total Orders:</strong> ${restaurant.totalOrders}</p>
    `;
}

// Combined window.onload function
window.onload = function () {
    fetchUserData();  // Fetch user data on page load

    const currentPath = document.URL.split(`${originBaseUrl}/`)[1];

    if (currentPath.startsWith('cart')) {
        // Initialize cart on page load
        fetchCart();
    } else if (currentPath.startsWith('register')) {
        document.getElementById('registerFormElement').addEventListener('submit', sendRegisterRequest);
    } else if (currentPath.startsWith('login')) {
        document.getElementById('loginFormElement').addEventListener('submit', sendLoginRequest);
    } else if (currentPath.startsWith('dishes')) {
        fetchDishes(1);  // Fetch dishes when on the "dishes" page
        document.getElementById('search-form').addEventListener('submit', searchDishForm)
    } else if (currentPath.startsWith('restaurants')) {
        fetchRestaurants();
        document.getElementById('restaurantForm').addEventListener('submit', createRestaurant)
    } else if (/\/restaurant\/([a-zA-Z0-9]+)/.test(document.URL)) {
        fetchRestaurantDetails()
    } else if (currentPath.startsWith('owner/dashboard')) {
        fetchOwnerRestaurant()
    }
};


// Logout User
function logout() {
    localStorage.removeItem('jwt');
    alert('Logged out');
    window.location.href = '/login';  // Redirect to login page
}
