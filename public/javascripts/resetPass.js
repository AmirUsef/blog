$(document).ready(function() {
    $("#submit").click(function() {
        if (validateInputs()) {
            $.ajax({
                type: "POST",
                url: "/auth/resetPass",
                data: { username: $("#input1").val().trim() },
                async: false,
                success: function(result) {
                    $('.toast').css("background-color", "green").toast({ delay: 3000 });
                    $('.toast').toast('show')
                    $('.toast-header strong').html("عملیات موفقیت آمیز")
                    $(".toast-body").html("رمز عبور جدید به شماره همراه شما ارسال شد")
                    setTimeout(function() { window.location.href = `http://localhost:3000/auth/login` }, 3000);
                },
                error: function(error) {
                    $('.toast').toast({ delay: 5000 });
                    $('.toast').toast('show')
                    if (error.status == 404)
                        $(".toast-body").html("اکانت یافت نشد")
                    if (error.status == 500)
                        $(".toast-body").html("خطای سرور")
                }
            });
        }
    })
})

function validateInputs() {
    let username = $("#input1").val();
    if (username == "")
        $("#error1").html("الزامی")
    else
        $("#error1").html("")
    return ($("#error1").html() == "")
}