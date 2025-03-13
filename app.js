const express = require("express");

require("dotenv").config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ask 경로 요청시 라우터
const router = express.Router();
const cors = require("cors");
// OpenAI API Key
const OpenAI = require("openai");

const app = express();
// app.use(cors());
app.use(cors());
app.use(express.json()); // 파라미터가 apllication/json 형태로 들어오면 파싱
app.use(express.urlencoded({ extended: true })); // 파라미터가 application/x-www-form-urlencoded 형태로 들어오면 파싱
console.log("app start ...");

// 라우터 - 해당 경로 api 호출 요청이 오면
app.use("/", router);
router.post("/ask", async (req, res) => {
  console.log("/ask");
  const prompt = req.body.prompt;
  console.log(">> prompt: " + prompt);
  const result = await chatGptApi(prompt);
  console.log(">> result: " + JSON.stringify(result));

  if (result) {
    res.json({ response: result });
  } else {
    res.status(500).json({ error: "Failed to get response from OpenAI" });
  }
});

app.get("/hello", (req, res) => {
  res.send("Hello");
});

const chatGptApi = async (prompt) => {
  try {
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        // Gtp 역할과 대답 예시를 알려주며 트레이닝 1
        {
          role: "developer",
          content:
            "You will be provided with a message, and your task is to respond using emojis only.",
        },
        {
          role: "user",
          content: "How are you feeling today?",
        },
        {
          role: "assistant",
          content: "😊👍",
        },
        // Gtp 역할과 대답 예시를 알려주며 트레이닝 2
        {
          role: "user",
          content: "Are you upset?",
        },
        {
          role: "assistant",
          content: "😡",
        },
        // Gtp 실제 집문 (prompt)
        {
          role: "user",
          content: prompt,
        },
      ],
      store: true,
      max_tokens: 100, // 글자수 제한
    });
    console.log("response : " + response.choices[0].message.content);

    return response.choices[0].message.content;
  } catch (error) {
    console.log(error);
    return "Error: Unable to retrieve response from OpenAI API";
  }
};

const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // 서버가 4000번 포트에서 실행 중
});
