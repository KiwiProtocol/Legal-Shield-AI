import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { AtomaService } from "./atomaService";
import { SuiAuthManager } from "./suiAuth";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5300;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize services
const atomaService = new AtomaService();

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Server is running" });
});

const authManager = new SuiAuthManager();
// Generate nonce for ZK login
app.post('/auth/nonce', async (req, res) => {
  try {
    const nonce = await authManager.generateLoginNonce();
    res.json({ nonce });
  } catch (error: any) {
    console.error('Error generating nonce:', error);
    res.status(500).json({ error: 'Failed to generate nonce' });
  }
});

// Verify ZK login
app.post('/auth/verify', async (req, res) => {
  try {
    const { zkProof, jwt, ephemeralKey, maxEpoch } = req.body;
    
    const result = await authManager.verifyZkLogin(jwt, zkProof, ephemeralKey, maxEpoch);
    res.json({
      token: result.token,
      address: result.address
    });
  } catch (error: any) {
    console.error('Error verifying login:', error);
    res.status(401).json({ error: 'Login verification failed' });
  }
});

// Verify session token
app.get('/auth/session', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.substring(7);
  const session = authManager.verifySessionToken(token);
  
  if (!session) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  res.json({ address: session.address });
});

// AI-Powered Legal Advice Endpoint
app.post("/legal/advice", async (req, res) => {
  try {
    const { userMessage, context } = req.body;
    const response = await atomaService.getLegalAdvice(userMessage, context || []);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: "An error occurred while processing legal advice." });
  }
});

// Fetch Case Law from CourtListener
app.get("/legal/caselaw", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required." });
    }
    const caseLawData = await atomaService.getCourtListenerCases(query as string);
    res.json(caseLawData);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch case law data." });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
