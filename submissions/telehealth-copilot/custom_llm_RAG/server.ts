import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { PatientRecord } from "./types";
import { sampleRecords } from "./sampleData";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

// Initialize vector store
let vectorStore: HNSWLib;

// Initialize embeddings and vector store
const initVectorStore = async () => {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.API_TOKEN,
  });

  const docs = sampleRecords.map(
    (record) =>
      new Document({
        pageContent: record.history,
        metadata: {
          id: record.id,
          name: record.name,
          dateAdded: record.dateAdded,
        },
      })
  );

  vectorStore = await HNSWLib.fromDocuments(docs, embeddings);
  console.log("Vector store initialized with sample records");
};

// Initialize vector store on startup
initVectorStore().catch(console.error);

/**
 * Middleware to log requests
 */
app.use((req: Request, res: Response, next: NextFunction): void => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

/**
 * Middleware to verify API Key
 */
const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const apiKey = req.header("api-key");
  if (apiKey !== process.env.API_TOKEN) {
    res.status(403).json({ detail: "Invalid or missing API key" });
    return;
  }
  next();
};

/**
 * Helper function to create SSE message
 */
const createSSEMessage = (data: any, content?: string): string => {
  return `data: ${JSON.stringify({
    id: data.id,
    object: "chat.completion.chunk",
    created: data.created,
    model: data.model,
    system_fingerprint: data.system_fingerprint || "",
    choices: [
      {
        index: 0,
        delta: content ? { content } : { role: data.choices[0].message.role },
        logprobs: null,
        finish_reason: null,
      },
    ],
  })}\n\n`;
};

/**
 * Add a new patient record
 */
app.post("/patients", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, history, dob } = req.body;

    if (!name || !history || !dob) {
      res.status(400).json({ detail: "Name, DOB & history are required" });
      return;
    }

    const newRecord: PatientRecord = {
      id: Date.now().toString(),
      name,
      dob,
      history,
      dateAdded: new Date().toISOString().split("T")[0],
    };

    // Add to vector store
    await vectorStore.addDocuments([
      new Document({
        pageContent: newRecord.history,
        metadata: {
          id: newRecord.id,
          name: newRecord.name,
          dob: newRecord.dob,
          dateAdded: newRecord.dateAdded,
        },
      }),
    ]);

    res.status(201).json(newRecord);
  } catch (error) {
    console.error("Error adding patient record:", error);
    res.status(500).json({ detail: "Failed to add patient record" });
  }
});

/**
 * Stream OpenAI API response to client with RAG
 */
const streamProcessedOpenAIResponse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      model = "gpt-4",
      messages,
      max_completion_tokens,
      metadata,
    } = req.body;

    // console.log(`${JSON.stringify(req.body)}`);
    // console.log(`Received request with metadata: ${JSON.stringify(metadata)}`);

    if (!messages?.length) {
      res.status(400).json({ detail: "Invalid request format" });
      return;
    }

    // Get patient context if patientId is provided in metadata
    let contextMessage: { role: string; content: string } | undefined;
    if (metadata?.patient_id) {
      console.log(
        `Searching for patient record with id: ${metadata.patient_id}`
      );

      // Search directly for the specific patient ID
      const searchResults = await vectorStore.similaritySearch(
        `id:${metadata.patient_id}`, // Search for this specific ID
        1 // We only need one result
      );

      if (searchResults.length > 0) {
        const patientRecord = searchResults[0];
        console.log(`Patient record found: ${patientRecord.metadata.name}`);
        contextMessage = {
          role: "system",
          content: `Current patient context:\nPatient: ${patientRecord.metadata.name}\nHistory: ${patientRecord.pageContent}\nDate Added: ${patientRecord.metadata.dateAdded}\n\nIf relevant, use this history to inform your response. If not relevant, ignore it. Summarize the conversation with or without history as needed, never end the summary with a period`,
        };
      } else {
        console.log(`No patient record found with id: ${metadata.patient_id}`);
      }
    } else console.log(`Patient ID not provided, standard predictions`);

    // Add context message if available
    const augmentedMessages = contextMessage
      ? [contextMessage, ...messages]
      : messages;

    // Print augmented messages for debugging
    // console.log(
    //   "Augmented messages:",
    //   JSON.stringify(augmentedMessages, null, 2)
    // );

    const openAIResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model,
        messages: augmentedMessages,
        stream: false,
        max_tokens: max_completion_tokens,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const completionData = openAIResponse.data;
    const message = completionData.choices[0].message;
    let content = message.content || "";

    try {
      const parsedContent = JSON.parse(content);
      content = JSON.stringify(parsedContent);
    } catch {
      // Not JSON, keep original content
    }

    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Send role and content
    res.write(createSSEMessage(completionData));
    res.write(createSSEMessage(completionData, content));
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    if (res.headersSent) {
      console.error("Error occurred after response was sent:", error);
      return;
    }

    const status = axios.isAxiosError(error)
      ? error.response?.status || 500
      : 500;
    const detail = axios.isAxiosError(error)
      ? error.response?.data || "OpenAI API request failed"
      : "Internal Server Error";

    res.status(status).json({ detail });
  }
};

/**
 * Route to handle chat completions
 */
app.post("/chat/completions", verifyToken, streamProcessedOpenAIResponse);

/**
 * Start the server
 */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
