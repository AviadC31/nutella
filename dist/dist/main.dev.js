"use strict";

var socket = io();
var answerData = {
  currentTime: 0
};
var isNameValid = false;
var isPhoneValid = false;
var isEmailValid = false;
var name = $(".name_inp").find("input");
var phone = $(".phone_inp").find("input");
var email = $(".email_inp").find("input");
var terms = $("label").find("#cb1");
var isTermsChecked = $("#cb1").prop("checked");
var questionsCounter = 1;
var alreadySingIn = false;
var isExist = false;
var isChecked = false;
var interval = null;
$("#cb1").on('click', function (e) {
  isChecked = !isChecked;
});

if (screen.width < 1025) {
  $('#description_page1').attr("style", "display:none");
  $('#description_page1_mob').attr("style", "display:block");
  $('#body').attr('style', 'background-image:url(../assets/imgs/bg_mob.png)');
} else {
  $('#description_page1').attr("style", "display:block");
  $('#description_page1_mob').attr("style", "display:none");
  $('#body').attr('style', 'background-image:url(../assets/imgs/bg_desk.jpg)');
}

$(window).on("resize", function () {
  if (screen.width < 1025) {
    // $('#description_page1').attr("style", "display:none")
    // $('#description_page1_mob').attr("style", "display:block")
    $('#body').attr('style', 'background-image:url(../assets/imgs/bg_mob.png)');
  } else {
    // $('#description_page1').attr("style", "display:block")
    // $('#description_page1_mob').attr("style", "display:none")
    $('#body').attr('style', 'background-image:url(../assets/imgs/bg_desk.jpg)');
  }
});

userDetails = function userDetails() {
  name.change(function () {
    if (name.val() === "") {
      isNameValid = false;
    } else {
      name.siblings().text('');
      isNameValid = true;
    }

    console.log(name.val());
  });
  phone.change(function () {
    if (phone.val()[0] !== '0' || phone.val()[1] !== '5' || phone.val().length !== 10 || !/^\d+$/.test(phone.val())) {
      phone.siblings().text('אנא הכנס מספר טלפון תקין');
      isPhoneValid = false;
    } else {
      phone.siblings().text('');
      isPhoneValid = true;
    }

    if (phone.val().length == 0) {
      phone.siblings().text('');
      isPhoneValid = true;
    }

    console.log(phone.val());
  });
  email.change(function () {
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.val())) {
      email.siblings().text('אנא הכנס אימייל תקין');
      isEmailValid = false;
    } else {
      email.siblings().text('');
      isEmailValid = true;
    }

    if (email.val().length == 0) {
      email.siblings().text('');
      isEmailValid = true;
    }

    console.log(email.val());
  });

  if (screen.width < 1025) {
    $('#body').attr('style', 'background-image:url(../assets/imgs/bg_mob_2.png)');
  } else {
    $('#body').attr('style', 'background-image:url(../assets/imgs/bg_desk.jpg)');
  }

  console.log($("#opt4").prop("checked"));
  console.log($("#opt3").prop("checked"));
  console.log($("#opt2").prop("checked"));
  console.log($("#opt1").prop("checked"));
  answerData['checkboxValue'] = $("input:checked").siblings("p").attr('id');

  if (answerData.checkboxValue) {
    $("#sendFirstAnswer").attr("style", "display:none");
    $("#options_wrapper").attr("style", "display:none");
    $("#opt4").prop("checked", false);
    $("#opt2").prop("checked", false);
    $("#opt3").prop("checked", false);
    $("#opt1").prop("checked", false);
    socket.emit('firstAnswer', answerData);
  } else {
    $("#no_answer_selected").html('נא לבחור תשובה');
  }
};

start = function start() {
  $("p").remove('#description_page1_mob');
  $("p").remove('#description_page1');

  if (screen.width < 1025) {
    $('#body').attr('style', 'background-image:url(../assets/imgs/bg_mob_2.png)'); // $('#description_page1_mob').attr("style", "display:none")
  } else {
    $('#body').attr('style', 'background-image:url(../assets/imgs/bg_desk.jpg)');
  }

  socket.emit('askOpeningQuestion');
  $("#backToGame").attr("style", "display:none");
  $("#nutella_regular_wrapper").attr("style", "display:none");
  $("#title").attr("style", "display:none");
  $("#stars_wrapper").attr("style", "display:none");
  $("#sub_title").attr("style", "display:none");
  $("#title_page1").attr("style", "display:none");
  $("#description_page1").attr("style", "display:none");
  $("#sub_description_page1").attr("style", "display:none");
  $("#btn_page1").attr("style", "display:none");
  $("#rail").attr("style", "display:none");
  $("#terms").attr("style", "display:none");
  $("#rail_head_wrapper").attr("style", "display:block");
  $("#title_page2").attr("style", "display:block");
  $("#sub_title_page2").attr("style", "display:block");
  $("#options_wrapper").attr("style", "display:block");
  $("#sendFirstAnswer").attr("style", "display:block");
  $("#title_page2").html('רגע לפני שמתחילים');
};

socket.on('question', function (question) {
  var answers = $(".options");

  for (var i = 0; i < answers.length; i++) {
    var target = Math.floor(Math.random() * answers.length - 1) + 1;
    var target2 = Math.floor(Math.random() * answers.length - 1) + 1;
    answers.eq(target).before(answers.eq(target2));
  }

  $('#sub_title_page2').html(question.question);
  $('#A').html(question.A);
  $('#B').html(question.B);
  $('#C').html(question.C);
  $('#D').html(question.D);
});
$("#opt1").on("click", function () {
  $("#opt2").prop("checked", false);
  $("#opt3").prop("checked", false);
  $("#opt4").prop("checked", false);
});
$("#opt2").on("click", function () {
  $("#opt1").prop("checked", false);
  $("#opt3").prop("checked", false);
  $("#opt4").prop("checked", false);
});
$("#opt3").on("click", function () {
  $("#opt2").prop("checked", false);
  $("#opt1").prop("checked", false);
  $("#opt4").prop("checked", false);
});
$("#opt4").on("click", function () {
  $("#opt2").prop("checked", false);
  $("#opt3").prop("checked", false);
  $("#opt1").prop("checked", false);
});

opening = function opening() {
  if (!isNameValid) {
    name.siblings().text('אנא הכנס שם מלא');
    isNameValid = false;
  } else {
    name.siblings().text('');
    isNameValid = true;
  }

  if (!isPhoneValid || phone.val().length == 0) {
    phone.siblings().text('אנא הכנס מספר טלפון תקין');
    isPhoneValid = false;
  } else {
    phone.siblings().text('');
    isPhoneValid = true;
  }

  if (!isEmailValid || email.val().length == 0) {
    email.siblings().text('אנא הכנס אימייל תקין');
    isEmailValid = false;
  } else {
    email.siblings().text('');
    isEmailValid = true;
  }

  console.log(isChecked);

  if (isChecked) {
    terms.closest('div').siblings('.errorCb').text('');
  } else {
    terms.closest('div').siblings('.errorCb').text('אנא קרא את התקנון');
  }

  if (isNameValid && isPhoneValid && isEmailValid && isChecked) {
    var _isNameValid = false;
    var _isPhoneValid = false;
    var _isEmailValid = false;
    isExist = false;
    var userDet = {
      name: name.val(),
      phone: phone.val(),
      email: email.val()
    };

    if (!alreadySingIn) {
      socket.emit('saveUserDetails', userDet);
      socket.on('errorSaving', function () {
        isExist = true;
        console.log(isExist);
      });
    }

    setTimeout(function () {
      console.log(isExist);

      if (isExist) {
        popup();
      } else {
        $("#form_container").attr("style", "display:none");
        $('#title_page2').attr("style", "display:block");
        $('#sub_title_page2').attr("style", "display:block");
        $("#title_page1").attr("style", "display:none");
        $("#title_page1_2").attr("style", "display:none");
        $("#title_page1_3").attr("style", "display:none");
        socket.emit('askQuestion');
        $("#timer").attr("style", "display:block");
        $("#rail_head_wrapper").attr("style", "display:none");
        $("#rail_head_wrapper_dynamic").attr("style", "display:block");
        interval = setInterval(function () {
          answerData.currentTime++;
          $("#timer").html("".concat(new Date(answerData.currentTime * 1000).toISOString().substr(14, 5)));
        }, 1000);
        $("#no_answer_selected").html('');
        $("#title_page2").html("".concat(questionsCounter, " \u05E9\u05D0\u05DC\u05D4"));
        $("#options_wrapper").attr("style", "display:block");
        $("#nutella_regular_wrapper").attr("style", "display:none");
        $("#sendFirstAnswer").attr("style", "display:block");
        $("#sendFirstAnswer").attr("onclick", "nextQuestion()");
        $("#sendFirstAnswer").attr("id", "sendAnswer");
        $("#sendAnswer").html('לשאלה הבאה');
        if (screen.width > 1024) $("#sendAnswer").css({
          width: '14.75rem'
        });

        if (screen.width < 1025) {
          $('#body').attr('style', 'background-image:url(../assets/imgs/bg_mob_2.png)');
        } else {
          $('#body').attr('style', 'background-image:url(../assets/imgs/bg_desk.jpg)');
        }

        $(window).on("resize", function () {
          if (screen.width < 1025) {
            $('#body').attr('style', 'background-image:url(../assets/imgs/bg_mob_2.png)');
          } else {
            $('#body').attr('style', 'background-image:url(../assets/imgs/bg_desk.jpg)');
          }
        });
        $(window).on("resize", function () {
          if (screen.width < 1025) {
            $('#body').attr('style', 'background-image:url(../assets/imgs/bg_mob_2.png)');
          } else {
            $('#body').attr('style', 'background-image:url(../assets/imgs/bg_desk.jpg)');
          }
        });
      }
    }, 1500);
  }
};

socket.on('correctedAnswer', function () {
  $("#no_answer_selected").html('');
  $('#description_page1').attr("style", "display:none");
  $('#timer').attr("style", "display:none");
  $('#title_page2').attr("style", "display:block");
  $('#sub_title_page2').attr("style", "display:block");
  $('#options_wrapper').attr("style", "display:none");
  $("#title_page2").html('?מי גאון');
  $("#sub_title_page2").html('מתחילים בעוד 1,2,3');
  $("#nutella_regular_wrapper").attr("style", "display:block");
  $("#nutella_regular").attr("src", "./assets/imgs/nutella_sale.png");
  setTimeout(function () {
    $("#form_container").attr("style", "display:flex");
    $("#title_page1").attr("style", "display:block");
    $("#nutella_regular_wrapper").attr("style", "display:none");
    $('#title_page2').attr("style", "display:none");
    $('#sub_title_page2').attr("style", "display:none");

    if (screen.width < 1025) {
      $("#title_page1").html(",שניה לפני שמתחילים");
      $('#body').attr('style', 'background-image:url(../assets/imgs/bg_mob_2.png)');
      $("#title_page1").css({
        top: '83.75rem',
        fontSize: '7.2625rem'
      });
      $("#title_page1_2").attr("style", "display:block");
      $("#title_page1_2").html("השאירו פרטים");
      $("#title_page1_2").css({
        top: '91.75rem'
      });
      $("#title_page1_3").attr("style", "display:block");
      $("#title_page1_3").html("במידה ותזכו ניצור עמכם קשר");
      $("#title_page1_3").css({
        top: '99.75rem'
      });
    } else {
      $("#title_page1").html("שניה לפני שמתחילים");
      $("#title_page1").css({
        top: '22.75rem',
        fontSize: '4.2625rem',
        width: '19rem',
        lineHeight: '3.8rem',
        color: '#e20019'
      });
      $("#title_page1_2").attr("style", "display:block");
      $("#title_page1_2").html("השאירו פרטים ובמידה ותזכו");
      $("#title_page1_2").css({
        top: '32.75rem',
        fontWeight: '400',
        fontSize: '1.6rem'
      });
      $("#title_page1_3").attr("style", "display:block");
      $("#title_page1_3").html("ניצור עמכם קשר");
      $("#title_page1_3").css({
        top: '34.75rem',
        fontWeight: '400',
        fontSize: '1.6rem'
      });
    }

    $("#title").attr("style", "display:none");
    $("#stars_wrapper").attr("style", "display:none");
    $("#sub_title").attr("style", "display:none");
    $("#title_page1").css({
      textAlign: 'center'
    });
    $("#description_page1").attr("style", "display:none");
    $("#description_page1_mob").attr("style", "display:none");
    $("#sub_description_page1").attr("style", "display:none");
    $("#btn_page1").attr("style", "display:none");
    $("#rail").attr("style", "display:none");
    $("#rail_head_wrapper").attr("style", "display:block");
    $("#terms").attr("style", "display:none");
    isReady = true;
  }, 3000);
});
socket.on('wrongAnswer', function () {
  $("#no_answer_selected").html('');
  $('#description_page1').attr("style", "display:none");
  $("#title_page2").html('אופס תשובה לא נכונה');
  $("#sub_title_page2").html('מוזמנים להסתכל על צנצנת מבצע של נוטלה ולחזור לשחק');
  $("#nutella_regular_wrapper").attr("style", "display:block");
  $("#nutella_regular").attr("src", "./assets/imgs/nutella_sale.png");
  $("#backToGame").attr("style", "display:block");
  alreadySingIn = true;
});

nextQuestion = function nextQuestion() {
  if (screen.width < 1025) {
    $('#body').attr('style', 'background-image:url(../assets/imgs/bg_mob_2.png)');
  } else {
    $('#body').attr('style', 'background-image:url(../assets/imgs/bg_desk.jpg)');
  }

  answerData['checkboxValue'] = $("input:checked").siblings("p").attr('id');
  $("#no_answer_selected").html('');

  if (answerData.checkboxValue) {
    $("#opt4").prop("checked", false);
    $("#opt2").prop("checked", false);
    $("#opt3").prop("checked", false);
    $("#opt1").prop("checked", false);
    socket.emit('answer', answerData);

    if (questionsCounter < 10) {
      socket.emit('askQuestion');
      questionsCounter++;
      $("#title_page2").html("".concat(questionsCounter, " \u05E9\u05D0\u05DC\u05D4"));
    }
  } else {
    $("#no_answer_selected").html('נא לבחור תשובה');
  }
};

socket.on('score', function (score) {
  clearInterval(interval);
  $("#options_wrapper").attr("style", "display:none");
  $("#sub_title_page2").html("!כל הכבוד");
  $("#title_page2").html("\u05E4\u05EA\u05E8\u05EA\u05DD \u05E0\u05DB\u05D5\u05DF ".concat(score, " \u05DE\u05EA\u05D5\u05DA 10 \u05E9\u05D0\u05DC\u05D5\u05EA"));
  $("#sub_description_page1").attr("style", "display:block");
  $("#sub_description_page1").html("תודה רבה על ההשתפות במידה ותזכו ניצור אתכם קשר");

  if (screen.width < 1025) {
    $("#title_page2").css({
      width: '71rem',
      lineHeight: "13.2rem",
      textAlign: "center",
      top: "85.75rem",
      fontSize: "13.225rem",
      fontWeight: "900",
      letterSpacing: '-0.525'
    });
    $("#sub_title_page2").css({
      color: "#e20019",
      textAlign: "center",
      top: "74.25rem",
      fontSize: "8.4rem",
      letterSpacing: "-0.125rem",
      lineHeight: "14.2rem",
      fontWeight: "900"
    });
    $("#sub_description_page1").css({
      color: "black",
      position: "absolute",
      top: "131rem",
      fontWeight: "300",
      width: '66.5rem',
      lineHeight: '7.5rem',
      wordSpacing: '0.5rem',
      letterSpacing: '-0.3rem',
      fontSize: '6.5rem'
    });
  } else {
    $("#title_page2").css({
      width: '25rem',
      lineHeight: "3.7rem",
      textAlign: "center",
      top: "30.75rem",
      fontSize: "3.625rem",
      fontWeight: "900"
    });
    $("#sub_title_page2").css({
      color: "#e20019",
      textAlign: "center",
      top: "22.25rem",
      fontSize: "2.4rem",
      letterSpacing: "-0.125rem",
      lineHeight: "14.2rem",
      fontWeight: "900"
    });
    $("#sub_description_page1").css({
      color: "black",
      position: "absolute",
      top: "38.5rem",
      fontWeight: "300"
    });
  }

  $("#nutella").attr("style", "display:none");
  $("#sendAnswer").attr("style", "display:none");
  $("#timer").attr("style", "display:none");
});
$("form").submit(function (e) {
  return false;
});

function popup() {
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}

$("#popupSetoff").on('click', function () {
  var popup = document.getElementById("myPopup");
  popup.classList.remove("show");
});

function doSomething() {
  //do some stuff here. eg:
  document.getElementById("test").innerHTML = "Goodbye!";
}

function showADialog(e) {
  var confirmationMessage = 'Your message here'; //some of the older browsers require you to set the return value of the event

  (e || window.event).returnValue = confirmationMessage; // Gecko and Trident

  return confirmationMessage; // Gecko and WebKit
}

window.beforeunload = function (e) {
  // to do something (Remember, redirects or alerts are blocked here by most browsers):
  doSomething(); // to show a dialog (uncomment to test):

  return showADialog(e);
};

window.onbeforeunload = function (event) {
  return confirm("Confirm refresh");
};

$(document).ready(function () {
  $('a').on('mousedown', stopNavigate);
  $('a').on('mouseleave', function () {
    $(window).on('beforeunload', function () {
      return 'Are you sure you want to leave?';
    });
  });
});

function stopNavigate() {
  $(window).off('beforeunload');
}

$(window).on('beforeunload', function () {
  return 'Are you sure you want to leave?';
});
$(window).on('unload', function () {
  logout();
});