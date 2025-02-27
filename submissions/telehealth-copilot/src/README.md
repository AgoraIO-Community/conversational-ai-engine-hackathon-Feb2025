# Agora ConvoAI Demo - Telehealth Platform

A modern telehealth platform that enables secure video consultations between doctors and patients, powered by Agora's Real-Time Communication SDK and AI capabilities.

## Features

- **Secure Video Consultations**: High-quality, real-time video communication between doctors and patients
- **AI-Powered Diagnosis Assistance**: Real-time AI analysis of consultations providing diagnostic suggestions
- **Multilingual Support**: Supports multiple languages including:
  - English
  - Spanish (Español)
  - Chinese (中文)
- **Real-time Transcription**: Automatic transcription of consultations
- **Dynamic Diagnosis Visualization**: Interactive charts showing diagnosis probabilities
- **Secure Patient Invitations**: Easy-to-share unique session links for patients

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Video SDK**: Agora RTC
- **AI Integration**: GPT-4 for medical analysis
- **Voice**: Azure Text-to-Speech
- **Charts**: Chart.js for diagnosis visualization

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables in `.env.local`:

   ```env
   # Client-side variables (public)
   NEXT_PUBLIC_AGORA_APP_ID=your_agora_app_id
   NEXT_PUBLIC_AI_ASSISTANT_UID=10000
   NEXT_PUBLIC_ASR_LANGUAGE=en-US
   NEXT_PUBLIC_AZURE_TTS_VOICE=en-US-EmmaMultilingualNeural

   # Server-side variables (private)
   AGORA_CUSTOMER_ID=your_agora_customer_id
   AGORA_CUSTOMER_SECRET=your_agora_customer_secret
   OPENAI_API_KEY=your_openai_api_key
   AZURE_TTS_KEY=your_azure_tts_key
   LLM_URL=http://ec2-18-236-128-162.us-west-2.compute.amazonaws.com:8000 # This is the URL of the LLM server optimized to work with JSON responses
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser

## Usage

### For Doctors

1. Click "I'm a Doctor" on the homepage
2. Create a new consultation session
3. Select the consultation language
4. Share the generated link with your patient
5. Start the session and enable AI assistance when needed

### For Patients

1. Use the link provided by your doctor
2. Grant camera and microphone permissions
3. Join the consultation

## Security

- All video communications are encrypted
- Unique session IDs for each consultation
- No data persistence - sessions are temporary
- Secure token-based authentication

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Powered by [Agora.io](https://www.agora.io/)
- AI capabilities by OpenAI's GPT-4
- Voice synthesis by Azure Text-to-Speech
