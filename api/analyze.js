// This file lives in the /api folder, which Vercel treats specially: every
// file in here becomes its own small backend endpoint automatically. This
// one will be reachable at the URL path /api/analyze once deployed.
//
// Why do we need this at all, instead of just calling Anthropic straight
// from the browser? Two reasons:
//   1. Talking to Anthropic requires a secret API key. If that key were
//      written into the React code, anyone could open their browser's
//      developer tools and steal it. Keeping the key here, in code that
//      only runs on Vercel's servers, keeps it hidden from visitors.
//   2. Browsers block "cross-origin" requests to most APIs unless the API
//      explicitly allows it. Anthropic's API does not allow being called
//      directly from a random website's front-end. A server-to-server
//      request (like this one) has no such restriction.
//
// The React app sends the photo's raw data to this endpoint. This function
// forwards it to Anthropic along with our instructions and our API key,
// then passes Anthropic's reply straight back to the app.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { mediaType, base64Data } = req.body || {};
  if (!mediaType || !base64Data) {
    res.status(400).json({ error: "Missing image data" });
    return;
  }

  try {
    const anthropicResponse = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system:
            "You are a wine label recognition assistant. Look closely at the wine bottle label in the image and identify its details. Respond with ONLY a raw JSON object, no markdown fences, no preamble, no commentary. The JSON must have exactly these keys: \"winery\", \"wineName\", \"vintageYear\", \"varietal\", \"region\", \"country\", \"isRedWine\", \"labelBoundingBox\". \"winery\" is the producer or estate name. \"wineName\" is the specific cuvee or bottling name if distinct from the winery. \"vintageYear\" is the year on the label. \"varietal\" is the grape variety or varieties (comma-separated if a blend). \"region\" is the wine region or appellation. \"country\" is the country of origin. If any of these string fields cannot be determined from the image, set its value to the exact string \"unknown\" rather than guessing or leaving it blank. \"isRedWine\" is a boolean: true if this is a red wine, false if it is any other style (white, rose, sparkling, orange, dessert, fortified). Base this on the label text (e.g. words like Red, Rouge, Tinto, Rosso, or a red-wine grape varietal) and the wine's visible color if the bottle or glass contents are visible. Always answer true or false for isRedWine, never a string. \"labelBoundingBox\" is an object {\"x\": number, \"y\": number, \"width\": number, \"height\": number} describing the smallest rectangle that tightly contains the main front label (the primary paper/printed label with the winery name, not the neck foil or back label), as fractions between 0 and 1 of the full image's width and height, measured from the top-left corner. If the label's edges aren't clearly visible, make your best estimate rather than omitting this field.",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: mediaType,
                    data: base64Data,
                  },
                },
                {
                  type: "text",
                  text: "Identify this wine from its label and return the JSON object as instructed.",
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await anthropicResponse.json();

    if (!anthropicResponse.ok) {
      res.status(anthropicResponse.status).json(data);
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || "Unknown server error" });
  }
}
