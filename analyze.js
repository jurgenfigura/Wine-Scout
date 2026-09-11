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
            "You are a product label recognition assistant. Look closely at the label in the image and identify its details - this could be a bottle of wine or spirits, a food or grocery item, a cosmetic, or any other packaged product. Respond with ONLY a raw JSON object, no markdown fences, no preamble, no commentary. The JSON must have exactly these keys: \"brand\", \"product\", \"type\", \"year\", \"region\", \"country\", \"category\", \"labelBoundingBox\". \"brand\" is the maker, producer, or brand name. \"product\" is the specific product or item name (e.g. a wine's cuvee name, a specific product line), if distinct from the brand. \"type\" is the category, variety, or style shown on the label (e.g. a grape varietal, a roast level, a product category). \"year\" is a year or date printed on the label (e.g. a vintage or production year), if present. \"region\" is a geographic region of origin named on the label, if present. \"country\" is the country of origin, if shown or inferable from the label. If any of these string fields is not present on the label or cannot be determined from the image, set its value to the exact string \"unknown\" rather than guessing - it is normal and expected for many labels to be missing several of these fields. \"category\" must be exactly one of these lowercase strings: \"wine\", \"whisky\", \"beer\", \"cider\", \"spirit\", \"unknown\". Use \"wine\" for any grape wine including sparkling, fortified, or dessert wine. Use \"whisky\" specifically for whisky/whiskey/bourbon/scotch. Use \"spirit\" for any other distilled spirit (vodka, gin, rum, tequila, brandy, liqueur, etc). Use \"beer\" for beer, ale, or lager. Use \"cider\" for cider or perry. Use \"unknown\" if the product is not an alcoholic beverage, or if the category genuinely cannot be determined. \"labelBoundingBox\" is an object {\"x\": number, \"y\": number, \"width\": number, \"height\": number} describing the smallest rectangle that tightly contains the main front label, as fractions between 0 and 1 of the full image's width and height, measured from the top-left corner. If the label's edges aren't clearly visible, make your best estimate rather than omitting this field.",
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
                  text: "Identify this product from its label and return the JSON object as instructed.",
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
