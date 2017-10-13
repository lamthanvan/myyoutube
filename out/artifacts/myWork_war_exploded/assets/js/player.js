var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
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
            // 'onStateChange': onPlayerStateChange
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
    if (event.data === YT.PlayerState.ENDED) {
        event.target.playVideo();
    }
}

function stopVideo() {
    player.stopVideo();
}
$(document).ready(function() {
    (function(r, e, E, m, b) {
        E[r] = E[r] || {};
        E[r][b] = E[r][b] || function() {
            (E[r].q = E[r].q || []).push(arguments)
        };
        b = m.getElementsByTagName(e)[0];
        m = m.createElement(e);
        m.async = 1;
        m.src = ("file:" == location.protocol ? "https:" : "") + "//s.reembed.com/G-ndLM8n.js";
        b.parentNode.insertBefore(m, b)
    })("reEmbed", "script", window, document, "api");
});