/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
require("firebase-functions/https");
// const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// https://hooks.zapier.com/hooks/catch/23640257/u3toc5k/

const {onCall} = require("firebase-functions/v2/https");

setGlobalOptions({maxInstances: 10});

exports.sendToZapier = onCall(async (request) => {
  const {email} = request.data;
  const zapierUrl = "https://hooks.zapier.com/hooks/catch/23640257/u3toc5k/";

  try {
    if (!email) throw new Error("No email provided");

    const response = await fetch(zapierUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email}),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Zapier Error: ${response.statusText} - ${text}`);
    }

    return {success: true};
  } catch (err) {
    console.error("sendToZapier failed:", err.message);
    throw new Error("Failed to send to Zapier");
  }
});

