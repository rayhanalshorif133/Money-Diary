async function loadBinanceData() {
    const tableBody = document.getElementById('binance-table-body');

    // উদাহরণস্বরূপ কিছু ডাটা (আপনি পরবর্তীতে Supabase থেকে নিতে পারেন)
    const data = [
        { date: '06-July-2026', prev: 17.43, extra: 0, curr: 17.45, pl: 0.02, note: '' },
        { date: '07-July-2026', prev: 17.45, extra: 0, curr: 0, pl: -17.45, note: '' },
        { date: '08-July-2026', prev: 0, extra: 0, curr: 0, pl: 0, note: '' }
    ];

    let rows = "";
    data.forEach(item => {
        rows += `<tr>
                <td>${item.date}</td>
                <td><input type="number" value="${item.prev}" style="width:60px"></td>
                <td><input type="number" value="${item.extra}" style="width:60px"></td>
                <td><input type="number" value="${item.curr}" style="width:60px"></td>
                <td>${item.pl}</td>
                <td><input type="text" value="${item.note}" placeholder="Optional"></td>
            </tr>`;
    });

    tableBody.innerHTML = rows;
}

// পেজ লোড হওয়ার সাথে সাথে রান করবে
window.onload = function () {
    loadBinanceData();
};