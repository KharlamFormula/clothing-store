const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.use(cors({
  origin: (origin, callback) => {

    if (
      !origin ||
      origin.includes("pages.dev") ||
      origin.includes("localhost")
    ) {
      callback(null, true);
    } else {
      callback(null, true);
    }

  },
  methods: ["GET","POST","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.options("/stripe/charge", cors());

app.post("/stripe/charge", cors(), async (req, res) => {

  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, error: "Invalid amount" });
  }

  try {

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });

  } catch (error) {

    console.error("Stripe error:", error.message);

    res.status(400).json({
      success: false,
      error: error.message
    });

  }

});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));