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
    (sum, item) => sum + item.price,
    0
  );

  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement)
    });

    if (error) {
      console.log(error.message);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/stripe/charge", {
        amount: totalAmount * 100,
        id: paymentMethod.id
      });

      if (response.data.success) {
        setSuccess(true);
        dispatch(clearCart());
      }
    } catch (err) {
      console.log(err);
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
