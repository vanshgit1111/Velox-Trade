
var modeBtn = document.getElementById("mode-btn");
var searchBox = document.getElementById("search-box");
var sectorDropdown = document.getElementById("sector-dropdown");
var sortDropdown = document.getElementById("sort-dropdown");
var cardsContainer = document.getElementById("cards-container");

var allStocks = [];
var myWatchlist = [];
var myChart = null;
modeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        modeBtn.textContent = "Light Mode";
    } else {
        modeBtn.textContent = "Dark Mode";
    }
});

function showMoodGauge(stocks) {
    var total = 0;
    for (var i = 0; i < stocks.length; i++) {
        total = total + parseFloat(stocks[i].change);
    }
    var avg = total / stocks.length;

    var mood = "Neutral";
    var moodColor = "#aaaaaa";

    if (avg > 0.5) {
        mood = "Greed";
        moodColor = "#008800";
    } else if (avg < -0.5) {
        mood = "Fear";
        moodColor = "#cc0000";
    }

    document.getElementById("mood-text").textContent = mood;
    var score = ((avg + 2) / 4) * 100;
    if (score < 5) score = 5;
    if (score > 100) score = 100;
    var leftover = 100 - score;

    var canvas = document.getElementById("mood-chart");
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: ["Score", "Rest"],
            datasets: [{
                data: [score, leftover],
                backgroundColor: [moodColor, "#dddddd"],
                borderWidth: 0
            }]
        },
        options: {
            rotation: -90,
            circumference: 180,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            }
        }
    });
}
function showWatchlist() {
    var area = document.getElementById("watchlist-area");
    var valueLabel = document.getElementById("total-value");

    area.innerHTML = "";
    var total = 0;
    for (var i = 0; i < myWatchlist.length; i++) {
        total = total + parseFloat(myWatchlist[i].price);
    }
    valueLabel.textContent = "Portfolio Value: ₹" + total.toFixed(2);
    for (var i = 0; i < myWatchlist.length; i++) {
        var item = myWatchlist[i];

        var div = document.createElement("div");
        div.className = "watchlist-item";

        var txt = document.createElement("span");
        txt.textContent = item.ticker + " - ₹" + item.price;

        var removeBtn = document.createElement("button");
        removeBtn.textContent = "x";
        removeBtn.setAttribute("data-ticker", item.ticker);
        removeBtn.addEventListener("click", function () {
            var tickerToRemove = this.getAttribute("data-ticker");
            var newList = [];
            for (var j = 0; j < myWatchlist.length; j++) {
                if (myWatchlist[j].ticker !== tickerToRemove) {
                    newList.push(myWatchlist[j]);
                }
            }
            myWatchlist = newList;
            filterAndShow();
            showWatchlist();
        });

        div.appendChild(txt);
        div.appendChild(removeBtn);
        area.appendChild(div);
    }
}
function showStockCards(stocks) {
    cardsContainer.innerHTML = "";

    for (var i = 0; i < stocks.length; i++) {
        var stock = stocks[i];

        var card = document.createElement("div");
        card.className = "card";
        var heading = document.createElement("h3");
        var nameSpan = document.createElement("span");
        nameSpan.textContent = stock.name;
        nameSpan.className = "stock-name";
        var tickerSpan = document.createElement("span");
        tickerSpan.textContent = stock.ticker;
        tickerSpan.className = "ticker-label";
        heading.appendChild(nameSpan);
        heading.appendChild(tickerSpan);

      
        var priceDiv = document.createElement("div");
        priceDiv.className = "price";
        priceDiv.textContent = "₹" + stock.price;


        var changeDiv = document.createElement("div");
        changeDiv.className = "change";
        var changeNum = parseFloat(stock.change).toFixed(2);
        if (changeNum > 0) {
            changeDiv.textContent = "+" + changeNum + "%";
            changeDiv.classList.add("green");
        } else {
            changeDiv.textContent = changeNum + "%";
            changeDiv.classList.add("red");
        }

        var sectorDiv = document.createElement("div");
        sectorDiv.className = "sector-tag";
        sectorDiv.textContent = stock.sector;

        
        var isInWatchlist = false;
        for (var j = 0; j < myWatchlist.length; j++) {
            if (myWatchlist[j].ticker === stock.ticker) {
                isInWatchlist = true;
                break;
            }
        }

        var btn = document.createElement("button");
        btn.className = "add-btn";
        if (isInWatchlist) {
            btn.textContent = "Remove";
            btn.classList.add("remove");
        } else {
            btn.textContent = "Add to Watchlist";
        }

        btn.setAttribute("data-ticker", stock.ticker);
        btn.setAttribute("data-price", stock.price);
        btn.addEventListener("click", function () {
            var t = this.getAttribute("data-ticker");
            var p = this.getAttribute("data-price");


            var found = false;
            for (var k = 0; k < myWatchlist.length; k++) {
                if (myWatchlist[k].ticker === t) {
                    found = true;
                    break;
                }
            }

            if (found) {
                var newList = [];
                for (var k = 0; k < myWatchlist.length; k++) {
                    if (myWatchlist[k].ticker !== t) {
                        newList.push(myWatchlist[k]);
                    }
                }
                myWatchlist = newList;
            } else {
                myWatchlist.push({ ticker: t, price: p });
            }
            showWatchlist();
            filterAndShow();
        });

        card.appendChild(heading);
        card.appendChild(priceDiv);
        card.appendChild(changeDiv);
        card.appendChild(sectorDiv);
        card.appendChild(btn);

        cardsContainer.appendChild(card);
    }
}


function filterAndShow() {
    var searchText = searchBox.value.toLowerCase();
    var sectorVal = sectorDropdown.value;
    var sortVal = sortDropdown.value;
    var filtered = [];
    for (var i = 0; i < allStocks.length; i++) {
        var s = allStocks[i];
        var nameMatch = s.name.toLowerCase().indexOf(searchText) !== -1;
        var tickerMatch = s.ticker.toLowerCase().indexOf(searchText) !== -1;
        var sectorMatch = (sectorVal === "All") || (s.sector === sectorVal);

        if ((nameMatch || tickerMatch) && sectorMatch) {
            filtered.push(s);
        }
    }
    if (sortVal === "name") {
        filtered.sort(function (a, b) {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
    } else if (sortVal === "price-low") {
        filtered.sort(function (a, b) {
            return parseFloat(a.price) - parseFloat(b.price);
        });
    } else if (sortVal === "price-high") {
        filtered.sort(function (a, b) {
            return parseFloat(b.price) - parseFloat(a.price);
        });
    }

    showStockCards(filtered);
}


searchBox.addEventListener("input", filterAndShow);
sectorDropdown.addEventListener("change", filterAndShow);
sortDropdown.addEventListener("change", filterAndShow);
async function startApp() {
    try {
        var data = await getStockData();
        var news = await getNews();
        var newsArea = document.getElementById("news-list");
        newsArea.innerHTML = "";
        for (var i = 0; i < news.length && i < 5; i++) {
            var newsDiv = document.createElement("div");
            newsDiv.className = "news-item";

            var link = document.createElement("a");
            link.href = news[i].url;
            link.target = "_blank";
            link.textContent = news[i].headline;

            newsDiv.appendChild(link);
            newsArea.appendChild(newsDiv);
        }


        allStocks = [];
        for (var i = 0; i < stockList.length; i++) {
            var s = stockList[i];
            var apiData = data[s.ticker];
            var currentPrice = "0.00";
            var changePercent = "0.00";

            if (apiData && apiData.close) {
                currentPrice = apiData.close;
                changePercent = apiData.percent_change;
            }

            allStocks.push({
                ticker: s.ticker,
                name: s.name,
                sector: s.sector,
                price: parseFloat(currentPrice).toFixed(2),
                change: parseFloat(changePercent).toFixed(2)
            });
        }

        showMoodGauge(allStocks);
        filterAndShow();
    } catch (err) {
        cardsContainer.innerHTML = "<p>Error loading data. Check console.</p>";
        console.log("Error:", err);
    }
}

startApp();