import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const {
      action,
      channelName,
      patientUid,
      selectedLanguage,
      selectedVoice,
      agentId,
      patientId,
    } = await request.json();

    // Get credentials from environment variables (server-side)
    const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID; // This one stays NEXT_PUBLIC since it's needed on client
    const customerId = process.env.AGORA_CUSTOMER_ID;
    const customerSecret = process.env.AGORA_CUSTOMER_SECRET;
    const openAiKey = process.env.OPENAI_API_KEY;
    const azureTtsKey = process.env.AZURE_TTS_KEY;
    const aiAssistantUid = process.env.NEXT_PUBLIC_AI_ASSISTANT_UID; // This one stays NEXT_PUBLIC since it's needed on client
    const llmUrl = process.env.LLM_URL;

    if (!appId || !customerId || !customerSecret) {
      console.error("Missing credentials:", {
        appId,
        customerId,
        customerSecret,
      });
      return NextResponse.json(
        { error: "Missing Agora credentials" },
        { status: 500 },
      );
    }

    // btoa is not available in Node.js environment, use Buffer instead
    const credentials = Buffer.from(`${customerId}:${customerSecret}`).toString(
      "base64",
    );
    const baseUrl = `https://api.agora.io/api/conversational-ai-agent/v2/projects/${appId}`;

    if (action === "join") {
      const response = await fetch(`${baseUrl}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify({
          name: `${channelName}-${Date.now()}`,
          properties: {
            channel: channelName,
            agent_rtc_uid: aiAssistantUid,
            enable_string_uid: false,
            idle_timeout: 60,
            remote_rtc_uids: [patientUid.toString()],
            advanced_features: {
              enable_bhvs: false,
              enable_aivad: false,
            },
            asr: {
              language: selectedLanguage,
            },
            vad: {
              silence_duration_ms: 480,
            },
            llm: {
              url: `${llmUrl}/chat/completions`,
              api_key: openAiKey,
              system_messages: [
                {
                  role: "system",
                  content: `You always respond in a valid JSON format.
                  You are a medical diagnosis assistant, you will listen a patient talking with its doctor describing its symptoms, you will provide potential conditions that the patient might have, keep everything in a medical context.  Provide exactly one valid JSON object with 3 keys This JSON must strictly adhere to RFC 8259, which requires every string to be enclosed in matching double quotes, and all punctuation (commas, colons, brackets, etc.) to be accurate.
                  The JSON object must have exactly these keys:
                  1.	"possible_conditions": an array of up to four objects. Each object must include:
                  	•	"condition": a string naming the condition
                  	•	"percentage": a number between 0 and 100 indicating the likelihood
                    - The percentage sum of all conditions must be 100
                  2. "summary": Short sentence summarizing patient symptoms
                  2.	"follow_up_question": a single string with a question for further patient information

                  No extra keys or text are permitted.

                  Responses should be in this language: ${selectedLanguage}

                  Example structure:
                  {
                    "possible_conditions": [{
                    "condition": "Migraine",
                    "percentage": 70
                  },
                  {
                    "condition": "Cold",
                    "percentage": 30
                  }
                  ],
                  "summary": "Patient has a headache and runny nose",
                  "follow_up_question": "Do you experience a sore throat?"
                  }

                  You must always respond in valid JSON format only, with no surrounding text or code fences.
                  Do not format your output as Markdown, code blocks, or anything else. Never end ‘summary’ or ‘follow-up’ question values with a period. These values should always remain unpunctuated.`,
                },
              ],
              greeting_message: "",
              failure_message: "error",
              max_history: 100,
              params: {
                model: "gpt-4",
                max_completion_tokens: 2048,
                temperature: 0.0,
                metadata: {
                  patient_id: `${patientId ?? ""}`,
                },
              },
            },
            tts: {
              vendor: "microsoft",
              params: {
                key: azureTtsKey,
                region: "eastus",
                voice_name: selectedVoice,
                rate: 1,
                volume: 70,
              },
            },
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to join AI agent to call");
      }

      const data = await response.json();
      return NextResponse.json(data);
    } else if (action === "leave") {
      if (!agentId) {
        return NextResponse.json(
          { error: "Agent ID is required for leave action" },
          { status: 400 },
        );
      }

      console.log(`Leaving AI agent: ${baseUrl}/agents/${agentId}/leave`);
      const response = await fetch(`${baseUrl}/agents/${agentId}/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to remove AI agent from call",
        );
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error handling AI assistant operation:", error);
    return NextResponse.json(
      { error: "Failed to process request: " + error.message },
      { status: 500 },
    );
  }
}
