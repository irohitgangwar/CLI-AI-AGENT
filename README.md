# Orbit AI Agent CLI 🚀

Orbit is a powerful, interactive Command-Line AI Agent. It supports standard conversational chat, multi-step tool execution, and an autonomous code generator that writes projects directly to your hard drive.

---

## 🌟 Features

*   💬 **AI Chat**: Standard conversational interface with streaming responses and full Markdown rendering.
*   🛠️ **Tool Calling**: Allows the AI to read local files, scan directory contents, and run custom integration helper commands.
*   🤖 **Agentic Code Builder**: Describe what you want to build (e.g., *"A React weather dashboard"*), and the agent will plan the architecture, create the files and folders, write clean code, and generate run instructions.
*   🔐 **Device Authentication Flow**: Secure GitHub OAuth login via your browser that automatically links with the CLI.

---

## 📦 Installation

Install the package globally on your computer using npm:

```bash
npm install -g orbital-cli-agent
```

---

## ⚙️ Setup Configuration

Before you start, the CLI needs a **Google Gemini API Key** to run the AI model. 

1. Go to Google AI Studio and get a free API key.
2. In the folder where you want to run the CLI (e.g. your Desktop or projects folder), create a file named `.env`.
3. Open the `.env` file and paste your key inside:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_actual_gemini_api_key_here
   ```
4. Save the file.

---

## 🎮 How to Use

Open your terminal in the folder containing your `.env` file and run:

### 1. Login
Authenticate your terminal using your GitHub account:
```bash
orbital login
```
*   This will display a verification code and open your browser.
*   Log in via GitHub, click **Approve**, and return to the terminal.

### 2. Verify Session
Check if you are successfully logged in:
```bash
orbital whoami
```

### 3. Wake Up the Agent
Launch the interactive CLI menu:
```bash
orbital wakeup
```
*   This opens a navigation loop menu.
*   You can select **AI Chat**, **Tool Calling**, or **Agentic Mode**.
*   When finished with a session, type `exit` to return to the main menu.
*   Select **Exit** to close the program cleanly.

### 4. Logout
Clear your saved session token:
```bash
orbital logout
```

---

## 🛡️ License

This project is licensed under the MIT License.
