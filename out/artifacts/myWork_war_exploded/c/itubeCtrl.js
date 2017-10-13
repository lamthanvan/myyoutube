var page, limit;
page = getParameterByName("page");
limit = getParameterByName("limit");
// console.log(page+' | '+limit);
var VIDEO_API_URL_VER1 = 'https://youtube-video-api-1608.appspot.com/youtube/api';
var VIDEO_API_URL = "https://youtube-api-challenger2.appspot.com/videos";
var API_KEY = 'AIzaSyARBKW7hWfmEYm7tswDHUsp68hUsfvgjbM';
var videoId = getParameterByName("v");
var VIDEO_INFO_API_URL = "https://youtube-video-api-1608.appspot.com/youtube/api?id=" + videoId;
var YT_CHECK_URL = 'https://www.googleapis.com/youtube/v3/videos?id=' + videoId + '&key=' + API_KEY + '&fields=items&part=snippet,statistics';
var PLAYLIST_API_URL = "https://youtube-api-challenger2.appspot.com/playlists";
app.controller('videosCtrl', function($scope, $http) {
    // $http.get(VIDEO_API_URL).then(function(response) {
    //     $scope.videos = response.data;
    // });
    $scope.init = function(){
        $scope.getListVideoService();
    }
    $scope.getListVideoService = function(){
        $http({
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("tokenKey")
            },
            url: VIDEO_API_URL
        }).then(function successCallback(response, status, xhr) {
            $scope.videos = response.data;
        }, function errorCallback(response) {
            console.log(resp);
            // alert(resp.errors[0].title + '! ' + resp.errors[0].detail);
        }, function errorCallback(response) {});
    }
    $scope.deleteVideo = function(videoid) {
        if (hasRole()) {
            $http({
                url: VIDEO_API_URL + '?id=' + videoid,
                method: 'DELETE'
            }).then(function successCallback(data, status, xhr) {
                console.log(VIDEO_API_URL + '?id=' + videoid);
                alert('success')
            }, function errorCallback(response) {
                var resp = response.data;
                console.log(resp);
                // alert(resp.errors[0].title + '! ' + resp.errors[0].detail);
            }, function errorCallback(response) {});
        } else {
            alert('Bạn cần đăng nhập để truy cập vào tính năng này!');
        }
    }
});
app.controller('registerCtrl', function($scope, $http, $window) {
    if (hasRole()) {
        $window.location.href = 'index.html';
    }
});
app.controller('videoInfoCtrl', function($scope, $http) {
    $http.get(VIDEO_INFO_API_URL).then(function(response) {
        // alert('im in');
        $scope.videoInfo = response.data;
        $scope.tags = $scope.videoInfo.keywords.split(",");
        $scope.$on('ngGetInforFinish', function(ngRepeatFinishedEvent) {
            var owl = $('.owl-stage');
            owl.owlCarousel({
                items: 4,
                loop: false,
                dots: false,
                nav: true,
                margin: 10,
                responsive: {
                    0: {
                        items: 1
                    },
                    768: {
                        items: 3
                    },
                    1024: {
                        items: 4
                    },
                    1600: {
                        items: 6
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
            owl.on('mousewheel', '.owl-stage', function(e) {
                if (e.deltaY > 0) {
                    owl.trigger('next.owl');
                } else {
                    owl.trigger('prev.owl');
                }
                e.preventDefault();
            });
        });
        $scope.$on('ngRepeatFinish', function(ngRepeatFinishedEvent) {
            // var owl = $('.owl-stage');
            // owl.owlCarousel({
            //     items: 4,
            //     loop: false,
            //     dots: false,
            //     nav: true,
            //     margin: 10,
            //     responsive: {
            //         0: {
            //             items: 1
            //         },
            //         768: {
            //             items: 3
            //         },
            //         1024: {
            //             items: 4
            //         },
            //         1600: {
            //             items: 6
            //         }
            //     }
            // });
            // // Go to the next item
            // $('.owl-next').click(function() {
            //     owl.trigger('next.owl.carousel');
            // })
            // // Go to the previous item
            // $('.owl-prev').click(function() {
            //     // With optional speed parameter
            //     // Parameters has to be in square bracket '[]'
            //     owl.trigger('prev.owl.carousel', [300]);
            // })
            // owl.on('mousewheel', '.owl-stage', function(e) {
            //     if (e.deltaY > 0) {
            //         owl.trigger('next.owl');
            //     } else {
            //         owl.trigger('prev.owl');
            //     }
            //     e.preventDefault();
            // });
        });
    });
});
// playlist controller
app.controller('playlistCtrl', function playlistCtrl($scope, $http, $window) {
    if (hasRole()) {
        $scope.tabName;
        $scope.playlists;
        $scope.meta;
        $scope.page;
        $scope.limit;
        $scope.tabName = 'playlist';
        $scope.init = function() {
            // console.log(localStorage.getItem("tokenKey"));
            $scope.currentPage = 1;
            $scope.limit = 12;
            $scope.getPlaylistService($scope, $http);
            $scope.totalPage;
            $scope.tabName = 'playlist';
            $scope.dataToSend = {
                "data": {
                    "type": "Playlist",
                    "attributes": {
                        "name": '',
                        "description": '',
                        "thumbnailUrl": '',
                    }
                }
            }
        }
        $scope.pagination = function(comand) {
            if (comand === 'minus') {
                if ($scope.currentPage >= 3) {
                    $scope.currentPage = $scope.currentPage - 2;
                } else {
                    $scope.currentPage = $scope.currentPage - 1;
                }
            } else if (comand === 'plus') {
                $scope.currentPage = $scope.currentPage + 2;
            } else if (comand === 'c') {
                $scope.currentPage = $scope.currentPage + 1;
            }
            $scope.getPlaylistService($scope, $http);
        }
        $scope.prev = function() {
            $scope.currentPage--;
            $scope.pagination();
        }
        $scope.next = function() {
            $scope.currentPage++;
            $scope.pagination();
        }
        $scope.switchTab = function(tabName) {
            this.tabName = tabName;
        }
        $scope.getPlaylistService = function($scope, $http) {
            // console.log("Tokenkey: "+localStorage.getItem("tokenKey"));
            $http({
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("tokenKey")
                },
                url: PLAYLIST_API_URL + '?page=' + $scope.currentPage + '&limit=' + $scope.limit,
            }).then(function successCallback(response) {
                if (response === '{}') {
                    alert('Chưa có playlist!');
                } else {
                    $scope.playlists = response.data.data;
                    $scope.meta = response.data.meta;
                    // console.log(response.data);
                    $scope.totalPage = $scope.meta.totalPage;
                    // console.log(response.data);
                    //$scope.meta.totalPage;
                    // console.log($scope.currentPage);
                }
            }, function errorCallback(response) {});
        }
        $scope.doSubmit = function() {
            $http({
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("tokenKey")
                },
                url: PLAYLIST_API_URL,
                data: $scope.dataToSend
            }).then(function successCallback(response) {
                $('#alert-success').text('Success');
                $('#alert-success').show();
                $('#alert-error').hide();
            }, function errorCallback(response) {
                var resp = response.data;
                $('#alert-error').text(resp.errors[0].title + '! ' + resp.errors[0].detail);
                $('#alert-error').show();
                $('#alert-success').hide();
            }, function errorCallback(response) {});
        }
    } else {
        alert('Bạn cần đăng nhập để truy cập vào tính năng này!');
        $window.location.href = 'index.html';
        return false;
    }
});
app.controller('uploadVideoCtrl', function($scope) {
    var d = new Date();
    var videoBOD = formatDate(d);
    $scope.videoURL = "";
    $scope.videoToUpload = {
        videoId: "",
        name: "",
        description: "",
        keywords: "",
        category: "",
        genre: "",
        authorName: "lamtv",
        authorEmail: "lamtvd00516@fpt.edu.vn",
        birthday: videoBOD
    }
    $scope.getLink = function() {
        alert($scope.videoURL)
    }
});

function hasRole() {
    if (typeof(Storage) !== "undefined") {
        if (localStorage.getItem("tokenKey") !== null) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
        alert("Sorry, your browser does not support Web Storage...");
    }
}

function getLink($scope) {
    alert(videoToUpload.videoId)
}

function submitForm($scope) {}

function getVideoInfo($scope, $http) {
    $http.get(VIDEO_INFO_API_URL).then(function(response) {
        $scope.videoInfo = response.data;
        $scope.tags = $scope.videoInfo.keywords.split(",");
        $scope.$on('ngGetInforFinish', function(ngRepeatFinishedEvent) {
            // console.log($scope.tags);
        });
        $scope.$on('ngRepeatFinish', function(ngRepeatFinishedEvent) {
            var owl = $('.owl-stage');
            owl.owlCarousel({
                items: 4,
                loop: false,
                dots: false,
                nav: true,
                margin: 10,
                responsive: {
                    0: {
                        items: 1
                    },
                    768: {
                        items: 3
                    },
                    1024: {
                        items: 4
                    },
                    1600: {
                        items: 6
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
            owl.on('mousewheel', '.owl-stage', function(e) {
                if (e.deltaY > 0) {
                    owl.trigger('next.owl');
                } else {
                    owl.trigger('prev.owl');
                }
                e.preventDefault();
            });
            // alert('ok')
        });
    });
}