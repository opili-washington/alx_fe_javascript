
const quotes = [
    { text: "The only way to do great work is to love what you do.", category: "motivation" },
    {  text: "Happiness is not something ready-made. It comes from your own actions.", category: "happiness" },
    { text: "Talk is cheap. Show me the code.", category: "programming" },
    { text: "Life is what happens when you're busy making other plans.", category: "life" },
    { text: "Why don’t scientists trust atoms? Because they make up everything.", category: "humor" },
  ];
 
  const btn = document.getElementById("newQuote")
  const btn1 = document.getElementById("newQuote")
  

  function showRandomQuote(){
    const quoteDisplay = document.getElementById("quoteDisplay")
   const index = Math.floor(Math.random()*quotes.length)
   const object = quotes[index]
   quoteDisplay.textContent = ` ${object.text} ${object.category}`
  }

  function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      saveQuotes(); // Save to local storage
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
      alert("Quote added successfully!");
    } else {
      alert("Please fill in both fields.");
    }
  }
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);

  showRandomQuote();

  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  function loadQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
      quotes = JSON.parse(storedQuotes);
    }
  }

  loadQuotes();

  function exportQuotes() {
    const dataStr = JSON.stringify(quotes);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "quotes.json";
    link.click();
  }

  function importFromJsonFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const importedQuotes = JSON.parse(e.target.result);
      quotes = importedQuotes;
      saveQuotes();
      alert("Quotes imported successfully!");
    };
    reader.readAsText(file);
  }

  function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    const filter = document.getElementById("categoryFilter");
    filter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
      filter.innerHTML += `<option value="${category}">${category}</option>`;
    });
  }

  function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = filteredQuotes.map(quote => `<p>"${quote.text}"</p><small>— ${quote.category}</small>`).join("");
  }



  function saveFilterPreference() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory);
  }
  
  function loadFilterPreference() {
    const selectedCategory = localStorage.getItem("selectedCategory") || "all";
    document.getElementById("categoryFilter").value = selectedCategory;
    filterQuotes();
  }
  
  // Call these functions on page load
  loadFilterPreference();
  populateCategories();

  async function fetchQuotesFromServer() {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverQuotes = await response.json();
    quotes = serverQuotes.map(post => ({ text: post.title, category: "Server" }));
    saveQuotes();
    populateCategories();
    filterQuotes();
  }

setInterval(fetchQuotesFromServer, 60000); // Sync every 60 seconds

function resolveConflicts(serverQuotes, localQuotes) {
  // Simple strategy: Server data takes precedence
  return serverQuotes;
}