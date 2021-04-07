$(document).ready(function() {
    $(".myArticles").attr('href', `/article/myArticles/${window.localStorage.getItem('userId')}`)
    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });
    $(".deleteBtn").click(function() {
        $.ajax({
            type: "DELETE",
            url: `/user/${window.localStorage.getItem('userId')}`,
            async: false,
            success: function() {
                window.location.href = 'http://localhost:3000/auth/loginpage'
            },
            error: function(error) {
                $('.toast').toast({ delay: 5000 });
                $('.toast').toast('show')
                $(".toast-body").html("خطای سرور")
            }
        })
    })
})