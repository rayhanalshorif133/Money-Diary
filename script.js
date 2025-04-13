$(() => {

  var index = 0;

  const commision = 0.0045;


  $('#cost_price').on('input', function () {
    var cost_price = $('#cost_price').val() ? $('#cost_price').val() : 0;
    cost_price = roundToNearest(cost_price, 0.1);
    cost_price = parseFloat(cost_price.toFixed(2));
    $('#selling_price').val(cost_price);
  });

  $("#btn-submit").click(() => {

    index++;

    const company_name = $('#company_name').val() ? $('#company_name').val() : 'Profit Calculation';
    var quantity = $('#quantity').val() ? $('#quantity').val() : 0;
    var cost_price = $('#cost_price').val() ? $('#cost_price').val() : 0;
    cost_price = roundToNearest(cost_price, 0.1);
    cost_price = parseFloat(cost_price.toFixed(2));
    $('#selling_price').val(cost_price);
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
              <th>Quantity</th>
              <th>Cost Price</th>
              <th>Total Cost</th>
              <th>Selling Price</th>
              <th>Total Revenue</th>
              <th>Comm.</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>`;

    var profit_gain = false;

    for (let index = 0; index < counting; index++) {
      var comm = (quantity * selling_price * commision).toFixed(2);
      var index_num = index + 1;
      var profit = ((quantity * selling_price) - (quantity * cost_price)) - comm;
      

      

      HTML += `
        <tr class="${!profit_gain && profit > 0 ? 'profit-gain' : ''}">
              <td>${index_num}</td>
              <td>${quantity}</td>
              <td>${cost_price}</td>
              <td>${(quantity * cost_price).toFixed(2)}</td>
              <td>${selling_price}</td>
              <td>${(quantity * selling_price).toFixed(2)}</td>
              <td>${comm}</td>
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


  $(document).on('click', '.close', function () {
    $(this).closest('table').remove();
  });
  
  $(document).on('click', 'tr', function () {
    $(this).addClass('selected').siblings().removeClass('selected');
  });
});

function roundToNearest(value, step) {
  return Math.round(value / step) * step;
}