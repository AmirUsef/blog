$(document).ready(function() {
    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });
    if (window.localStorage.getItem('role') == 'blogger') {
        $(".first").html(`<li><a href="/user/addArticle">افزودن مقاله جدید</a></li><li><a href="/article/articles/${window.localStorage.getItem('userId')}" class="myArticles">مقالات من</a></li>`)
        $(".last").html(`<li><a class="deleteBtn">حذف اکانت</a></li>`)
        $(".deleteBtn").click(function() {
            $.ajax({
                type: "DELETE",
                url: `/user/${window.localStorage.getItem('userId')}`,
                async: false,
                success: function() {
                    window.location.href = 'http://localhost:3000/auth/login'
                },
                error: function(error) {
                    $('.toast').toast({ delay: 5000 });
                    $('.toast').toast('show')
                    $(".toast-body").html("خطای سرور")
                }
            })
        })
    } else {
        $(".first").html(`<li><a href="/user/AllUsers">کاربران</a></li>`)
        $(".delete").css("background-color", "red")
        $(".reset").css("background-color", "green")
        $(".delete").click(function() {
            const id = $(this).attr("userId")
            $.ajax({
                type: "DELETE",
                url: `/user/${id}`,
                async: false,
                success: function() {
                    location.reload()
                },
                error: function(error) {
                    $('.toast').toast({ delay: 5000 });
                    $('.toast').toast('show')
                    $(".toast-body").html("خطای سرور")
                }
            })
        })
        $(".reset").click(function() {
            const username = $(this).attr("username")
            $.ajax({
                type: "POST",
                url: `/auth/resetPass`,
                data: { username },
                async: false,
                success: function() {
                    location.reload()
                },
                error: function(error) {
                    $('.toast').toast({ delay: 5000 });
                    $('.toast').toast('show')
                    $(".toast-body").html("خطای سرور")
                }
            })
        })
    }

})