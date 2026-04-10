# 📈 VeloxTrade — Stock Market Intelligence Dashboard

A real-time stock market dashboard built with Vanilla HTML, CSS & JavaScript.

🔗 [Live Demo](https://velox-flax.vercel.app/)

---

## 🛠️ Tech Stack
- HTML, CSS, Vanilla JavaScript
- Twelve Data API (live stock data)
- Chart.js (mood gauge + price charts)

---

## ✨ Features
-  Live stock cards with prices and % change
-  Market Mood Indicator — Fear / Neutral / Greed
-  Search, Filter and Sort stocks using Array HOFs
-  Personal Watchlist with virtual portfolio value
-  Latest market news
-  Dark / Light mode toggle
-  Fully responsive — mobile, tablet, desktop

---

## ⚠️ Known Limitations

- **API Restrictions** — Twelve Data's free tier does not fully support
  Indian NSE stocks, so some data is fetched from US markets instead
- **Limited Stocks** — Free plan restricts the number of stocks that
  can be fetched in a single API call
- **Slow Load Time** — API calls take a few seconds to respond on the
  free tier, so a small delay on page load is expected

---

## 📂 Project Structure
Velox-Trade/
├── index.html
├── style.css
├── app.js
├── api.js
├── ui.js
└── watchlist.js

---

## 🚀 How to Run
1. Clone the repo
2. Get a free API key from [twelvedata.com](https://twelvedata.com)
3. Add your key in `api.js`
4. Open `index.html` in your browser

---

## 👨‍💻 Author
**Vansh Chaturvedi** — [@vanshgit1111](https://github.com/vanshgit1111)
