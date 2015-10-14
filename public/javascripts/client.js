$(document).ready(function() {
  //selected vs not selected
  $('.category').click(function () {
    $(this).toggleClass("selected");
  });

  $('#submit').on('click', function (event) {
    var selection = $('.selected').text();
    $('#categories').val(selection);
  });

  $('#addProd').submit(function (event) {
    var errors = [];
    if ($('.selected').text() === "") {
      errors.push('Please add at least one category.')
    }
    var expDate = document.getElementById("exp_date");
    var selectedValue = expDate.options[expDate.selectedIndex].value;
    if (selectedValue == "customDate") {
      if ($('#purchase_date').val() >= $('#customDate').val()) {
        errors.push('Expiration date must be after purchase date.')
      }
    }
    if (errors.length > 0) {
      $('.errors').html(errors.join('<br>'))
      event.preventDefault();
    }
  });

//add slashes to date automatically
  $(".date").keyup(function(e) {
    if (e.keyCode != 8) {
      if ($(this).val().length == 2) {
        $(this).val($(this).val() + "/");
      } else if ($(this).val().length == 5) {
        $(this).val($(this).val() + "/");
      }
    } else {
      var temp = $(this).val();
      if ($(this).val().length == 5) {
        $(this).val(temp.substring(0,4));
      } else if ($(this).val().length == 2) {
        $(this).val(temp.substring(0,1));
      }
    }
  });

// hidden input field
var expDate = document.getElementById("exp_date");
expDate.onchange=customInput;
function customInput() {
  var expDate = document.getElementById("exp_date");
  var selectedValue = expDate.options[expDate.selectedIndex].value;

  if (selectedValue == "customDate") {
    document.getElementById("customDate").style.display = "inline-block";
    document.getElementById("custDate").style.display = "inline-block";
  } else {
    document.getElementById("customDate").style.display = "none";
    document.getElementById("custDate").style.display = "none";
  }
}

//price to 2 decimal places
document.getElementById("price").onblur =function (){
  this.value = parseFloat(this.value.replace(/,/g, ""))
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//find selected value
// var objSelect = document.getElementById("exp_date");
//
// function setSelectedValue(selectObj, valueToSet) {
//   for (var i = 0; i < selectObj.options.length; i++) {
//     if (selectObj.options[i].text== valueToSet) {
//       selectObj.options[i].selected = true;
//       return;
//     }
//   }
// }
// setSelectedValue(objSelect, "90 Days");

//only allow numbers in date fields
addEvent(document.getElementById('purchase_date'),'keyup',validate);
addEvent(document.getElementById('purchase_date'),'mouseover',validate);
addEvent(document.getElementById('customDate'),'keyup',validate);
addEvent(document.getElementById('customDate'),'mouseover',validate);

function validate(event) {
  var str=this.value;
  var charsAllowed="0123456789/";
  var allowed;
  for(var i=0;i<this.value.length;i++) {
    allowed=false;
    for(var j=0;j<charsAllowed.length;j++) {
      if( this.value.charAt(i)==charsAllowed.charAt(j) ) {
        allowed=true;
      }
    }
    if(allowed==false) {
      this.value = this.value.replace(this.value.charAt(i),""); i--;
    }
  }
  return true;
}

function addEvent(obj,type,fn) {
  if (obj.addEventListener) {
    obj.addEventListener(type,fn,false);
    return true;
  } else if (obj.attachEvent) {
    obj['e'+type+fn] = fn;
    obj[type+fn] = function() {
      obj['e'+type+fn]( window.event );
    }
    var r = obj.attachEvent('on'+type, obj[type+fn]);
    return r;
  } else {
    obj['on'+type] = fn;
    return true;
  }
}

// req.body.exp_date
var expDate = document.getElementById('expDate').innerHTML;
if (expDate == '30-day') {
  document.getElementById('exp_date').value = '30-day';
}
else if (expDate == '60-day') {
  document.getElementById('exp_date').value = '60-day';
}
else if (expDate == '90-day') {
  document.getElementById('exp_date').value = '90-day';
}
else if (expDate == '1-year') {
  document.getElementById('exp_date').value = '1-year';
}
else if (expDate == '3-year') {
  document.getElementById('exp_date').value = '3-year';
}
else if (expDate == '5-year') {
  document.getElementById('exp_date').value = '5-year';
}
else if (expDate == '10-year') {
  document.getElementById('exp_date').value = '10-year';
}
else if (expDate == 'lifetime') {
  document.getElementById('exp_date').value = 'lifetime';
}
else if (expDate == 'customDate') {
  document.getElementById('exp_date').value = 'customDate';
}
})

// if customDate is entered, it should show on edit form
window.onload = function() {
var expDate = document.getElementById("exp_date");
var selectedValue = expDate.options[expDate.selectedIndex].value;

if (selectedValue == "customDate") {
  document.getElementById("customDate").style.display = "inline-block";
  document.getElementById("custDate").style.display = "inline-block";
} else {
  document.getElementById("customDate").style.display = "none";
  document.getElementById("custDate").style.display = "none";
}
}
