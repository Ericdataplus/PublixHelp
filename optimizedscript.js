// DOM elements
const elements = {
  submitBtn: document.querySelector("#submit"),
  passwordInput: document.querySelector("#password"),
  mainChat: document.querySelector("#main-chat"),
  apiKeyInput: document.querySelector("#api-key"),
  rememberKeyCheckbox: document.querySelector("#remember-key"),
  inputBox: document.querySelector("#input-box"),
  gptResponse: document.querySelector("#gpt-response"),
  loadingBar: document.querySelector("#loading-bar"),
  askQuestionBtn: document.querySelector("#ask-question")
};

const password = "shrimpqualia";
const prePrompt = `...`; // Add your prePrompt content here

// Event listeners
elements.passwordInput.addEventListener("input", handlePasswordInput);
elements.submitBtn.addEventListener("click", handleSubmit);
elements.inputBox.addEventListener("keydown", handleKeyDown);
elements.askQuestionBtn.addEventListener("click", askQuestion);

// Event handler functions
function handlePasswordInput() {
  elements.apiKeyInput.parentElement.style.display = elements.passwordInput.value.length > 0 ? "none" : "block";
}

function handleSubmit() {
  if (elements.passwordInput.value === password) {
    elements.mainChat.style.display = "block";
    submitCredentials();
  } else {
    alert("Incorrect password. Please try again.");
  }
}

function handleKeyDown(event) {
  if (event.key === "Enter") {
    makeApiCall();
  }
}

function askQuestion(event) {
  event.preventDefault();
  makeApiCall();
}

// Helper functions
function submitCredentials() {
  const apiKey = elements.apiKeyInput.value;
  if (elements.rememberKeyCheckbox.checked) {
    localStorage.setItem("apiKey", apiKey);
  }
}

async function makeApiCall() {
  elements.loadingBar.style.display = "block";
  const apiKey = elements.apiKeyInput.value;

  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt: prePrompt + elements.inputBox.value,
        model: "text-davinci-003",
        max_tokens: 100,
        temperature: 0.5
      })
    });

    if (!response.ok) {
      throw new Error("API call failed");
    }

    const data = await response.json();
    elements.gptResponse.innerText = data.choices[0].text;
    elements.inputBox.value = "";
    elements.gptResponse.style.display = "block";
    elements.loadingBar.style.display = "none";
  } catch (error) {
    console.error(error);
    elements.loadingBar.style.display = "none";
  }
}

// Check for stored API key
const storedApiKey = localStorage.getItem("apiKey");
if (storedApiKey) {
  elements.apiKeyInput.value = storedApiKey;
  elements.rememberKeyCheckbox.checked = true;
  elements.mainChat.style.display = "block";
}
