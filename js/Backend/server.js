require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "openai/gpt-oss-120b";

console.log("***** NEW SERVER VERSION LOADED *****");

console.log(
  "✓ Groq API Key:",
  process.env.GROQ_API_KEY ? "Loaded" : "Missing"
);

console.log("✓ Model:", MODEL);

app.get("/", (req, res) => {
  res.send("Groq Backend Running ✓");
});

async function analyzePrescription(data) {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    temperature: 0.1,
    max_tokens: 2000,
    response_format: {
      type: "json_object",
    },
    messages: [
  {
    role: "system",
    content: `
You are a senior clinical prescription analysis assistant.

Return ONLY valid JSON.

Return exactly:

{
  "riskScore": 0,
  "riskLevel": "",
  "report": [],
  "recommendations": []
}

Rules:

- Use ONLY the supplied prescription.
- Never invent diseases.
- Never invent allergies.
- Never invent diagnoses.
- Never invent medicines.
- Never invent follow-up dates.
- Never assume missing information.

The "report" array must contain 10-15 bullet points.

Include bullets for:

• Patient Name
• Age
• Blood Group
• Allergies
• Doctor Name
• Hospital
• Visit Date
• Specialization
• Every medicine
• Strength
• Duration
• Morning/Afternoon/Night timing
• Risk explanation
• Monitoring advice
• Missing information (if any)

Each bullet should be one short sentence.

The recommendations array must contain exactly 6 practical recommendations.

`
  },
  {
    role: "user",
    content: `
Prescription Data:

${JSON.stringify(data, null, 2)}

Generate the JSON response.
`
  }
]
  });

  return completion.choices[0].message.content;
}

app.post("/api/analyze", async (req, res) => {
  console.log("\n========== REQUEST ==========");
  console.log(JSON.stringify(req.body, null, 2));

  try {

    const text = await analyzePrescription(req.body);

    console.log("\n========== RAW RESPONSE ==========");
    console.log(text);

    const result = JSON.parse(text);

   if (
    result.riskScore === undefined ||
    !result.riskLevel ||
    !Array.isArray(result.report) ||
    !Array.isArray(result.recommendations)
) {
    throw new Error("Invalid JSON structure returned by AI.");
}

    res.json(result);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      riskScore: 0,
      riskLevel: "Unknown",
      summary: "Unable to analyze prescription.",
      recommendations: [
        err.message
      ]
    });

  }
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});