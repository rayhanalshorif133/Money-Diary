$(() => {

  var index = 0;

  $("#btn-submit").click(() => {

    index++;

    const company_name = $('#company_name').val() ? $('#company_name').val() : 'Profit Calculation';
    var quantity = $('#quantity').val() ? $('#quantity').val() : 0;
    var cost_price = $('#cost_price').val() ? $('#cost_price').val() : 0;
    var selling_price = $('#selling_price').val() ? $('#selling_price').val() : 0;

    quantity = parseFloat(quantity);
    cost_price = parseFloat(cost_price);
    selling_price = parseFloat(selling_price);


    var HTML = `
        <table class="table mt-3 table-bordered table-hover">
          <thead>
            <tr class="bg-success text-white">
              <th colspan="6" class="company_name">${company_name} <div class="close"><i class="fa-solid fa-xmark"></i></div></th>
            </tr>
            <tr class="bg-success text-white">
              <th>Quantity</th>
              <th>Cost Price</th>
              <th>Total Cost</th>
              <th>Selling Price</th>
              <th>Total Revenue</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>`;

    for (let index = 0; index < 5; index++) {
      HTML += `
        <tr>
              <td>${quantity}</td>
              <td>${cost_price}</td>
              <td>${(quantity * cost_price).toFixed(2)}</td>
              <td>${selling_price}</td>
              <td>${(quantity * selling_price).toFixed(2)}</td>
              <td>${((quantity * selling_price) - (quantity * cost_price)).toFixed(2)}</td>
            </tr>
        `;
        selling_price += 0.1;
        selling_price = parseFloat(selling_price.toFixed(2));
    }

    HTML += `</tbody></table>`;
    $('.insert-table').prepend(HTML);
  });


  $(document).on('click', '.close', function () {
    $(this).closest('table').remove();
  });
});