$(() => {
    $("#btn-submit").click(function() {
        // Input values nichi
        const before = parseFloat($("#before_amount").val()) || 0;
        const current = parseFloat($("#current_amount").val()) || 0;
        const qty = parseFloat($("#current_qty").val()) || 0;

        // Validation
        if (qty <= 0) {
            new Notyf().error("Quantity must be greater than 0!");
            return;
        }

        // Formula Calculation
        const calculation = (before - current) / qty;

        // UI-te Result dekhano
        $("#display-result").text(calculation.toFixed(8) + " USDT");
        
        $("#result-box").fadeIn(400);

        const notyf = new Notyf();
        notyf.success("Calculation Updated!");
        
        console.log('Result Calculated:', calculation);
    });
});