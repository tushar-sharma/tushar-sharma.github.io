$(document).ready(function () {
    var table = $('#dtMaterial').DataTable({
        "paging": true, // Ensure paging is true
        "bSort": false,
        pageLength: 5,
        "autoWidth": true,
        "columns": [
          null,
          null,
          {'searchable': false},
          {'searchable': false}
        ]
      });

    // You can hide and remove rows as follows
    table.rows('.hidden').remove().draw();

    
    $('#dtMaterial_wrapper').find('label').each(function () {
        $(this).parent().append($(this).children());
      });
      $('#dtMaterial_wrapper .dataTables_filter').find('input').each(function () {
        $('input').attr("placeholder", "Search");
        $('input').removeClass('form-control-sm');
      });
      $('#dtMaterial_wrapper .dataTables_length').addClass('d-flex flex-row');
      $('#dtMaterial_wrapper .dataTables_filter').addClass('md-form');
      $('#dtMaterial_wrapper select').removeClass(
        'custom-select custom-select-sm form-control form-control-sm');
      $('#dtMaterial_wrapper select').addClass('mdb-select');
      $('#dtMaterial_wrapper .mdb-select').materialSelect();
      $('#dtMaterial_wrapper .dataTables_filter').find('label').remove();
  });  