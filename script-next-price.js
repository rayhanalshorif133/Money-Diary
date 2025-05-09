$(() => {


    $("#btn-submit").click(() => {
        console.clear();
        var index = 19;
        console.log(index);
        const company_name = $('#company_name').val() ? $('#company_name').val() : 'Next Price Calculation';
        const oldUnits = parseFloat($('#already_quantity').val()) || 0;
        const oldCostPerUnit = parseFloat($('#cost_price').val()) || 0;
        const newInvestment = parseFloat($('#new_investment').val()) || 0;
        const currentPrice = parseFloat($('#current_price').val()) || 0;
        const newCostPerUnit = calculateNewCostPerUnit(oldUnits, oldCostPerUnit, newInvestment, currentPrice);
        console.log(`New Cost Per Unit: ${newCostPerUnit}`);

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
    <tr><td colspan="3">Total Units</td><td colspan="2">${oldUnits + parseInt(newInvestment / currentPrice)}</td></tr>
    <tr><td colspan="3">New Average Cost</td><td colspan="2">${newCostPerUnit}</td></tr>
  </tbody>
</table>
`;

        $(".demo-table").html(HTML);
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
