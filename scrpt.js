const allVideos = document.querySelectorAll('video');

allVideos.forEach(video => {
    video.addEventListener('play', (event) => {
        // When one video starts, loop through all others
        allVideos.forEach(otherVideo => {
            // Pause any video that is NOT the one that just started
            if (otherVideo !== event.target) {
                otherVideo.pause();
            }
        });
    });
});

document.querySelectorAll('video').forEach((video, index) => {
    // Create the seek bar element
    const seekBar = document.createElement('input');
    seekBar.type = 'range';
    seekBar.min = 0;
    seekBar.value = 0;
    seekBar.style.width = '40%';
    seekBar.style.padding = '20px';
    seekBar.style.background = '#ddd';
    seekBar.style.outline = 'none';
    seekBar.style.cursor = 'pointer'

    // Insert the seek bar immediately after the video
    video.parentNode.insertBefore(seekBar, video.nextSibling);

    // 1. Sync seek bar MAX to video duration once metadata is loaded
    video.addEventListener('loadedmetadata', () => {
        seekBar.max = Math.floor(video.duration);
    });

    // 2. Sync seek bar POSITION as video plays
    video.addEventListener('timeupdate', () => {
        seekBar.value = Math.floor(video.currentTime);
    });

    // 3. Allow user to SEEK the video using the bar
    seekBar.addEventListener('input', () => {
        video.currentTime = seekBar.value;
    });
});