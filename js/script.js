$(() => {

  checkAuth();
  handMenutabutton();
  handleParamsValue();
  handleShowHideBtn();
  handleButtons();


});

const handleButtons = () => {
  $("#btn-submit").click(() => {
    submitFunction(true);
  });

  $("#btn-update").click(() => {
    const share_id = $('#share_id').val();
    if (share_id === 'N/A' || !share_id) {
      return false;
    }

    const company_name = $('#company_name').val() ? $('#company_name').val() : 'Next Price Calculation';
    const keyword = $('#keyword').val() ? $('#keyword').val() : 'N/A';
    const oldUnits = parseFloat($('#already_quantity').val()) || 0;
    const oldCostPerUnit = parseFloat($('#cost_price').val()) || 0;
    const newInvestment = parseFloat($('#new_investment').val()) || 0;
    const currentPrice = parseFloat($('#current_price').val()) || 0;
    const counter = parseFloat($('#counter').val()) || 500;

    supabaseConn
      .from('prevInfo')
      .update({
        company_name: company_name,
        keyword: keyword,
        already_unit_qty: oldUnits,
        cost_per_price: oldCostPerUnit,
        invest_new_amount: newInvestment,
        current_per_price: currentPrice,
        counter: counter
      })
      .eq('id', share_id)
      .then(({ data, error }) => {
        if (error) {
          console.error("Update error:", error);
        } else {
          console.log("Update successful full data:", data);
        }
      });
  });

  $("#btn-reset").click(() => {
    $('#share_id').val('N/A');
    $('#investmentForm')[0].reset();
    $("#calculate-table").html('');
    $("#btn-update").addClass('hidden');
  });

  $("#logoutBtn").click(() => {
    supabaseConn.auth.signOut().then(({ error }) => {
      if (error) {
        console.error("Logout error:", error);
      } else {
        localStorage.removeItem('isLogin');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_email');
        window.location.href = './login.html';
      }
    });
  });

  $("#currentMerketTab").click(() => {
    $("#refreshBtn").click();
  });


  $("#previousDataTab").click(() => {
    handlePreviousData();
  });



};


const handlePreviousData = () => {
  const userId = localStorage.getItem('user_id');
  if (!userId) {
    console.error('User ID not found in localStorage');
    return;
  }


  supabaseConn
    .from('prevInfo')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(8)
    .then(({ data, error }) => {
      if (error) {
        console.error('Error fetching previous data:', error);
        return;
      }
      var HTML = "";
      data.forEach(item => {

        if (item.company_name && item.company_name.length > 17) {
          item.company_name = item.company_name.slice(0, 17) + '...';
        }




        const profit_loss = (item.current_per_price - item.cost_per_price) * item.already_unit_qty;
        const profit_percentage = ((item.current_per_price - item.cost_per_price) / item.cost_per_price) * 100;
        const profitClass = profit_loss >= 0 ? 'profit-positive' : 'profit-negative';
        const profitSign = profit_loss >= 0 ? '+' : '';
        const profitIcon = profit_loss >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
        const profitText = profit_loss >= 0 ? 'Profit' : 'Loss';
        const profitValue = `${profitSign}${profit_percentage.toFixed(2)}% ${profitText} (৳ ${profit_loss.toFixed(2)})`;



        HTML += `<div class="premium-card">
          <div class="floating-info">
            <i class="fas fa-chart-line"></i>
          </div>

          <div class="card-header">
            <h2 class="company-name">
              ${item.company_name || "New Company"}
            </h2>
          </div>

          <div class="card-body">
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-label">Keyword</div>
                <div class="stat-value">${item.keyword || ""}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Buy Qty</div>
                <div class="stat-value">${item.already_unit_qty}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Cost Price</div>
                <div class="stat-value price">৳ ${item.cost_per_price}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Current Price</div>
                <div class="stat-value price">৳ ${item.current_per_price}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">New Invest</div>
                <div class="stat-value">৳ ${item.invest_new_amount}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Counter</div>
                <div class="stat-value">${item.counter}</div>
              </div>
            </div>

            <div class="profit-indicator ${profitClass}">
              <i class="fas ${profitIcon}"></i>
              <span>${profitValue}</span>
            </div>
          </div>
          <div class="card-actions">
            <button class="action-btn btn-primary btn-use" data-id="${item.id}">
              <i class="fas fa-play"></i>
              Use
            </button>
            <button class="action-btn btn-danger btn-delete" data-id="${item.id}">
              <i class="fas fa-trash"></i>
              Delete
            </button>
          </div>
        </div>`;

      });

      $("#previousDataGrid").html(HTML);
    });

  handlePreviousDataButtons(userId);
};



const handlePreviousDataButtons = (userId) => {
  $(document).on('click', '.btn-use', function () {
    const id = $(this).data('id');
    $('#share_id').val(id);
    supabaseConn
      .from('prevInfo')
      .select('*')
      .eq('user_id', userId)
      .eq('id', id)
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching previous data:', error);
          return;
        }

        if (data) {
          const item = data[0];
          $('#already_quantity').val(item.already_unit_qty);
          $('#cost_price').val(item.cost_per_price);
          $('#current_price').val(item.current_per_price);
          $('#new_investment').val(item.invest_new_amount);
          $('#counting').val(item.counter);
          $('#company_name').val(item.company_name || 'New Company');
          $('#keyword').val(item.keyword || 'N/A');
          $("#keyWordName").text(item.keyword || 'N/A');
          $("#btn-update").removeClass('hidden');
          $("#btn-reset").removeClass('hidden');
          $(".tab-buttons").find('[data-tab="investmentDetails"]').click();
          submitFunction(false);
        }

      });
  });



  $(document).on('click', '.btn-delete', function () {
    const id = $(this).data('id');
    $('#share_id').val(id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        supabaseConn
          .from('prevInfo')
          .delete()
          .eq('id', id)
          .then(({ data, error }) => {
            if (error) {
              console.error('Error deleting data:', error);
              return;
            }

            handlePreviousData();
          });
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });


  });

}

const handMenutabutton = () => {
  document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('show');
  });


  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabContents.forEach(tc => tc.classList.remove('active'));
      tabButtons.forEach(b => b.classList.remove('active'));
      document.getElementById(target).classList.add('active');
      btn.classList.add('active');
    });
  });
};

const handleShowHideBtn = () => {
  $(".toggle-btn").click(function () {

    $(this).toggleClass('hide').toggleClass('show');
    sessionStorage.setItem('isHidden', $(this).hasClass('show') ? 'true' : 'false');

    $("#investment-container").toggleClass('hidden');
    if ($(this).hasClass('hide')) {
      $(this).html('<i class="fa-regular fa-eye-slash"></i> Hide');
    } else {
      $(this).html('<i class="fa-solid fa-eye"></i> Show');
    }
  });

  const isHidden = sessionStorage.getItem('isHidden');
  if (isHidden === 'true') {
    $(".toggle-btn").addClass('show').removeClass('hide');
    $("#investment-container").addClass('hidden');
    $(".toggle-btn").html('<i class="fa-solid fa-eye"></i> Show');
  } else {
    $(".toggle-btn").addClass('hide').removeClass('show');
    $("#investment-container").removeClass('hidden');
    $(".toggle-btn").html('<i class="fa-regular fa-eye-slash"></i> Hide');
  }
};


const handleParamsValue = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const alreadyUnitQty = urlParams.get('alreadyUnitQty');
  const costPerPrice = urlParams.get('costPerPrice');
  const currentPerPrice = urlParams.get('currentPerPrice');
  const investNewAmount = urlParams.get('investNewAmount');
  const counter = urlParams.get('counter');
  const companyName = urlParams.get('companyName') || 'New Company';
  const counting = urlParams.get('counting') || 50;

  if (alreadyUnitQty && costPerPrice && currentPerPrice && investNewAmount && counter) {
    $('#already_quantity').val(alreadyUnitQty);
    $('#cost_price').val(costPerPrice);
    $('#current_price').val(currentPerPrice);
    $('#new_investment').val(investNewAmount);
    $('#counting').val(counting);
    $('#company_name').val(companyName);
    submitFunction(false);
  }
};


const checkAuth = async () => {


  const { data: { user }, error } = await supabaseConn.auth.getUser();
  if (error) {
    console.error("Authentication error:", error);
    localStorage.removeItem('isLogin');
    window.location.href = './login.html';
  } else if (!user) {
    localStorage.removeItem('isLogin');
    window.location.href = './login.html';
  } else {
    localStorage.setItem('isLogin', true);
    localStorage.setItem('user_id', user.id);
    localStorage.setItem('user_email', user.email);
  }

}


const submitFunction = (hasInsert = false) => {
  const company_name = $('#company_name').val() ? $('#company_name').val() : 'Next Price Calculation';
  const keyword = $('#keyword').val() ? $('#keyword').val() : 'N/A';
  const oldUnits = parseFloat($('#already_quantity').val()) || 0;
  const oldCostPerUnit = parseFloat($('#cost_price').val()) || 0;
  const newInvestment = parseFloat($('#new_investment').val()) || 0;
  const currentPrice = parseFloat($('#current_price').val()) || 0;
  const counter = parseFloat($('#counter').val()) || 500;
  const isSaveDB = $('#isSaveDB').is(':checked');

  $("#keyWordName").text(keyword)


  const newCostPerUnit = calculateNewCostPerUnit(oldUnits, oldCostPerUnit, newInvestment, currentPrice);

  if (hasInsert && isSaveDB) {
    insertNewData(company_name, keyword, oldUnits, oldCostPerUnit, currentPrice, newInvestment, counter);
  }


  const totalUnit = oldUnits + parseInt(newInvestment / currentPrice);


  var HTML = `
    <table>
          <thead>
            <tr>
              <th colspan="5" class="company_name">
                 ${company_name}
                <div class="close"><i class="fa-solid fa-xmark"></i></div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-success text-white">
            <tr>
              <td colspan="3">Owned Units</td>
              <td colspan="2">${oldUnits}</td>
            </tr>
            <tr>
              <td colspan="3">Cost/Unit</td>
              <td colspan="2">${oldCostPerUnit}</td>
            </tr>
            <tr>
              <td colspan="3">Market Price</td>
              <td colspan="2">${currentPrice}</td>
            </tr>
            <tr>
              <td colspan="3">New Investment</td>
              <td colspan="2">${newInvestment}</td>
            </tr>
            <tr>
              <td colspan="3">New Unit</td>
              <td colspan="2">${parseInt(newInvestment / currentPrice)}</td>
            </tr>
            <tr>
              <td colspan="3">Total Cost</td>
              <td colspan="2">${(oldUnits * oldCostPerUnit) + newInvestment}</td>
            </tr>
            <tr>
              <td colspan="3">Total Units</td>
              <td colspan="2">${totalUnit}</td>
            </tr>
            <tr>
              <td colspan="3">New Average Cost</td>
              <td colspan="2">${newCostPerUnit}</td>
            </tr>
          </tbody>
        </table>
  `;

  $("#calculate-table").html(HTML);

  drawTable(keyword, company_name, totalUnit, newCostPerUnit, counter);
  return false;
}


const insertNewData = async (companyName, keyword, alreadyUnitQty, costPerPrice, currentPerPrice, investNewAmount, counter) => {


  const userId = localStorage.getItem('user_id');


  if (!userId) {
    console.error('User ID not found in localStorage');
    return false;
  }

  const { data, error } = await supabaseConn
    .from('prevInfo')
    .insert([
      {
        user_id: userId,
        company_name: companyName ?? 'New Company',
        keyword: keyword ?? 'N/A',
        already_unit_qty: alreadyUnitQty ?? 0,
        cost_per_price: costPerPrice ?? 0,
        current_per_price: currentPerPrice ?? 0,
        invest_new_amount: investNewAmount ?? 0,
        counter: counter ?? 0
      }
    ]);

  if (error) {
    console.error('Insert error:', error);
  } else {
    console.log('Insert success:', data);
  }

  return true;

}


const drawTable = (keyword = 'N/A', company_name = 'New Company', quantity = 0, cost_price = 0, counter = 500) => {


  const CURRENT_PRICE = parseFloat($("#current_price").val()) || 0;


  $('#calculate-table-list').html('');
  const commision = 0.0045;

  sale_price = roundToNearest(cost_price, 0.1);
  sale_price = parseFloat(sale_price.toFixed(2));
  var selling_price = sale_price ? sale_price : 0;

  quantity = parseFloat(quantity);
  cost_price = parseFloat(cost_price);
  selling_price = parseFloat(selling_price);
  counting = parseInt(counter);

  // ey porjnto OK 

  var HTML = `
        <table>
          <thead>
            <tr>
              <th colspan="8" class="company_name">${company_name} <div class="close"><i class="fa-solid fa-xmark"></i></div></th>
            </tr>
            <tr>
              <th>#</th>
              <th>Cost Price</th>
              <th>Selling Price</th>
              <th>Comm.</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>`;

  var profit_gain = false;
  var perCommission = selling_price * commision;

  HTML += `
        <tr class="bg-navy text-white">
              <td colspan="6" style="text-align: center;">
              <span class="text-white">Quantity: </span>${quantity} (${parseFloat(perCommission.toFixed(2))})
              </td>
            </tr>
        `;

  for (let index = 0; index < counting; index++) {
    var comm = quantity * selling_price * commision;
    var index_num = index + 1;
    var profit = ((quantity * selling_price) - (quantity * cost_price)) - comm;

    var sale_per_unit = (quantity * selling_price - comm) / quantity;


    var total_cost = (quantity * cost_price).toFixed(2);
    var total_revenue = (quantity * selling_price).toFixed(2);


    HTML += `
        <tr data-info="${total_cost}-${total_revenue}" class="${CURRENT_PRICE == selling_price.toFixed(2) ? 'current-gain' : ''} ${!profit_gain && profit > 0 ? 'profit-gain' : ''}">
              <td>${index_num}</td>
              <td>${cost_price}</td>
              <td>${selling_price.toFixed(2)} (${sale_per_unit.toFixed(2)})</td>
              <td>${comm.toFixed(2)}</td>
              <td>${profit.toFixed(2)}</td>
            </tr>
        `;
    selling_price += 0.1;
    selling_price = parseFloat(selling_price.toFixed(2));
    if (profit > 0) {
      profit_gain = true;
    }
  }

  HTML += `</tbody></table>`;
  $('#calculate-table-list').prepend(HTML);



};





const calculateNewCostPerUnit = (oldUnits, oldCostPerUnit, newInvestment, currentPrice) => {
  // Calculate new average cost per unit
  const oldTotalCost = oldUnits * oldCostPerUnit;
  const newUnits = newInvestment / currentPrice;
  const totalCost = oldTotalCost + newInvestment;
  const totalUnits = oldUnits + newUnits;
  const newAverageCost = totalCost / totalUnits;
  const newCostPerUnit = parseFloat(newAverageCost.toFixed(2));
  return newCostPerUnit;
}





$(document).on('click', 'tr', function () {
  $(this).addClass('selected').siblings().removeClass('selected');

  if (!$(this).data('info')) {
    return false;
  }

  var dataInfo = $(this).data('info');
  var values = dataInfo.split('-');
  var totalCost = parseFloat(values[0]);
  var totalRevenue = parseFloat(values[1]);

  $(this).siblings().find('.remove-container').remove();

  $(this).after(`<tr><td colspan="5" class="text-center remove-container">
      Total Cost: 
      <strong>
        ${totalCost.toFixed(2)}</strong> | Total Revenue: <strong>${totalRevenue.toFixed(2)} | Profit: ${(totalRevenue - totalCost).toFixed(2)}
      </strong>
      <button class="btn btn-remove-row btn-danger remove-row">
        <i class="fa-solid fa-xmark"></i>
      </button>
      </td></tr>`);


});

$(document).on('click', '.remove-row', function () {
  $(this).closest('tr').remove();
});



function roundToNearest(value, step) {
  return Math.round(value / step) * step;
}