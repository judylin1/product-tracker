$(document).ready(function() {
  //selected vs not selected
  $('.category').click(function () {
    $(this).toggleClass("selected");
  });

  $('#submit').on('click', function (event) {
    var selection = $('.selected').text();
    $('#categories').val(selection);
  });

  //purchases
  $('#purchase').click(function () {
    var cleanUp = $(location).attr('href').split('/');
    var checked = $('#purchase:checked').val();
    if (checked === 'on') {
      $.get('/purchase?product='+cleanUp[6]+'&checked='+'yes')
    } else {
      $.get('/purchase?product='+cleanUp[6]+'&checked='+'no')
    }
  });

  $('#addProd').submit(function (event) {
    var errors = [];
    if ($('.selected').text() === "") {
      errors.push('Please add at least one category.')
    }
    if (errors.length > 0) {
      $('.errors').html(errors.join('<br>'))
      event.preventDefault();
    }
  });
});
