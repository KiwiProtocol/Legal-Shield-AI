# LegalShield AI: Smart Legal Advice, Zero Privacy Risks

LegalShield AI is a decentralized, AI-powered legal advisor designed for small businesses and individuals who need affordable and confidential legal services. By leveraging open-source legal models, the platform delivers comprehensive contract reviews, dispute resolution insights, and compliance checks—all while ensuring client data remains secure through decentralized processing and zero-knowledge authentication.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technical Architecture](#technical-architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
  - [Backend Endpoints](#backend-endpoints)
  - [Frontend Interface](#frontend-interface)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Overview

LegalShield AI provides a robust and secure legal advisory service by combining:

- **Atoma SDK Integration:** Uses open-source legal models to perform advanced legal analysis, including contract review, dispute resolution, and compliance checks.
- **Sui zkLogin Integration:** Implements zero-knowledge proof-based authentication to ensure user privacy.
- **Case Law Enrichment:** Leverages the CourtListener API to incorporate relevant case law data, enriching the legal advice provided.
- **File Upload Capabilities:** Supports the uploading of legal documents and voice notes to facilitate more detailed legal analysis.

## Features

- **Decentralized Legal Analysis:** Securely process legal documents in a decentralized environment without exposing raw data.
- **Confidential Authentication:** Login via Google integrated with Sui zkLogin to protect user identity.
- **Real-World Legal Insights:** Reference up-to-date case law through integration with the CourtListener API.
- **User-Friendly Chat Interface:** A ChatGPT-like UI for interactive legal consultations.
- **Document & Voice Note Uploads:** Submit legal documents and audio notes for enhanced analysis.

## Technical Architecture

### Backend

- **Language/Framework:** Node.js with Express and TypeScript.
- **Key Services:**
  - **AtomaService:** Handles AI-powered legal advice using the Atoma SDK, fallback heuristic analysis, and integration with CourtListener for case law data.
  - **SuiAuth:** Manages secure, zero-knowledge authentication using Sui zkLogin and Google OAuth.
- **File Uploads:** Implements file upload functionality via Multer for legal documents and voice notes.

### Frontend

- **Interface:** A standalone HTML/CSS/JavaScript chat interface that simulates a ChatGPT-like conversation, complete with file upload features and a dynamic login button that updates upon successful Google authentication.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/legalshield-ai.git
   cd legalshield-ai
   ```

2. **Install Backend Dependencies:**

   ```bash
   cd backend
   npm install
   ```

3. **Set Up Environment Variables:**

   Create a `.env` file in the backend directory with the following content:

   ```dotenv
   ATOMASDK_BEARER_AUTH=your_atoma_sdk_bearer_auth_token
   JWT_SECRET=your_jwt_secret_key
   JWKS_URI=https://your-jwks-uri.example.com
   CLIENT_ID=your_client_id
   SUI_API_URL=https://your_sui_api_url (optional)
   PORT=3000
   ```

4. **Frontend Setup:**

   The frontend is contained in the `frontend` folder. No additional dependencies are required—simply open `index.html` in your web browser.

### Running the Application

#### Backend

- **Development Mode:**

  ```bash
  npm run dev
  ```

- **Production Mode:**

  ```bash
  npm run build
  npm start
  ```

#### Frontend

- Open `frontend/index.html` in your preferred web browser.

## Usage

### Backend Endpoints

- **GET /health**  
  Health check endpoint to verify the server is running.

- **POST /auth/google**  
  Endpoint to authenticate via Google (using Sui zkLogin).  
  **Request Body:** `{ "idToken": "your_google_id_token" }`

- **POST /legal/advice**  
  Get AI-powered legal advice.  
  **Request Body:**  
  ```json
  {
    "userMessage": "Your legal query or contract text",
    "context": [{ "role": "assistant", "content": "Previous conversation message" }]
  }
  ```

- **GET /legal/caselaw?query=...**  
  Retrieve relevant case law using the CourtListener API.

- **POST /legal/upload**  
  Upload legal documents and voice notes. Supports multiple files under fields `documents` and `voices`.

### Frontend Interface

The frontend provides a ChatGPT-like interface with:
- A header featuring a dynamic “Login with Google” button.
- A chat window for user interactions.
- Text input for legal queries.
- File upload sections for documents and voice notes.

## Project Structure

```
legalshield-ai/
├── backend/
│   ├── src/
│   │   ├── server.ts        // Main server file with endpoints and file upload implementation
│   │   ├── atomaService.ts  // AI legal advice integration with Atoma SDK and CourtListener API
│   │   ├── suiAuth.ts       // Sui zkLogin authentication integration
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
├── frontend/
│   └── index.html           // Chat interface and file upload UI
└── README.md
```

## Contributing

Contributions are welcome! Please fork the repository, make your changes, and open a pull request. For any major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Atoma SDK Documentation](https://docs.atoma.network/)
- [Sui Documentation](https://docs.sui.io/)
- [CourtListener API](https://www.courtlistener.com/api/rest-info/)
```

