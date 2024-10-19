import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Initial inventory data
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Milk', quantity: 20, expiry: '2024-10-30', sales: [5, 3, 4, 7], reorderLevel: 10 },
    { id: 2, name: 'T-Shirt', quantity: 50, expiry: 'N/A', sales: [15, 20, 5, 8], reorderLevel: 30 },
    { id: 3, name: 'Laptop', quantity: 10, expiry: 'N/A', sales: [2, 1, 3, 4], reorderLevel: 5 },
  ]);

  const [newItem, setNewItem] = useState({ name: '', quantity: '', expiry: '', sales: '' });
  const [alerts, setAlerts] = useState([]);
  const [notification, setNotification] = useState('');

  // Function to check for alerts (low quantity, expiration)
  const checkForAlerts = () => {
    const today = new Date();
    const newAlerts = inventory.filter(item => {
      const expiryDate = new Date(item.expiry);
      const isExpiring = item.expiry !== 'N/A' && expiryDate < today;
      const isOverstocked = item.quantity > item.reorderLevel * 2;
      return isExpiring || isOverstocked;
    });
    setAlerts(newAlerts);
  };

  // Automatically check alerts when inventory changes
  useEffect(() => {
    checkForAlerts();
  }, [inventory]);

  // Function to forecast demand based on historical sales
  const forecastDemand = (sales) => {
    return Math.round(sales.reduce((total, sale) => total + sale, 0) / sales.length);
  };

  // Handle adding new items
  const handleAddItem = () => {
    if (newItem.name && newItem.quantity && newItem.sales) {
      const newItemData = {
        ...newItem,
        quantity: parseInt(newItem.quantity),
        sales: newItem.sales.split(',').map(Number),
        id: inventory.length + 1,
        reorderLevel: 10, // Default reorder level for now
      };
      
      setInventory([...inventory, newItemData]);
      setNotification(`Item "${newItem.name}" added to inventory.`);
      setTimeout(() => setNotification(''), 3000); // Clear notification after 3 seconds
      setNewItem({ name: '', quantity: '', expiry: '', sales: '' });
    }
  };

  return (
    <div className="app-container">
      <h1>Smart Inventory & Waste Reduction System</h1>

      {notification && <div className="notification">{notification}</div>}
      
      <div className="inventory-section">
        <h2>Current Inventory</h2>
        <ul>
          {inventory.map((item) => (
            <li key={item.id}>
              <strong>{item.name}</strong> - {item.quantity} in stock (Reorder Level: {item.reorderLevel})
              <p>Predicted Demand: {forecastDemand(item.sales)} units</p>
              {item.expiry !== 'N/A' && <p>Expiry Date: {item.expiry}</p>}
            </li>
          ))}
        </ul>
      </div>

      <div className="add-item-section">
        <h2>Add New Item</h2>
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
        />
        <input
          type="date"
          placeholder="Expiry Date"
          value={newItem.expiry}
          onChange={(e) => setNewItem({ ...newItem, expiry: e.target.value })}
        />
        <input
          type="text"
          placeholder="Sales (comma-separated)"
          value={newItem.sales}
          onChange={(e) => setNewItem({ ...newItem, sales: e.target.value })}
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>

      <div className="alerts-section">
        <h2>Waste & Overstock Alerts</h2>
        {alerts.length > 0 ? (
          <ul>
            {alerts.map((alert, index) => (
              <li key={index}>
                <strong>{alert.name}</strong> is at risk of waste (Expiring soon or Overstocked)!
              </li>
            ))}
          </ul>
        ) : (
          <p>No current waste or overstock alerts.</p>
        )}
      </div>
    </div>
  );
}

export default App;
