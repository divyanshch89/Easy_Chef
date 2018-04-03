/*This will be be the main file containing script to render Easy Chef views
****************************
Author(s): Team#4-ISTM 631, Spring 2018
Email: team4istm631@gmail.com
****************************
*/

var EasyChef = EasyChef || {

    globalVars: {
        getUserDataUrl: "/api/Users/{0}",
        createNewUserUrl: "/api/Users",
        authenticationCookieName: "authentication",
        welcomeMessage: "Howdy, {0}"
    },
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
                    //destroy the authentication cookie
                    if (EasyChef.Utility.readCookie(EasyChef.globalVars.authenticationCookieName) != null) {
                        EasyChef.Utility.deleteCookie(EasyChef.globalVars.authenticationCookieName);
                    }
                    EasyChef.Utility.manageNavAfterLogout();
                    if (EasyChef.Utility.getPageName() == "login") {
                        $("#userData").addClass("hide");
                        $("#status").addClass("hide");
                    }
                }
                return;
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
                    console.log("Fetching user data");

                    //change button to log out
                    $(".login").remove();
                    //create welcome message
                    EasyChef.Utility.createWelcome(response.first_name);
                    //insert new logout nav
                    var newLogout = $("<li class='nav-item login'><a class='nav-link' onclick='EasyChef.Facebook.logout()' href='#'><span>Logout</span></a></li >");
                    $("#rightnav li:eq(0)").after(newLogout);

                    //manage user authorization
                    EasyChef.Utility.checkAuthorization(response);
                    if (EasyChef.Utility.getPageName() == "login") {
                        $("#status").removeClass("hide");
                        $("#userData").removeClass("hide");
                        document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response.first_name + '!';
                        document.getElementById('userData').innerHTML = '<p><b>FB ID:</b> ' + response.id + '</p><p><b>Name:</b> ' + response.first_name + ' ' + response.last_name + '</p><p><b>Email:</b> ' + response.email + '</p><p><b>Gender:</b> ' + response.gender + '</p><p><b>Locale:</b> ' + response.locale + '</p><p><b>Picture:</b> <img src="' + response.picture.data.url + '"/></p><p><b>FB Profile:</b> <a target="_blank" href="' + response.link + '">click to view profile</a></p>';
                    }
                });
        },
        logout: function () {
            FB.getLoginStatus(function (response) {
                if (response.status == 'connected') {
                    FB.logout(function (response) {
                        EasyChef.Utility.manageNavAfterLogout()
                        console.log("User logged out!");
                        return;
                    });

                }
            });
        }
    },
    Utility:
    {
        makeAjax: function (url, verb, data, succescallback, errorcallback) {
            $.ajax({
                url: url,
                data: data,
                type: verb,
                success: function (response) {
                    succescallback(response);
                },
                error: function (err) {
                    errorcallback(err);
                }
            });
        },
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
        },
        createCookie: function (name, value, days) {
            var expires;
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toGMTString();
            } else {
                expires = "";
            }
            document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
        },
        readCookie: function (name) {
            var nameEQ = encodeURIComponent(name) + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ')
                    c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0)
                    return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
            return null;
        },
        deleteCookie: function (name) {
            EasyChef.Utility.createCookie(name, "", -1);
        },
        format: function (str, col) {
            col = typeof col === 'object' ? col : Array.prototype.slice.call(arguments, 1);
            return str.replace(/\{\{|\}\}|\{(\w+)\}/g, function (m, n) {
                if (m == "{{") { return "{"; }
                if (m == "}}") { return "}"; }
                return col[n];
            });
        },
        checkAuthorization: function (fbresponse) {
            //check if cookie exist for user
            if (this.readCookie(EasyChef.globalVars.authenticationCookieName) == null) {
                //cookie don't exist
                //check if the user exist in database and get his role
                EasyChef.Utility.makeAjax(this.format(EasyChef.globalVars.getUserDataUrl, fbresponse.id), "GET", "", function (success) {
                    //handle success
                    //user exist
                    //set username and role in a cookie
                    var obj = new Object();
                    obj.fbid = fbresponse.id;
                    obj.first_name = fbresponse.first_name;
                    if (success == "") {
                        //user not available
                        //create user with fb response data
                        //set obj role for cookie
                        EasyChef.Utility.createNewUser(fbresponse);
                        obj.UserRole = "User";
                    }
                    else {
                        //user available in database
                        obj.UserRole = success.roleName;
                    }
                    if (obj.UserRole == "Admin") {
                        //create the admin nav if not available
                        EasyChef.Utility.createAdminNav();
                    }
                    EasyChef.Utility.createCookie(EasyChef.globalVars.authenticationCookieName, EasyChef.Utility.createJSON(obj), 5);
                    console.log(success);
                }, function (err) {
                    //handle error
                    console.log(err);
                })
            }
            else {
                //if not then, check
                //user exist in db ,if yes get its role
                //create a cookie with users email and set the role
            }
        },
        createJSON: function (obj) {
            return JSON.stringify(obj);
        },
        createAdminNav: function () {
            if ($("#adminnav").length == 0) {
                var newElem = $("<li id='adminnav' class='nav-item'><a class='nav-link' href='/admin/recipe'><span>Admin</span></a></li>");
                $("#rightnav li:eq(1)").after(newElem);
            }
        },
        createNewUser: function () {

        },
        setNavActive: function (elem) {
            //reset all nav active
            $(".navbar li.active").removeClass("active");
            if (elem == "") {
                elem = EasyChef.Utility.getPageName();
                $(".navbar ." + elem).addClass("active");
            }
            else
                $(".navbar #" + elem).addClass("active");


        },
        createWelcome: function (username) {
            if ($(".userwelcome").length == 0) {
                var message = "<li class='nav-item userwelcome'><a href='#'><span>" + EasyChef.Utility.format(EasyChef.globalVars.welcomeMessage, username) + "!</span></a></li>";
                $("#rightnav").prepend(message);
            }
        },
        manageNavAfterLogout: function () {
            $(".login a").prop("href", "/login");
            $(".login a").prop("onclick", null).off("click");
            $(".login span").text("Login");
            if ($("#adminnav")) {
                $("#adminnav").remove();
            }
            if ($(".userwelcome")) {
                $(".userwelcome").remove();
            }
            //delete the authorization cookie
            EasyChef.Facebook.init();
        }
    }
};

// this will called when document is ready
$(function () {
    EasyChef.init();
});

