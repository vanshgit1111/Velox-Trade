const api_key = "d8678aab24864d44af4d6b2520712cc3"

const STOCKS = [
    { ticker: 'AAPL', name: 'Apple Inc.', sector: 'IT' },
    { ticker: 'MSFT', name: 'Microsoft', sector: 'IT' },
    { ticker: 'GOOG', name: 'Alphabet', sector: 'IT' },
    { ticker: 'XOM', name: 'ExxonMobil', sector: 'Energy' },
    { ticker: 'CVX', name: 'Chevron', sector: 'Energy' },
    { ticker: 'JPM', name: 'JPMorgan', sector: 'Banking' },
    { ticker: 'BAC', name: 'Bank of America', sector: 'Banking' },
    { ticker: 'WFC', name: 'Wells Fargo', sector: 'Banking' }
]

async function fetchAllStocks() {
    const symbols = STOCKS.map(stock => stock.ticker).join(',')
    const url = `https://api.twelvedata.com/quote?symbol=${symbols}&apikey=${api_key}`
    const response = await fetch(url)
    const data = await response.json()
    return data
}

async function fetchNews() {
    const url = `https://api.rss2json.com/v1/api.json?rss_url=https://economictimes.indiatimes.com/markets/rssfeeds/2146842.cms`
    const response = await fetch(url)
    const data = await response.json()
    return data.items || []
}
