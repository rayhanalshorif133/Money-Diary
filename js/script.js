$(() => {



  const urlParams = new URLSearchParams(window.location.search);
  const alreadyUnitQty = urlParams.get('alreadyUnitQty');
  const costPerPrice = urlParams.get('costPerPrice');
  const currentPerPrice = urlParams.get('currentPerPrice');
  const investNewAmount = urlParams.get('investNewAmount');
  const counter = urlParams.get('counter');
  const companyName = urlParams.get('companyName') || 'New Company';
  const counting = urlParams.get('counting') || 50;

  if (alreadyUnitQty && costPerPrice && currentPerPrice && investNewAmount && counter) {
    $('#already_quantity').val(alreadyUnitQty);
    $('#cost_price').val(costPerPrice);
    $('#current_price').val(currentPerPrice);
    $('#new_investment').val(investNewAmount);
    $('#counting').val(counting);
    $('#company_name').val(companyName);
    submitFunction(false);
  }

  $("#btn-submit").click(() =>{
     submitFunction(true);
  });

});


const submitFunction = (hasInsert = false) => {
  const company_name = $('#company_name').val() ? $('#company_name').val() : 'Next Price Calculation';
  const oldUnits = parseFloat($('#already_quantity').val()) || 0;
  const oldCostPerUnit = parseFloat($('#cost_price').val()) || 0;
  const newInvestment = parseFloat($('#new_investment').val()) || 0;
  const currentPrice = parseFloat($('#current_price').val()) || 0;
  const counter = parseFloat($('#counter').val()) || 500;
  const isSaveDB = $('#isSaveDB').is(':checked');

  const newCostPerUnit = calculateNewCostPerUnit(oldUnits, oldCostPerUnit, newInvestment, currentPrice);

  if (hasInsert && isSaveDB) {
    insertNewData(company_name, oldUnits, oldCostPerUnit, currentPrice, newInvestment, counter);
  }

  const totalUnit = oldUnits + parseInt(newInvestment / currentPrice);

  var HTML = `<table class="table mt-3 table-bordered table-hover">
          <thead>
              <tr class="bg-navy text-white">
                <th colspan="5" class="company_name">
                  ${company_name}
                  <div class="close"><i class="fa-solid fa-xmark"></i></div>
                </th>
              </tr>
          </thead>
          <tbody class="bg-success text-white">
            <tr><td colspan="3">Owned Units</td><td colspan="2">${oldUnits}</td></tr>
            <tr><td colspan="3">Cost/Unit</td><td colspan="2">${oldCostPerUnit}</td></tr>
            <tr><td colspan="3">Market Price</td><td colspan="2">${currentPrice}</td></tr>
            <tr><td colspan="3">New Investment</td><td colspan="2">${newInvestment}</td></tr>
            <tr><td colspan="3">New Unit</td><td colspan="2">${parseInt(newInvestment / currentPrice)}</td></tr>
            <tr><td colspan="3">Total Cost</td><td colspan="2">${(oldUnits * oldCostPerUnit) + newInvestment}</td></tr>
            <tr><td colspan="3">Total Units</td><td colspan="2">${totalUnit}</td></tr>
            <tr><td colspan="3">New Average Cost</td><td colspan="2">${newCostPerUnit}</td></tr>
          </tbody>
        </table>
        `;

  $(".demo-table").html(HTML);
  $("#priceBtn").attr("href", `./price.html?from=next_page&company_name=${company_name}&buy_unit_qty=${totalUnit}&per_unit_price=${newCostPerUnit}`);

  drawTable(company_name, totalUnit, newCostPerUnit, counter);
}


const insertNewData = async (companyName, alreadyUnitQty, costPerPrice, currentPerPrice, investNewAmount, counter) => {
  var supabaseConn = supabase.createClient(
    "https://bdmzqapfwgohgkctmzht.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkbXpxYXBmd2dvaGdrY3Rtemh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2OTE0MDcsImV4cCI6MjA2OTI2NzQwN30.EUrn0pIDQNBCyAqo3Z8fIi22ZKgxv91I6sI7_0ujw20"
  );



  const { data, error } = await supabaseConn
    .from('prevInfo')
    .insert([
      {
        company_name: companyName ?? 'New Company',
        already_unit_qty: alreadyUnitQty ?? 0,
        cost_per_price: costPerPrice ?? 0,
        current_per_price: currentPerPrice ?? 0,
        invest_new_amount: investNewAmount ?? 0,
        counter: counter ?? 0
      }
    ]);

  if (error) {
    console.error('Insert error:', error);
  } else {
    console.log('Insert success:', data);
  }

  return true;

}


const drawTable = (company_name = 'New Company', quantity = 0, cost_price = 0, counter = 500) => {

  const commision = 0.0045;

  sale_price = roundToNearest(cost_price, 0.1);
  sale_price = parseFloat(sale_price.toFixed(2));
  var selling_price = sale_price ? sale_price : 0;

  quantity = parseFloat(quantity);
  cost_price = parseFloat(cost_price);
  selling_price = parseFloat(selling_price);
  counting = parseInt(counter);

  // ey porjnto OK 

  var HTML = `
        <table class="table mt-3 table-bordered table-hover">
          <thead>
            <tr class="bg-success text-white">
              <th colspan="8" class="company_name">${company_name} <div class="close"><i class="fa-solid fa-xmark"></i></div></th>
            </tr>
            <tr class="bg-success text-white">
              <th>#</th>
              <th>Cost Price</th>
              
              <th>Selling Price</th>
             
              <th>Comm.</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>`;

  var profit_gain = false;
  var perCommission = selling_price * commision;

  HTML += `
        <tr class="bg-navy text-white">
              <td colspan="6">
              <span class="text-white">Quantity: </span>${quantity} (${parseFloat(perCommission.toFixed(2))})
              </td>
            </tr>
        `;

  for (let index = 0; index < counting; index++) {
    var comm = quantity * selling_price * commision;
    var index_num = index + 1;
    var profit = ((quantity * selling_price) - (quantity * cost_price)) - comm;

    var sale_per_unit = (quantity * selling_price - comm) / quantity;


    var total_cost = (quantity * cost_price).toFixed(2);
    var total_revenue = (quantity * selling_price).toFixed(2);


    HTML += `
        <tr data-info="${total_cost}-${total_revenue}" class="${!profit_gain && profit > 0 ? 'profit-gain' : ''}">
              <td>${index_num}</td>
              <td>${cost_price}</td>
              <td>${selling_price.toFixed(2)} (${sale_per_unit.toFixed(2)})</td>
              <td>${comm.toFixed(2)}</td>
              <td>${profit.toFixed(2)}</td>
            </tr>
        `;
    selling_price += 0.1;
    selling_price = parseFloat(selling_price.toFixed(2));
    if (profit > 0) {
      profit_gain = true;
    }
  }

  HTML += `</tbody></table>`;
  $('.insert-table').prepend(HTML);


};


const calculateNewCostPerUnit = (oldUnits, oldCostPerUnit, newInvestment, currentPrice) => {
  // Calculate new average cost per unit
  const oldTotalCost = oldUnits * oldCostPerUnit;
  const newUnits = newInvestment / currentPrice;
  const totalCost = oldTotalCost + newInvestment;
  const totalUnits = oldUnits + newUnits;
  const newAverageCost = totalCost / totalUnits;
  const newCostPerUnit = parseFloat(newAverageCost.toFixed(2));
  return newCostPerUnit;
}


$("#btn-reset").click(() => {
  const url = new URL(window.location.href);
  window.history.replaceState(null, '', url.pathname);
  location.reload();
});



$(document).on('click', 'tr', function () {
  $(this).addClass('selected').siblings().removeClass('selected');

  if (!$(this).data('info')) {
    return false;
  }

  var dataInfo = $(this).data('info');
  var values = dataInfo.split('-');
  var totalCost = parseFloat(values[0]);
  var totalRevenue = parseFloat(values[1]);

  $(this).siblings().find('.remove-container').remove();

  $(this).after(`<tr><td colspan="5" class="text-center remove-container">
      Total Cost: 
      <strong>
        ${totalCost.toFixed(2)}</strong> | Total Revenue: <strong>${totalRevenue.toFixed(2)} | Profit: ${(totalRevenue - totalCost).toFixed(2)}
      </strong>
      <button class="btn btn-remove-row btn-danger remove-row">
        <i class="fa-solid fa-xmark"></i>
      </button>
      </td></tr>`);


});

$(document).on('click', '.remove-row', function () {
  $(this).closest('tr').remove();
});



function roundToNearest(value, step) {
  return Math.round(value / step) * step;
}