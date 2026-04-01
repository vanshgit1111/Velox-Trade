const API_KEY = "56ab54b6441d463ea8ea7494e141045d"; 

async function searchStock() {
  const symbol = document.getElementById("symbolInput").value.toUpperCase();
  const resultDiv = document.getElementById("result");

  if (!symbol) {
    resultDiv.innerHTML = " Please enter a stock symbol.";
    return;
  }

  resultDiv.innerHTML = " Loading...";

  try {
    const url = `https://api.twelvedata.com/time_series?apikey=${API_KEY}&symbol=${symbol}&interval=1min&outputsize=5`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "error") {
      resultDiv.innerHTML = " Invalid stock symbol or data not available.";
      return;
    }

    if (!data.values || data.values.length === 0) {
      resultDiv.innerHTML = " No data found for this stock.";
      return;
    }

    const latest = data.values[0];

    resultDiv.innerHTML = `
      <h3>${symbol}</h3>
      <p><strong>Datetime:</strong> ${latest.datetime}</p>
      <p><strong>Open:</strong> ${latest.open}</p>
      <p><strong>High:</strong> ${latest.high}</p>
      <p><strong>Low:</strong> ${latest.low}</p>
      <p><strong>Close:</strong> ${latest.close}</p>
    `;

  } catch (error) {
    resultDiv.innerHTML = " Something went wrong. Try again.";
    console.error(error);
  }
}