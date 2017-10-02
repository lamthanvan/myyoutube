var apiUrl = "https://youtube-video-api-1608.appspot.com/youtube/api";
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

var app = angular.module("itube", []);
