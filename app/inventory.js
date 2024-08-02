'use client'
import React, {useState, useEffect} from "react";
import { addDoc, collection, getDocs, onSnapshot, querySnapshot, query, deleteDoc, doc } from "firebase/firestore"; 
import { ExpandableCard } from "./components/ExpandableCard";
import { db } from "./firebase";// map locations for future map for pantry products
// class MapLocations {
//     constructor(id, name, x, y, products) {
//         this.id = id;
//         this.name = name;
//         this.x = x;
//         this.y = y;
//         this.products = products
//     }
// }

// const pantryMap = () => {
//     const [mapLocations, setMapLocations] = useState<MapLocations[]>([]);
//     const [chosenLocation, setChosenLocation] = useState<MapLocations | null>(null);

//     useEffect(() => {

//     })
// }

// pass parameters such as the name, quantity, and the update/delete button
const InventoryPage = () => {
  // selected option default home
  const [selectedOptionFromMenu, setSelectedOptionFromMenu] = useState('Home');

  const [activeItem, setActiveItem] = useState(null);

  const [items, setItems] = useState([
    // {name: 'Cofee', price: 4.95},
    // {name: 'Movie', price: 28.43},
    // {name: 'Candy', price: 4.5},
  ]);

  const [newItem, setNewItem] = useState({name: '', quantity: ''})


  const [total, setTotal] = useState(0);

  // render content based on the option selected
  const showContentFromSidebar = () => {
    switch(selectedOptionFromMenu) {
      case 'Home':
        return <HomePage />;
      case 'Inventory':
        return <InventoryPage />
      case 'Recipe':
        return <RecipePage />
      case 'Map':
        return <MapPage />
      default:
        return <HomePage/>
    }
  }

  // Add item to database

  const addItem = async (e) => {
    e.preventDefault();
    if(newItem.name !== '' && newItem.quantity !== '') {
      await addDoc(collection(db, 'items'), {
        name: newItem.name.trim(),
        quantity: newItem.quantity,
      });

      const newItemToAdd = { ...newItem, price: parseFloat(newItem.quantity) };
      setItems([...items, newItemToAdd]);
      setNewItem({ name: '', quantity: '' });

    }
  }

  // Read items from database

  useEffect(() => {
    const q = query(collection(db, 'items'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArray = []

      querySnapshot.forEach((doc) => {
        itemsArray.push({...doc.data(), id: doc.id})
      })

      setItems(itemsArray);

      // Read total from itemsArray
      const calculateTotal = () => {
        const totalQuantity = itemsArray.reduce((sum, item) => sum + parseFloat(item.quantity), 0)
        setTotal(totalQuantity)
      }
      calculateTotal()
      return () => unsubscribe();
    })
  }, [])

  // Delete items from database
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, 'items', id)) 
  }
  return (
    <div className="p-4 rounded-lg">
      <form className="grid grid-cols-6 items-center text-black">
        <input
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="col-span-3 p-3 border"
          type="text"
          placeholder="Enter item"
        />
        <input
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
          className="col-span-2 p-3 border mx-3"
          type="number"
          placeholder="Enter quantity"
        />
        <button
          onClick={addItem}
          className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl"
          type="submit"
        >
          +
        </button>
      </form>
      <ul>
        {items.map((item, id) => (
          <li key={id} className="my-4 w-full flex justify-between bg-slate-950">
            <div className="p-4 w-full flex justify-between">
              <span className="capitalize">{item.name}</span>
              <span>{item.quantity} {item.name} added to your pantry</span>
            </div>
            <button
              onClick={() => setActiveItem(item)}
              className="ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16"
            >
              Update
            </button>
            <button
              onClick={() => deleteItem(item.id)}
              className="ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16"
            >
              X
            </button>
          </li>
        ))}
      </ul>
      {items.length < 1 ? (
        ""
      ) : (
        <div className="flex justify-between p-3">
          <span>Total</span>
          <span>{total} products in inventory</span>
        </div>
      )}
      {activeItem && (
        <ExpandableCard
          title={`Update ${activeItem.name}`}
          description={`Quantity: ${activeItem.quantity}`}
          ctaText="Save"
          ctaLink="#"
          onClose={() => setActiveItem(null)}
        />
      )}
    </div>
  )
}

export default InventoryPage



// 
/**
 * 
 * 
const WarehouseMap = () => {
  const [warehouse, setWarehouse] = useState([
    { id: 1, name: 'Aisle 1', products: [] },
    { id: 2, name: 'Aisle 2', products: [] },
    { id: 3, name: 'Aisle 3', products: [] },
    { id: 4, name: 'Aisle 4', products: [] },
  ]);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [newProduct, setNewProduct] = useState('');

  const handleAddProduct = () => {
    if (selectedLocation && newProduct) {
      const updatedLocation = {
       ...selectedLocation,
        products: [...selectedLocation.products, newProduct],
      };
      setWarehouse(warehouse.map(location => (location.id === selectedLocation.id? updatedLocation : location)));
      setNewProduct('');
    }
  };

  const handleMoveProduct = (productId, fromLocationId, toLocationId) => {
    const fromLocation = warehouse.find(location => location.id === fromLocationId);
    const toLocation = warehouse.find(location => location.id === toLocationId);
    const productIndex = fromLocation.products.indexOf(productId);
    if (productIndex!== -1) {
      fromLocation.products.splice(productIndex, 1);
      toLocation.products.push(productId);
      setWarehouse(warehouse.map(location => (location.id === fromLocationId? fromLocation : location.id === toLocationId? toLocation : location)));
    }
  };

  return (
    <Grid container spacing={2}>
      {warehouse.map(location => (
        <Grid item key={location.id} xs={12} sm={6} md={4} lg={3}>
          <div
            style={{
              backgroundColor: '#f0f0f0',
              padding: 10,
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
            onClick={() => setSelectedLocation(location)}
          >
            <Typography variant="h6">{location.name}</Typography>
            <Typography variant="body1">Products: {location.products.join(', ')}</Typography>
          </div>
        </Grid>
      ))}
      {selectedLocation && (
        <Grid item xs={12}>
          <Typography variant="h5">Selected Location: {selectedLocation.name}</Typography>
          <Typography variant="body1">Products: {selectedLocation.products.join(', ')}</Typography>
          <form>
            <input
              type="text"
              value={newProduct}
              onChange={e => setNewProduct(e.target.value)}
              placeholder="Add new product"
            />
            <Button variant="contained" color="primary" onClick={handleAddProduct}>
              Add Product
            </Button>
          </form>
          <Typography variant="body1">Move product to:</Typography>
          {warehouse.map(location => (
            <Button
              key={location.id}
              variant="contained"
              color="primary"
              onClick={() => handleMoveProduct(selectedLocation.products[0], selectedLocation.id, location.id)}
            >
              {location.name}
            </Button>
          ))}
        </Grid>
      )}
    </Grid>
  );
};

export default WarehouseMap;
 */