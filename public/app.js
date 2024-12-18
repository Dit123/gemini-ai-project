const themeToggleButton = document.getElementById("theme-toggle-button");
const deleteChatButton = document.getElementById("delete-chat-button");
const chatList = document.querySelector(".chat-list");
const typingInput = document.querySelector(".typing-input");
const sendMessageButton = document.getElementById("send-message-button");
const body = document.body;


themeToggleButton.addEventListener("click", () => {
  body.classList.toggle("light_mode");

  
  if (body.classList.contains("light_mode")) {
    themeToggleButton.textContent = "dark_mode";
  } else {
    themeToggleButton.textContent = "light_mode";
  }
});


const addMessage = (messageText, isIncoming = false) => {
  const message = document.createElement("div");
  message.className = `message ${isIncoming ? "incoming" : ""}`;
  
  message.innerHTML = `
    <div class="message-content">
      <div class="avatar">${isIncoming ? "🤖" : "🧑"}</div>
      <p class="text">${messageText}</p>
    </div>
  `;

  chatList.appendChild(message);
  chatList.scrollTop = chatList.scrollHeight; 
};


sendMessageButton.addEventListener("click", (event) => {
  event.preventDefault();

  const messageText = typingInput.value.trim();
  if (messageText) {
    addMessage(messageText);
    typingInput.value = ""; 

    setTimeout(() => {
      addMessage("I'm here to assist you! 😊", true); 
    }, 1000);
  }
});


deleteChatButton.addEventListener("click", () => {
  chatList.innerHTML = ""; 
});
