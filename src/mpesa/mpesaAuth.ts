import dotenv from "dotenv";
dotenv.config();

export async function getAccessToken() {
  try {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      throw new Error("Missing MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET in environment variables");
    }

    // Convert both consumer Secrets and Consumer keys to base 64 to secure them
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    // To send, we use the Fetch method
    const response = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      method: 'GET',
      headers: {
        "Authorization": `Basic ${auth}`
      }
    });
    // Should Return a token
    const data = await response.json();

    console.log("🌟 ~ getAccessToken ~ data:", data);

    return data.access_token;
  } catch (error: any) {
    console.log("🌟 ~ getAccessToken ~ error:", error);
    return null;
  }
}
