var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
var playAllButton = document.getElementById('playall');
var muteAllButton = document.getElementById('muteall');

//////////////////////////////Time display slider//////////////////////////////

var playHead = document.getElementById('timeelapsed');
var primaryTrack = document.getElementById('primarytrack');
var currentTime = document.getElementById('currtime');
var endTime = document.getElementById('endtime');
var centerPanButton = document.getElementById('centerpan');

audioReady().then(function() {
    playAllButton.disabled = false
});

///////////////////////////////////////////////////////////////////////////////

var gainArray = [];
makeNewTrack("track1", audioCtx, gainArray);
makeNewTrack("track2", audioCtx, gainArray);
makeNewTrack("track3", audioCtx, gainArray);
makeNewTrack("track4", audioCtx, gainArray);
makeNewTrack("track5", audioCtx, gainArray);
makeNewTrack("track6", audioCtx, gainArray);
makeNewTrack("track7", audioCtx, gainArray);
makeNewTrack("track8", audioCtx, gainArray);


playAllButton.onclick = updatePlays;
muteAllButton.onclick = updateGains;
centerPanButton.onclick = updatePans;
$(primaryTrack).on('timeupdate', timeUpdateListener);
playHead.addEventListener('mousedown', playHeadMouseDown, false);
playHead.addEventListener('mouseup', playHeadMouseUp, false);

////////////////////////////////////FUNCTIONS//////////////////////////////////

// mouseDown EventListener

function playHeadMouseUp() {
    updateTrackPositions();
    $(primaryTrack).on('timeupdate', timeUpdateListener);
}

function playHeadMouseDown() {
    $(primaryTrack).off('timeupdate');
}

function timeUpdateListener() {

    playHead.value = Math.floor(primaryTrack.currentTime);
    currentTime.innerHTML = formatTime(primaryTrack.currentTime);

    if (primaryTrack.ended) {
        playHead.value = 0;
        currentTime.innerHTML = "00:00";
        updateTrackPositions();
        updatePlays();
    }
}

function makeNewTrack(id, audiocontext, array) {
    var div = document.getElementById(id);
    var divchild = div.children;
    var audio = divchild[0];
    var volSlider = divchild[3];
    var panSlider = divchild[6];
    var muteButton = divchild[8];

    var source = audiocontext.createMediaElementSource(audio);
    var pannerNode = audiocontext.createPanner();
    var gainNode = audiocontext.createGain();

    var len = array.length;
    array[len] = gainNode;

    ////new stuff////
    audiocontext.listener.setPosition(0, 0, 0);
    pannerNode.setPosition(0, 0, 1);
    source.connect(pannerNode);
    pannerNode.connect(gainNode);
    gainNode.connect(audiocontext.destination);

    function updatePan() {
        pannerNode.setPosition(panSlider.value, 0, 1 - panSlider.value);
    }

    function updateVol() {
        gainNode.gain.value = volSlider.value;
        muteButton.innerHTML = "Mute";
        muteButton.style.backgroundColor = "white";
    }

    function updateMute() {
        if (gainNode.gain.value == 0) {
            gainNode.gain.value = volSlider.value;
            muteButton.innerHTML = "Mute";
            muteButton.style.backgroundColor = "white";
        } else {
            gainNode.gain.value = 0;
            muteButton.innerHTML = "Unmute";
            muteButton.style.backgroundColor = "#C6BEB5";
        }
    }

    panSlider.oninput = updatePan;
    volSlider.oninput = updateVol;
    muteButton.onclick = updateMute;
}


function audioReady() {
    return $.when.apply($, $('audio').map(function() {
        var ready = new $.Deferred();
        $(this).one('canplay', ready.resolve);
        return ready.promise();
    }));
}

function updatePlays() {
    playAllButton.backgroundColor = "green";

    endTime.innerHTML = formatTime(primaryTrack.duration);
    playHead.max = primaryTrack.duration;


    var div = document.getElementById("alltracks");
    tracks = div.children;
    for (i = 0; i < tracks.length; i++) {
        trackchilds = tracks[i].children;
        audioelement = trackchilds[0];
        if (audioelement.paused) {
            audioelement.play();
            playAllButton.innerHTML = "Pause";
        } else {
            audioelement.pause();
            playAllButton.innerHTML = "Play";
        }
    }
}

function updateMutes() {
    var div = document.getElementById("alltracks");
    tracks = div.children;
    for (i = 0; i < tracks.length; i++) {
        trackchilds = tracks[i].children;
        audioelement = trackchilds[0];
        muteelement = trackchilds[8];
        if (muteAllButton.value == "muteall") {
            audioelement.muted = true;
            muteelement.innerHTML = "Unmute";
            muteelement.style.backgroundColor = "#C6BEB5";
        } else if (muteAllButton.value == "unmute") {
            audioelement.muted = false;
            muteelement.innerHTML = "Mute";
            muteelement.style.backgroundColor = "white";
        }
    }

    if (muteAllButton.value == "muteall") {
        muteAllButton.value = "unmute";
        muteAllButton.innerHTML = "Unmute All";
        muteAllButton.style.backgroundColor = "#C6BEB5";
        muteAllButton.style.color = "#3172AE";
    } else if (muteAllButton.value == "unmute") {
        muteAllButton.value = "muteall";
        muteAllButton.innerHTML = "Mute All";
        muteAllButton.style.backgroundColor = "#3172AE";
        muteAllButton.style.color = "white";
    }
}

function updateGains() {
    var div = document.getElementById("alltracks");
    var tracks = div.children;
    for (i = 0; i < tracks.length; i++) {
        var trackchilds = tracks[i].children;
        var volumeelement = trackchilds[3];
        var muteelement = trackchilds[8];
        var gainNode = gainArray[i];
        muteAllButton.style.backgroundColor = "black";
        if (muteAllButton.value == "muteall") {
            gainNode.gain.value = 0;
            muteelement.innerHTML = "Unmute";
            muteelement.style.backgroundColor = "#C6BEB5";
        } else if (muteAllButton.value == "unmute") {
            gainNode.gain.value = volumeelement.value;
            muteelement.innerHTML = "Mute";
            muteelement.style.backgroundColor = "white";
        }
    }
    if (muteAllButton.value == "muteall") {
        muteAllButton.value = "unmute";
        muteAllButton.innerHTML = "Unmute All";
        muteAllButton.style.backgroundColor = "#C6BEB5";
        muteAllButton.style.color = "#3172AE";
    } else if (muteAllButton.value == "unmute") {
        muteAllButton.value = "muteall";
        muteAllButton.innerHTML = "Mute All";
        muteAllButton.style.backgroundColor = "#3172AE";
        muteAllButton.style.color = "white";
    }
}

function updatePans() {
    var div = document.getElementById("alltracks");
    tracks = div.children;
    for (i = 0; i < tracks.length; i++) {
        trackchilds = tracks[i].children;
        panelement = trackchilds[6];
        panelement.value = "0";
    }
}

function updateTrackPositions() {
    var Elapsed = playHead.value;
    var div = document.getElementById("alltracks");
    tracks = div.children;
    var trackchilds;
    var audioelement;
    for (i = 0; i < tracks.length; i++) {
        trackchilds = tracks[i].children;
        audioelement = trackchilds[0];
        audioelement.pause();
    }
    for (i = 0; i < tracks.length; i++) {
        trackchilds = tracks[i].children;
        audioelement = trackchilds[0];
        audioelement.currentTime = Elapsed;
    }
    for (i = 0; i < tracks.length; i++) {
        trackchilds = tracks[i].children;
        audioelement = trackchilds[0];
        audioelement.play();
    }
}


function formatTime(value) {
    var tick = value;
    // console.log(tick);
    var mins = Math.floor(tick / 60);
    var secs = Math.floor(tick % 60);
    var tock = (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs;
    return tock;
}