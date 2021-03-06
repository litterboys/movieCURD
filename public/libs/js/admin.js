$(function () {
    $('.del').on("click", function (e) {
        var target = $(e.target)
        var id = target.data("id")
        var tr = $(".item-id-" + id)

        if (id) {
            $.ajax({
                type: "DELETE",
                url: "/admin/list?id=" + id
            })
            .done(function (results) {
                if (results.success === 1) {
                    if (tr && tr.length > 0) {
                        tr.remove()
                    }
                }
            })
        }
    })
})