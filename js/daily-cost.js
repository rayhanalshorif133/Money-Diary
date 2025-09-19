
$(() => {

    handleDailyCost();


});





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
            console.log(date);
            handleDB();
        }
        setTimeout(() => {
            $(".calculateSubmitBtn").find('i').removeClass('fa-spinner').addClass('fa-check');
        }, 1000);
    });
};


const handleDB = async () => {

    const userId = localStorage.getItem('user_id');


    if (!userId) {
        console.error('User ID not found in localStorage');
        return false;
    }

    try {

        const record = {
            user_id: userId,   
            date: dateOnly,
            amount: someAmount
        };

        // Upsert with conflict on user + date
        const { data, error } = await supabaseConn
            .from('dailyCost')
            .upsert(record, { onConflict: ['user_id', 'date'] })
            .select();

        if (error) {
            console.error('Upsert error:', error);
        } else if (data && data[0]) {
            secondTd.text(data[0].amount);
        }
    } catch (err) {
        console.error('Unexpected Error:', err);
    }
};