
$(() => {

    handleDailyCost();
});


const updatedAmount = () => {
    $("#daliy-cost-table-body tr").each(async function (index, element) {

        const secondTd = $(element).find("td").eq(1);
        const className = secondTd.attr("class");
        const dateOnly = className.replace("date-", "");


        const { data, error } = await supabaseConn
            .from('dailyCost')
            .select('*')
            .eq('date', dateOnly);

        if (data) {
            const amount = data && data[0] ? data[0].amount : 0;
            secondTd.text(amount);
        } else {
            return 0;
        }
    });
};




const handleDailyCost = () => {

    const today = new Date();
    const thisMonth = today.toISOString().slice(0, 7); // YYYY-MM

    $('#daily_selected_date').val(thisMonth).trigger('change');


    $('#daily_selected_date').on('change', async function () {
        const inputMonth = $(this).val();
        const formatted = moment(inputMonth, "YYYY-MM").format("MMMM - YYYY");
        $("#insert_month").text(formatted);
        const daysInMonth = moment(inputMonth, "YYYY-MM").daysInMonth();

        let html = "";

        for (let day = 1; day <= daysInMonth; day++) {
            const date = moment(`${inputMonth}-${day}`, "YYYY-MM-DD");

            html += `
        <tr>
            <td>${date.format("D-MMM")}</td>
            <td class="date-${date.format("YYYY-MM-DD")}"><i class="fa-solid fa-spinner"></i></td>
            <td>
                <button class="calculateTypeBtn"><i class="fa-solid fa-plus"></i></button>
            </td>
            <td>
                <input class="amount-input" type="number"/>
            </td>
            <td>
                <button class="calculateSubmitBtn" data-date="${date.format("YYYY-MM-DD")}"><i class="fa-solid fa-check"></i></button>
            </td>
        </tr>
    `;
        }

        $("#daliy-cost-table-body").html(html);

        updatedAmount();

    });







    $(document).on('click', ".calculateTypeBtn", function () {
        if ($(this).find('i').hasClass('fa-plus')) {
            $(this).find('i').removeClass('fa-plus').addClass('fa-minus');
            $(this).attr('data-action', 'minus');
        } else if ($(this).find('i').hasClass('fa-minus')) {
            $(this).find('i').removeClass('fa-minus').addClass('fa-equals');
            $(this).attr('data-action', 'equals');
        } else {
            $(this).find('i').removeClass('fa-equals').addClass('fa-plus');
            $(this).attr('data-action', 'plus');
        }
    });

    $(document).on('click', ".calculateSubmitBtn", function () {
        if ($(this).find('i').hasClass('fa-check')) {
            $(this).find('i').removeClass('fa-check').addClass('fa-spinner');
            const date = $(this).attr("data-date");
            let row = $(this).closest("tr");
            let amount = row.find(".amount-input").val();
            var actionType = row.find(".calculateTypeBtn i") ?? 'plus';


            if (actionType.hasClass("fa-plus")) {
                actionType = 'plus';
            } else if (actionType.hasClass("fa-minus")) {
                actionType = 'minus';
            } else if (actionType.hasClass("fa-equals")) {
                actionType = 'equals';
            }

            handleDB(date, amount, actionType, row);
        }
        setTimeout(() => {
            $(".calculateSubmitBtn").find('i').removeClass('fa-spinner').addClass('fa-check');
        }, 1000);
    });
};


const handleDB = async (dateOnly, amount, actionType, row) => {

    const userId = localStorage.getItem('user_id');



    

    if (!userId) {
        console.error('User ID not found in localStorage');
        return false;
    }

    try {

        // find exsits or not
        const { data, error } = await supabaseConn
            .from('dailyCost')
            .select('*')
            .eq('date', dateOnly);

        if (error) {
            console.log("Select error:", error);
        } else if (data && data[0]) {
            const oldAmount = data[0].amount || 0;

            console.log(dateOnly, amount, actionType);

            var newAmount = 0;


            if(actionType == 'plus'){
                newAmount = parseInt(oldAmount) + parseInt(amount);
            }else if(actionType == 'minus'){
                newAmount = parseInt(oldAmount) - parseInt(amount);
            }
            else{
                newAmount = parseInt(amount);
            }

            const { data: updateData, error: updateError } = await supabaseConn
                .from('dailyCost')
                .update({ amount: newAmount })
                .eq('date', dateOnly);

            if (updateError) {
                console.log("Update error:", updateError);
            } else {
                console.log("Updated row:", updateData);
                updatedAmount();
                row.find(".amount-input").val('');
            }
        } else {
            const { data: insertData, error: insertError } = await supabaseConn
                .from('dailyCost')
                .insert([
                    { user_id: userId, date: dateOnly, amount: amount }
                ]);

            if (insertError) {
                console.log("Insert error:", insertError);
            } else {
                console.log("Inserted row:", insertData);
                updatedAmount();
                row.find(".amount-input").val('');
            }
        }
    } catch (err) {
        console.error('Unexpected Error:', err);
    }
};