"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const atomaService_1 = require("./atomaService");
const suiAuth_1 = require("./suiAuth");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5300;
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Initialize services
const atomaService = new atomaService_1.AtomaService();
// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "Server is running" });
});
const authManager = new suiAuth_1.SuiAuthManager();
// Generate nonce for ZK login
app.post('/auth/nonce', async (req, res) => {
    try {
        const nonce = await authManager.generateLoginNonce();
        res.json({ nonce });
    }
    catch (error) {
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
    }
    catch (error) {
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
    }
    catch (error) {
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
        const caseLawData = await atomaService.getCourtListenerCases(query);
        res.json(caseLawData);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch case law data." });
    }
});
// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
