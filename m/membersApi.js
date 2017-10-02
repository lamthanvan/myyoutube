var MEMBER_API_URL = "https://youtube-api-challenger.appspot.com/members";
var MEMBER_AUTH_URL = "https://youtube-api-challenger.appspot.com/authentication";
var username, fullName, email, password, birthDay, gender, avatar;
var type, id;
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
$(document).ready(function() {
    $('#btn-login').on('click', function() {
        username = $('#login-form input[name = username]').val();
        password = $('#login-form input[name = password]').val();
        attributes = {
            "username": username;
            "password": password;
        }
    });
    $('#btn-reg').on('click', register());
});

function login(attributes) {
    $.ajax({
        url: MEMBER_AUTH_URL,
        headers: {
            "Content-Type": "application/json",
        },
        type: "POST",
        data: {
            "type": "MemberLogin",
            attributes
        },
        success: function(data, status, xhr) {
            console.log(data);
        }
    });
}

function register() {
    username = $('#login-form input[name = username]').val();
    fullName = $('#login-form input[name = fullname]').val();
    email = $('#login-form input[name = email]').val();
    password = $('#login-form input[name = password]').val();
    birthDay = $('#login-form input[name = birthday]').val();
    gender = $('#login-form input[name = username]').val();
    avatar = $('#login-form input[name = avatar]').val();
    var alertSuccess = $('#alert-success');
    var alertError = $('#alert-error');
    attributes {
        "username": username,
        "fullName": fullname,
        "email": email,
        "password": password,
        "birthDay": birthday,
        "gender": gender,
        "avatar": avatar,
    }
    var dataToSend = {
        "data": {
            "type": "Member",
            "attributes": attributes,
        }
    }
    $.ajax({
        url: MEMBER_API_URL,
        headers: {
            "Content-Type": "application/json",
        },
        type: "POST",
        success: function(data, status, xhr) {
            console.log(data);
            alertSuccess.text("Đăng ký thành công!");
            alertSuccess.show();
            alertError.text("");
            alertError.hide();
        },
        error: function(request, status, error) {
            // console.log(status);
            console.log('request: ' + request);
            console.log('status:' + status);
            console.log('er:' + error);
        },
    });
});
}

function getListMembers() {
    $.ajax({
        url: MEMBER_API_URL,
        headers: {
            "Content-Type": "application/json",
        },
        type: "GET",
        success: function(data, status, xhr) {
            console.log(data);
            // console.log('status:' + status);
            // console.log('xhr: ' + xhr);
            // console.log('data' + data);
        },
        error: function(request, status, error) {
            // console.log(status);
            console.log('request: ' + request);
            console.log('status:' + status);
            console.log('er:' + error);
        },
    });
}