const API_URL = "https://chatbot-mpl-vrc.vercel.app/api/chat";

const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// ------------------------------
// Add Chat Message
// ------------------------------
function addMessage(text, sender) {
  const div = document.createElement("div");

  div.className = `flex items-start gap-3 ${
    sender === "user" ? "justify-end" : ""
  } animate-[fadeIn_.3s_ease-out]`;

  const bubbleStyleBot =
    "bg-white/15 backdrop-blur-md border border-white/20 text-white shadow-lg";

  const bubbleStyleUser =
    "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg";

  div.innerHTML = `
    ${
      sender === "bot"
        ? `<img src="assets/mpl.png" class="w-10 h-10 rounded-full shadow">`
        : ""
    }

    <div class="px-4 py-3 rounded-2xl max-w-[75%] ${
      sender === "user" ? bubbleStyleUser : bubbleStyleBot
    }">${text}</div>

    ${
      sender === "user"
        ? `<img src="assets/user.jpg" class="w-10 h-10 rounded-full shadow">`
        : ""
    }
  `;

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
  const div = document.createElement("div");
  div.id = "typing";
  div.className = "flex items-start gap-3 animate-[fadeIn_.3s_ease-out]";

  div.innerHTML = `
    <img src="assets/mpl.png" class="w-10 h-10 rounded-full shadow">
    <div class="px-4 py-3 rounded-2xl bg-white/15 backdrop-blur-md 
      border border-white/20 text-gray-100 flex gap-2 shadow-lg">
      <span class="animate-bounce">●</span>
      <span class="animate-bounce delay-150">●</span>
      <span class="animate-bounce delay-300">●</span>
    </div>
  `;

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById("typing");
  if (t) t.remove();
}

// ------------------------------
// Send Message
// ------------------------------
async function sendMessage() {
  const msg = input.value.trim();
  if (!msg) return;

  addMessage(msg, "user");
  input.value = "";

  showTyping();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });

    const data = await response.json();
    removeTyping();

    // Jika API mengembalikan error → tampilkan di bubble
    if (!response.ok) {
      addMessage("⚠ " + data.error, "bot");
      return;
    }

    addMessage(data.answer, "bot");

  } catch (err) {
    removeTyping();
    addMessage("⚠ Tidak dapat menghubungi server", "bot");
  }
}

// ------------------------------
// Events
// ------------------------------
sendBtn.onclick = sendMessage;

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
