$(() => {

  // // http://127.0.0.1:5650/index.html?from=next_page&buy_unit_qty=2281&per_unit_price=3.11

  var index = 0;

  const commision = 0.0045;


  $('#cost_price').on('input', function () {
    var cost_price = $('#cost_price').val() ? $('#cost_price').val() : 0;
    sale_price = roundToNearest(cost_price, 0.1);
    sale_price = parseFloat(sale_price.toFixed(2));
    $('#selling_price').val(sale_price);
  });

  $("#btn-submit").click(() => {

    index++;

    const company_name = $('#company_name').val() ? $('#company_name').val() : 'Profit Calculation';
    var quantity = $('#quantity').val() ? $('#quantity').val() : 0;
    var cost_price = $('#cost_price').val() ? $('#cost_price').val() : 0;
    sale_price = roundToNearest(cost_price, 0.1);
    sale_price = parseFloat(sale_price.toFixed(2));
    $('#selling_price').val(sale_price);
    var selling_price = $('#selling_price').val() ? $('#selling_price').val() : 0;
    var counting = $('#counting').val() ? $('#counting').val() : 10;

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
    var perCommision = parseFloat(selling_price * commision, 2);

    HTML += `
        <tr class="bg-navy text-white">
              <td colspan="6">
              <span class="text-white">Quantity: </span>${quantity} (${perCommision})
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
  });

  // check params and auto set
  const url = new URL(window.location.href);
  if (url.searchParams.get('from') === 'next_page') {
    const company_name = url.searchParams.get('company_name');
    const buy_unit_qty = url.searchParams.get('buy_unit_qty');
    const per_unit_price = url.searchParams.get('per_unit_price');
    $('#company_name').val(company_name);
    $('#quantity').val(buy_unit_qty);
    $('#cost_price').val(per_unit_price);
    var sale_price = roundToNearest(per_unit_price, 0.1);
    sale_price = parseFloat(sale_price.toFixed(2));
    $('#selling_price').val(sale_price);
    $("#btn-submit").click();
  }







  $("#btn-reset").click(() => {
    const url = new URL(window.location.href);
    window.history.replaceState(null, '', url.pathname);
    location.reload();
  });


  $(document).on('click', '.close', function () {
    $(this).closest('table').remove();
  });

  $(document).on('click', 'tr', function () {
    $(this).addClass('selected').siblings().removeClass('selected');

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
    $(this).closest('tr').prev().remove();
    $(this).closest('tr').remove();
  });
});

function roundToNearest(value, step) {
  return Math.round(value / step) * step;
}