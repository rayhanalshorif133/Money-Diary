$(() => {

  var index = 0;

  $("#btn-submit").click(() => {

    index++;

    const company_name = $('#company_name').val() ? $('#company_name').val() : 'Profit Calculation';
    const quantity = $('#quantity').val() ? $('#quantity').val() : 0;
    const cost_price = $('#cost_price').val() ? $('#cost_price').val() : 0;
    const selling_price = $('#selling_price').val() ? $('#selling_price').val() : 0;

    var HTML = `
        <table class="table mt-3 table-bordered table-hover">
          <thead>
            <tr class="bg-success text-white">
              <th colspan="6" class="company_name">${company_name}</th>
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
              <td>${parseFloat(quantity * cost_price, 2)}</td>
              <td>Total Cost</td>
              <td>Selling Price</td>
              <td>Total Revenue</td>
              <td>Profit</td>
            </tr>
        `;
    }

    HTML += `</tbody></table>`;
    $('.insert-table').prepend(HTML);
  });

});