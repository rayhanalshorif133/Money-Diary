

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
    rows.map((item, index) => {
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
}

async function load() {
    $('#status').textContent = 'Loading…';
    try {
        const keyword = $('#keyword').val() ? $('#keyword').val() : 'N/A';
        $("#keyWordName").text(`${keyword}`);

        if (keyword === 'N/A') {
            return false;
        }

        const API = `https://bd.bullbd.com/shares/${keyword}`;
        const res = await fetch(API, { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const json = await res.json();
        render(json);
        $('#status').textContent = 'Live ✔';

        // auto update data
        const share_id = $('#share_id').val();
        if (!share_id || share_id === 'N/A') {
            return false;
        }

        autoUpdateData(json, share_id);

    } catch (err) {
        console.warn('Falling back to provided data:', err);
        render(FALLBACK);
        $('#status').textContent = 'Fallback (sample data)';
    }
}

document.getElementById('refreshBtn').addEventListener('click', load);

load();



// live update every 30 seconds
const newShareTradedShow = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const keyword = $('#keyword').val();


    const formattedDate = `${year}-${month}-${day}`;
    const nextDay = String(today.getDate() + 1).padStart(2, '0');
    const formattedNextDate = `${year}-${month}-${nextDay}`;

    $.getJSON(`https://provider.bullbd.com/shares/get-tick-minute-data-from-to?code=${keyword}&from=${formattedDate}&upto=${formattedNextDate}`, function (data) {
        if (data.length > 0) {
            let last = data[data.length - 1]; // get last record

            // format values
            let shares = last.volume_new;
            let price = last.ltp;

            let msg = `new ${shares} traded @ ${price} tk`;
            $('#newShareTradedShow').text(msg);
        }
    });

    $.getJSON("https://provider.bullbd.com/shares/get-once", function (response) {
        const item = $.grep(response, function (obj) {
            return obj.c === keyword;
        })[0];

        if (item) {
            $("#keyWordName").html(`${keyword} | <span style="color:${item.price_change >= 0 ? 'green' : 'red'}">${item.price_change}</span> tk`);
            
        }
    });
};

newShareTradedShow();

const autoUpdateData = (liveData, share_id) => {
    const upperBuyPrice = liveData.buy && liveData.buy.length > 0 ? liveData.buy[0].price : null;
    if (!upperBuyPrice) {
        return false;
    }

    $("#current_price").val(upperBuyPrice);
    supabaseConn
        .from('prevInfo')
        .update({
            current_per_price: upperBuyPrice,   
        })
        .eq('id', share_id)              
        .then(({ data, error }) => {
            if (error) {
                console.error("Update error:", error);
            } else {
                console.log("Update successful:", data);
            }
        });
};