const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

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

      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    console.log("paymentIntent", paymentIntent.id);

    res.json({
      success: true,
      paymentIntent,
    });
  } catch (error) {
    console.error("Stripe error:", error.message);

    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(process.env.PORT || 8080, () => {
  console.log("Server started...");
});
