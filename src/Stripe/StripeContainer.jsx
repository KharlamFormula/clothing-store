import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const PUBLIC_KEY = "pk_test_51Sp3PkB8RmfoMVFLAB1CJvIR972OWPGAkcuUpxzL7fHTYjOZfwxZPDof6khjltyTWbDBhFrDI87ajbixgDkMmjJ500ORPyibiD";

const stripePromise = loadStripe(PUBLIC_KEY);

const StripeContainer = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default StripeContainer;
