const ACCESS_TOKEN = "YOUR_LONG_LIVED_ACCESS_TOKEN";
const IG_USER_ID = "YOUR_INSTAGRAM_BUSINESS_ACCOUNT_ID";

// Route to get Instagram posts
app.get("/api/instagram", async (req, res) => {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${IG_USER_ID}?fields=media.limit(5){id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username}&access_token=${ACCESS_TOKEN}`
    );

    const data = await response.json();

    if (data.error) {
      console.error(data.error);
      return res.status(400).json({ error: data.error.message });
    }

    res.json(data.media.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
