$(document).ready(function() {
    $("#submit").click(function() {
        if (validateInputs()) {
            let user = { username: $("#input1").val().trim(), password: $("#input2").val() }
            $.ajax({
                type: "POST",
                url: "/auth/login",
                data: user,
                async: false,
                success: function(result) {
                    window.location.href = `http://localhost:3000/user/dashboard`
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
    let password = $("#input2").val();
    if (username == "")
        $("#error1").html("الزامی")
    else
        $("#error1").html("")
    if (password == "")
        $("#error2").html("الزامی")
    else
        $("#error2").html("")
    return ($("#error1").html() == "" && $("#error2").html() == "")
}