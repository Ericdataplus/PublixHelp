const submitBtn = document.querySelector("#submit");
const passwordInput = document.querySelector("#password");
const mainChat = document.querySelector("#main-chat");
const password = "shrimpqualia";

const apiKeyInput = document.querySelector("#api-key");
const rememberKeyCheckbox = document.querySelector("#remember-key");
const inputBox = document.querySelector("#input-box");
const gptResponse = document.querySelector("#gpt-response");
const loadingBar = document.querySelector("#loading-bar");

const prePrompt = `...`; // Add your prePrompt content here

passwordInput.addEventListener("input", function () {
  if (passwordInput.value.length > 0) {
    apiKeyInput.parentElement.style.display = "none";
  } else {
    apiKeyInput.parentElement.style.display = "block";
  }
});

submitBtn.addEventListener("click", function () {
  if (passwordInput.value === password) {
    mainChat.style.display = "block";
    submitCredentials();
  } else {
    alert("Incorrect password. Please try again.");
  }
});

inputBox.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    makeApiCall();
  }
});

function submitCredentials() {
  const apiKey = apiKeyInput.value;
  if (rememberKeyCheckbox.checked) {
    localStorage.setItem("apiKey", apiKey);
  }
}

function makeApiCall() {
  loadingBar.style.display = "block";
  const apiKey = apiKeyInput.value;

  fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      prompt: prePrompt + inputBox.value,
      model: "text-davinci-003",
      max_tokens: 100,
      temperature: 0.5
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("API call failed");
      }
      return response.json();
    })
    .then(data => {
      gptResponse.innerText = data.choices[0].text;
      inputBox.value = "";
      gptResponse.style.display = "block";
      loadingBar.style.display = "none";
    })
    .catch(error => {
      console.error(error);
      loadingBar.style.display = "none";
    });
}

// Check if there's a stored API key
const storedApiKey = localStorage.getItem("apiKey");
if (storedApiKey) {
  apiKeyInput.value = storedApiKey;
  rememberKeyCheckbox.checked = true;
  mainChat.style.display = "block";
}

const askQuestionBtn = document.querySelector("#ask-question");

// ...

askQuestionBtn.addEventListener("click", function (event) {
    event.preventDefault();
    makeApiCall();
});