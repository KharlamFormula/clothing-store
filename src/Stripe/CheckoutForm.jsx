import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../store/cartSlice";
import { useNavigate } from "react-router-dom";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const items = useSelector(state => state.cart.items);

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (totalAmount <= 0) return;

    try {
      // Створюємо PaymentIntent на сервері
      const { data } = await axios.post(
        "https://clothing-store-3es6.onrender.com/stripe/charge",
        { amount: totalAmount * 100 }
      );

      const cardElement = elements.getElement(CardElement);

      // Підтверджуємо платіж на фронтенді
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        { payment_method: { card: cardElement } }
      );

      if (error) {
        console.log("Stripe Error:", error.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        setSuccess(true);
        dispatch(clearCart());
      }
    } catch (err) {
      console.log("Axios Error:", err.response?.data || err.message);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: "center" }}>
        <h2>✅ Оплата пройшла успішно!</h2>
        <button className="btn-check" onClick={() => navigate("/")}>
          Повернутися на сайт
        </button>
      </div>
    );
  }

  return (
    <form className="pay" onSubmit={handleSubmit}>
      <h3>До оплати: {totalAmount} грн</h3>
      <CardElement />
      <button className="btn-pay" style={{ marginTop: 20 }}>Оплатити</button>
    </form>
  );
};

export default CheckoutForm;