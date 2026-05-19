// /api/verify-recaptcha.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { token } = req.body;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      {},
      {
        params: {
          secret: secretKey,
          response: token,
        },
      }
    );

    if (response.data.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false, error: response.data["error-codes"] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
