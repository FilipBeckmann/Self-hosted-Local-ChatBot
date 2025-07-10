export class History {
    constructor(){
        this.chatHistory = [];
    }
    pushToHistory(arole, acontent){
        this.chatHistory.push({
            role: arole,
            content: String(acontent)
        })
    }
    getChatHistory(){
        return this.chatHistory;
    }
    clearChatHistory(){
        this.chatHistory = [];
    }
    saveChatHistory(){
        localStorage.setItem("chatHistory", JSON.stringify(this.chatHistory));
    }
    loadChatHistory(){
        const chatHistory = localStorage.getItem("chatHistory");
        if (chatHistory){
            this.chatHistory = JSON.parse(chatHistory);
        }
    }
    deleteChatHistory(){
        localStorage.removeItem("chatHistory");
        this.chatHistory = [];
    }
}