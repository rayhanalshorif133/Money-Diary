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

  $("#shareNowBtn").click(function (e) {
    const buyPrice = parseFloat($("#buyPrice").val());
    const sell_price = parseFloat($("#sellPrice").val());
    const quantity = parseInt($("#quantity").val());
    const commissionRate = parseFloat($("#commission").val());

    // Validate input values
    if (isNaN(buyPrice) || isNaN(sell_price) || isNaN(quantity) || isNaN(commissionRate)) {
      alert("Please fill in all the fields with valid numbers.");
      return;
    }
    const BASE_URL = window.location.href;
    const SHARE_URL = BASE_URL + `?buyPrice=${buyPrice}&sellPrice=${sell_price}&quantity=${quantity}&commission=${commissionRate}`;

    copyToClipboard(SHARE_URL);
    $(this).text('Copy to clipboard');

    setTimeout(() => {
      $(this).text('Share');
    }, 2000);

  });



  const BASE_URL = window.location.href;

  // Check if the URL has query parameters
  if (BASE_URL.includes('?')) {
    handleShareUrl(BASE_URL);
  }



});


function copyToClipboard(text) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
}



const handleShareUrl = (BASE_URL) => {


  const urlParams = new URLSearchParams(new URL(BASE_URL).search);

  // Get individual values
  const buyPrice = parseFloat(urlParams.get("buyPrice")); // Convert to float
  const sellPrice = parseFloat(urlParams.get("sellPrice")); // Convert to float
  const quantity = parseInt(urlParams.get("quantity"), 10); // Convert to integer
  const commission = parseFloat(urlParams.get("commission")); // Convert to float

  $("#buyPrice").val(buyPrice);
  $("#sellPrice").val(sellPrice);
  $("#quantity").val(quantity);
  $("#commission").val(commission);

  $("#calculate").click();

};


