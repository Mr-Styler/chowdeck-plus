const Dish = require('../models/Dish');

// Sample dishes data
const dishes = [
    {
        "name": "Spaghetti Carbonara",
        "price": 12.99,
        "description": "A classic Italian pasta dish made with eggs, cheese, pancetta, and pepper.",
        "ingredients": ["spaghetti", "eggs", "pancetta", "parmesan cheese", "black pepper"],
        "images": ["https://images.unsplash.com/photo-1601929622275-ec8da40b0eb3"],
        "restaurant": "5f8f8c44b54764421b7156eb"
    },
    {
        "name": "Margherita Pizza",
        "price": 10.99,
        "description": "A simple yet delicious pizza topped with fresh tomatoes, mozzarella, and basil.",
        "ingredients": ["pizza dough", "tomato sauce", "mozzarella cheese", "basil"],
        "images": ["https://images.unsplash.com/photo-1602111876874-0d0eb5826ed4"],
        "restaurant": "5f8f8c44b54764421b7156eb"
    },
    {
        "name": "Caesar Salad",
        "price": 8.99,
        "description": "A refreshing salad made with crisp romaine lettuce and homemade Caesar dressing.",
        "ingredients": ["romaine lettuce", "croutons", "parmesan cheese", "Caesar dressing"],
        "images": ["https://images.unsplash.com/photo-1504674900247-3b22d19c7c3d"],
        "restaurant": "5f8f8c44b54764421b7156ec"
    },
    {
        "name": "Beef Tacos",
        "price": 9.99,
        "description": "Delicious tacos filled with seasoned ground beef, fresh lettuce, and cheese.",
        "ingredients": ["taco shells", "ground beef", "lettuce", "cheddar cheese", "salsa"],
        "images": ["https://images.unsplash.com/photo-1574169208508-57f0e40c93d4"],
        "restaurant": "5f8f8c44b54764421b7156ec"
    },
    {
        "name": "Pad Thai",
        "price": 11.50,
        "description": "A popular Thai stir-fried noodle dish made with shrimp, tofu, and peanuts.",
        "ingredients": ["rice noodles", "shrimp", "tofu", "peanuts", "bean sprouts"],
        "images": ["https://images.unsplash.com/photo-1586242982437-b4f58e69ff0b"],
        "restaurant": "5f8f8c44b54764421b7156ed"
    },
    {
        "name": "Chicken Alfredo",
        "price": 13.50,
        "description": "Creamy fettuccine pasta tossed with grilled chicken and rich Alfredo sauce.",
        "ingredients": ["fettuccine", "chicken breast", "Alfredo sauce", "parmesan cheese", "parsley"],
        "images": ["https://images.unsplash.com/photo-1569029310660-6b3e7759c42f"],
        "restaurant": "5f8f8c44b54764421b7156ed"
    },
    {
        "name": "Margarita",
        "price": 7.50,
        "description": "A classic cocktail made with tequila, lime juice, and triple sec served in a salted rim glass.",
        "ingredients": ["tequila", "lime juice", "triple sec", "salt"],
        "images": ["https://images.unsplash.com/photo-1545997774-0a83cc5f5ab7"],
        "restaurant": "5f8f8c44b54764421b7156ee"
    },
    {
        "name": "Pancakes",
        "price": 6.99,
        "description": "Fluffy pancakes served with butter and syrup, perfect for breakfast.",
        "ingredients": ["flour", "milk", "eggs", "syrup", "butter"],
        "images": ["https://images.unsplash.com/photo-1543356404-5c7aefc32826"],
        "restaurant": "5f8f8c44b54764421b7156ee"
    },
    {
        "name": "Lamb Chops",
        "price": 19.99,
        "description": "Grilled lamb chops marinated with garlic and rosemary for a flavorful meal.",
        "ingredients": ["lamb chops", "rosemary", "garlic", "olive oil"],
        "images": ["https://images.unsplash.com/photo-1564061074764-4c4a17c5f5f8"],
        "restaurant": "5f8f8c44b54764421b7156ef"
    },
    {
        "name": "Chocolate Cake",
        "price": 5.99,
        "description": "Rich and moist chocolate cake layered with creamy chocolate frosting.",
        "ingredients": ["flour", "cocoa powder", "sugar", "eggs", "butter"],
        "images": ["https://images.unsplash.com/photo-1589798461757-86c17e679c62"],
        "restaurant": "5f8f8c44b54764421b7156ef"
    },
    {
        "name": "Greek Salad",
        "price": 8.49,
        "description": "A refreshing salad with cucumbers, tomatoes, olives, and feta cheese, dressed with olive oil.",
        "ingredients": ["cucumbers", "tomatoes", "feta cheese", "olive oil", "oregano"],
        "images": ["https://images.unsplash.com/photo-1555685813-e43c5004f168"],
        "restaurant": "5f8f8c44b54764421b7156eb"
    },
    {
        "name": "Lasagna",
        "price": 14.99,
        "description": "Layers of pasta with meat sauce, ricotta, and mozzarella, baked to perfection.",
        "ingredients": ["lasagna noodles", "ground beef", "ricotta cheese", "mozzarella cheese", "tomato sauce"],
        "images": ["https://images.unsplash.com/photo-1598536341698-0d37e664207b"],
        "restaurant": "5f8f8c44b54764421b7156ec"
    },
    {
        "name": "Seafood Paella",
        "price": 18.99,
        "description": "A Spanish rice dish cooked with saffron and loaded with shrimp, mussels, and chicken.",
        "ingredients": ["rice", "shrimp", "mussels", "chicken", "saffron"],
        "images": ["https://images.unsplash.com/photo-1501670181788-5c7f2229f4a8"],
        "restaurant": "5f8f8c44b54764421b7156ed"
    },
    {
        "name": "Vegetable Stir Fry",
        "price": 10.50,
        "description": "A healthy mix of stir-fried vegetables seasoned with soy sauce and ginger.",
        "ingredients": ["mixed vegetables", "soy sauce", "ginger", "garlic", "sesame oil"],
        "images": ["https://images.unsplash.com/photo-1572158813054-45365b79d5b7"],
        "restaurant": "5f8f8c44b54764421b7156ee"
    },
    {
        "name": "Fried Rice",
        "price": 9.49,
        "description": "Delicious fried rice with vegetables and a hint of soy sauce.",
        "ingredients": ["rice", "egg", "peas", "carrots", "soy sauce"],
        "images": ["https://images.unsplash.com/photo-1612395992851-74349e25b750"],
        "restaurant": "5f8f8c44b54764421b7156ef"
    },
    {
        "name": "Pesto Pasta",
        "price": 12.99,
        "description": "Penne pasta tossed in fresh basil pesto with cherry tomatoes and parmesan.",
        "ingredients": ["penne pasta", "pesto sauce", "cherry tomatoes", "parmesan cheese"],
        "images": ["https://images.unsplash.com/photo-1589927997313-bae4c6d8a249"],
        "restaurant": "5f8f8c44b54764421b7156ed"
    },
    {
        "name": "Stuffed Bell Peppers",
        "price": 11.99,
        "description": "Bell peppers stuffed with ground turkey and rice, topped with melted cheese.",
        "ingredients": ["bell peppers", "ground turkey", "rice", "cheese"],
        "images": ["https://images.unsplash.com/photo-1584801728815-fc940b95691f"],
        "restaurant": "5f8f8c44b54764421b7156ee"
    }
]


const addDish = async (req, res) => {
    try {
        // dishes.forEach(async dish => {
        //     const newDish = await Dish.create(dish);
        //     console.log(newDish.name)
        // })
        const dish = await Dish.create(req.body)
        // res.status(201).json({message: 'Dishes added successfully'});
        res.status(201).json({message: 'Dish added successfully'});
    } catch (error) {
        res.status(400).send(error.message);
    }
};

module.exports = { addDish };
