const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
  origin: "https://majestic-taffy-da65bb.netlify.app"
}));

app.post("/stripe/charge", async (req, res) => {
  console.log("route reached", req.body);
  const { amount, id } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "uah",
      description: "Your Company Description",
      payment_method: id,
      confirm: true,
      automatic_payment_methods: { enabled: true }
    });

    console.log("paymentIntent", paymentIntent.id);

    res.json({ success: true, paymentIntent });
  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(400).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));