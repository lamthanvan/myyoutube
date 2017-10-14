app.controller('loginCtrl', function($window, $scope, $http, $interval) {
    $scope.remain;
    $scope.msg;
    $scope.error;
    $scope.success;
    $scope.attributes = {
        "username": '',
        "password": '',
    }
    $scope.authentication = {
        "data": {
            "type": "MemberLogin",
            "attributes": $scope.attributes
        }
    }
    $scope.init = function() {
        $scope.remain = 5;
        $scope.msg = '';
        $scope.attributes.username = '';
        $scope.attributes.password = '';
        if (typeof(Storage) !== "undefined") {
            $scope.tokenKey = localStorage.getItem("tokenKey");
            if ($scope.tokenKey !== null) {
                $window.location.href = $window.history.back();
            }
        } else {
            alert("Sorry, your browser does not support Web Storage...");
        }
    }
    $scope.login = function() {
        // console.log($scope.attributes);
        if ($scope.attributes.username !== '') {
            $http({
                method: 'POST',
                url: MEMBER_AUTH_URL,
                data: $scope.authentication
            }).then(function successCallback(rsdata, status, xhr) {
                // console.log(rsdata.data.data.attributes.secrectToken);
                if (typeof(Storage) !== "undefined") {
                    // Store
                    localStorage.setItem("tokenKey", rsdata.data.data.attributes.secretToken);
                    localStorage.setItem("username", $scope.attributes.username);
                    localStorage.setItem("userId", rsdata.data.data.attributes.userId);
                    redirect();
                    $interval(redirect, 1000);
                    // console.log(rsdata.data.data.attributes.secretToken);
                    // console.log(localStorage.getItem("tokenKey"));
                    // Retrieve
                } else {
                    alert("Sorry, your browser does not support Web Storage...");
                }
                $scope.success = true;
                $scope.error = false;
            }, function errorCallback(response) {
                var resp = response.data;
                // console.log(resp.errors[0].title);
                $scope.error = true;
                $scope.success = false;
                $scope.msg = resp.errors[0].title + '!' + resp.errors[0].detail;
            });
        } else {
            $scope.error = true;
            $scope.success = false;
            $scope.msg = "Please enter username, password";
            // console.log($scope.attributes.username);
            // console.log(localStorage.getItem("tokenKey"));
        }
    }
    var redirect = function() {
        if ($scope.remain == 1) {
            $interval.cancel();
            // console.log($window.history.back);
             $window.location.href = 'index.html';
        } else {
            $scope.remain = $scope.remain - 1;
            // console.log($scope.remain);
        }
    }
})
app.controller('authenCtrl', function($window, $scope, $route) {
    $scope.isLogined;
    $scope.authenName;
    $scope.tokenKey;
    $scope.authenId;
    $scope.init = function() {
        $scope.checkAuthen();
    }
    $scope.checkAuthen = function() {
        if (typeof(Storage) !== "undefined") {
            $scope.tokenKey = localStorage.getItem("tokenKey");
            if ($scope.tokenKey !== null) {
                $scope.authenName = localStorage.getItem("username");
                $scope.authenId = localStorage.getItem('userId');
                $scope.isLogined = true;
            } else {
                $scope.isLogined = false;
            }
        } else {
            alert("Sorry, your browser does not support Web Storage...");
            $scope.isLogined = false;
        }
    }
    $scope.logout = function() {
        localStorage.removeItem("tokenKey");
        localStorage.removeItem("username");
        localStorage.removeItem("userId");
        $window.location.href = 'index.html';
    }
});
// function login() {
//     username = $('#login-form input[name = username]').val();
//     password = $('#login-form input[name = password]').val();
//     attributes = {
//         "username": username,
//         "password": password,
//     }
//     var authentication = {
//         "data": {
//             "type": "MemberLogin",
//             "attributes": attributes
//         }
//     }
//     // $.post(MEMBER_AUTH_URL, JSON.stringify(authentication), function(rsdata, status, xhr) {
//     //     if (typeof(Storage) !== "undefined") {
//     //         // Store
//     //         localStorage.setItem("tokenKey", rsdata.data.attributes.secrectToken);
//     //         // Retrieve
//     //         console.log(localStorage.getItem("tokenKey"));
//     //         member = {
//     //             Authorization: tokenKey
//     //         }
//     //     } else {
//     //         alert("Sorry, your browser does not support Web Storage...");
//     //     }
//     //     $('#alert-success').text('Login success! Automatic direct.');
//     //     $('#alert-success').show();
//     //     $('#alert-error').hide();
//     //     // console.log(member);
//     //     tokenKey = localStorage.getItem("tokenKey");
//     // }).then($.get(MEMBER_AUTH_URL, "Authorization: "+tokenKey,
//     //     function(rsdata, status, xhr) {
//     //         console.log(rsdata);
//     //     }));
//     $.ajax({
//         url: MEMBER_AUTH_URL,
//         // headers: {
//         //     "Content-Type": "application/json",
//         // },
//         type: "POST",
//         Authorization: tokenKey,
//         data: JSON.stringify(authentication),
//         success: function(rsdata, status, xhr) {
//             console.log(rsdata.data);
//             if (typeof(Storage) !== "undefined") {
//                 // Store
//                 localStorage.setItem("tokenKey", rsdata.data.attributes.secrectToken);
//                 // Retrieve
//                 console.log(localStorage.getItem("tokenKey"));
//             } else {
//                 alert("Sorry, your browser does not support Web Storage...");
//             }
//             // console.log(status);
//             // console.log(xhr);
//             $('#alert-success').text('Login success! Automatic direct.');
//             $('#alert-success').show();
//             $('#alert-error').hide();
//         },
//         error: function(request, status, error) {
//             var resp = JSON.parse(request.responseText);
//             $('#alert-error').text(resp.errors[0].title + '! ' + resp.errors[0].detail);
//             $('#alert-error').show();
//             $('#alert-success').hide();
//         }
//     });
// }