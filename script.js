$(document).ready(function () {
  $("#calculate").click(function () {
    // Get input values
    const buyPrice = parseFloat($("#buyPrice").val());
    const sell_price = parseFloat($("#sellPrice").val());
    const quantity = parseInt($("#quantity").val());
    var commissionRate = parseFloat($("#commission").val());

    // Validate input values
    if (isNaN(buyPrice)  || isNaN(quantity) || isNaN(commissionRate)) {
      alert("Please fill in all the fields with valid numbers.");
      return;
    }

    var commissionRateCal = commissionRate / 100;

    const totalBuyCost = buyPrice * quantity;
    var totalSellRevenue = sell_price * quantity;
    const commissionOnBuy = totalBuyCost * commissionRateCal;
    var commissionOnSell = totalSellRevenue * commissionRateCal;

    // Step 4: Calculate the net profit or loss
    // const netProfitLoss = totalSellRevenue - totalBuyCost - commissionOnBuy - commissionOnSell;
    var netProfitLoss = totalSellRevenue - totalBuyCost - commissionOnSell;
    var averageBuyPrice = (totalBuyCost + commissionOnBuy) / quantity;

    if(sell_price == 0 || isNaN(sell_price)){
      netProfitLoss = 0;
      totalSellRevenue = 0;
      commissionOnSell = 0;
    }

    // Display results
    $("#buyCost").text("Total Buy Cost: " + totalBuyCost.toFixed(2) + " Taka");
    $("#sell_price").text("Total Sell Price: " + totalSellRevenue.toFixed(2) + " Taka");
    $("#commissionBuy").text("Commission on Buy: " + commissionOnBuy.toFixed(2) + " Taka");
    $("#commissionSell").text("Commission on Sell: " + commissionOnSell.toFixed(2) + " Taka");
    $("#averageBuyPrice").text("Average on Buy Price: " + averageBuyPrice.toFixed(2) + " Taka");

    $("#profitLoss").text("Net Profit/Loss: " + netProfitLoss.toFixed(2) + " Taka");

    // set in query parameters
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('buyPrice', buyPrice.toFixed(2));
    queryParams.set('sellPrice', sell_price.toFixed(2));
    queryParams.set('quantity', quantity.toString());
    queryParams.set('commission', commissionRate.toString());
    window.history.replaceState({}, '', window.location.pathname + '?' + queryParams.toString());
  });


  $("#profitLoss").click(function(){
    const buyPrice = parseFloat($("#buyPrice").val());
    const sell_price = parseFloat($("#sellPrice").val());
    const quantity = parseInt($("#quantity").val());
    const commissionRate = parseFloat($("#commission").val());
    const totalBuyCost = buyPrice * quantity;
    const totalSellRevenue = sell_price * quantity;
    const commissionOnBuy = totalBuyCost * (commissionRate / 100);
    const commissionOnSell = totalSellRevenue * (commissionRate / 100);
    const netProfitLoss = totalSellRevenue - totalBuyCost - commissionOnSell - commissionOnBuy;
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

  var handleAutoID;

  // Check if the URL has query parameters
  if (BASE_URL.includes('?')) {
    handleShareUrl(BASE_URL);
  }


  $(".sellPriceAutoBtn").click(function () {
    $(this).text('Stop');

    if($(this).hasClass('process')){
      clearInterval(handleAutoID);
      $(this).text('Auto');
      $(this).removeClass('process bg-danger').addClass('bg-success');
      return false;
    }

    handleAutoID = setInterval(() => {
      handleAuto();
    }, 3000);
    $(this).addClass('process bg-danger').removeClass('bg-success');
  });







});


const handleAuto = () => {
  const AUTOSELLVALUE = parseFloat($("#sellPrice_auto").val());
  const sell_price = parseFloat($("#sellPrice").val());
  const addedPrice = (parseFloat(sell_price) + parseFloat(AUTOSELLVALUE)).toFixed(2);
  $("#sellPrice").val(addedPrice);
  $("#calculate").click();
};


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


