$(document).scroll(function() {
  var documentScrollTop = $(document).scrollTop();
  if (documentScrollTop > $('#header').height()) {
    $('#navbar').addClass('fixedattop');
    var shiftContent = $('#navbar').height();
    $('#content').css('margin-top', shiftContent + 'px');
  }
  else if ($('#navbar').hasClass('fixedattop')) {
    $('#navbar').removeClass('fixedattop');
    $('#content').css('margin-top', '0px');
  }
});

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
    if ($('#name').val().trim() === "") {
      errors.push('Please add a product name.')
    }
    if ($('#price').val().trim() === "") {
      errors.push('Please add the product price.')
    }
    if ($('#product').val().trim() === "") {
      errors.push('Please specify where the product can be purchased.')
    }
    if ($('#guarantee').val().trim() === "") {
      errors.push('Please add the product guarantee/warranty.')
    }
    if ($('.selected').text() === "") {
      errors.push('Please add at least one category.')
    }
    if (errors.length > 0) {
      $('.errors').html(errors.join('<br>'))
      event.preventDefault();
    }
  });
});
