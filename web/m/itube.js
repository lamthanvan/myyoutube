var VIDEO_API_URL = "https://youtube-video-api-1608.appspot.com/youtube/api";
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
var app = angular.module("itube", []).directive('onFinishRender', function($timeout) {
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
});;
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