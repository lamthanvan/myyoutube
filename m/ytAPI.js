var apiKey = 'AIzaSyARBKW7hWfmEYm7tswDHUsp68hUsfvgjbM'; //IzaSyARBKW7hWfmEYm7tswDHUsp68hUsfvgjbM   new key active from 28/9/2017
var videoId;
var YT_API_URL = 'https://www.googleapis.com/youtube/v3/videos?id=' + videoId + '&key=' + apiKey + '&fields=items&part=snippet,statistics';
var VIDEO_API_URL = "https://youtube-video-api-1608.appspot.com/youtube/api?id="+videoId;
var video;



function isExits(id) {
    var isExitsURL = 'https://www.googleapis.com/youtube/v3/videos?part=id&id=' + videoId + '&key=' + apiKey;
    $.ajax({
        url: isExitsURL,
        type: 'GET',
        success: function(data, status, xhr) {
            console.log(data.pageInfo.totalResults);
            if (data.pageInfo.totalResults === 1) {
                ytApiGetVideo(videoId);
                return true;
            } else {
                msgAlert('alert-warning', '', '', 'video-link');
                msgAlert('alert-warning', 'Warning!', 'Video does not exits, does video published?', 'alert');
                setInputTextAtId('', 'video-name');
                setInputTextAtId('', 'video-description');
                setInputTextAtId('', 'video-tags');
                return false;
            }
        },
        error: function() {}
    });
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
    if (isValidURL(inputUrl)) {
        var url = new URL(inputUrl);
        videoId = getParameterByName("v", url);
        if (videoId != null || videoId != "" || videoId != "undefined") {
            console.log(videoId);
            isExits(videoId);
            // ytApiGetVideo(videoId);
        } else {
            // $('#video-link').addClass('alert-warning');
            msgAlert('alert-warning',null,null,'video-link');
            msgAlert('alert-warning', 'Warning!', 'Can not get video id. Link/url must follow https://www.youtube.com/watch?v=xxx (xxx is video id)', 'alert');
            return false;
        }
    } else {
        msgAlert('alert-danger', null, null, 'video-link');
        msgAlert('alert-warning', 'Warning!', 'Link/url is invalid. Link must follow https://www.youtube.com/watch?v=xxx (xxx is video id)', 'alert');
        console.log('can not get data, link error');
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

function ytApiGetVideo(videoId) {
   
    YT_API_URL = 'https://www.googleapis.com/youtube/v3/videos?id=' + videoId + '&key=' + apiKey + '&fields=items&part=snippet,statistics';
    // console.log("ytAPI();" + YT_API_URL);
    video = null;
    $.ajax({
        url: YT_API_URL,
        type: 'GET',
        success: function(data, status, xhr) {
            console.log(status);
            video = data.items[0];
            $('#video-link').removeClass('alert-warning');
            $('#video-link').removeClass('alert-danger');
            $('#video-link').addClass('alert-success');
            $('#alert').removeClass('alert-warning');
            $('#alert').removeClass('alert-danger');
            $('#alert').addClass('alert-success');
            $('#alert').html('<strong>Success!</strong> Get video data done.');
            // msgAlert('alert-success','Success!','Get video data done.','alert');
            formVideoFill(video.snippet, true);
        },
        error: function() {
            alert('Can not contact api server: ' + xhr.status);
            console.log('YT API Failed');

        }
    });
}
// Client ID and API key from the Developer Console