var username, fullName, email, password, birthDay, gender, avatar;
var type, id;
var tokenKey
var member;
var attributes = {
    "username": null,
    "fullName": null,
    "email": null,
    "password": null,
    "birthDay": null,
    "gender": null,
    "avatar": null,
}
var data = {
    "type": "Member",
    "attributes": attributes
}

function login() {
    username = $('#login-form input[name = username]').val();
    password = $('#login-form input[name = password]').val();
    attributes = {
        "username": username,
        "password": password,
    }
    var authentication = {
        "data": {
            "type": "MemberLogin",
            "attributes": attributes
        }
    }
    // $.post(MEMBER_AUTH_URL, JSON.stringify(authentication), function(rsdata, status, xhr) {
    //     if (typeof(Storage) !== "undefined") {
    //         // Store
    //         localStorage.setItem("tokenKey", rsdata.data.attributes.secrectToken);
    //         // Retrieve
    //         console.log(localStorage.getItem("tokenKey"));
    //         member = {
    //             Authorization: tokenKey
    //         }
    //     } else {
    //         alert("Sorry, your browser does not support Web Storage...");
    //     }
    //     $('#alert-success').text('Login success! Automatic direct.');
    //     $('#alert-success').show();
    //     $('#alert-error').hide();
    //     // console.log(member);
    //     tokenKey = localStorage.getItem("tokenKey");
    // }).then($.get(MEMBER_AUTH_URL, "Authorization: "+tokenKey,
    //     function(rsdata, status, xhr) {
    //         console.log(rsdata);
    //     }));
    $.ajax({
        url: MEMBER_AUTH_URL,
        // headers: {
        //     "Content-Type": "application/json",
        // },
        type: "POST",
        Authorization: tokenKey,
        data: JSON.stringify(authentication),
        success: function(rsdata, status, xhr) {
            console.log(rsdata.data);
            if (typeof(Storage) !== "undefined") {
                // Store
                localStorage.setItem("tokenKey", rsdata.data.attributes.secrectToken);
                // Retrieve
                console.log(localStorage.getItem("tokenKey"));
            } else {
                alert("Sorry, your browser does not support Web Storage...");
            }
            // console.log(status);
            // console.log(xhr);
            $('#alert-success').text('Login success! Automatic direct.');
            $('#alert-success').show();
            $('#alert-error').hide();
        },
        error: function(request, status, error) {
            var resp = JSON.parse(request.responseText);
            $('#alert-error').text(resp.errors[0].title + '! ' + resp.errors[0].detail);
            $('#alert-error').show();
            $('#alert-success').hide();
        }
    });
}

function register() {
    username = $('#register-form input[name = user-name]').val();
    fullName = $('#register-form input[name = full-name]').val();
    email = $('#register-form input[name = email]').val();
    password = $('#register-form input[name = password]').val();
    birthDay = $('#register-form input[name = birthday]').val();
    gender = $('#register-form select[name="gender"]').val();
    avatar = $('#register-form input[name = avatar]').val();
    var alertSuccess = $('#alert-success');
    var alertError = $('#alert-error');
    attributes = {
        "username": username,
        "fullName": fullName,
        "email": email,
        "password": password,
        "birthDay": birthDay,
        "gender": gender,
        "avatar": avatar,
    }
    var dataToSend = {
        "data": {
            "type": "Member",
            "attributes": attributes
        }
    }
    $.ajax({
        url: MEMBER_API_URL,
        headers: {
            "Content-Type": "application/json",
        },
        data: JSON.stringify(dataToSend),
        type: "POST",
        success: function(data, status, xhr) {
            // console.log(dataToSend);
            alertSuccess.text("Tạo tài khoản thành công!");
            alertSuccess.show();
            alertError.text("");
            alertError.hide();
        },
        error: function(request, status, error) {
            // console.log(dataToSend);
            var resp = JSON.parse(request.responseText);
            $("#alert-success").text("");
            $("#alert-success").hide();
            $("#alert-error").text(resp.errors[0].title + " " + resp.errors[0].detail);
            $("#alert-error").show();
        },
    });
}

function getListMembers() {
    $.ajax({
        url: MEMBER_API_URL,
        headers: {
            "Content-Type": "application/json",
        },
        type: "GET",
        success: function(data) {},
        error: function(request, status, error) {
            var resp = JSON.parse(request.responseText);
            $("#alert-success").text("");
            $("#alert-success").hide();
            $("#alert-error").text(resp.errors[0].title + " " + resp.errors[0].detail);
            $("#alert-error").show();
        }
    });
}
// cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var username = getCookie("username");
    if (username != "") {
        console.log("Welcome again " + username);
    } else {
        username = prompt("Please enter your name:", "");
        if (username != "" && username != null) {
            setCookie("username", username, 5);
        }
    }
}
$(document).ready(function() {
    // $('#btn-login').on('click', function(e) {
    //     login();
    // });
    $('#btn-reg').on('click', function(e) {
        register();
    });
    if (typeof(Storage) !== "undefined") {
        tokenKey = localStorage.getItem("tokenKey");
    } else {
        alert("Sorry, your browser does not support Web Storage...");
    }
});