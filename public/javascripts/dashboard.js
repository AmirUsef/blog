$(document).ready(function() {
    $(".deleteBtn").click(function() {
        $.ajax({
            type: "DELETE",
            url: "http://localhost:3000/user/delete",
            async: false,
            success: function() {
                window.location.href = 'http://localhost:3000/auth/loginpage'
            },
            error: function(xhr, status, error) {
                $(".alert-danger p").html("خطای سرور")
                $(".alert-danger").css("display", "block")
            }
        });
    })
    $(".modal .close").click(function() {
        $("#myModal").css("display", "none");
    });
    $(".alert .close").click(function() {
        $(".alert").css("display", "none");
    });
    $("#firstName a").click(function() {
        $(".modal").css("display", "block")
        $('.modal-header h2').html("ویرایش نام")
        $(".modal-body").html(`<span class="d-flex flex-row-reverse"><label>:نام جدید </label><input></input><p></p></span>`)
        $('.modal-footer').html(`<button class="btn saveBtn">ثبت</button>`)
        $(".saveBtn").click(function() {
            if ($(".modal-body input").val() == "")
                return $(".modal-body p").html("الزامی")
            else if (!(/^[a-zA-Z\s]*$/).test($(".modal-body input").val()))
                return $(".modal-body p").html("نام معتبر نیست")

            updatedObject = { firstName: $(".modal-body input").val() }
            $.ajax({
                type: "POST",
                url: `http://localhost:3000/user/update`,
                async: false,
                data: updatedObject,
                success: function(result) {
                    $(".alert-success p").html("عملیات موفقیت آمیز")
                    $(".alert-success").css("display", "block")
                    location.reload();
                },
                error: function(xhr, status, error) {
                    $(".alert-danger p").html("خطای سرور")
                    $(".alert-danger").css("display", "block")
                }
            });
        })
    })
    $("#lastName a").click(function() {
        $(".modal").css("display", "block")
        $('.modal-header h2').html("ویرایش نام خانوادگی")
        $(".modal-body").html(`<span class="d-flex flex-row-reverse"><label>:نام خانوادگی جدید </label><input></input><p></p></span>`)
        $('.modal-footer').html(`<button class="btn saveBtn">ثبت</button>`)
        $(".saveBtn").click(function() {
            if ($(".modal-body input").val() == "")
                return $(".modal-body p").html("الزامی")
            else if (!(/^[a-zA-Z\s]*$/).test($(".modal-body input").val()))
                return $(".modal-body p").html("نام معتبر نیست")

            updatedObject = { lastName: $(".modal-body input").val() }
            $.ajax({
                type: "POST",
                url: `http://localhost:3000/user/update`,
                async: false,
                data: updatedObject,
                success: function(result) {
                    $(".alert-success p").html("عملیات موفقیت آمیز")
                    $(".alert-success").css("display", "block")
                    location.reload();
                },
                error: function(xhr, status, error) {
                    $(".alert-danger p").html("خطای سرور")
                    $(".alert-danger").css("display", "block")
                }
            });
        })
    })
    $("#phoneNumber a").click(function() {
        $(".modal").css("display", "block")
        $('.modal-header h2').html("ویرایش شماره همراه")
        $(".modal-body").html(`<span class="d-flex flex-row-reverse"><label>:شماره جدید </label><input type="tel" placeholder="09121111111" maxlength="11"><p></p></span>`)
        $('.modal-footer').html(`<button class="btn saveBtn">ثبت</button>`)
        $(".saveBtn").click(function() {
            if ($(".modal-body input").val() == "")
                return $(".modal-body p").html("الزامی")
            else if (!(/^09[0-9]{9}$/).test($(".modal-body input").val()))
                return $(".modal-body p").html("تلفن همراه معتبر نیست")
            updatedObject = { phoneNumber: $(".modal-body input").val() }
            $.ajax({
                type: "POST",
                url: `http://localhost:3000/user/update`,
                async: false,
                data: updatedObject,
                success: function(result) {
                    $(".alert-success p").html("عملیات موفقیت آمیز")
                    $(".alert-success").css("display", "block")
                    location.reload();
                },
                error: function(xhr, status, error) {
                    if (xhr.status == 409)
                        $(".modal-body p").html("اکانتی با این شماره وجود دارد")
                    else {
                        $(".alert-danger p").html("خطای سرور")
                        $(".alert-danger").css("display", "block")
                    }
                }
            });
        })
    })
    $("#gender a").click(function() {
        $(".modal").css("display", "block")
        $('.modal-header h2').html("ویرایش جنسیت")
        $(".modal-body").html(`<span class="d-flex flex-row-reverse"><label>:جنسیت </label><select><option value="male">Male</option><option value="female">Female</option></select><p></p></span>`)
        $('.modal-footer').html(`<button class="btn saveBtn">ثبت</button>`)
        $(".saveBtn").click(function() {
            updatedObject = { gender: $(".modal-body select").val() }
            $.ajax({
                type: "POST",
                url: `http://localhost:3000/user/update`,
                async: false,
                data: updatedObject,
                success: function(result) {
                    $(".alert-success p").html("عملیات موفقیت آمیز")
                    $(".alert-success").css("display", "block")
                    location.reload();
                },
                error: function(xhr, status, error) {
                    $(".alert-danger p").html("خطای سرور")
                    $(".alert-danger").css("display", "block")
                }
            });
        })
    })
    $("#password a").click(function() {
        $(".modal").css("display", "block")
        $('.modal-header h2').html("ویرایش پسوورد")
        $(".modal-body").html(`<span class="d-flex flex-row-reverse"><label>:پسوورد فعلی</label><input type="password"></input><p></p></span>
                                <span class="d-flex flex-row-reverse"><label>:پسوورد جدید</label><input type="password"></input><p></p></span>
                                <span class="d-flex flex-row-reverse"><label>:تایید پسوورد </label><input type="password"></input><p></p></span>`)
        $('.modal-footer').html(`<button class="btn saveBtn">ثبت</button>`)
        $(".saveBtn").click(function() {
            let password = $(".modal-body input:eq(0)").val()
            let newpassword = $(".modal-body input:eq(1)").val()
            let confirmpass = $(".modal-body input:eq(2)").val()
            if (!password)
                return $(".modal-body p:eq(0)").html("الزامی")
            else
                $(".modal-body p:eq(0)").html("")
            if (!newpassword)
                return $(".modal-body p:eq(1)").html("الزامی")
            else if (!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).test(newpassword))
                return $(".modal-body p:eq(1)").html("پسوورد باید حداقل 8 کاراکتر شامل حداقل 1 حرف و 1 عدد باشد")
            else if (password == newpassword)
                return $(".modal-body p:eq(1)").html("پسوورد جدید و قدیم یکسان هستند")
            else
                $(".modal-body p:eq(1)").html("")
            if (newpassword != confirmpass)
                return $(".modal-body p:eq(2)").html("پسوورد های وارد شده یکسان نیست")
            else
                $(".modal-body p:eq(2)").html("")
            updatedObject = { password, newpassword }
            $.ajax({
                type: "POST",
                url: `http://localhost:3000/user/update`,
                async: false,
                data: updatedObject,
                success: function(result) {
                    $(".alert-success p").html("عملیات موفقیت آمیز")
                    $(".alert-success").css("display", "block")
                    location.reload();
                },
                error: function(xhr, status, error) {
                    if (xhr.status == 404)
                        $(".modal-body p:eq(0)").html("پسوورد وارد شده اشتباه است")
                    else
                        $(".alert-danger p").html("خطای سرور")
                    $(".alert-danger").css("display", "block")
                }
            });
        })
    })

})