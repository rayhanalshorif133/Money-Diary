$(() => {
    $("#btn-submit").click(function() {
        // Values nichi
        const before = parseFloat($("#before_amount").val()) || 0;
        const current = parseFloat($("#current_amount").val()) || 0;
        const qty = parseFloat($("#current_qty").val()) || 0;

        if (qty <= 0) {
            new Notyf().error("Please enter a valid Quantity!");
            return;
        }

        // 1. Core Calculation
        const buyPrice = (before - current) / qty;
        const initialCapital = buyPrice * qty;

        // 2. UI Updates (Main Result)
        $("#display-result").text(buyPrice.toFixed(8) + " USDT");
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