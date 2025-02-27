export const agoraConfig = {
  appId: process.env.NEXT_PUBLIC_AGORA_APP_ID,
  customerId: process.env.NEXT_PUBLIC_AGORA_CUSTOMER_ID,
  customerSecret: process.env.NEXT_PUBLIC_AGORA_CUSTOMER_SECRET,
  openAiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  azureTtsKey: process.env.NEXT_PUBLIC_AZURE_TTS_KEY,
  azureTtsVoice: process.env.NEXT_PUBLIC_AZURE_TTS_VOICE,
  aiAssistantUid: process.env.NEXT_PUBLIC_AI_ASSISTANT_UID,
  asrLanguage: process.env.NEXT_PUBLIC_ASR_LANGUAGE,
  llmUrl: process.env.NEXT_PUBLIC_LLM_URL,
};
