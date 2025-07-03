
async function sendMessage() {
    let inputField = document.getElementById("userInput");
    let message = inputField.value.trim();
    if (message === "") return;
    let chatBox = document.getElementById("chatBox");
    let userMessage = document.createElement("div");
    userMessage.className = "message user";
    userMessage.textContent = message;
    chatBox.appendChild(userMessage);
    try {
        let response = await fetch("http://10.10.2.69:8000/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3",
                prompt: message
            })
        });
        const text = await response.text(); // Read as text first
        console.log("Raw response:", text);
        // Split the response into separate JSON objects (assuming they're space-separated)
        const jsonObjects = text.split("\n").filter(line => line.trim() !== "");
        let fullResponse = "";
        for (let jsonString of jsonObjects) {
            try {
                const ldata = JSON.parse(jsonString);
                fullResponse += ldata.response || "";
            } catch (jsonError) {
                console.error("Fehler beim Parsen der Antwort:", jsonError);
            }
        }
        // Display the full response
        console.log("Bot full response:", fullResponse);
        // Create and append bot message
        let botMessage = document.createElement("div");
        botMessage.className = "message bot";
        botMessage.textContent = fullResponse;
        chatBox.appendChild(botMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
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
