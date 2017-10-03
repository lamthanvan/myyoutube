var apiKey = 'AIzaSyARBKW7hWfmEYm7tswDHUsp68hUsfvgjbM'; //IzaSyARBKW7hWfmEYm7tswDHUsp68hUsfvgjbM   new key active from 28/9/2017
var videoId;
var YT_API_URL = 'https://www.googleapis.com/youtube/v3/videos?id=' + videoId + '&key=' + apiKey + '&fields=items&part=snippet,statistics';
var VIDEO_API_URL = "https://youtube-video-api-1608.appspot.com/youtube/api?id=" + videoId;
var video;
var flag = true;

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

function isValidURL(url) {
    var expression = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?=.*v=((\w|-){11}))(?:\S+)?$/;
    var regex = new RegExp(expression);
    if (url.match(regex)) {
        return true;
    } else {
        return false;
    }
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
        error: function(request,status,xhr) {
            alertError.text('Error! Some thing wrong. Code: '+status.status);
            alertError.show();
            alertWarning.hide();
            alertSuccess.hide();
            console.log('YT API Failed');
            clearFormVideoFill();
        }
    });
}
// Client ID and API key from the Developer Console