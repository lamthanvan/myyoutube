var VIDEO_API_URL = "https://youtube-video-api-1608.appspot.com/youtube/api";
var API_KEY = 'AIzaSyARBKW7hWfmEYm7tswDHUsp68hUsfvgjbM';
var videoId = getParameterByName("v");
var YT_CHECK_URL = 'https://www.googleapis.com/youtube/v3/videos?id=' + videoId + '&key=' + API_KEY + '&fields=items&part=snippet,statistics';
app.controller('videosCtrl', function($scope, $http) {
    $http.get(VIDEO_API_URL).then(function(response) {
        $scope.videos = response.data;
    });
});

app.controller('videoInfoCtrl', ['', function() {}])

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

app.controller('registerCtrl', ['', function(){
    
}])