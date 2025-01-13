const themeToggleButton = document.getElementById("theme-toggle-button");
const deleteChatButton = document.getElementById("delete-chat-button");
const chatList = document.querySelector(".chat-list");
const typingInput = document.querySelector(".typing-input");
const sendMessageButton = document.getElementById("send-message-button");
const body = document.body;

let recognition; 
let mediaStream;

themeToggleButton.addEventListener("click", () => {
  body.classList.toggle("light_mode");

  themeToggleButton.textContent = body.classList.contains("light_mode") 
    ? "dark_mode" 
    : "light_mode";
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

const startRecognition = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech Recognition is not supported by your browser.");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = true;

  recognition.onstart = () => {
    console.log("Voice recognition started");
    document.getElementById("output").textContent = "Listening...";
};
  recognition.onresult = (event) => {
    const speechResult = event.results[event.results.length - 1][0].transcript;
    console.log("Recognized Speech:", speechResult);
    addMessage(speechResult);
    document.getElementById("output").innerText = speechResult;

  //recognition.onend = () => {
    //console.log("Voice recognition stopped");
};

fetch('/gemini', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ command: speechResult }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log("Backend Response:", data.response);
    document.getElementById("output").textContent = `Gemini says: "${data.response}"`;
    addMessage(data.response, true);
  })
  .catch((error) => console.error("Error with voice command:", error));
  document.getElementById("output").textContent = "Error processing your request.";
};

recognition.onend = () => {
  console.log("Voice recognition stopped");
  document.getElementById("output").textContent = `Error: ${event.error}`;
}

  recognition.onerror = (event) => {
    console.error("Error in recognition:", event.error);
    addMessage("Error recognizing voice input. Please try again.", true);
    document.getElementById("output").textContent = `Error: ${event.error}`;
  };

recognition.start();

const stopVoiceRecognition = () => {
    if (recognition) {
        recognition.stop();
        console.log("Voice recognition manually stopped");
        document.getElementById("output").textContent = "Voice recognition stopped.";
    }
  };

  const startVideo = () => {
    const videoElement = document.getElementById("video");
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            mediaStream = stream;
            videoElement.srcObject = stream;
            videoElement.play();
            console.log("Video started");
        })
        .catch((error) => {
            console.error("Error accessing video:", error);
            addMessage("Unable to access the camera.");
        });
}

const stopVideo = () => {
    if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
        console.log("Video manually stopped");
    }
}
    
const startAll = () => {
  startVideo();
  startRecognition();
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

document.getElementById("start-video").addEventListener("click", startVideo);
document.getElementById("start-voice").addEventListener("click", startRecognition);
document.getElementById("stop-voice").addEventListener("click", stopVoiceRecognition);
document.getElementById("stop-video").addEventListener("click", stopVideo);
document.getElementById("start-all").addEventListener("click", startAll);