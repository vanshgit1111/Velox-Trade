
var myApiKey = "";
var newsKey = "";

if (typeof CONFIG !== "undefined") {
    myApiKey = CONFIG.TWELVEDATA_API_KEY;
    newsKey = CONFIG.FINNHUB_API_KEY;
}

var stockList = [
    { ticker: "AAPL", name: "Apple Inc.", sector: "IT" },
    { ticker: "MSFT", name: "Microsoft", sector: "IT" },
    { ticker: "GOOG", name: "Alphabet", sector: "IT" },
    { ticker: "XOM", name: "ExxonMobil", sector: "Energy" },
    { ticker: "CVX", name: "Chevron", sector: "Energy" },
    { ticker: "JPM", name: "JPMorgan", sector: "Banking" },
    { ticker: "BAC", name: "Bank of America", sector: "Banking" },
    { ticker: "WFC", name: "Wells Fargo", sector: "Banking" }
];

async function getStockData() {
    var tickers = "";
    for (var i = 0; i < stockList.length; i++) {
        tickers += stockList[i].ticker;
        if (i < stockList.length - 1) {
            tickers += ",";
        }
    }
    var url = "https://api.twelvedata.com/quote?symbol=" + tickers + "&apikey=" + myApiKey;
    var response = await fetch(url);
    var data = await response.json();
    return data;
}

async function getNews() {
    var url = "https://finnhub.io/api/v1/news?category=general&token=" + newsKey;
    var response = await fetch(url, { cache: "no-store" });
    var data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
        return [];
    }
    var shuffled = data.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }
    return shuffled.slice(0, 5);
}
