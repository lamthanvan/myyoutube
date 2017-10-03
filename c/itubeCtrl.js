var page, limit;
var VIDEO_API_URL = 'https://youtube-video-api-1608.appspot.com/youtube/api?page=' + page + '&limit=' + limit;
var API_KEY = 'AIzaSyARBKW7hWfmEYm7tswDHUsp68hUsfvgjbM';
var videoId = getParameterByName("v");
var VIDEO_INFO_API_URL = "https://youtube-video-api-1608.appspot.com/youtube/api?id=" + videoId;
var YT_CHECK_URL = 'https://www.googleapis.com/youtube/v3/videos?id=' + videoId + '&key=' + API_KEY + '&fields=items&part=snippet,statistics';
app.controller('videosCtrl', function($scope, $http) {
    $http.get(VIDEO_API_URL).then(function(response) {
        $scope.videos = response.data;
    });
});
app.controller('videoCtrl', ['', function() {}])
app.controller('registerCtrl', ['', function() {}])
app.controller('videoInfoCtrl', function($scope, $http) {
    // console.log('video info');
    $http.get(VIDEO_INFO_API_URL).then(function(response) {
        $scope.videoInfo = response.data;
        $scope.tags = $scope.videoInfo.keywords.split(",");
        $scope.$on('ngRepeatFinish', function(ngRepeatFinishedEvent) {
                var owl = $('.owl-stage');            
                owl.owlCarousel({
                    items:4,
                    loop:false,
                    dots:false,
                    nav:true,
                    margin:10,
                    responsive:{
                        0:{
                            items:1
                        },
                        768:{
                            items:3
                        },            
                        1024:{
                            items:4
                        },
                        1600:{
                            items:6
                        }
                    }
                });
                // Go to the next item
                $('.owl-next').click(function() {
                    owl.trigger('next.owl.carousel');
                })
                // Go to the previous item
                $('.owl-prev').click(function() {
                    // With optional speed parameter
                    // Parameters has to be in square bracket '[]'
                    owl.trigger('prev.owl.carousel', [300]);
                })
               owl.on('mousewheel', '.owl-stage', function (e) {
                    if (e.deltaY>0) {
                        owl.trigger('next.owl');
                    } else {
                        owl.trigger('prev.owl');
                    }
                    e.preventDefault();
                });

           // alert('ok')
        });
    });
});
$(document).ready(function() {});