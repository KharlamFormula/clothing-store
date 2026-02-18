import StripeContainer from "./Stripe/StripeContainer";

const CheckoutPage = () => {
  return (
    <div style={{ padding: 40 }}>
      <h1>Оплата</h1>
      <StripeContainer />
    </div>
  );
};

export default CheckoutPage;
