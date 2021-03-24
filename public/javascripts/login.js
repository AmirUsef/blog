$(document).ready(function() {
    $(".alert .close").click(function() {
        $(".alert").css("display", "none");
    });
    $("#submit").click(function() {
        if (validateInputs()) {
            let user = { username: $("#input1").val(), password: $("#input2").val() }
            $.ajax({
                type: "POST",
                url: "http://localhost:3000/auth/login",
                data: user,
                async: false,
                success: function(result) {
                    window.location.href = `http://localhost:3000/user/dashboard`
                },
                error: function(xhr, status, error) {
                    if (xhr.status == 404) {
                        $(".alert p").html("کاربر یافت نشد")
                        $(".alert").css("display", "block")
                    }
                    if (xhr.status == 500) {
                        $(".alert p").html("خطای سرور")
                        $(".alert").css("display", "block")
                    }
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