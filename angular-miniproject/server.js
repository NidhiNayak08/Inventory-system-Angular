const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Sample data for initial inventory
let inventoryData = [
    { id: 1, name: 'Product A', quantity: 10 },
    { id: 2, name: 'Product B', quantity: 20 },
    { id: 3, name: 'Product C', quantity: 15 }
];

// Route to get all inventory items (API route)
app.get('/api/inventory', (req, res) => {
    res.json(inventoryData);
});

// Route to add a new item to inventory (API route)
app.post('/api/inventory', (req, res) => {
    const newItem = req.body;
    newItem.id = inventoryData.length + 1;
    inventoryData.push(newItem);
    saveDataToJson(inventoryData);
    res.status(201).send('Item added to inventory');
});

// Route to update an existing item in inventory (API route)
app.put('/api/inventory/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const updatedItem = req.body;

    inventoryData = inventoryData.map(item => {
        if (item.id === itemId) {
            return { ...item, ...updatedItem };
        }
        return item;
    });

    saveDataToJson(inventoryData);
    res.send('Item updated');
});

// Route to delete an item from inventory (API route)
app.delete('/api/inventory/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    inventoryData = inventoryData.filter(item => item.id !== itemId);
    saveDataToJson(inventoryData);
    res.send('Item deleted');
});

// Function to save inventory data to JSON file
function saveDataToJson(data) {
    fs.writeFile('data.json', JSON.stringify(data, null, 2), err => {
        if (err) {
            console.error('Error writing to data.json:', err);
        }
    });
}

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
