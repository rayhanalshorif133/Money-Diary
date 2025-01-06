$(document).ready(function () {
  $("#calculate").click(function () {
    // Get input values
    const buyPrice = parseFloat($("#buyPrice").val());
    const sell_price = parseFloat($("#sellPrice").val());
    const quantity = parseInt($("#quantity").val());
    const commissionRate = parseFloat($("#commission").val());

    // Validate input values
    if (isNaN(buyPrice) || isNaN(sell_price) || isNaN(quantity) || isNaN(commissionRate)) {
      alert("Please fill in all the fields with valid numbers.");
      return;
    }

    // Step 1: Calculate the total cost for buying the shares
    const totalBuyCost = buyPrice * quantity;

    // Step 2: Calculate the total revenue from selling the shares
    const totalSellRevenue = sell_price * quantity;
    console.log(totalSellRevenue);

    // Step 3: Calculate the commission on buying and selling transactions
    const commissionOnBuy = totalBuyCost * (commissionRate / 100);
    const commissionOnSell = totalSellRevenue * (commissionRate / 100);

    // Step 4: Calculate the net profit or loss
    const netProfitLoss = totalSellRevenue - totalBuyCost - commissionOnBuy - commissionOnSell;

    // Display results
    $("#buyCost").text("Total Buy Cost: " + totalBuyCost.toFixed(2) + " Taka");
    $("#sell_price").text("Total Sell Price: " + totalSellRevenue.toFixed(2) + " Taka");
    $("#commissionBuy").text("Commission on Buy: " + commissionOnBuy.toFixed(2) + " Taka");
    $("#commissionSell").text("Commission on Sell: " + commissionOnSell.toFixed(2) + " Taka");
    $("#profitLoss").text("Net Profit/Loss: " + netProfitLoss.toFixed(2) + " Taka");
  });

});


