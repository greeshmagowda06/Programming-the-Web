const quotes = [
  "The best way to predict the future is to invent it.",
  "Do one thing every day that scares you.",
  "Dream big. Work hard. Stay humble.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "Happiness depends upon ourselves.",
  "Your limitation—it’s only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones."
];

const quoteBox = document.getElementById("quote-box");
const newQuoteBtn = document.getElementById("new-quote-btn");

function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

newQuoteBtn.addEventListener("click", () => {

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const newQuote = quotes[randomIndex];

  quoteBox.textContent = "";

  const quoteElement = document.createElement("p");
  quoteElement.textContent = newQuote;
  quoteElement.style.color = randomColor();

  quoteBox.appendChild(quoteElement);
});
