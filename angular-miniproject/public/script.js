document.addEventListener("DOMContentLoaded", () => {
  const addItemForm = document.getElementById("addItemForm");
  const inventoryTable = document
    .getElementById("inventoryTable")
    .querySelector("tbody");

  // Function to fetch and display inventory items
  function fetchInventory() {
    fetch("/api/inventory")
      .then((response) => response.json())
      .then((data) => {
        inventoryTable.innerHTML = ""; // Clear existing table rows
        data.forEach((item) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                        <td>${item.id}</td>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>
                            <button onclick="editItem(${item.id}, '${item.name}', ${item.quantity})">Edit</button>
                            <button onclick="deleteItem(${item.id})">Delete</button>
                        </td>
                    `;
          inventoryTable.appendChild(row);
        });
      })
      .catch((error) => console.error("Error fetching inventory:", error));
  }

  // Fetch inventory data when the page loads
  fetchInventory();

  // Event listener for form submission to add a new item
  addItemForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(addItemForm);
    const newItem = {
      name: formData.get("itemName"),
      quantity: parseInt(formData.get("itemQuantity")),
    };
    fetch("/api/inventory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    })
      .then((response) => {
        if (response.ok) {
          addItemForm.reset();
          fetchInventory(); // Refresh inventory data after adding
        } else {
          throw new Error("Failed to add item");
        }
      })
      .catch((error) => console.error("Error adding item:", error));
  });

  // Function to edit an item
  window.editItem = function (itemId, itemName, itemQuantity) {
    const newName = prompt("Enter new name:", itemName);
    const newQuantity = parseInt(prompt("Enter new quantity:", itemQuantity));
    if (newName !== null && !isNaN(newQuantity)) {
      const updatedItem = { name: newName, quantity: newQuantity };
      fetch(`/api/inventory/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      })
        .then((response) => {
          if (response.ok) {
            fetchInventory(); // Refresh inventory data after editing
          } else {
            throw new Error("Failed to edit item");
          }
        })
        .catch((error) => console.error("Error editing item:", error));
    }
  };

  // Function to delete an item
  window.deleteItem = function (itemId) {
    fetch(`/api/inventory/${itemId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          fetchInventory(); // Refresh inventory data after deletion
        } else {
          throw new Error("Failed to delete item");
        }
      })
      .catch((error) => console.error("Error deleting item:", error));
  };
});
