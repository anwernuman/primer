window.addEventListener("load", onLoaded);

async function onLoaded() {
  const clientTokenResponse = await fetch("/client-token", {
    method: "post",
    headers: { "Content-Type": "application/json" },
  });
  console.log(clientTokenResponse);
  const { clientToken } = await clientTokenResponse.json();

  const primer = new Primer({
    credentials: {
      clientToken, // Your server generated client token
    },
  });

  // Use `.checkout()` to initialize and render the UI
  await primer.checkout({
    // Specify the selector of the container element
    container: "#checkout-container",

    /**
     * When a payment method is chosen and the customer clicks 'Pay',
     * the payment method is tokenized and you'll receive a token in the
     * `onTokenizeSuccess` callback which you can send to your server
     * to authorize a transaction.
     */
    onTokenizeSuccess(paymentMethod) {
      // Send the payment method token to your server
      return fetch("/authorize", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentMethod),
      });
    },

    // Other customization options
    transitions: {
      duration: 700,
    },
  });
}
