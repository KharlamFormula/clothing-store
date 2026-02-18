import { useDispatch, useSelector } from "react-redux";
import {
  closeCart,
  removeFromCart
} from "./store/cartSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, isOpen } = useSelector(state => state.cart);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price,
    0
  );

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="cart"
      onMouseLeave={() => {
        if (window.innerWidth > 768) {
          dispatch(closeCart());
        }
      }}
    >
      <div className="cart-header">
        <h2>Корзина</h2>
        <button className="btn-cross-basket" onClick={() => dispatch(closeCart())}>✕</button>
      </div>

      {items.length === 0 ? (
        <p className="empty">Корзина порожня</p>
      ) : (
        <>
          <ol className="cart-list">
            {items.map((item, index) => (
              <li key={index}>
                <span>{item.par} </span>
                <span> - {item.price} грн</span>
                <button className="btn-cross"
                  onClick={() => dispatch(removeFromCart(index))}
                >
                  ✕
                </button>
              </li>
            ))}
          </ol>

          <div className="cart-footer">
            <div className="total">
              Разом: <strong>{totalPrice} грн</strong>
            </div>

            <button
              className="buy-btn"
              onClick={() => {
                dispatch(closeCart());
                navigate("/checkout");
              }}
            >
              Купити
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
