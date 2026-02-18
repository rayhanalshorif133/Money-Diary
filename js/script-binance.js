const notyError = new Notyf({
    duration: 3000,
    position: {
        x: 'left', // বাম দিক থেকে আসবে
        y: 'bottom', // নিচ থেকে আসবে (চাইলে 'top' দিতে পারেন)
    },
});


$(() => {

    fetchDataFromDB();


    $("#coin_name").on("keyup", function () {
        $(this).val($(this).val().toUpperCase());
    });

    $("#btn-submit").click(function () {

        const coin_name = $("#coin_name").val() || '- - -';
        const before = parseFloat($("#before_amount").val()) || 0;
        const current = parseFloat($("#current_amount").val()) || 0;
        const qty = parseFloat($("#current_qty").val()) || 0;

        if (qty <= 0) {
            new Notyf().error("Please enter a valid Quantity!");
            return;
        }

        // 1. Core Calculation
        var buyPrice = (before - current) / qty;
        const initialCapital = buyPrice * qty;

        insertDB(coin_name, before, current, qty, parseFloat(buyPrice.toFixed(8)));

        // 2. UI Updates (Main Result)
        $("#coin-name-display").text(coin_name);
        $("#display-result").text(buyPrice.toFixed(8) + " USDT");
        $("#display-average-price").text(buyPrice.toFixed(8));
        $("#result-box").fadeIn();

        // 3. Strategy Header Update
        $("#initial-capital-display").text(initialCapital.toFixed(2));
        $("#qty-display").text(qty.toLocaleString());

        // 4. Table Generation (1% to 100%)
        let tableRows = "";
        for (let i = 1; i <= 100; i++) {
            const percent = i;
            const sellPrice = buyPrice + (buyPrice * (percent / 100));
            const profit = (sellPrice - buyPrice) * qty;
            const afterSell = initialCapital + profit;
            const totalUSDT = afterSell + current;

            tableRows += `
                <tr style="border-bottom: 1px solid #f1f1f1; hover: background: #f9f9f9;">
                    <td style="padding: 12px 15px; font-weight: bold; color: #27ae60;">${percent}%</td>
                    <td style="padding: 12px 15px; font-family: monospace;">${sellPrice.toFixed(8)}</td>
                    <td style="padding: 12px 15px; color: #2980b9; font-weight: 500;">+${profit.toFixed(2)}</td>
                    <td style="padding: 12px 15px; font-weight: bold; color: #e67e22;">${afterSell.toFixed(2)}</td>
                    <td style="padding: 12px 15px; font-weight: bold; color: #e67e22;">${totalUSDT.toFixed(2)}</td>
                </tr>
            `;
        }

        $("#profit-table-body").html(tableRows);
        $("#profit-gain").slideDown(500);

        new Notyf().success("Calculation Successful!");
    });
});


const insertDB = async (coin_name, before, current, qty, buyPrice) => {
    const { data: existingData, error: fetchError } = await supabaseConn
        .from('binance-calculation')
        .select('id')
        .eq('coin_name', coin_name)
        .eq('current_qty', parseFloat(qty));

    if (fetchError) {
        console.error("Fetch error:", fetchError);
        return;
    }

    if (existingData && existingData.length > 0) {
        notyError.error("Already Added..!!!");
        return; 
    }

    const { data, error } = await supabaseConn
        .from('binance-calculation')
        .insert([
            {
                coin_name: coin_name,
                before_amount: parseFloat(before),
                current_amount: parseFloat(current),
                current_qty: parseFloat(qty),
                average_price: parseFloat(buyPrice)
            }
        ]);

    if (error) {
        notyError.error("Error inserting data");
    } else {
        new Notyf().success("Data saved successfully");
    }
};


const fetchDataFromDB = async () => {
    const { data, error } = await supabaseConn
        .from('binance-calculation')
        .select('*');

    if (error) {
        notyError.error("Error fetching data");
    } else {

        const cartCountElement = document.getElementById('cart-count');
        if (data && data.length > 0) {
            cartCountElement.innerText = data.length;
            cartCountElement.style.display = 'flex';
        } else {
            cartCountElement.innerText = '0';
            cartCountElement.style.display = 'none';
        }
    }
};


