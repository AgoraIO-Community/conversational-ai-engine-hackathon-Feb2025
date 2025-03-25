# Ben Weekes - Evaluation

## Project Overview

Ben's submission consists of a conversational AI system that integrates Agora's RTC capabilities with LLM functionality. The project includes:

1. RTC Client for Desktop & Mobile
2. Postman to send a ConvoAI agent into RTC channel
3. LLM proxy (convoai-llm-wrap) to inject RAG and LLM functions into pipeline
4. RTM to send photo messages from LLM to client

## Scoring Sheet

| Name       | Innovation (15%) | Functionality (20%) | Technical Execution (20%) | Documentation & Testing (20%) | User Experience (20%) | Real-World Impact (5%) | Bonus Point | Total Score | Notes                                                                  |
| ---------- | ---------------- | ------------------- | ------------------------- | ----------------------------- | --------------------- | ---------------------- | ----------- | ----------- | ---------------------------------------------------------------------- |
| Ben Weekes | 4 \* (.15)       | 4 \* (.2)           | 2 \* (.2)                 | 1 \* (.2)                     | 2 \* (.2)             | 4 \* (.05)             | +1          | 3.8         | Strong technical implementation. UX & Documentation could be improved. |

## Scoring Details

### 1. Innovation

**Score: 4**

The project demonstrates a highly creative approach by combining multiple technologies (Agora RTC/RTM, LLM, STT/TTS) into a cohesive conversational AI system. The integration of Trulience avatars and the ability to send photos via RTM show original thinking. The LLM proxy with RAG capabilities adds significant differentiation from standard implementations.

### 2. Functionality

**Score: 4**

The implementation demonstrates a working proof of concept with the integration of Agora's RTC/RTM services, LLM capabilities, and audio processing. Functionaly it has all the elements required plus some nice extras.

### 3. Technical Execution

**Score: 2**

The overall code quality is good but execution is a bit unusual. Since the project is using TEN AGENT for the frontend, it requires extra steps to get the agent running, which are not documented and i was not able to get it running. Using the built in agent invite flow throws errors. In the video it appears as though the user would need to use POSTMAN but it would have been a better approach to have the agent invite flow working.

### 4. Documentation and Ease of Testing

**Score: 1**

The documentation is minimal and lacks basic setup instructions. The main README provides a high-level overview of features but lacks setup instructions or architecture explanation. While there is a demo video link provided, more comprehensive documentation would improve the ability to understand and test the project.

### 5. User Experience

**Score: 2**

The UI includes a clean interface using shadcn/ui components. The integration of avatars enhances the user experience. But it's not seemless.

The ux flow should be frictionless, the user shouldnt have to manually join the channel with POSTMAN, this could have been handled in the project code.

### 6. Real-World Impact

**Score: 4**

The project addresses a real world use-case by cobining voice-first AI with visual represenation using a video avatar. The combination of RTC, custom LLM wrapper for RAG, and RTM for additional media sharing creates an interesting solution that could be used in virtual companiors, customer service, virtual assistants, and more.

## Bonus Point

**Score: +1**

Ben incorporated RTM (RESTful API) which is additional to the basic requirements of RTC.

## Total Score

**Final Score: 3.8/5**

## Feedback

Ben has created a technically impressive solution that showcases the potential of Agora's conversational AI capabilities. With some improvements to documentation and user'agent invite flow, this could be a very compelling demonstration of the platform's capabilities.

### Strengths

- Strong technical implementation
- Creative approach to combining voice, text, and visual elements

### Areas for Improvement

- More comprehensive documentation would make the project easier to understand and test
- More detailed setup instructions would help others replicate the project
- Improved ease of use for the end-user.
