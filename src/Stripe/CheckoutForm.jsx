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

    if (totalAmount <= 0) {
      console.log("Сума замовлення = 0, платіж неможливий");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement
    });

    if (error) {
      console.log("Stripe Error:", error.message);
      return;
    }

    if (!paymentMethod || !paymentMethod.id) {
      console.log("PaymentMethod не створено");
      return;
    }

    try {
      const response = await axios.post(
        "https://clothing-store-3es6.onrender.com/stripe/charge",
        {
          amount: totalAmount * 100, 
          id: paymentMethod.id
        }
      );

      if (response.data.success) {
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
