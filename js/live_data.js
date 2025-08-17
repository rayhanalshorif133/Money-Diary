const API = 'https://bd.bullbd.com/shares/ORIONINFU';

const FALLBACK = {
    "buy": [
        { "price": 469.5, "volume": 106 },
        { "price": 466.4, "volume": 10 },
        { "price": 466.3, "volume": 255 },
        { "price": 466.1, "volume": 780 },
        { "price": 466, "volume": 720 },
        { "price": 465.1, "volume": 50 },
        { "price": 465, "volume": 695 },
        { "price": 464.8, "volume": 300 },
        { "price": 463.1, "volume": 250 },
        { "price": 463, "volume": 1109 }
    ],
    "sell": [
        { "price": 469.7, "volume": 20 },
        { "price": 469.8, "volume": 160 },
        { "price": 469.9, "volume": 110 },
        { "price": 470, "volume": 881 },
        { "price": 470.3, "volume": 1 },
        { "price": 470.6, "volume": 241 },
        { "price": 470.7, "volume": 701 },
        { "price": 471, "volume": 500 },
        { "price": 471.4, "volume": 100 },
        { "price": 471.5, "volume": 280 }
    ],
    "total_buy_volume": 4275,
    "avg_buy_price": 464.92,
    "total_sell_volume": 2994,
    "avg_sell_price": 470.55
};



function renderSide(tbody, rows, isBuyORSell) {
    HTML = '';
    rows.map((item,index) => {
        var className = isBuyORSell === 'buy' ? 'buy-row' : 'sell-row';
        HTML += `
        <tr class="${className}">
            <td>${index + 1}</td>
          <td>${item.price}</td>
          <td>${item.volume}</td>
        </tr>
        `;
    });
    tbody.html(HTML);
}

function render(data) {
    const buyRows = Array.isArray(data.buy) ? data.buy : [];
    const sellRows = Array.isArray(data.sell) ? data.sell : [];

    renderSide($('#buyBody'), buyRows, 'buy');
    renderSide($('#sellBody'), sellRows, 'sell');


    return false;

   

    

    // Totals and averages
    // const buyTotals = computeTotals(buyRows);
    // const sellTotals = computeTotals(sellRows);

    // $('#buyTotal').textContent = fmtNum(data.total_buy_volume ?? buyTotals.totalVol);
    // $('#sellTotal').textContent = fmtNum(data.total_sell_volume ?? sellTotals.totalVol);
    // $('#buyAvg').textContent = `Avg: ${fmtPrice(data.avg_buy_price ?? buyTotals.avgPrice)}`;
    // $('#sellAvg').textContent = `Avg: ${fmtPrice(data.avg_sell_price ?? sellTotals.avgPrice)}`;
    // $('#buyLevels').textContent = buyRows.length;
    // $('#sellLevels').textContent = sellRows.length;
    // $('#buyAvg2').textContent = fmtPrice(data.avg_buy_price ?? buyTotals.avgPrice);
    // $('#sellAvg2').textContent = fmtPrice(data.avg_sell_price ?? sellTotals.avgPrice);
}

async function load() {
    $('#status').textContent = 'Loading…';
    try {
        const res = await fetch(API, { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const json = await res.json();
        render(json);
        $('#status').textContent = 'Live ✔';
    } catch (err) {
        console.warn('Falling back to provided data:', err);
        render(FALLBACK);
        $('#status').textContent = 'Fallback (sample data)';
    }
}

document.getElementById('refreshBtn').addEventListener('click', load);

load();