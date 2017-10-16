var apiKey = 'AIzaSyARBKW7hWfmEYm7tswDHUsp68hUsfvgjbM'; //IzaSyARBKW7hWfmEYm7tswDHUsp68hUsfvgjbM   new key active from 28/9/2017
var videoId;
var YT_API_URL = 'https://www.googleapis.com/youtube/v3/videos?id=' + videoId + '&key=' + apiKey + '&fields=items&part=snippet,statistics';
var UPLOAD_VIDEO_URL = "https://youtube-video-api-1608.appspot.com/youtube/api";
// var VIDEO_API_URL = "https://youtube-video-api-1608.appspot.com/youtube/api?id=" + videoId;
var PLAYLIST_API_URL = "https://youtube-api-challenger.appspot.com/playlist";
var video;
var flag = true;

function handleForm() {
    if (isFormValid()) {
     
        addVideo();
    } else {
        return false;
    }
}
function isFormValid() {
    //getvalue
    url = document.getElementById("video-link").value.trim();
    name = document.getElementById("video-name").value;
    description = document.getElementById("video-description").value;
    tags = document.getElementById("video-tags").value;
    category = document.getElementsByName("video-category");
    var isValid = false;
    console.log(category);
    // Handle form.
    if (ytGetVideoByLink(url)) {
        isValid = true;
    } else {
        isValid = false;
    }
    if (name.length <= 0) {
        isValid = false;
        msgAlert('alert-danger', 'Lỗi!', 'Tên video không được để trống', 'alert');
        $('video-name').addClass('alert-danger');
    } else if (name.length > 110) {
        isValid = false;
        msgAlert('alert-danger', 'Lỗi!', 'Tên video không được quá 100 ký tự', 'alert');
        $('video-name').addClass('alert-danger');
    } else {
        $('alert').addClass('hide');
        isValid = true;
    }
    return isValid;
}

function isExitsVideo(videoId) {
    var alertWarning = $('#alert-warning');
    var alertError = $('#alert-error');
    var alertSuccess = $('#alert-success');
    var isExitsURL = 'https://www.googleapis.com/youtube/v3/videos?part=id&id=' + videoId + '&key=' + apiKey;
    $.ajax({
        url: isExitsURL,
        type: 'GET',
        success: function(data, status, xhr) {
            // console.log(data.pageInfo.totalResults);
            if (data.pageInfo.totalResults === 1) {
                // ytApiGetVideo(videoId);
                flag = true;
            } else {
                flag = false;
            }
        },
        error: function() {
            flag = false;
        }
    });
    return flag;
}


function setInputTextAtId(text, id) { //text nội dung chèn vào, id là id của DOM <div id=''>
    $('#' + id).val(text);
}

function ytGetVideoByLink(inputUrl) {
    var alertWarning = $('#alert-warning');
    var alertError = $('#alert-error');
    var alertSuccess = $('#alert-success');
    if (isValidURL(inputUrl)) {
        var url = new URL(inputUrl);
        videoId = getParameterByName("v", url);
        if (videoId != null || videoId != "" || videoId != "undefined") {
            // console.log(videoId);
            if (isExitsVideo(videoId)) {
                ytApiGetVideo(videoId);
            } else {
                alertError.hide();
                alertWarning.text('Warning!Video does not exits please check again')
                alertWarning.show();
                alertSuccess.hide();
                clearFormVideoFill();
            }
        } else {
            alertError.hide();
            alertSuccess.hide();
            alertWarning.text('Can not get video id. Link/url must follow https://www.youtube.com/watch?v=xxx (xxx is video id)')
            alertWarning.show();
            return false;
        }
    } else {
        alertError.hide();
        alertSuccess.hide();
        alertWarning.text('Can not get video id. Link/url must follow https://www.youtube.com/watch?v=xxx (xxx is video id)')
        alertWarning.show();
        return false;
    }
}

function formVideoFill(video, flag) { //flag true-false>> true: fill/ >>false: do not thing.
    if (flag) {
        setInputTextAtId(video.title, 'video-name');
        setInputTextAtId(video.description, 'video-description');
        setInputTextAtId(video.tags, 'video-tags');
    }
}

function clearFormVideoFill() {
    setInputTextAtId('', 'video-name');
    setInputTextAtId('', 'video-description');
    setInputTextAtId('', 'video-tags');
}

function ytApiGetVideo(videoId) {
    var alertWarning = $('#alert-warning');
    var alertError = $('#alert-error');
    var alertSuccess = $('#alert-success');
    YT_API_URL = 'https://www.googleapis.com/youtube/v3/videos?id=' + videoId + '&key=' + apiKey + '&fields=items&part=snippet,statistics';
    // console.log("ytAPI();" + YT_API_URL);
    video = null;
    $.ajax({
        url: YT_API_URL,
        type: 'GET',
        success: function(data, status, xhr) {
            console.log(status);
            video = data.items[0];
            alertError.hide();
            alertWarning.hide();
            alertSuccess.text('Done! load video infomation successed.')
            alertSuccess.show();
            // msgAlert('alert-success','Success!','Get video data done.','alert');
            formVideoFill(video.snippet, true);
        },
        error: function(request, status, xhr) {
            alertError.text('Error! Some thing wrong. Code: ' + status.status);
            alertError.show();
            alertWarning.hide();
            alertSuccess.hide();
            console.log('YT API Failed');
            clearFormVideoFill();
        }
    });
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
function getPlayList() {
    $.post(MEMBER_AUTH_URL,JSON.stringify(authentication), function(rsdata, status, xhr) {
            setCookie("request", xhr);
            // console.log(rsdata);
            $('#alert-success').text('Login success! Automatic direct.');
            $('#alert-success').show();
            $('#alert-error').hide();
        }),
    $.ajax({
        url: PLAYLIST_API_URL,
        type: 'GET',
        success: function(data, status, xhr) {
            console.log(data);
            // console.log(status);
            // video = data.items[0];
            // alertError.hide();
            // alertWarning.hide();
            // alertSuccess.text('Done! load video infomation successed.')
            // alertSuccess.show();
            // msgAlert('alert-success','Success!','Get video data done.','alert');
            // formVideoFill(video.snippet, true);
        },
        error: function(request, status, xhr) {
            // alertError.text('Error! Some thing wrong. Code: '+status.status);
            // alertError.show();
            // alertWarning.hide();
            // alertSuccess.hide();
            // console.log('YT API Failed');
            // clearFormVideoFill();
        }
    });
}
// Client ID and API key from the Developer Console