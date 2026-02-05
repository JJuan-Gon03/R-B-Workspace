import {main} from "../services/gemini.service.js";

const getGeminiResponse = async (req, res) => {
  try {
    const text = req.params.text;
    const user_id = req.params.user_id;
    const reply = await main(text, user_id);
    return res.status(200).json(reply);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "error retrieving response",
    });
  }
};

export {getGeminiResponse}

