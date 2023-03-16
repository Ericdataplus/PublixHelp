const submitBtn = document.querySelector("#submit");
const passwordInput = document.querySelector("#password");
const mainChat = document.querySelector("#main-chat");
const password = "shrimpqualia";

const apiKeyInput = document.querySelector("#api-key");
const rememberKeyCheckbox = document.querySelector("#remember-key");
const inputBox = document.querySelector("#input-box");
const gptResponse = document.querySelector("#gpt-response");
const loadingBar = document.querySelector("#loading-bar");

const prePrompt = `As an AI assistant, I'm here to help you find items in the Publix store based on the following layout:

Aisle 1: canned fruits, juices, produce, sports drinks
Aisle 2: international foods, kosher, pasta, rice/dry beans, sauces/mixes
Aisle 3: breads, canned vegetables, canned meats, peanut butter/jelly, soups
Aisle 4: baby food, baby needs, cookies, crackers, disposable diapers
Aisle 5: cake mixes, condiments, oil/shortening, spices/extracts, sugar
Aisle 6: canned milk, cereals, coffee/tea, hot cereal, syrups
Aisle 7: air filters, batteries, charcoal, light bulbs, pet supplies
Aisle 8: nuts, popcorn, potato chips, soft drinks, specialty drinks
Aisle 9: candies, greeting cards, magazines/books, school supplies, toys
Aisle 10: frozen dinners, frozen meats, frozen potatoes, frozen seafood, frozen vegetables
Aisle 11: frozen breakfast, frozen desserts, frozen foods, ice cream, novelties
Aisle 12: bagged ice, cold beer, frozen pizzas, wine, wine coolers
Aisle 13: feminine products, foil/wax paper, paper products, picnic supplies, plastic bags
Aisle 14: air fresheners, brooms/mops, cleaners, insecticides, laundry detergent
Aisle 15: bath soap, cosmetics, first aid, hair care, toothpaste
Aisle 16: adult nutrients, cheese, water, vitamins, yogurt

Other sections:
- Deli section
- Produce section
- Meat section
- Cold milk near Aisle 16
- Protein powder in Aisle 16

When you ask me about the location of one or more items, I will provide you with the corresponding aisle(s) so you can quickly guide the customer.

Customer question:`; // Add your prePrompt content here

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