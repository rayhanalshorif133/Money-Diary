$(() => {

  var index = 0;

  $("#btn-submit").click(() => {

    index++;

    const company_name = $('#company_name').val() ? $('#company_name').val() : 'Profit Calculation';
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
          <tbody></tbody>
        </table>
    `;
    $('.insert-table').prepend(HTML);
  });

});