
var videoId, name, description, tags, genre, category, lstCategory, videoBOD;
var video = {
    videoId: videoId,
    name: name,
    description: description,
    keywords: tags,
    category: lstCategory,
    genre: genre,
    authorName: "lamtv",
    authorEmail: "lamtvd00516@fpt.edu.vn",
    birthday: videoBOD
};
//angular code
var app = angular.module("itube", ["ngRoute"]).directive('onFinishRender', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    }
});
app.run(function($rootScope) {
    $rootScope.playlistsModel;
});
app.directive('ngConfirmClick', [
    function() {
        return {
            link: function(scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click', function(event) {
                    if (window.confirm(msg)) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
    }
])
app.config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "chisaipage/videos.html"
    }).when("/home/", {
        templateUrl: "chisaipage/videos.html"
    }).when("/home/videos", {
        templateUrl: "chisaipage/videos.html"
    }).when("/home/playlist", {
        templateUrl: "chisaipage/playlist.html",      
    }).when("/home/upload", {
        templateUrl: "chisaipage/uploadvideo.html"
    }).when("/home/contact", {
        templateUrl: "chisaipage/contact.html"
    }).when("/home/sitemap", {
        templateUrl: "chisaipage/sitemap.html"
    });
});

//////effect + page ready control
window.onscroll = function() {
    scrollFunction()
};

function scrollFunction() {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        // document.getElementById("navbar-top").style.top = "-80px";
        $('#navbar-top').addClass('mobile-scroll-ver');
    } else if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
        // document.getElementById("navbar-top").style.top = "0";
        $('#navbar-top').removeClass('mobile-scroll-ver');
    }
    if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
        // document.getElementById("navbar-top").style.top = "-80px";
        $('#navbar-top').addClass('desktop-scroll-ver');
    } else if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        // document.getElementById("navbar-top").style.top = "0";
        $('#navbar-top').removeClass('desktop-scroll-ver');
    }
}

function isValidURL(url) {
    var expression = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?=.*v=((\w|-){11}))(?:\S+)?$/;
    var regex = new RegExp(expression);
    if (url.match(regex)) {
        return true;
    } else {
        return false;
    }
}

function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getDate() + 1 + "/" + date.getMonth() + "/" + date.getFullYear() + "  " + strTime;
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}