$(() => {


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
    });

});