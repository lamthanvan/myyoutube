
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
console.log(videoId);
// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '450',
        width: '100%',
        videoId: videoId,
        events: {
            // 'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}
// function loadVideoById(videoId, height, width) {
// }
// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}
// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {}
}

function stopVideo() {
    player.stopVideo();
}

$(document).ready(function() {
    // player.loadVideoById('EoTMe7gd4WY',0,'default');
});