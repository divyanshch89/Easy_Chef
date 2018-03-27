/*This will be be the main file containing script to render Easy Chef views
****************************
Author(s): Team#4-ISTM 631, Spring 2018
Email: team4istm631@gmail.com
****************************
*/

var EasyChef = EasyChef || {

    globalVars: {},
    init: function () {
        //position the footer as per screen height
        EasyChef.Utility.positionFooter();
    },
    Cart: {
        addItem: function () {
            var currentCount = parseInt($(".badge").text());
            $(".badge").text(currentCount + 1);
            $(".badge").addClass("active");
            $(".badge").removeClass("hide");
            $(".cart").addClass("active");
        }
    },
    Utility:
    {
        positionFooter: function () {
            var footerHeight = 0,
                footerTop = 0,
                $footer = $(".footer");
            footerHeight = $footer.height();
            footerTop = ($(window).scrollTop() + $(window).height() - footerHeight) + "px";

            if (($(document.body).height() + footerHeight) < $(window).height()) {
                $footer.css({
                    position: "absolute",
                    top: footerTop
                });
            } else {
                $footer.css({
                    position: "static"
                })
            }
            $footer.removeClass("hide");
            $(window)
                .scroll(this.positionFooter)
                .resize(this.positionFooter)
        },
        setLocalStorage: function (key, val) {
            if (window.localStorage) {
                localStorage.setItem(key, val);
            }
        },
        getLocalStorage: function (key) {
            var result = null;
            if (EasyChef.Utility.isLocalStorageKeyExist(key))
                return localStorage.getItem(key);
        },
        isLocalStorageKeyExist: function (key) {
            var result = false;
            if (localStorage.getItem(key) != null)
                result = true;
            return result;
        },
        getJSONObject: function (obj, key, val) {
            var objects = [];
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    objects = objects.concat(Academia.Utility.getJSONObject(obj[i], key, val));
                } else if (i == key && obj[key] == val) {
                    objects.push(obj);
                }
            }
            return objects;
        },
        getPageName: function () {
            return location.pathname.split('/').slice(-1)[0].toLowerCase();
        },
        getCurrentDate: function () {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!

            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            return dd + '/' + mm + '/' + yyyy;
        }
    }
};

// this will called when document is ready
$(function () {
    EasyChef.init();
});

