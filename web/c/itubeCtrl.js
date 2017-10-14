var page, limit;
page = getParameterByName("page");
limit = getParameterByName("limit");
// console.log(page+' | '+limit);
var MEMBER_API_URL = "https://youtube-api-challenger2.appspot.com/members";
var MEMBER_AUTH_URL = "https://youtube-api-challenger2.appspot.com/authentication";
var VIDEO_API_URL_VER1 = 'https://youtube-video-api-1608.appspot.com/youtube/api';
var VIDEO_API_URL = "https://youtube-api-challenger2.appspot.com/videos";
var API_KEY = 'AIzaSyARBKW7hWfmEYm7tswDHUsp68hUsfvgjbM';
var videoId = getParameterByName("v");
var VIDEO_INFO_API_URL = "https://youtube-api-challenger2.appspot.com/videos/";
var YT_CHECK_URL;
var PLAYLIST_API_URL;
app.controller('videosCtrl', function($scope, $http) {
    // $http.get(VIDEO_API_URL).then(function(response) {
    //     $scope.videos = response.data;
    // });
    $scope.init = function() {
        $scope.getListVideoService();
    }
    $scope.getListVideoService = function() {
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
app.controller('uploadVideoCtrl', function($scope, $http) {
    $scope.ytURL = "";
    $scope.playlistsModel = {};
    $scope.playlist;
    $scope.ytId;
    $scope.nullPl = {
        type: "playlist",
        id: "0",
        attributes: {
            name: "Không thuộc playlist"
        }
    };
    $scope.videoToUpload = {
        data: {
            type: "video",
            attributes: {
                "youtubeId": "",
                "name": "",
                "description": "",
                "keywords": "",
                "playlistId": "",
                "thumbnail": ""
            }
        }
    };
    $scope.init = function() {
        // $scope.getPlaylistModel();
    }
    $scope.getPlaylistModel = function() {
        $http({
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("tokenKey")
            },
            url: PLAYLIST_API_URL + '?page=1&limit=100'
        }).then(function successCallback(response) {
            if (response === '{}') {
                // alert('Chưa có playlist!');
                template: "chua co pll"
            }
            else {
                $scope.playlistsModel = response.data.data
                $scope.playlistsModel.unshift($scope.nullPl)
                // console.log($scope.playlistsModel)
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
            url: VIDEO_API_URL,
            data: $scope.videoToUpload
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
    //get data from youtube data api
    $scope.getYTData = function() {
        if (isValidURL($scope.ytURL)) {
            // console.log('valid url')
            var url = new URL($scope.ytURL);
            $scope.ytId = getParameterByName("v", url);
            $scope.isExitsURL = 'https://www.googleapis.com/youtube/v3/videos?part=id&id=' + $scope.ytId + '&key=' + API_KEY;
            $http({
                url: $scope.isExitsURL,
                type: 'GET'
            }).then(function successCallback(response) {
                // console.log(response.data.pageInfo.totalResults)
                if (response.data.pageInfo.totalResults === 1) {
                    $scope.ytApiGetVideo();
                } else {
                    // console.log('khong ton tai')
                }
            }, function errorCallback(response) {
                console.log('nhay vao error');
            });
        }
    }
    //call youtube data api
    $scope.ytApiGetVideo = function() {
        var alertWarning = $('#alert-warning');
        var alertError = $('#alert-error');
        var alertSuccess = $('#alert-success');
        YT_API_URL = 'https://www.googleapis.com/youtube/v3/videos?id=' + $scope.ytId + '&key=' + API_KEY + '&fields=items&part=snippet,statistics';
        console.log(YT_API_URL);
        video = null;
        $http({
            url: YT_API_URL,
            type: 'GET'
        }).then(function successCallback(response) {
            $('#alert-success').text('Success');
            $('#alert-success').show();
            $('#alert-error').hide();
            //console.log(response.data)
            var video = response.data.items[0].snippet;
            console.log(video)
            $scope.videoToUpload.name = video.title;
            $scope.videoToUpload.description = video.description;
            $scope.videoToUpload.keywords = video.tags;
        }, function errorCallback(response) {
            $('#alert-error').text('Video không tồn tại!');
            $('#alert-error').show();
            $('#alert-success').hide();
        }, function errorCallback(response) {});
    }

    function addVideo() {
        var alertWarning = $('#alert-warning');
        var alertError = $('#alert-error');
        var alertSuccess = $('#alert-success');
        var d = new Date();
        var videoBOD = formatDate(d);
        var lstCategory = "";
        for (var i = 0, len = category.length; i < len; i++) {
            if (category[i].checked) {
                lstCategory += category[i].value + ',';
            }
        }
        lstCategory = lstCategory.substring(0, lstCategory.length - 1);
        // console.log(lstCategory);
        // console.log(video);
        // console.log(apiUrl);
        var videoUpload = {
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
        //console.log(video);
        $.ajax({
            url: UPLOAD_VIDEO_URL,
            // contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(videoUpload),
            type: 'POST',
            success: function(status, xhr) {
                alertError.hide();
                alertWarning.hide();
                alertSuccess.html('<strong>Thành công!</strong> Tải lên thành công video.')
                alertSuccess.show();
            },
            error: function(status, xhr) {
                alertError.html('<strong>Lỗi!</strong> lỗi bất thường xảy ra, thử lại. code: ' + xhr.status);
                alertError.show();
                alertWarning.hide();
                alertSuccess.hide();
            }
        })
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
        alert("Sorry, your browser does not support Web Storage...");
        return false;
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