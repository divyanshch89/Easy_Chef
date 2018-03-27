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
        //init fb authentication process
        // EasyChef.Facebook.init();
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
    Facebook: {
        init: function () {
            // Check whether the user already logged in
            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    //display user data
                    console.log("Logged In!")
                    EasyChef.Facebook.getFbUserData();

                }
                else {
                    //show login button
                    console.log("User is not logged in.");
                    $("#adminnav").addClass("hide");
                    if (EasyChef.Utility.getPageName() == "login") {
                        $("#userData").addClass("hide");

                        $("#status").addClass("hide");
                    }
                }
            });
        },
        login: function () {
            FB.login(function (response) {
                if (response.authResponse) {
                    // Get and display the user profile data
                    getFbUserData();
                } else {
                    document.getElementById('status').innerHTML = 'User cancelled login or did not fully authorize.';
                }
            }, { scope: 'public_profile,email' });
        },
        getFbUserData: function () {
            FB.api('/me', { locale: 'en_US', fields: 'id,first_name,last_name,email,link,gender,locale,picture' },
                function (response) {
                    //document.getElementById('fbLink').setAttribute("onclick", "fbLogout()");
                    //document.getElementById('fbLink').innerHTML = 'Logout from Facebook';
                    console.log("Fetching user data");

                    $("#adminnav").removeClass("hide");
                    if (EasyChef.Utility.getPageName() == "login") {
                        $("#status").removeClass("hide");
                        $("#userData").removeClass("hide");
                        document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response.first_name + '!';
                        document.getElementById('userData').innerHTML = '<p><b>FB ID:</b> ' + response.id + '</p><p><b>Name:</b> ' + response.first_name + ' ' + response.last_name + '</p><p><b>Email:</b> ' + response.email + '</p><p><b>Gender:</b> ' + response.gender + '</p><p><b>Locale:</b> ' + response.locale + '</p><p><b>Picture:</b> <img src="' + response.picture.data.url + '"/></p><p><b>FB Profile:</b> <a target="_blank" href="' + response.link + '">click to view profile</a></p>';
                    }
                });
        },
        logout: function () {
            FB.logout(function () {
                document.getElementById('fbLink').setAttribute("onclick", "fbLogin()");
                document.getElementById('fbLink').innerHTML = '<img src="fblogin.png"/>';
                document.getElementById('userData').innerHTML = '';
                document.getElementById('status').innerHTML = 'You have successfully logout from Facebook.';
            });
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

