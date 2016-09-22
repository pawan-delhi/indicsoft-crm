$(document).ready(function() {
    /* MESSAGE BOX */
    $(".mb-control").on("click", function() {
        var box = $($(this).data("box"));
        if (box.length > 0) {
            box.toggleClass("open");

            var sound = box.data("sound");

            if (sound === 'alert')
                playAudio('alert');

            if (sound === 'fail')
                playAudio('fail');

        }
        return false;
    });
    $(".mb-control-close").on("click", function() {
        $(this).parents(".message-box").removeClass("open");
        return false;
    });
    /* END MESSAGE BOX */

    x_navigation();
});

$(function() {
    onload();
});

$(window).resize(function() {
    page_content_onresize();
});

function onload() {
    page_content_onresize();
}

function page_content_onresize() {
    $(".page-content,.content-frame-body,.content-frame-right,.content-frame-left").css("width", "").css("height", "");

    var content_minus = 0;
    content_minus = ($(".page-container-boxed").length > 0) ? 40 : content_minus;
    content_minus += ($(".page-navigation-top-fixed").length > 0) ? 50 : 0;

    var content = $(".page-content");
    var sidebar = $(".page-sidebar");

    if (content.height() < $(document).height() - content_minus) {
        content.height($(document).height() - content_minus);
    }

    if (sidebar.height() > content.height()) {
        content.height(sidebar.height());
    }

    if ($(window).width() > 1024) {

        if ($(".page-sidebar").hasClass("scroll")) {
            if ($("body").hasClass("page-container-boxed")) {
                var doc_height = $(document).height() - 40;
            } else {
                var doc_height = $(window).height();
            }
            $(".page-sidebar").height(doc_height);

        }

        if ($(".content-frame-body").height() < $(document).height() - 162) {
            $(".content-frame-body,.content-frame-right,.content-frame-left").height($(document).height() - 162);
        } else {
            $(".content-frame-right,.content-frame-left").height($(".content-frame-body").height());
        }

        $(".content-frame-left").show();
        $(".content-frame-right").show();
    } else {
        $(".content-frame-body").height($(".content-frame").height() - 80);

        if ($(".page-sidebar").hasClass("scroll"))
            $(".page-sidebar").css("height", "");
    }

    if ($(window).width() < 1200) {
        if ($("body").hasClass("page-container-boxed")) {
            $("body").removeClass("page-container-boxed").data("boxed", "1");
        }
    } else {
        if ($("body").data("boxed") === "1") {
            $("body").addClass("page-container-boxed").data("boxed", "");
        }
    }
}





function x_navigation_minimize(action) {

    if (action == 'open') {
        $(".page-container").removeClass("page-container-wide");
        $(".page-sidebar .x-navigation").removeClass("x-navigation-minimized");
        $(".x-navigation-minimize").find(".fa").removeClass("fa-indent").addClass("fa-dedent");

    }

    if (action == 'close') {
        $(".page-container").addClass("page-container-wide");
        $(".page-sidebar .x-navigation").addClass("x-navigation-minimized");
        $(".x-navigation-minimize").find(".fa").removeClass("fa-dedent").addClass("fa-indent");

    }

    $(".x-navigation li.active").removeClass("active");

}

function x_navigation() {

    $(".x-navigation-control").click(function() {
        $(this).parents(".x-navigation").toggleClass("x-navigation-open");

        onresize();

        return false;
    });

    if ($(".page-navigation-toggled").length > 0) {
        x_navigation_minimize("close");
    }

    $(".x-navigation-minimize").click(function() {

        if ($(".page-sidebar .x-navigation").hasClass("x-navigation-minimized")) {
            $(".page-container").removeClass("page-navigation-toggled");
            x_navigation_minimize("open");
        } else {
            $(".page-container").addClass("page-navigation-toggled");
            x_navigation_minimize("close");
        }

        onresize();

        return false;
    });

    $(".x-navigation  li > a").click(function() {

        var li = $(this).parent('li');
        var ul = li.parent("ul");

        ul.find(" > li").not(li).removeClass("active");

    });

    $(".x-navigation li").click(function(event) {
        event.stopPropagation();

        var li = $(this);

        if (li.children("ul").length > 0 || li.children(".panel").length > 0 || $(this).hasClass("xn-profile") > 0) {
            if (li.hasClass("active")) {
                li.removeClass("active");
                li.find("li.active").removeClass("active");
            } else
                li.addClass("active");

            onresize();

            if ($(this).hasClass("xn-profile") > 0)
                return true;
            else
                return false;
        }
    });

    /* XN-SEARCH */
    $(".xn-search").on("click", function() {
            $(this).find("input").focus();
        })
        /* END XN-SEARCH */

}
/* EOF X-NAVIGATION CONTROL FUNCTIONS */

/* PAGE ON RESIZE WITH TIMEOUT */
function onresize(timeout) {
    timeout = timeout ? timeout : 200;

    setTimeout(function() {
        page_content_onresize();
    }, timeout);
}
/* EOF PAGE ON RESIZE WITH TIMEOUT */