const socket = io()
const answerData = { currentTime: 0 }
const terms = $("label").find("#cb1")
const name = $(".name_inp").find("input")
const phone = $(".phone_inp").find("input")
const email = $(".email_inp").find("input")
const isTermsChecked = $("#cb1").prop("checked")
var interval = null
let isExist = false
let isChecked = false
let isNameValid = false
let isPhoneValid = false
let isEmailValid = false
let alreadySingIn = false
let isStarted = false
let questionsCounter = 1

$("#cb1").on('click', () => {
    isChecked = !isChecked
})

if (isStarted) {
    $(window).on("resize", function() {

        if (screen.width < 1025) {
            $('#body').attr('style', 'background-image:url(../assets/imgs/bg_mob_2.png)')
        } else {
            $('#body').attr('style', 'background-image:url(../assets/imgs/bg_desk.jpg)')
        }
    })
}


userDetails = () => {

    name.change(function() {

        if (name.val() === "") {
            isNameValid = false
        } else {
            name.siblings().text('')
            isNameValid = true
        }
    })

    phone.change(function() {

        if (
            phone.val()[0] !== '0' ||
            phone.val()[1] !== '5' ||
            phone.val().length !== 10 ||
            !/^\d+$/.test(phone.val())
        ) {
            phone.siblings().text('אנא הכנס מספר טלפון תקין')
            isPhoneValid = false
        } else {
            phone.siblings().text('')
            isPhoneValid = true
        }
        if (phone.val().length == 0) {
            phone.siblings().text('')
            isPhoneValid = true
        }
    })

    email.change(function() {

        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.val())) {
            email.siblings().text('אנא הכנס אימייל תקין')
            isEmailValid = false
        } else {
            email.siblings().text('')
            isEmailValid = true
        }
        if (email.val().length == 0) {
            email.siblings().text('')
            isEmailValid = true
        }
    })

    // if (screen.width < 1025) {
    //     $('#body').attr('style', 'background-image:url(../assets/imgs/bg_mob_2.png)')
    //     console.log('%%%%%%%%%%%%%%%%%%%%%%')


    // } else {
    //     $('#body').attr('style', 'background-image:url(../assets/imgs/bg_desk.jpg)')

    // }

    answerData['checkboxValue'] = $("input:checked").siblings("p").attr('id')
    if (answerData.checkboxValue) {
        $("#sendFirstAnswer").attr("style", "display:none")
        $("#options_wrapper").attr("style", "display:none")
        $("#opt4").prop("checked", false)
        $("#opt2").prop("checked", false)
        $("#opt3").prop("checked", false)
        $("#opt1").prop("checked", false)
        socket.emit('firstAnswer', answerData)
    } else {
        $("#no_answer_selected").html('נא לבחור תשובה')
    }
}

start = () => {

    $("p").remove('#description_page1')
    $("#nutella_logo_wrapper").attr("style", "display:none")
    isStarted = true

    if (screen.width < 1025) {
        $('#body').attr('style', 'background-image:url(../assets/imgs/bg_mob_2.png)')
    }

    $(window).on("resize", function() {
        if (screen.width < 1025) {

            $('#body').attr('style', 'background-image:url(../assets/imgs/bg_mob_2.png)')
        } else {
            $('#body').attr('style', 'background-image:url(../assets/imgs/bg_desk.jpg)')

        }
    })

    socket.emit('askOpeningQuestion')
    $("#backToGame").attr("style", "display:none")
    $("#nutella_regular_wrapper").attr("style", "display:none")
    $("#title").attr("style", "display:none")
    $("#stars_wrapper").attr("style", "display:none")
    $("#sub_title").attr("style", "display:none")
    $("#start_note").attr("style", "display:none")
    $("#title_page1").attr("style", "display:none")
    $("#description_page1").attr("style", "display:none")
    $("#sub_description_page1").attr("style", "display:none")
    $("#btn_page1").attr("style", "display:none")
    $("#rail").attr("style", "display:none")
    $("#terms").attr("style", "display:none")
    $("#rail_head_wrapper").attr("style", "display:block")
    $("#title_page2").attr("style", "display:block")
    $("#sub_title_page2").attr("style", "display:block")
    $("#sub_title_page2").attr("id", "question")
    $("#options_wrapper").attr("style", "display:block")
    $("#sendFirstAnswer").attr("style", "display:block")
    $("#title_page2").html('רגע לפני שמתחילים')
}

socket.on('question', question => {
    var answers = $(".options")
    for (var i = 0; i < answers.length; i++) {
        var target = Math.floor(Math.random() * answers.length - 1) + 1
        var target2 = Math.floor(Math.random() * answers.length - 1) + 1
        answers.eq(target).before(answers.eq(target2))
    }
    $('#question').html(question.question)
    $('#A').html(question.A)
    $('#B').html(question.B)
    $('#C').html(question.C)
    $('#D').html(question.D)
})


$("#opt1").on("click", function() {
    $("#opt2").prop("checked", false)
    $("#opt3").prop("checked", false)
    $("#opt4").prop("checked", false)
})

$("#opt2").on("click", function() {
    $("#opt1").prop("checked", false)
    $("#opt3").prop("checked", false)
    $("#opt4").prop("checked", false)
})

$("#opt3").on("click", function() {
    $("#opt2").prop("checked", false)
    $("#opt1").prop("checked", false)
    $("#opt4").prop("checked", false)
})

$("#opt4").on("click", function() {
    $("#opt2").prop("checked", false)
    $("#opt3").prop("checked", false)
    $("#opt1").prop("checked", false)
})

opening = async() => {

    if (!isNameValid) {
        name.siblings().text('אנא הכנס שם מלא')
        isNameValid = false
    } else {
        name.siblings().text('')
        isNameValid = true
    }
    if (!isPhoneValid || phone.val().length == 0) {
        phone.siblings().text('אנא הכנס מספר טלפון תקין')
        isPhoneValid = false
    } else {
        phone.siblings().text('')
        isPhoneValid = true
    }
    if (!isEmailValid || email.val().length == 0) {
        email.siblings().text('אנא הכנס אימייל תקין')
        isEmailValid = false
    } else {
        email.siblings().text('')
        isEmailValid = true
    }
    if (isChecked) {
        terms.closest('div').siblings('.errorCb').text('')
    } else {
        terms.closest('div').siblings('.errorCb').text('אנא קרא את התקנון')
    }
    if (isNameValid && isPhoneValid && isEmailValid && isChecked) {

        let isNameValid = false
        let isPhoneValid = false
        let isEmailValid = false

        isExist = false
        const userDet = { name: name.val(), phone: phone.val(), email: email.val() }
        if (!alreadySingIn) {
            socket.emit('saveUserDetails', userDet)
            await new Promise(resolve => {
                socket.on('errorSaving', isSavingFailed => {
                    resolve(isSavingFailed)
                    isExist = isSavingFailed
                        // console.log(isExist)
                })
            })
        }
        // setTimeout(function() {
        // console.log(isExist)
        if (isExist) {
            popup()
        } else {
            socket.emit('askQuestion')
            $("#title_page1_2").remove()
            $("#title_page1_3").remove()
            $("#form_container").attr("style", "display:none")
            $('#title_page2').attr("style", "display:block")
            $('#question').attr("style", "display:block")
            $("#title_page1").attr("style", "display:none")
            $("#title_page1_2").attr("style", "display:none")
            $("#title_page1_3").attr("style", "display:none")
            $("#timer").attr("style", "display:block")
            $("#rail_head_wrapper").attr("style", "display:none")
            $("#rail_head_wrapper_dynamic").attr("style", "display:block")

            interval = setInterval(function() {
                answerData.currentTime++
                    $("#timer").html(`${new Date(answerData.currentTime * 1000).toISOString().substr(14, 5)}`)
            }, 1000)
            $("#no_answer_selected").html('')
            $("#title_page2").html(`${questionsCounter} שאלה`)
            $("#options_wrapper").attr("style", "display:block")
            $("#nutella_regular_wrapper").attr("style", "display:none")
            $("#sendFirstAnswer").attr("style", "display:block")
            $("#sendFirstAnswer").attr("onclick", "nextQuestion()")
            $("#sendFirstAnswer").attr("id", "sendAnswer")
            $("#sendAnswer").html('לשאלה הבאה')


            if (screen.width < 1025) {
                $("#sendAnswer").css({ width: '50.75rem' })
            } else {
                $("#sendAnswer").css({ width: '12.75rem' })
            }

            $(window).on("resize", function() {
                if (screen.width < 1025) {
                    $("#sendAnswer").css({ width: '50.75rem' })
                } else {
                    $("#sendAnswer").css({ width: '12.75rem' })

                }
            })
        }
        // }, 1500)
    }
}

socket.on('correctedAnswer', () => {

    $("#no_answer_selected").html('')
    $('#description_page1').attr("style", "display:none")
    $('#timer').attr("style", "display:none")
    $('#title_page2').attr("style", "display:block")
    $('#question').attr("style", "display:block")
    $('#options_wrapper').attr("style", "display:none")
    $("#title_page2").html('?מי גאון')
    $("#question").attr("id", "sub_title_page2")
    $("#sub_title_page2").html('מתחילים בעוד 1,2,3')
    $("#nutella_regular_wrapper").attr("style", "display:block")
    $("#nutella_regular").attr("src", "./assets/imgs/nutella_sale.png")
    setTimeout(function() {

        $("#sub_title_page2").attr("id", "question")
        $("#form_container").attr("style", "display:flex")
        $("#title_page1").attr("style", "display:block")
        $("#nutella_regular_wrapper").attr("style", "display:none")
        $('#title_page2').attr("style", "display:none")
        $('#question').attr("style", "display:none")

        if (screen.width < 1025) {
            $("#title_page1").html(",שניה לפני שמתחילים")
            $("#title_page1").css({
                    width: '85rem',
                })
                // $('#body').attr('style', 'background-image:url(../assets/imgs/bg_mob_2.png)')
                // console.log('%%%%%%%%%%%%%%%%%%%%%%')

            $("#title_page1").css({
                top: '83.75rem',
                fontSize: '7.2625rem'
            })
            $("#title_page1_2").attr("style", "display:block")
            $("#title_page1_2").html("השאירו פרטים")
            $("#title_page1_2").css({
                top: '91.75rem',
            })
            $("#title_page1_3").attr("style", "display:block")
            $("#title_page1_3").html("במידה ותזכו ניצור עמכם קשר")
            $("#title_page1_3").css({
                top: '99.75rem',
            })
        } else {
            $("#title_page1").html("שניה לפני שמתחילים")
            $("#title_page1").css({
                top: '22.75rem',
                fontSize: '4.2625rem',
                width: '19rem',
                lineHeight: '3.8rem',
                color: '#e20019'
            })

            $("#title_page1_2").attr("style", "display:block")
            $("#title_page1_2").html("השאירו פרטים ובמידה ותזכו")
            $("#title_page1_2").css({
                top: '32.75rem',
                fontWeight: '400',
                fontSize: '1.6rem'
            })
            $("#title_page1_3").attr("style", "display:block")
            $("#title_page1_3").html("ניצור עמכם קשר")
            $("#title_page1_3").css({
                top: '34.75rem',
                fontWeight: '400',
                fontSize: '1.6rem'
            })
        }

        $(window).on("resize", function() {

            if (screen.width < 1025) {
                $("#title_page1").html(",שניה לפני שמתחילים")
                $('#body').attr('style', 'background-image:url(../assets/imgs/bg_mob_2.png)')
                    // console.log('%%%%%%%%%%%%%%%%%%%%%%')

                $("#title_page1").css({
                    top: '85.75rem',
                    fontSize: '7.2625rem',
                    color: 'black',
                    lineHeight: '3.8rem',
                    width: '77rem'
                })
                $("#title_page1_2").attr("style", "display:block")
                $("#title_page1_2").html("השאירו פרטים")
                $("#title_page1_2").css({
                    top: '91.75rem',
                })
                $("#title_page1_3").attr("style", "display:block")
                $("#title_page1_3").html("במידה ותזכו ניצור עמכם קשר")
                $("#title_page1_3").css({
                    top: '99.75rem',
                })
            } else {
                $("#title_page1").html("שניה לפני שמתחילים")
                $("#title_page1").css({
                    top: '22.75rem',
                    fontSize: '4.2625rem',
                    width: '19rem',
                    lineHeight: '3.8rem',
                    color: '#e20019'
                })

                $("#title_page1_2").attr("style", "display:block")
                $("#title_page1_2").html("השאירו פרטים ובמידה ותזכו")
                $("#title_page1_2").css({
                    top: '32.75rem',
                    fontWeight: '400',
                    fontSize: '1.6rem'
                })
                $("#title_page1_3").attr("style", "display:block")
                $("#title_page1_3").html("ניצור עמכם קשר")
                $("#title_page1_3").css({
                    top: '34.75rem',
                    fontWeight: '400',
                    fontSize: '1.6rem'
                })
            }
        })

        $("#title").attr("style", "display:none")
        $("#stars_wrapper").attr("style", "display:none")
        $("#sub_title").attr("style", "display:none")
        $("#start_note").attr("style", "display:none")
        $("#title_page1").css({
            textAlign: 'center',
        })
        $("#description_page1").attr("style", "display:none")
        $("#sub_description_page1").attr("style", "display:none")
        $("#btn_page1").attr("style", "display:none")
        $("#rail").attr("style", "display:none")
        $("#rail_head_wrapper").attr("style", "display:block")
        $("#terms").attr("style", "display:none")
        isReady = true
    }, 3000)
})


socket.on('wrongAnswer', () => {

    $("#no_answer_selected").html('')
    $('#description_page1').attr("style", "display:none")
    $("#title_page2").html('אופס תשובה לא נכונה')
    $("#question").attr("id", "sub_title_page2")
    $("#sub_title_page2").html('מוזמנים להסתכל על צנצנת מבצע של נוטלה ולחזור לשחק')
    $("#nutella_logo_wrapper").attr("style", "display:block")
    $("#backToGame").attr("style", "display:block")
    alreadySingIn = true

})

nextQuestion = () => {
    // if (screen.width < 1025) {
    //     $('#body').attr('style', 'background-image:url(../assets/imgs/bg_mob_2.png)')
    // } else {
    //     $('#body').attr('style', 'background-image:url(../assets/imgs/bg_desk.jpg)')
    // }

    answerData['checkboxValue'] = $("input:checked").siblings("p").attr('id')

    $("#no_answer_selected").html('')
    if (answerData.checkboxValue) {
        $("#opt4").prop("checked", false)
        $("#opt2").prop("checked", false)
        $("#opt3").prop("checked", false)
        $("#opt1").prop("checked", false)
        socket.emit('answer', answerData)
        if (questionsCounter < 10) {
            socket.emit('askQuestion')
            questionsCounter++
            $("#title_page2").html(`${questionsCounter} שאלה`)
        }
    } else {
        $("#no_answer_selected").html('נא לבחור תשובה')
    }
}

socket.on('score', score => {
    clearInterval(interval)
    $("#rail_head_dynamic").attr("src", "./assets/imgs/rail_head_end.gif")
    $("#options_wrapper").attr("style", "display:none")
    $("#question").attr("id", "sub_title_page2")
    $("#sub_title_page2").html("!כל הכבוד")
    $("#title_page2").html(`פתרתם נכון ${score} מתוך 10 שאלות`)
    $("#sub_description_page1").attr("style", "display:block")
    $("#sub_description_page1").html("תודה רבה על ההשתתפות. במידה ותזכו ניצור אתכם קשר")


    $(window).on("resize", function() {

        if (screen.width < 1025) {
            $("#title_page2").css({
                width: '71rem',
                lineHeight: "13.2rem",
                textAlign: "center",
                top: "85.75rem",
                fontSize: "13.225rem",
                fontWeight: "900",
                letterSpacing: '-0.525'
            })
            $("#sub_title_page2").css({
                color: "#e20019",
                textAlign: "center",
                top: "74.25rem",
                fontSize: "8.4rem",
                letterSpacing: "-0.125rem",
                lineHeight: "14.2rem",
                fontWeight: "900"
            })
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
            })
        } else {
            $("#title_page2").css({
                width: '25rem',
                lineHeight: "3.7rem",
                textAlign: "center",
                top: "30.75rem",
                fontSize: "3.625rem",
                fontWeight: "900"
            })
            $("#sub_title_page2").css({
                color: "#e20019",
                textAlign: "center",
                top: "22.25rem",
                fontSize: "2.4rem",
                letterSpacing: "-0.125rem",
                lineHeight: "14.2rem",
                fontWeight: "900"
            })
            $("#sub_description_page1").css({
                color: "black",
                position: "absolute",
                top: "38rem",
                fontWeight: "300",
                fontSize: '1.5625rem',
                letterSpacing: '0rem',
                wordSpacing: '0rem',
            })
        }
    })

    if (screen.width < 1025) {
        $("#title_page2").css({
            width: '71rem',
            lineHeight: "13.2rem",
            textAlign: "center",
            top: "85.75rem",
            fontSize: "13.225rem",
            fontWeight: "900",
            letterSpacing: '-0.525'
        })
        $("#sub_title_page2").css({
            color: "#e20019",
            textAlign: "center",
            top: "74.25rem",
            fontSize: "8.4rem",
            letterSpacing: "-0.125rem",
            lineHeight: "14.2rem",
            fontWeight: "900"
        })
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
        })
    } else {
        $("#title_page2").css({
            width: '25rem',
            lineHeight: "3.7rem",
            textAlign: "center",
            top: "30.75rem",
            fontSize: "3.625rem",
            fontWeight: "900"
        })
        $("#sub_title_page2").css({
            color: "#e20019",
            textAlign: "center",
            top: "22.25rem",
            fontSize: "2.4rem",
            letterSpacing: "-0.125rem",
            lineHeight: "14.2rem",
            fontWeight: "900"
        })
        $("#sub_description_page1").css({
            color: "black",
            position: "absolute",
            top: "38rem",
            fontWeight: "300"
        })
    }

    $("#nutella").attr("style", "display:none")
    $("#sendAnswer").attr("style", "display:none")
    $("#timer").attr("style", "display:none")
})

$("form").submit(function() {
    return false
})

function popup() {
    var popup = document.getElementById("myPopup")
    popup.classList.toggle("show")
}
$("#popupSetoff").on('click', () => {
    var popup = document.getElementById("myPopup")
    popup.classList.remove("show")
})

function doSomething() {
    //do some stuff here. eg:
    document.getElementById("test").innerHTML = "Goodbye!"
}

function showADialog(e) {
    var confirmationMessage = 'Your message here'
        //some of the older browsers require you to set the return value of the event
        (e || window.event).returnValue = confirmationMessage // Gecko and Trident
    return confirmationMessage // Gecko and WebKit
}
window.beforeunload = function(e) {
    // to do something (Remember, redirects or alerts are blocked here by most browsers):
    doSomething()
        // to show a dialog (uncomment to test):
    return showADialog(e)
}

window.onbeforeunload = function(event) {
    return confirm("Confirm refresh")
}


$(document).ready(function() {

    $('a').on('mousedown', stopNavigate)

    $('a').on('mouseleave', function() {
        $(window).on('beforeunload', function() {
            return 'Are you sure you want to leave?'
        })
    })
})

function stopNavigate() {
    $(window).off('beforeunload')
}

$(window).on('beforeunload', function() {
    return 'Are you sure you want to leave?'
})

$(window).on('unload', function() {

    logout()

})