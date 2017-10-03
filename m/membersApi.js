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

function login() {
    username = $('#register-form input[name = username]').val();
    password = $('#register-form input[name = password]').val();
    attributes = {
        "username": username,
        "password": password,
    }
    var dataToSend = {
        "data": {
            "type": "Member",
            "attributes": attributes,
        }
    }
    $.ajax({
        url: MEMBER_AUTH_URL,
        headers: {
            "Content-Type": "application/json",
        },
        type: "POST",
        data: JSON.stringify(dataToSend),
        success: function(data, status, xhr) {
            console.log(data);
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
            console.log(dataToSend);
            alertSuccess.text("Tạo tài khoản thành công!");
            alertSuccess.show();
            alertError.text("");
            alertError.hide();
        },
        error: function(request, status, error) {
            console.log(dataToSend);
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
$(document).ready(function() {
    $('#btn-login').on('click', function(e) {
        login();
    });
    $('#btn-reg').on('click', function(e) {
        register();
    });
});