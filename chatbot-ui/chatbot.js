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
                const ldata = JSON.parse(jsonString);
                fullResponse += ldata.response || "";
            } catch (jsonError) {
                console.error("Fehler beim Parsen der Antwort:", jsonError);
            }
        }

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
