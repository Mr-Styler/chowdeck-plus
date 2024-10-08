const Dish = require('/models/Dish'); // Adjust the path as needed


// Sample dishes data
const dishes = [
    {
        name: 'Spaghetti Carbonara',
        price: 12.99,
        ingredients: ['spaghetti', 'eggs', 'pancetta', 'parmesan cheese', 'black pepper'],
        image: 'https://images.unsplash.com/photo-1601929622275-ec8da40b0eb3',
        description: 'A classic Italian pasta dish made with eggs, cheese, pancetta, and pepper.'
    },
    {
        name: 'Margherita Pizza',
        price: 10.99,
        ingredients: ['pizza dough', 'tomato sauce', 'mozzarella cheese', 'basil'],
        image: 'https://images.unsplash.com/photo-1602111876874-0d0eb5826ed4',
        description: 'A simple yet delicious pizza topped with fresh tomatoes, mozzarella, and basil.'
    },
    {
        name: 'Caesar Salad',
        price: 8.99,
        ingredients: ['romaine lettuce', 'croutons', 'parmesan cheese', 'Caesar dressing'],
        image: 'https://images.unsplash.com/photo-1504674900247-3b22d19c7c3d',
        description: 'A refreshing salad made with crisp romaine lettuce and homemade Caesar dressing.'
    },
    {
        name: 'Beef Tacos',
        price: 9.99,
        ingredients: ['taco shells', 'ground beef', 'lettuce', 'cheddar cheese', 'salsa'],
        image: 'https://images.unsplash.com/photo-1574169208508-57f0e40c93d4',
        description: 'Delicious tacos filled with seasoned ground beef, fresh lettuce, and cheese.'
    },
    {
        name: 'Pad Thai',
        price: 11.50,
        ingredients: ['rice noodles', 'shrimp', 'tofu', 'peanuts', 'bean sprouts'],
        image: 'https://images.unsplash.com/photo-1586242982437-b4f58e69ff0b',
        description: 'A popular Thai stir-fried noodle dish made with shrimp, tofu, and peanuts.'
    },
    {
        name: 'Chicken Alfredo',
        price: 13.50,
        ingredients: ['fettuccine', 'chicken breast', 'Alfredo sauce', 'parmesan cheese', 'parsley'],
        image: 'https://images.unsplash.com/photo-1569029310660-6b3e7759c42f',
        description: 'Creamy fettuccine pasta tossed with grilled chicken and rich Alfredo sauce.'
    },
    {
        name: 'Margarita',
        price: 7.50,
        ingredients: ['tequila', 'lime juice', 'triple sec', 'salt'],
        image: 'https://images.unsplash.com/photo-1545997774-0a83cc5f5ab7',
        description: 'A classic cocktail made with tequila, lime juice, and triple sec served in a salted rim glass.'
    },
    {
        name: 'Pancakes',
        price: 6.99,
        ingredients: ['flour', 'milk', 'eggs', 'syrup', 'butter'],
        image: 'https://images.unsplash.com/photo-1543356404-5c7aefc32826',
        description: 'Fluffy pancakes served with butter and syrup, perfect for breakfast.'
    },
    {
        name: 'Lamb Chops',
        price: 19.99,
        ingredients: ['lamb chops', 'rosemary', 'garlic', 'olive oil'],
        image: 'https://images.unsplash.com/photo-1564061074764-4c4a17c5f5f8',
        description: 'Grilled lamb chops marinated with garlic and rosemary for a flavorful meal.'
    },
    {
        name: 'Chocolate Cake',
        price: 5.99,
        ingredients: ['flour', 'cocoa powder', 'sugar', 'eggs', 'butter'],
        image: 'https://images.unsplash.com/photo-1589798461757-86c17e679c62',
        description: 'Rich and moist chocolate cake layered with creamy chocolate frosting.'
    },
    {
        name: 'Greek Salad',
        price: 8.49,
        ingredients: ['cucumbers', 'tomatoes', 'feta cheese', 'olive oil', 'oregano'],
        image: 'https://images.unsplash.com/photo-1555685813-e43c5004f168',
        description: 'A refreshing salad with cucumbers, tomatoes, olives, and feta cheese, dressed with olive oil.'
    },
    {
        name: 'Lasagna',
        price: 14.99,
        ingredients: ['lasagna noodles', 'ground beef', 'ricotta cheese', 'mozzarella cheese', 'tomato sauce'],
        image: 'https://images.unsplash.com/photo-1598536341698-0d37e664207b',
        description: 'Layers of pasta with meat sauce, ricotta, and mozzarella, baked to perfection.'
    },
    {
        name: 'Seafood Paella',
        price: 18.99,
        ingredients: ['rice', 'shrimp', 'mussels', 'chicken', 'saffron'],
        image: 'https://images.unsplash.com/photo-1501670181788-5c7f2229f4a8',
        description: 'A Spanish rice dish cooked with saffron and loaded with shrimp, mussels, and chicken.'
    },
    {
        name: 'Vegetable Stir Fry',
        price: 10.50,
        ingredients: ['mixed vegetables', 'soy sauce', 'ginger', 'garlic', 'sesame oil'],
        image: 'https://images.unsplash.com/photo-1572158813054-45365b79d5b7',
        description: 'A healthy mix of stir-fried vegetables seasoned with soy sauce and ginger.'
    },
    {
        name: 'Fried Rice',
        price: 9.49,
        ingredients: ['rice', 'egg', 'peas', 'carrots', 'soy sauce'],
        image: 'https://images.unsplash.com/photo-1612395992851-74349e25b750',
        description: 'Delicious fried rice with vegetables and a hint of soy sauce.'
    },
    {
        name: 'Pesto Pasta',
        price: 12.99,
        ingredients: ['penne pasta', 'pesto sauce', 'cherry tomatoes', 'parmesan cheese'],
        image: 'https://images.unsplash.com/photo-1589927997313-bae4c6d8a249',
        description: 'Penne pasta tossed in fresh basil pesto with cherry tomatoes and parmesan.'
    },
    {
        name: 'Stuffed Bell Peppers',
        price: 11.99,
        ingredients: ['bell peppers', 'ground turkey', 'rice', 'cheese'],
        image: 'https://images.unsplash.com/photo-1584801728815-fc940b95691f',
        description: 'Bell peppers stuffed with ground turkey and rice, topped with melted cheese.'
    }
];


// Function to populate the database
exports.populateDishes = async () => {
    try {
        // Clear the existing dishes
        await Dish.deleteMany({});
        console.log('Existing dishes deleted.');

        // Insert new dishes
        await Dish.insertMany(dishes);
        console.log('Dishes populated successfully.');
    } catch (error) {
        console.error('Error populating dishes:', error);
    }
};
