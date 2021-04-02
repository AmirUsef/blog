$(document).ready(function() {
    pagInation()
})


function pagInation() {
    const url = new URL(window.location.href);
    let page = url.searchParams.get("pageno")
    if (!page)
        page = 1
    url.searchParams.set('pageno', parseInt(page) - 1)
    if (page && page != 1)
        $(".pagination").append(`<li class="page-item" id="pre">
        <a class="page-link" href=${url.href} aria-label="Previous">
            <span aria-hidden="true">&laquo;</span></a></li>`)
    for (let index = 0; index < articlesLength / 6; index++) {
        url.searchParams.set('pageno', index + 1)
        if (page == index + 1)
            $(".pagination").append(`<li class="page-item disabled">
            <a class="page-link" href=${url.href}>${index+1}</a></li>`)
        else
            $(".pagination").append(`<li class="page-item">
            <a class="page-link" href=${url.href}>${index+1}</a></li>`)
    }
    url.searchParams.set('pageno', parseInt(page) + 1)
    if (page < Math.ceil(articlesLength / 6))
        $(".pagination").append(`<li class="page-item" id="next">
        <a class="page-link" href=${url.href} aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>`)
}