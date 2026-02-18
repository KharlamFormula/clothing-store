import "./App.css";
import { useState, useMemo } from "react";
import { products } from "./data";
import ProductList from "./ProductList";
import Cart from "./Cart";

import { IoSearchOutline } from "react-icons/io5";
import { FaBasketShopping } from "react-icons/fa6"; 

import { useDispatch, useSelector } from "react-redux";
import { addToCart, openCart } from "./store/cartSlice";

function App() {
  const dispatch = useDispatch();
  const cartCount = useSelector(state => state.cart.items.length);

  const [inputValue, setInputValue] = useState("");
  const [category, setCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState("");  

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setDebouncedValue(inputValue); 
    }
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (debouncedValue) {
      const categoryMap = {
        "сукня": "dress",
        "сукні": "dress",
        "худі": "hoodie",
        "сорочка": "shirt",
        "сорочки": "shirt",
        "штани": "pants",
        "пальто": "coat"
      };
      const mapped = categoryMap[debouncedValue.toLowerCase()];
      if (mapped) {
        result = result.filter(p => p.category === mapped);
      }
    }

    if (category) {
      result = result.filter(p => p.category === category);
    }

    if (sortOrder === "asc") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortOrder === "desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [debouncedValue, category, sortOrder]);

  const handleBurgerClick = () => setMenuOpen(!menuOpen);

  const handleMouseLeave = () => {
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  return (
    <div className="cont-main">
      <h1>
        STYLE<span className="spanHead">hub</span>
      </h1>

      <div className="top-bar">
        <div
          className="burger"
          onClick={handleBurgerClick}
        >
          ☰
        </div>

        <div
          className={`top-left ${menuOpen ? "open" : ""}`}
          onMouseLeave={handleMouseLeave}  
        >
          {[
            { label: "Всі", value: "" },
            { label: "Сукні", value: "dress" },
            { label: "Худі", value: "hoodie" },
            { label: "Сорочки", value: "shirt" },
            { label: "Штани", value: "pants" },
            { label: "Пальто", value: "coat" }
          ].map(btn => (
            <button
              key={btn.value}
              onClick={() => {
                setCategory(btn.value);
                setMenuOpen(false); 
              }}
              className={category === btn.value ? "active" : ""}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="top-right">
          <div className="search-wrapper">
            <IoSearchOutline className="search-icon" />
            <input
              type="text"
              placeholder="Пошук"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)} 
              onKeyDown={handleKeyPress} 
            />
          </div>

          <button
            onClick={() => setSortOrder("asc")}
            className={`btn-sort ${sortOrder === "asc" ? "active" : ""}`}
          >
            Ціна ↑
          </button>

          <button
            onClick={() => setSortOrder("desc")}
            className={`btn-sort ${sortOrder === "desc" ? "active" : ""}`}
          >
            Ціна ↓
          </button>

          <button
            className="basket"
            onClick={() => dispatch(openCart())}
          >
            <FaBasketShopping /> ({cartCount})
          </button>
        </div>
      </div>

      <ProductList
        products={filteredProducts}
        addToCart={(product) => dispatch(addToCart(product))}
      />
      
      <Cart />
    </div>
  );
}

export default App;







