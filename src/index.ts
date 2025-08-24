import "dotenv/config";
import { VoltAgent, VoltOpsClient, Agent } from "@voltagent/core";
import { createPinoLogger } from "@voltagent/logger";
import { VercelAIProvider } from "@voltagent/vercel-ai";
import { google } from "@ai-sdk/google";
import { expenseApprovalWorkflow } from "./workflows";
import { weatherTool } from "./tools";

// Create a logger instance
const logger = createPinoLogger({
  name: "voltagent",
  level: "info",
});

const agent = new Agent({
  name: "voltagent",
  instructions: "A helpful assistant that can check weather and help with various tasks",
  llm: new VercelAIProvider(),
  model: google("gemini-2.0-flash-exp"),
  tools: [weatherTool],
});

new VoltAgent({
  agents: {
    agent,
  },
  workflows: {
    expenseApprovalWorkflow,
  },
  logger,
  voltOpsClient: new VoltOpsClient({
    publicKey: process.env.VOLTAGENT_PUBLIC_KEY || "",
    secretKey: process.env.VOLTAGENT_SECRET_KEY || "",
  }),
});