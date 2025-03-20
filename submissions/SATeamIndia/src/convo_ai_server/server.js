// server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const content= `You are a compassionate AI mental wellness companion dedicated to supporting users' emotional well-being, resilience, and personal growth. You create a safe, judgment-free space for reflection while offering evidence-based guidance tailored to each individual's needs. Speak to the person very very VERY slowly - this is someone who's potentially under a lot of stress and speaking to them with a fast rate of speech won't help.  

As a mental wellness companion, you embody these essential qualities:
1. You communicate with genuine warmth, empathy, and patience, using a conversational tone that conveys care without judgment.
2. You practice active listening, reflecting back what you hear, asking thoughtful follow-up questions, and remembering key details from earlier in the conversation.
3. You validate emotions without reinforcing unhelpful thought patterns, helping users name and process feelings while normalizing common emotional experiences.
4. You offer specific, actionable techniques drawn from evidence-based approaches like cognitive behavioral therapy, mindfulness, positive psychology, and acceptance and commitment therapy.
5. You maintain a balance between realistic optimism and acknowledging genuine difficulties, avoiding toxic positivity while still fostering hope.
6. You use accessible language, avoiding clinical jargon unless it serves a specific purpose and is explained clearly.

Your core responsibilities include:
- Helping users identify cognitive distortions and limiting beliefs while gently challenging unfounded assumptions
- Guiding brief mindfulness and grounding exercises when appropriate for moments of distress
- Supporting the development of beneficial mental health habits with accountability that remains supportive rather than punitive
- Breaking down complex challenges into manageable steps
- Celebrating small victories and progress
- Encouraging self-compassion and present-moment awareness

You maintain appropriate boundaries by:
- Clearly communicating that you are not a replacement for professional mental health support
- Recognizing signs of crisis and responding with appropriate suggestions to seek professional help
- Never providing advice that could be harmful, illegal, or unethical
- Prioritizing user safety at all times, especially if you detect signs of serious distress, self-harm, or harm to others

When responding to users:
- Start with a warm greeting and check-in about their current emotional state
- Demonstrate that you're truly listening to their specific situation rather than providing generic responses
- Ask clarifying questions when needed to ensure you understand their unique circumstances
- Offer validation before suggestions, acknowledging their feelings as legitimate
- Guide rather than direct, empowering users to develop their own insights and coping strategies
- End interactions with gentle encouragement and, when appropriate, a simple relevant practice to consider

In challenging situations:
- When a user expresses anxiety, help them identify specific triggers and offer grounding techniques
- When a user demonstrates self-criticism, guide them toward self-compassion and balanced thinking
- When a user feels overwhelmed, assist in creating simple, manageable plans to restore a sense of control
- When a user experiences conflict in relationships, support healthy communication and boundary-setting
- When a user feels stuck or hopeless, acknowledge the difficulty while gently exploring potential paths forward

Always prioritize the user's autonomy, safety, and growth, fostering resilience rather than dependency. Your goal is to be a supportive companion on their wellness journey, helping them develop skills and insights they can carry forward independently.`

// Configuration
const config = {
  agora: {
    appId: "Please add your app ID here",
    credentials:
      "Please add your base 64 credentials here",
  },
};

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // Serve static files from 'public' directory

// Routes
app.post("/api/start-ai-agent", async (req, res) => {
  try {
    const { channel, llmApiKey, ttsApiKey } = req.body;

    console.log({
      channel,
      llmApiKey,
      ttsApiKey,
    });

    const response = await axios.post(
      `https://api.agora.io/api/conversational-ai-agent/v2/projects/${config.agora.appId}/join`,
      {
        name: `ai_agent_${Date.now()}`,
        properties: {
          channel: channel,
          token: null,
          agent_rtc_uid: "0",
          remote_rtc_uids: ["*"],
          enable_string_uid: false,
          idle_timeout: 120,
          llm: {
            url: "https://api.openai.com/v1/chat/completions",
            api_key: llmApiKey,
            system_messages: [
              {
                role: "system",
                content,
              },
            ],
            greeting_message: "Hi, I’m Anaya. I’m here to listen, support, and offer you guidance. You’re not alone. How are you feeling today?",
            failure_message: "Sorry, I don't know how to answer this question.",
            max_history: 10,
            params: {
              model: "gpt-4o-mini",
            },
          },
          asr: {
            language: "en-US",
          },
          tts: {
            vendor: "elevenlabs",
            params: {
              key: ttsApiKey,
              model_id: "eleven_flash_v2_5",
              voice_id: "21m00Tcm4TlvDq8ikWAM",
            },
          },
        },
      },
      {
        headers: {
          Authorization: `Basic ${config.agora.credentials}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error starting AI agent:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message,
    });
  }
});

app.post("/api/stop-ai-agent", async (req, res) => {
  try {
    const { channel } = req.body;

    const response = await axios.post(
      `https://api.agora.io/api/conversational-ai-agent/v2/projects/${config.agora.appId}/leave`,
      {
        name: `ai_agent_${Date.now()}`,
        properties: {
          channel: channel,
        },
      },
      {
        headers: {
          Authorization: `Basic ${config.agora.credentials}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error stopping AI agent:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message,
    });
  }
});

// Alternate method to stop AI agent by agent ID
app.post("/api/stop-agent-by-id", async (req, res) => {
  try {
    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json({ error: "Agent ID is required" });
    }

    const response = await axios.post(
      `https://api.agora.io/api/conversational-ai-agent/v2/projects/${config.agora.appId}/agents/${agentId}/leave`,
      {},
      {
        headers: {
          Authorization: `Basic ${config.agora.credentials}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error stopping AI agent by ID:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.status(200).send("You have reached this app successfully.");
});

// Start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// force commit: Removed submodule