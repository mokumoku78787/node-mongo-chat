const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const callChatGPT = async (messages) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
      }),
    });
    const data = await response.json();
    return data.choices[0].message;
  } catch (error) {
    throw error;
  }
};

module.exports = callChatGPT;
