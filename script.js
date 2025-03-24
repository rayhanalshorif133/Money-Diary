$(() => {

  $("#btn-submit").click(() => {

    const company_name = $('#company_name').val();

    console.log(company_name);

    const HTML = $(".demo-table").html();
    $(".insert-table").append(HTML);
  });

});