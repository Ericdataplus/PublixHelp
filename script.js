// DOM elements
const submitBtn = document.querySelector("#submit");
const apiKeyInput = document.querySelector("#api-key");
const inputBox = document.querySelector("#input-box");
const gptResponse = document.querySelector("#gpt-response");
const loadingBar = document.querySelector("#loading-bar");
const askQuestionBtn = document.querySelector("#ask-question");
const mainChat = document.querySelector("#main-chat");


// Event listeners
submitBtn.addEventListener("click", handleSubmit);
inputBox.addEventListener("keydown", handleKeyDown);
askQuestionBtn.addEventListener("click", askQuestion);

// Event handler functions
function handleSubmit(event) {
  event.preventDefault();

  // Enable input box and Ask Question button
  inputBox.disabled = false;
  askQuestionBtn.disabled = false;
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
function makeApiCall() {
  loadingBar.style.display = "block";
  const apiKey = apiKeyInput.value;

  // Add your preprompt information here
  const preprompt = `
  As an AI assistant, I'm here to help you find items in the Publix store based on the following layout:

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
  
  Customer question:
`;

  fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      prompt: preprompt + "\n\n" + inputBox.value,
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
