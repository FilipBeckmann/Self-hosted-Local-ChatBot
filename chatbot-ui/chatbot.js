import { History } from "./chathistory.js";

const chatHistory = new History();

window.closeonclick = closeonclick;
window.sendMessage = sendMessage;
window.showChatbot = showChatbot;

async function sendMessage() {
    let inputField = document.getElementById("userInput");
    let message = inputField.value.trim();
    if (message === "") return;
    let chatBox = document.getElementById("chatBox");

    // User Nachricht anzeigen
    let userMessage = document.createElement("div");
    userMessage.className = "message user";
    userMessage.textContent = message;
    chatBox.appendChild(userMessage);

    // Lade-Spinner anzeigen
    let loadingMessage = document.createElement("div");
    loadingMessage.className = "message bot loading";
    loadingMessage.textContent = "|"; // Startsymbol
    chatBox.appendChild(loadingMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    const spinnerChars = ["|", "/", "-", "\\"];
    let spinnerIndex = 0;

    // Spinner Intervall starten
    let spinnerInterval = setInterval(() => {
        spinnerIndex = (spinnerIndex + 1) % spinnerChars.length;
        loadingMessage.textContent = spinnerChars[spinnerIndex];
    }, 200);
    chatHistory.pushToHistory("user", message);
    chatHistory.saveChatHistory();
    console.log("Kontext:", JSON.stringify(chatHistory.getChatHistory()));

    try {
        let response = await fetch("http://localhost:11434/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3",
                messages: chatHistory.getChatHistory()
            })
        });
        const text = await response.text(); // Text zuerst lesen
        console.log("Raw response:", text);

        // Spinner stoppen & entfernen
        clearInterval(spinnerInterval);
        chatBox.removeChild(loadingMessage);

        // JSON-Objekte aus der Antwort parsen (line-separated)
        const jsonObjects = text.split("\n").filter(line => line.trim() !== "");
        let fullResponse = "";
        for (let jsonString of jsonObjects) {
            try {
                const data = JSON.parse(jsonString);
                // Prüfe auf das neue Format: message.content
                if (data.message && data.message.content) {
                    fullResponse += data.message.content;
                }
                // Optional: Support für ältere /api/generate-Form
                else if (data.response) {
                    fullResponse += data.response;
                }
            } catch (err) {
                console.error("Fehler beim Parsen:", err, "Zeile:", jsonString);
            }
        }
        chatHistory.pushToHistory("assistant", fullResponse);
        chatHistory.saveChatHistory();

        // Antwort anzeigen
        let botMessage = document.createElement("div");
        botMessage.className = "message bot";
        botMessage.textContent = fullResponse;
        chatBox.appendChild(botMessage);
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        clearInterval(spinnerInterval);
        chatBox.removeChild(loadingMessage);
        console.error("Error fetching response:", error);
    }

    inputField.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}


async function closeonclick() {
  console.log("Schließen Button wurde gedrückt!!!");
  hideChatbot();
}

function showChatbot() {
    const container = document.getElementById("chatbot-container");
    const button = document.getElementById("chat-toggle-button");
    if (container) {
        container.style.display = "flex";
    }
    if (button) {
        button.style.display = "none";
    }
}

function hideChatbot() {
    const container = document.getElementById("chatbot-container");
    const button = document.getElementById("chat-toggle-button");
    if (container) {
        container.style.display = "none";
    }
        if (button) {
        button.style.display = "block";
    }
}
