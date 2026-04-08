const themeToggleBtn = document.getElementById('theme-toggle')
const searchInput = document.getElementById('search-input')
const sectorFilter = document.getElementById('sector-filter')
const sortSelect = document.getElementById('sort-select')
const stockGrid = document.getElementById('stock-grid')

let stockDataArray = []
let watchlist = []
let chartInstance = null

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode')
    if (document.body.classList.contains('dark-mode')) {
        themeToggleBtn.textContent = 'Light Mode'
    } else {
        themeToggleBtn.textContent = 'Dark Mode'
    }
})

function renderMoodGauge(dataArray) {
    const totalChange = dataArray.reduce((acc, stock) => acc + parseFloat(stock.change), 0)
    const avgChange = totalChange / dataArray.length
    
    let mood = 'Neutral'
    let color = '#aaaaaa' // gray for neutral
    
    if (avgChange > 0.5) {
        mood = 'Greed'
        color = '#008800' // explicitly hardcode green match
    } else if (avgChange < -0.5) {
        mood = 'Fear'
        color = '#cc0000' // explicitly hardcode red match
    }

    document.getElementById('mood-label').textContent = mood

    // Map avgChange from a basic -2% to 2% scale into a 0 to 100 score for pie slice sizing
    let score = ((avgChange + 2) / 4) * 100
    if (score < 5) score = 5
    if (score > 100) score = 100
    
    const remaining = 100 - score

    const ctx = document.getElementById('mood-chart')
    if (chartInstance) {
        chartInstance.destroy()
    }

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Score', 'Remaining'],
            datasets: [{
                data: [score, remaining], 
                backgroundColor: [color, '#dddddd'],
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
    })
}

function renderWatchlist() {
    const listGrid = document.getElementById('watchlist-grid')
    const portfolioLabel = document.getElementById('portfolio-value')
    
    listGrid.innerHTML = ''
    
    const totalVal = watchlist.reduce((acc, item) => acc + parseFloat(item.price), 0)
    portfolioLabel.textContent = `Portfolio Value: ₹${totalVal.toFixed(2)}`
    
    watchlist.map(item => {
        const div = document.createElement('div')
        div.className = 'watchlist-card'
        
        const text = document.createElement('span')
        text.textContent = `${item.ticker} - ₹${item.price}`
        
        const remBtn = document.createElement('button')
        remBtn.textContent = 'x'
        remBtn.addEventListener('click', () => {
            watchlist = watchlist.filter(w => w.ticker !== item.ticker)
            processData()
            renderWatchlist()
        })
        
        div.appendChild(text)
        div.appendChild(remBtn)
        listGrid.appendChild(div)
    })
}

function renderStocks(dataArray) {
    stockGrid.innerHTML = ''
    dataArray.map(stock => {
        const card = document.createElement('div')
        card.className = 'card'
        
        const title = document.createElement('h3')
        title.textContent = stock.name
        
        const symbol = document.createElement('p')
        symbol.textContent = stock.ticker
        
        const price = document.createElement('div')
        price.className = 'stock-price'
        price.textContent = `₹${stock.price}`
        
        const change = document.createElement('div')
        change.className = 'stock-change'
        const changeVal = parseFloat(stock.change).toFixed(2)
        
        if (changeVal > 0) {
            change.textContent = `+${changeVal}%`
            change.classList.add('green-text')
        } else {
            change.textContent = `${changeVal}%`
            change.classList.add('red-text')
        }
        
        const sector = document.createElement('div')
        sector.className = 'stock-sector'
        sector.textContent = stock.sector
        
        const isFav = watchlist.find(w => w.ticker === stock.ticker)
        
        const favBtn = document.createElement('button')
        if (isFav) {
            favBtn.textContent = 'Remove'
            favBtn.className = 'fav-btn favorited'
        } else {
            favBtn.textContent = 'Add to Watchlist'
            favBtn.className = 'fav-btn'
        }
        
        favBtn.addEventListener('click', () => {
            if (isFav) {
                watchlist = watchlist.filter(w => w.ticker !== stock.ticker)
            } else {
                watchlist = [...watchlist, { ticker: stock.ticker, price: stock.price }]
            }
            renderWatchlist()
            processData()
        })
        
        card.appendChild(title)
        card.appendChild(symbol)
        card.appendChild(price)
        card.appendChild(change)
        card.appendChild(sector)
        card.appendChild(favBtn)
        
        stockGrid.appendChild(card)
    })
}

function processData() {
    let filteredData = stockDataArray.filter(stock => {
        const searchVal = searchInput.value.toLowerCase()
        const matchName = stock.name.toLowerCase().includes(searchVal)
        const matchTicker = stock.ticker.toLowerCase().includes(searchVal)
        const matchSector = sectorFilter.value === 'All' || stock.sector === sectorFilter.value
        return (matchName || matchTicker) && matchSector
    })

    filteredData = filteredData.sort((a, b) => {
        if (sortSelect.value === 'name') {
            return a.name.localeCompare(b.name)
        }
        if (sortSelect.value === 'price-asc') {
            return parseFloat(a.price) - parseFloat(b.price)
        }
        if (sortSelect.value === 'price-desc') {
            return parseFloat(b.price) - parseFloat(a.price)
        }
        return 0
    })

    renderStocks(filteredData)
}

searchInput.addEventListener('input', processData)
sectorFilter.addEventListener('change', processData)
sortSelect.addEventListener('change', processData)

async function startApp() {
    try {
        const data = await fetchAllStocks()
        const newsItems = await fetchNews()
        
        const newsContainer = document.getElementById('news-feed')
        newsItems.slice(0, 5).map(article => {
            const div = document.createElement('div')
            div.className = 'news-item'
            
            const title = document.createElement('a')
            title.href = article.link
            title.target = "_blank"
            title.textContent = article.title
            
            div.appendChild(title)
            newsContainer.appendChild(div)
        })
        
        stockDataArray = STOCKS.map(stock => {
            const apiStockData = data[stock.ticker]
            let currentPrice = '0.00'
            let percentChange = '0.00'
            
            if (apiStockData && apiStockData.close) {
                currentPrice = apiStockData.close
                percentChange = apiStockData.percent_change
            }
            
            return {
                ticker: stock.ticker,
                name: stock.name,
                sector: stock.sector,
                price: parseFloat(currentPrice).toFixed(2),
                change: parseFloat(percentChange).toFixed(2)
            }
        })
        
        renderMoodGauge(stockDataArray)
        processData()
    } catch (error) {
        stockGrid.innerHTML = '<p>Error loading data.</p>'
        console.error(error)
    }
}

startApp()