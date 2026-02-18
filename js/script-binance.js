const notyError = new Notyf({
    duration: 3000,
    position: {
        x: 'left', // বাম দিক থেকে আসবে
        y: 'bottom', // নিচ থেকে আসবে (চাইলে 'top' দিতে পারেন)
    },
});


$(() => {

    fetchDataFromDB();
    fetchAndDisplayCards();


    $("#coin_name").on("keyup", function () {
        $(this).val($(this).val().toUpperCase());
    });


    $("#cartBtn").click(function () {
        $(this).find('i').toggleClass('fa-cart-arrow-down fa-shopping-cart');
        $("#db-data-container").toggleClass('hidden');
        $("#profit-gain").addClass('hidden');
    });

    $("#btn-submit").click(function () {

        //     https://api.gateio.ws/api/v4/spot/tickers?currency_pair=OWL_USDT 

        const coin_name = $("#coin_name").val() || null;
        const before = parseFloat($("#before_amount").val()) || 0;
        const current = parseFloat($("#current_amount").val()) || 0;
        const qty = parseFloat($("#current_qty").val()) || 0;


        if (!coin_name) {
            new Notyf().error("Please enter a valid *COIN NAME!");
            return;
        }

        if (qty <= 0) {
            new Notyf().error("Please enter a valid Quantity!");
            return;
        }




        // 1. Core Calculation
        var buyPrice = (before - current) / qty;
        const initialCapital = buyPrice * qty;

        insertDB(coin_name, before, current, qty, parseFloat(buyPrice.toFixed(8)));

        // 2. UI Updates (Main Result)
        $("#coin-name-display").text(coin_name);
        $("#display-result").text(buyPrice.toFixed(8) + " USDT");
        $("#display-average-price").text(buyPrice.toFixed(8));
        $("#result-box").fadeIn();

        $("#initial-capital-display").text(initialCapital.toFixed(2));
        $("#qty-display").text(qty.toLocaleString());

        let tableRows = "";
        for (let i = 1; i <= 100; i++) {
            const percent = i;
            const sellPrice = buyPrice + (buyPrice * (percent / 100));
            const profit = (sellPrice - buyPrice) * qty;
            const afterSell = initialCapital + profit;
            const totalUSDT = afterSell + current;

            tableRows += `
                <tr style="border-bottom: 1px solid #f1f1f1; hover: background: #f9f9f9;">
                    <td style="padding: 12px 15px; font-weight: bold; color: #27ae60;">${percent}%</td>
                    <td style="padding: 12px 15px; font-family: monospace;">${sellPrice.toFixed(8)}</td>
                    <td style="padding: 12px 15px; color: #2980b9; font-weight: 500;">+${profit.toFixed(2)}</td>
                    <td style="padding: 12px 15px; font-weight: bold; color: #e67e22;">${afterSell.toFixed(2)}</td>
                    <td style="padding: 12px 15px; font-weight: bold; color: #e67e22;">${totalUSDT.toFixed(2)}</td>
                </tr>
            `;
        }

        $("#profit-table-body").html(tableRows);
        $("#profit-gain").slideDown(500);

        new Notyf().success("Calculation Successful!");
    });
});


const insertDB = async (coin_name, before, current, qty, buyPrice) => {
    const { data: existingData, error: fetchError } = await supabaseConn
        .from('binance-calculation')
        .select('id')
        .eq('coin_name', coin_name)
        .eq('current_qty', parseFloat(qty));

    if (fetchError) {
        console.error("Fetch error:", fetchError);
        return;
    }

    if (existingData && existingData.length > 0) {
        notyError.error("Already Added..!!!");
        return;
    }

    const { data, error } = await supabaseConn
        .from('binance-calculation')
        .insert([
            {
                coin_name: coin_name,
                before_amount: parseFloat(before),
                current_amount: parseFloat(current),
                current_qty: parseFloat(qty),
                average_price: parseFloat(buyPrice)
            }
        ]);

    if (error) {
        notyError.error("Error inserting data");
    } else {
        fetchAndDisplayCards();
        new Notyf().success("Data saved successfully");
    }
};


const fetchDataFromDB = async () => {
    const { data, error } = await supabaseConn
        .from('binance-calculation')
        .select('*');

    if (error) {
        notyError.error("Error fetching data");
    } else {

        const cartCountElement = document.getElementById('cart-count');
        if (data && data.length > 0) {
            cartCountElement.innerText = data.length;
            cartCountElement.style.display = 'flex';
        } else {
            cartCountElement.innerText = '0';
            cartCountElement.style.display = 'none';
        }
    }
};


const fetchAndDisplayCards = async () => {

    const { data: records, error } = await supabaseConn
        .from('binance-calculation')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error("Error fetching data:", error);
        return;
    }


    records.forEach(record => {
  

        const CARDHTML = `<div class="bg-white p-[15px] rounded-[10px] border-l-5 border-[#27ae60] text-[13px] relative">
        <div class="flex justify-between items-center border-b border-[#eee] pb-[5px] mb-[10px]">
                <strong style="color: #2c3e50;">${record.coin_name || 'N/A'}</strong>
                <button onclick="deleteRecord(${record.id})" style="background: none; border: none; color: #e74c3c; cursor: pointer; padding: 5px;">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
                <div style="color: #7f8c8d;">Qty: <span style="color: #2c3e50; font-weight:600;">${record.current_qty}</span></div>
                <div style="color: #7f8c8d;">Avg: <span style="color: #2980b9; font-weight:600;">${record.average_price.toFixed(4)}</span></div>
                <div style="color: #7f8c8d;">Total: <span style="color: #2c3e50; font-weight:600;">$${record.current_amount}</span></div>
            </div>
        </div>`;
        $("#cards-list").append(CARDHTML);
    });
};

$("#cards-list").click(() => {
    console.log('hello');
});

const deleteRecord = async (id) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#34495e',
        confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
        const { error } = await supabaseConn
            .from('binance-calculation')
            .delete()
            .eq('id', id);

        if (error) {
            new Notyf().error("Failed to delete record");
        } else {
            new Notyf().success("Record deleted successfully");
            fetchAndDisplayCards();
            fetchDataFromDB();
        }
    }
};

