"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtomaService = void 0;
// src/atomaService.ts
const atoma_sdk_1 = require("atoma-sdk");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Initialize the Atoma SDK with bearer authentication from environment variables.
const atomaSDK = new atoma_sdk_1.AtomaSDK({
    bearerAuth: process.env.ATOMASDK_BEARER_AUTH || '7uabXiOonc28sJAussfv90cIeiJkPi'
});
class AtomaService {
    /**
     * Get legal advice from the AI model.
     * @param userMessage - The message from the client (e.g., a legal contract to review).
     * @param context - Optional conversation history to maintain context.
     */
    async getLegalAdvice(userMessage, context = []) {
        // Updated system message incorporating LegalShield AI's decentralized and privacy-first approach.
        const systemMessage = {
            role: "system",
            content: "You are a legal expert AI advisor for LegalShield AI, a decentralized, privacy-first legal service " +
                "designed for small businesses and individuals. Provide comprehensive contract reviews, dispute resolution insights, " +
                "and compliance checks. Your advice should be informed by up-to-date legal standards, relevant case law, " +
                "and current regulatory frameworks. Ensure all user data remains confidential."
        };
        // Build the message chain: system prompt, prior conversation context, and the current user message.
        const messages = [systemMessage, ...context, { role: "user", content: userMessage }];
        try {
            // Attempt to get advice from the primary AI model.
            const result = await atomaSDK.chat.create({
                messages,
                model: "meta-llama/Llama-3.3-70B-Instruct"
            });
            return result;
        }
        catch (error) {
            console.error("Atoma SDK error:", error);
            // If the primary call fails, return an intelligent fallback response enriched with CourtListener data.
            return this.fallbackLegalAdvice(userMessage, context);
        }
    }
    /**
     * An intelligent fallback system that performs advanced legal text analysis and enriches recommendations with case law.
     * @param userMessage - The original user message.
     * @param context - Any previous conversation context.
     */
    async fallbackLegalAdvice(userMessage, context) {
        // Extract common legal keywords.
        const detectedKeywords = this.extractKeywords(userMessage);
        // Perform advanced clause analysis.
        const clauseAnalysis = this.advancedClauseAnalysis(userMessage);
        // Fetch relevant case law from CourtListener based on the user query.
        const courtData = await this.getCourtListenerCases(userMessage);
        let advice = "Preliminary Legal Analysis (Fallback Mode):\n\n";
        advice += "Note: This analysis is generated using heuristic methods and real-world case law data " +
            "from the CourtListener API. It provides initial insights and should not replace a comprehensive review by a qualified attorney.\n\n";
        if (detectedKeywords.length === 0 && Object.keys(clauseAnalysis).length === 0) {
            advice += "No common legal terminology or recognizable clauses were detected. Please provide more detailed information.";
        }
        else {
            if (detectedKeywords.length > 0) {
                advice += `Detected Keywords: ${detectedKeywords.join(", ")}.\n\n`;
            }
            if (Object.keys(clauseAnalysis).length > 0) {
                advice += "Identified Legal Clauses and Recommendations:\n";
                for (const [clause, recommendation] of Object.entries(clauseAnalysis)) {
                    advice += `• ${clause}: ${recommendation}\n`;
                }
            }
        }
        // Append CourtListener case law references if available.
        if (courtData && courtData.results && courtData.results.length > 0) {
            advice += "\nRelevant Case Law References:\n";
            courtData.results.forEach((caseItem, index) => {
                advice += `• [${index + 1}] ${caseItem.caseName} (${caseItem.court}): ${caseItem.absoluteUrl}\n`;
            });
        }
        else {
            advice += "\nNo relevant case law data found from CourtListener.";
        }
        if (context.length > 0) {
            advice += "\n\nAdditional Context: " + context.map((msg) => msg.content).join(" | ");
        }
        advice += "\n\nFor a comprehensive review, please consult a qualified legal professional.";
        return {
            fallback: true,
            message: advice,
            disclaimer: "This heuristic-based advice is not a substitute for a full legal review by a qualified attorney."
        };
    }
    /**
     * Extracts common legal keywords from the provided text.
     * @param text - The text to analyze.
     * @returns An array of detected keywords.
     */
    extractKeywords(text) {
        const keywords = [
            "contract",
            "agreement",
            "liability",
            "termination",
            "non-compete",
            "compliance",
            "dispute",
            "arbitration",
            "warranty",
            "confidentiality"
        ];
        const lowerText = text.toLowerCase();
        return keywords.filter((keyword) => lowerText.includes(keyword));
    }
    /**
     * Performs advanced clause analysis using regular expressions to identify legal clauses.
     * @param text - The text to analyze.
     * @returns An object mapping detected clause names to tailored recommendations.
     */
    advancedClauseAnalysis(text) {
        const clauseAnalysis = {};
        // Define regex patterns for common legal clauses.
        const clauses = {
            "Termination Clause": /termination clause|terminate|ending/i,
            "Liability Clause": /liability|indemnify|indemnification/i,
            "Confidentiality Clause": /confidentiality|non-disclosure|NDA/i,
            "Non-Compete Clause": /non[-\s]?compete|restrict/i,
            "Dispute Resolution Clause": /dispute resolution|arbitration|litigation/i,
            "Force Majeure Clause": /force majeure/i,
            "Warranty Clause": /warranty|guarantee/i,
            "Compliance Clause": /compliance/i
        };
        for (const [clauseName, regex] of Object.entries(clauses)) {
            if (regex.test(text)) {
                switch (clauseName) {
                    case "Termination Clause":
                        clauseAnalysis[clauseName] =
                            "Ensure termination rights and obligations are clearly defined with explicit conditions and penalties, including state-specific requirements.";
                        break;
                    case "Liability Clause":
                        clauseAnalysis[clauseName] =
                            "Review limitations on liability and indemnification clauses to mitigate risk; confirm terms align with current legal standards.";
                        break;
                    case "Confidentiality Clause":
                        clauseAnalysis[clauseName] =
                            "Verify that confidentiality obligations are robust, mutually binding, and compliant with data privacy laws.";
                        break;
                    case "Non-Compete Clause":
                        clauseAnalysis[clauseName] =
                            "Assess the scope and duration of non-compete clauses to ensure they are reasonable and enforceable in your jurisdiction.";
                        break;
                    case "Dispute Resolution Clause":
                        clauseAnalysis[clauseName] =
                            "Evaluate dispute resolution options such as arbitration or mediation for fairness and cost-effectiveness, considering alternatives if necessary.";
                        break;
                    case "Force Majeure Clause":
                        clauseAnalysis[clauseName] =
                            "Confirm that force majeure provisions are precisely defined and balanced, without favoring one party excessively.";
                        break;
                    case "Warranty Clause":
                        clauseAnalysis[clauseName] =
                            "Ensure warranty terms are compliant with legal standards and specify clear remedies for breaches.";
                        break;
                    case "Compliance Clause":
                        clauseAnalysis[clauseName] =
                            "Verify that compliance clauses incorporate all relevant legal and regulatory frameworks in detail.";
                        break;
                    default:
                        clauseAnalysis[clauseName] = "Clause detected; further review is recommended.";
                }
            }
        }
        return clauseAnalysis;
    }
    /**
     * Fetches relevant court opinions and case law from the CourtListener API based on a search query.
     * @param query - The search query to look up in the CourtListener database.
     * @returns The JSON response from the CourtListener API.
     */
    async getCourtListenerCases(query) {
        try {
            // CourtListener API endpoint for opinions; adjust parameters as needed.
            const url = `https://www.courtlistener.com/api/rest/v3/opinions/?search=${encodeURIComponent(query)}&page_size=5`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`CourtListener API returned status ${response.status}`);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error("CourtListener API error:", error);
            return { error: "Unable to fetch data from CourtListener API." };
        }
    }
}
exports.AtomaService = AtomaService;
