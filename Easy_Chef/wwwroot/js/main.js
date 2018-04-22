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
        userCheckCookieName: "UserCheck",
        cartCookieName: "Cart",
        welcomeMessage: "Howdy, {0}",
        cartEmptyMessage: "Oh no, Cart is Empty!",
        orderSubmitMessage: "This will submit the order. Click OK to continue"
    },
    ChifuMessages: {
        cartdictionary: ["Well, that's a smart choice", "You're one in mellon", "I prepared this meal specially for you"],
        greetingDictionary: ["Howdy, people of Texas", "Rise and shine", "You forgot your apron Chef!", "Let's make something awesome today"]
    },
    init: function () {
        //position the footer as per screen height
        EasyChef.Utility.positionFooter();
        EasyChef.Cart.updateCartBadgeCount();
    },
    Checkout: {
        fetchUserData: function () {
            //check if user exist
            //if yes: fetch data and load in the view
            var authenticationData = JSON.parse(EasyChef.Utility.readCookie(EasyChef.globalVars.authenticationCookieName));
            if (authenticationData != null) {
                if (authenticationData.UserExist) {
                    //data exist.load into UI
                    console.log("Render user address details");
                    EasyChef.Checkout.showUserDetails(authenticationData);
                }
            }
        },
        showUserDetails: function (data) {
            //  $(".fname").val(data.first_name);
            //$(".lname").val(data.last_name);
            // $(".phone").val(data.UserPhone);
            // $(".address").val(data.UserAddress);
            // $(".email").val(data.UserEmail);
            //if (data.DBSyncRequired)
            //    $('#saveinfo').prop('checked', true);
        },
        performUserDataUpdate: function () {
            if ($("#shippingform").valid()) {
                //update authentication cookie
                var data = JSON.parse(EasyChef.Utility.readCookie(EasyChef.globalVars.authenticationCookieName));
                if (data != null) {
                    if ($('#saveinfo').is(":checked")) {

                        data.first_name = $(".fname").val();
                        data.last_name = $(".lname").val();
                        data.UserPhone = $(".phone").val();
                        data.UserAddress = $(".address").val();
                        data.UserEmail = $(".email").val();
                        data.DBSyncRequired = true;

                        //mark data for update
                        //TODO: check the flow again
                    }
                    else {
                        if (data != null)
                            data.DBSyncRequired = false;
                    }

                    EasyChef.Utility.createCookie(EasyChef.globalVars.authenticationCookieName, JSON.stringify(data), 7);
                }
                window.location.href = "/payment";
            }
        }
    },
    Payment: {
        showPaymentDetails: function () {
            var userData = EasyChef.Utility.readCookie(EasyChef.globalVars.authenticationCookieName);
            if (userData != null) {
                userData = JSON.parse(userData);
                var payment = userData.PaymentInfo;
                if (payment != null) {
                    $(".cardnumber").val(payment.cardNumber);
                    $(".cardexpiration").val(payment.expirationDate);
                }
            }
        },
        completeOrder: function () {
            if ($("#paymentform").valid()) {
                if (confirm(EasyChef.globalVars.orderSubmitMessage)) {
                    //check if authentication exist
                    var userData = JSON.parse(EasyChef.Utility.readCookie(EasyChef.globalVars.authenticationCookieName));
                    if (userData != null) {
                        //check if db update required
                        if (userData.DBSyncRequired == true) {
                            //check if user exist
                            var paymentObject = new Object();
                            paymentObject.type = "CC";
                            paymentObject.cardNumber = $(".cardnumber").val();
                            paymentObject.expirationDate = $(".cardexpiration").val();
                            userData.PaymentInfo = paymentObject;
                            if (userData.UserId != null) {
                                //Yes: update the user and payment info
                                var userObj = EasyChef.Utility.createUserObject(userData, true);
                                EasyChef.Utility.makeAjax(EasyChef.Utility.format(EasyChef.globalVars.getUserDataUrl, userObj.UserId),
                                    "PUT", JSON.stringify(userObj), function (success) {
                                        console.log("User data successfully updated to db");
                                        EasyChef.Utility.createCookie(EasyChef.globalVars.authenticationCookieName, JSON.stringify(userData), 7);
                                        window.location.href = "/ordercomplete";
                                    }, function (err) {
                                        console.log("Error in updating user data");
                                        window.location.href = "/error/500";
                                    });
                            }
                            else {
                                //No: Create new user and update payment info
                                var userObj = EasyChef.Utility.createUserObject(userData, false);
                                EasyChef.Utility.makeAjax(EasyChef.globalVars.createNewUserUrl,
                                    "POST", JSON.stringify(userObj), function (success) {
                                        console.log("User succesfully created");
                                        userData.UserExist = true;
                                        userData.DBSyncRequired = false;
                                        userData.UserId = success.id;
                                        EasyChef.Utility.createCookie(EasyChef.globalVars.authenticationCookieName, JSON.stringify(userData), 7);
                                        window.location.href = "/ordercomplete";
                                    }, function (err) {
                                        console.log("Error in adding user data" + err);
                                        window.location.href = "/error/500?code=" + err.errorText;
                                    });
                            }
                        }
                        else {
                            //db update not required
                            //TODO: test the flow
                            window.location.href = "/ordercomplete?type=updatenotrequired";
                        }
                    }
                    else {
                        //guest checkout
                        window.location.href = "/ordercomplete?type=guest";
                    }
                }
            }
        }
    },
    Cart: {
        addItem: function () {
            //check and update cart
            this.addItemToCookie();

            this.updateCartBadgeCount();
            //generate funny message
            EasyChef.Utility.funnyMessage(EasyChef.ChifuMessages.cartdictionary);
        },
        updateCartBadgeCount: function () {
            var cartItems = JSON.parse(EasyChef.Utility.readCookie("Cart"));
            if (cartItems != null) {
                if (cartItems.length > 0) {
                    $(".badge").text(cartItems.length);
                    $(".badge").addClass("active");
                    $(".badge").removeClass("hide");
                    $(".cart").addClass("active");
                }
                else {
                    $(".badge").text("");
                    $(".badge").addClass("hide");
                    $(".badge").removeClass("active");
                    $(".cart").removeClass("active");
                }
            }
            else {
                $(".badge").text("");
                $(".badge").addClass("hide");
                $(".badge").removeClass("active");
                $(".cart").removeClass("active");
            }

        },
        addItemToCookie: function () {
            //check if cart cookie exist
            if (EasyChef.Utility.readCookie("Cart") != null) {
                var cartItems = JSON.parse(EasyChef.Utility.readCookie("Cart"));
                //if yes: retrive data, append new data and restore
                //check if current item already exist
                var getcurrentItem = EasyChef.Utility.getJSONObject(cartItems, "RecipeName", $(".recipename").text());
                if (getcurrentItem.length > 0) {
                    //update the quantity
                    getcurrentItem[0].Quantity = parseInt(getcurrentItem[0].Quantity) + 1;
                }
                else {
                    cartItems.push(this.getNewCartItem());
                }
                EasyChef.Utility.createCookie("Cart", JSON.stringify(cartItems), 30);
            }
            else {
                var cart = {};
                var cartItems = [];
                cart.items = cartItems;
                //if no: create data object, add into cookie and store
                cart.items.push(this.getNewCartItem());
                EasyChef.Utility.createCookie("Cart", JSON.stringify(cart.items), 30);
            }


        },
        getNewCartItem: function () {
            var cartItem = new Object();
            cartItem.RecipeName = $(".recipename").text();
            cartItem.Description = $(".shortdescription").text().substring(0, 75) + "...";
            cartItem.Price = $("#recipeprice").val();
            cartItem.Quantity = 1;
            return cartItem;
        },
        generateCartView: function () {
            var cartItems = JSON.parse(EasyChef.Utility.readCookie("Cart"));
            if (cartItems.length > 0) {
                //time to push HTML
                var htmlToPush = "";
                $.each(cartItems, function (i, item) {
                    htmlToPush += EasyChef.Cart.generateCartProductHTML(item);
                });
                //update the DOM
                $("#cart tbody").html(htmlToPush);
                //update total price
                this.updateCartTotal();
                //bind events
                this.bindCartEvents();
                //show table
                $("#cart").removeClass("hide");

            }
            else {
                //cart empty display the message
                $(".container").html("<h2 class='text-center'>" + EasyChef.globalVars.cartEmptyMessage + "</h2>");
            }
        },
        generateCartProductHTML: function (item) {
            var result = "";
            result = "<tr><td data-th='Product'><div class='row'><div class='col-sm-12'><h4 class='nomargin recipename'>" + item.RecipeName +
                "</h4 ><p>" + item.Description +
                "</p></div ></div></td><td data-th='Price' class='itemprice'>$" + item.Price +
                "</td><td data-th='Quantity'><input type='number' class='form-control text-center' value='" + item.Quantity +
                "'></td><td data-th='Subtotal' class='text-center subtotal'>$" + item.Quantity * item.Price +
                "</td><td class='actions data-th=''><button class='btn btn-danger btn-block'><i class='fa fa-trash'></i></button></td></tr>";
            return result;
        },
        bindCartEvents: function () {
            $(document).on("keyup mouseup", "#cart tbody td input[type='number']", function () {
                var computedValue = isNaN(parseFloat($(this).val())) ? 0 : parseFloat($(this).val());
                $(this).parent().parent().find(".subtotal").text("$" + computedValue * parseFloat($(this).parent().parent().find(".itemprice").text().replace("$", "")));
                //update cookie data
                var cartItems = JSON.parse(EasyChef.Utility.readCookie("Cart"));
                var recipeName = $(this).parent().parent().find(".recipename").text();
                var getcurrentItem = EasyChef.Utility.getJSONObject(cartItems, "RecipeName", recipeName);
                getcurrentItem[0].Quantity = parseInt($(this).val());
                EasyChef.Utility.createCookie("Cart", JSON.stringify(cartItems), 30);
                EasyChef.Cart.updateCartTotal();
            });
            $(document).on("click", "table button", function () {
                var recipeName = $(this).parent().parent().find(".recipename").text();
                if (confirm("Do you want to delete " + $(this).parent().parent().find(".recipename").text() + "?")) {
                    //delete from UI
                    $(this).parent().parent().remove();
                    //update cookie
                    var cartItems = JSON.parse(EasyChef.Utility.readCookie("Cart"));
                    var getcurrentItem = EasyChef.Utility.getJSONObject(cartItems, "RecipeName", recipeName);
                    cartItems.splice($.inArray(getcurrentItem, cartItems), 1);
                    EasyChef.Utility.createCookie("Cart", JSON.stringify(cartItems), 30);

                    if (cartItems.length == 0) {
                        // cart is empty,show default view
                        EasyChef.Cart.generateCartView();
                    }
                    EasyChef.Cart.updateCartBadgeCount();
                }
                else {
                    // alert("Smart Choice Indeed!");
                    EasyChef.Utility.funnyMessage(["Smart choice Chef! I bet you won't regret it."]);
                }
                // alert("Do you want to delete " + $(this).parent().parent().find(".recipename").text() + "?");
                EasyChef.Cart.updateCartTotal();
            });

        },
        updateCartTotal: function () {
            var total = 0;
            $.each($("#cart tbody tr td[data-th='Subtotal']"), function (i, item) {
                total += parseFloat($(this).text().replace("$", ""));
            });
            $("#cart .carttotal").text("$" + total);
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
                    //if (EasyChef.Utility.getPageName() == "login") {
                    //    window.location.href = '/';
                    //    //$("#status").removeClass("hide");
                    //    //$("#userData").removeClass("hide");
                    //    //$(".btn-danger").removeClass("hide");
                    //    //document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response.first_name + '!';
                    //    //document.getElementById('userData').innerHTML = '<p><b>FB ID:</b> ' + response.id + '</p><p><b>Name:</b> ' + response.first_name + ' ' + response.last_name + '</p><p><b>Email:</b> ' + response.email + '</p><p><b>Gender:</b> ' + response.gender + '</p><p><b>Locale:</b> ' + response.locale + '</p><p><b>Picture:</b> <img src="' + response.picture.data.url + '"/></p><p><b>FB Profile:</b> <a target="_blank" href="' + response.link + '">click to view profile</a></p>';
                    //}
                });
        },
        logout: function () {
            FB.getLoginStatus(function (response) {
                if (response.status == 'connected') {
                    FB.logout(function (response) {
                        EasyChef.Utility.manageNavAfterLogout()
                        console.log("User logged out!");
                        return false;
                    });

                }
            });
        }
    },
    Utility:
    {
        createUserObject: function (obj, userExist) {
            var userObject = new Object();
            if (userExist)
                userObject.UserId = obj.UserId;
            userObject.UserFname = obj.first_name;
            userObject.UserLname = obj.last_name;
            userObject.UserEmail = obj.UserEmail;
            userObject.UserAddress = obj.UserAddress;
            userObject.RoleId = obj.UserRole == "Admin" ? 1 : 2;
            userObject.UserFbId = obj.fbid;
            userObject.UserPhone = obj.UserPhone;
            if (obj.PaymentId != null)
                userObject.PaymentId = obj.PaymentId;
            userObject.Payment = obj.PaymentInfo;

            return userObject;
        },
        makeAjax: function (url, verb, data, successcallback, errorcallback) {
            $.ajax({
                url: url,
                data: data,
                type: verb,
                success: function (response) {
                    successcallback(response);
                },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
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
        getQueryStringValue: function (name) {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars[name];
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
                    objects = objects.concat(EasyChef.Utility.getJSONObject(obj[i], key, val));
                } else if (i == key && obj[key] == val) {
                    objects.push(obj);
                }
            }
            return objects;
        },
        getPageName: function () {
            return location.pathname.split('/').slice(-1)[0].toLowerCase();
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
                    obj.DBSyncRequired = false;
                    if (success == "") {
                        //user not available
                        //set user role as user
                        obj.UserRole = "User";
                        obj.UserExist = false;
                    }
                    else {
                        //Yay!, user available in database
                        obj.UserRole = success.roleName;
                        obj.UserAddress = success.userAddress;
                        obj.UserEmail = success.userEmail;
                        obj.PaymentInfo = success.payment;
                        obj.PaymentId = success.paymentId;
                        obj.first_name = success.userFname;
                        obj.last_name = success.userLname;
                        obj.UserPhone = success.userPhone
                        obj.UserExist = true;
                        obj.UserId = success.userId;

                    }
                    if (obj.UserRole == "Admin") {
                        //create the admin nav if not available
                        EasyChef.Utility.createAdminNav();
                    }
                    EasyChef.Utility.createCookie(EasyChef.globalVars.authenticationCookieName, EasyChef.Utility.createJSON(obj), 7);
                    console.log(success);
                    if (EasyChef.Utility.getPageName() == "checkouttype")
                        window.location.href = "/checkout";
                    else {
                        window.location.href = "/"
                    }
                }, function (err) {
                    //handle error
                    console.log(err);
                });
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
        },
        showSnackBar: function () {
            var elem = $("#snackbar");
            elem.addClass("show");
            // After 3 seconds, remove the show class from DIV
            setTimeout(function () { elem.removeClass("show"); }, 5000);
        },
        funnyMessage: function (items) {
            //get random message
            var item = items[Math.floor(Math.random() * items.length)];
            item = "Chef Chifu - " + "'" + item + "'";
            $("#snackbar").text(item);
            EasyChef.Utility.showSnackBar();
        }
    }
};

// this will called when document is ready
$(function () {
    EasyChef.init();
});

