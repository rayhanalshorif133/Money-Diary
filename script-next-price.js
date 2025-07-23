var index = 0;

const commision = 0.0045;


$(() => {



  $("#btn-submit").click(() => {
    console.clear();
    const company_name = $('#company_name').val() ? $('#company_name').val() : 'Next Price Calculation';
    const oldUnits = parseFloat($('#already_quantity').val()) || 0;
    const oldCostPerUnit = parseFloat($('#cost_price').val()) || 0;
    const newInvestment = parseFloat($('#new_investment').val()) || 0;
    const currentPrice = parseFloat($('#current_price').val()) || 0;
    const newCostPerUnit = calculateNewCostPerUnit(oldUnits, oldCostPerUnit, newInvestment, currentPrice);
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
    $("#homeBtn").attr("href", `./index.html?from=next_page&company_name=${company_name}&buy_unit_qty=${totalUnit}&per_unit_price=${newCostPerUnit}`);

    calculateTabeDraw({
      company_name: company_name,
      quantity: totalUnit,
      cost_price: newCostPerUnit,
      sale_price: currentPrice,
      counting: 10
    });

  });

});


const calculateNewCostPerUnit = (oldUnits, oldCostPerUnit, newInvestment, currentPrice) => {
  const oldTotalCost = oldUnits * oldCostPerUnit;
  const newUnits = newInvestment / currentPrice;
  const totalCost = oldTotalCost + newInvestment;
  const totalUnits = oldUnits + newUnits;
  const newAverageCost = totalCost / totalUnits;
  return parseFloat(newAverageCost.toFixed(2));
}



const calculateTabeDraw = (props) => {
  var { company_name, quantity, cost_price, sale_price, counting = 10 } = props;
  index++;

  sale_price = roundToNearest(cost_price, 0.1);
  sale_price = parseFloat(sale_price.toFixed(2));
  $('#selling_price').val(sale_price);
  var selling_price = $('#selling_price').val() ? $('#selling_price').val() : 0;

  quantity = parseFloat(quantity);
  cost_price = parseFloat(cost_price);
  selling_price = parseFloat(selling_price);
  counting = parseInt(counting);


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



function roundToNearest(value, step) {
  return Math.round(value / step) * step;
}