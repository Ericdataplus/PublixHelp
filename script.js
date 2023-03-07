const submitKeyBtn = document.querySelector("#submit-key");
const apiKeyInput = document.querySelector("#api-key");
const rememberKeyCheckbox = document.querySelector("#remember-key");
const mainChat = document.querySelector("#main-chat");
const inputBox = document.querySelector("#input-box");
const gptResponse = document.querySelector("#gpt-response");

const prePrompt = `
I work at publix and these are the isles, when a customer asks me where something is I want to ask you to tell me to give them the answer the quickest I can. 

These are the isles

ailse 1 - canned fruits, juices produce sports drinks
ailse 2 - international foods, kosher, pasta, rice/dry beans, sauces/mixes
aisle 3 - breads, can vegetables, canned meats, peanut butter/jelly soups
aisle 4 - baby food, baby needs, cookies, crackers, disposable diapers
aisle 5 - cake mixes, condiments, oil/shortening, spices/extracts, sugar
aisle 6 - canned milk, cereals, coffee/tea, hot cereal, syrups
aisle 7 - air filters, batteries, charcoal, light bulbs, pet supplies
aisle 8 - nuts, popcorn, potato chips, soft drinks, specialy drinks
aisle 9 - candies, greeting cards, magazines/books, school supplies, toys
aisle 10 - frozen dinners, frozen meats, frozen potatoes, frozen seafood, frozen vegetables
aisle 11 - frozen breakfast, frozen desserts, frozen foods, ice cream,  novelties
aisle 12 - bagged ice, cold beer, frozen pizzas, wine, wine coolers
aisle 13 - feminine product, foil/waxpaper, paper products, picnic supplies plastic bags
aisle 14 - air fresheners, brooms/mops, cleaners, insecticides, laundry detergent
aisle 15 - bath soap, cosmetics, first aid, hair care, toothpaste
aisle 16 - adult nutrients, cheese, water, vitamins, yogurt

then there's a deli section, a produce section and a meat section and the cold milk is near aisle 16 and the protein powder is in aisle 16

those are where the stuff is and when the customer ask me where something is I ask you and you help me point the customer in the right direction sooner by always including the aisle the item in question is in the answer so I can tell the customer. If I get asked where two different items are you're able to give both or more aisle answers in the response telling which is where.

customer question:`;

submitKeyBtn.addEventListener("click", makeApiCall);
inputBox.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    makeApiCall();
  }
});

function makeApiCall() {
  const apiKey = apiKeyInput.value;
  if (rememberKeyCheckbox.checked) {
    localStorage.setItem("apiKey", apiKey);
    localStorage.setItem("apiKeyExpiration", Date.now() + 24 * 60 * 60 * 1000);
  }

  fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      prompt: prePrompt + inputBox.value,
      model: "text-davinci-003",
      max_tokens: 100
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
    })
    .catch(error => {
      console.error(error);
    });
}

// Check if there's a stored API key and check if it's still valid
const storedApiKey = localStorage.getItem("apiKey");
const apiKeyExpiration = localStorage.getItem("apiKeyExpiration");
if (storedApiKey && apiKeyExpiration && apiKeyExpiration > Date.now()) {
  apiKeyInput.value = storedApiKey;
  rememberKeyCheckbox.checked = true;
  mainChat.style.display = "block";
}
