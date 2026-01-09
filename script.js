  // ==== PLAYLIST VARS & CONTAINERS ====
        const playlistInput = document.querySelector('input[placeholder="Enter playlist name"]');
        const createPlaylistBtn = document.querySelector('button.btn-primary');
        const playlists = [];
        let activePlaylistIndex = null;
        // Use fixed DOM containers for playlists
        const playlistList = document.getElementById("all-playlists");
        const playlistSongs = document.getElementById("current-playlist");
        // All Element Variables
        const themeToggle = document.getElementById("cyber-toggle");
        let now_playing = document.querySelector(".now-playing");
        let track_art = document.querySelector(".track-art");
        let track_name = document.querySelector(".track-name");
        let track_artist = document.querySelector(".track-artist");
        let playpause_btn = document.querySelector(".playpause-track");
        let seek_slider = document.querySelector(".seek_slider");
        let volume_slider = document.querySelector(".volume_slider");
        let curr_time = document.querySelector(".current-time");
        let total_duration = document.querySelector(".total-duration");
        let songsGenre = document.getElementsByClassName("song_genre");
        const genreSelect = songsGenre[0];
        genreSelect.addEventListener("change", () => {
            const selectedGenre = genreSelect.value;
            if (selectedGenre === "All") {
                renderAllSongs(track_list);
                return;
            }
            const filteredSongs = track_list.filter(song => song.genre === selectedGenre);
            renderAllSongs(filteredSongs);
        });
        const allSongsContainer = document.getElementById("all-songs");
        let track_index = 0;
        let isPlaying = false;
        let updateTimer;
        // Create new audio element
        let curr_track = document.createElement('audio');
        // Define the tracks that have to be played
        let track_list = [
            {
                name: "Besharam Rang Pathaan",
                artist: "Shilpa Rao, Caralisa Monteiro",
                genre: "Pop",
                image: "./songs/cover/besharam-rang-pathaan.jpg",
                path: "./songs/Besharam Rang Pathaan.mp3"
            },
            {
                name: "Gehra Hua Dhurandhar",
                artist: "Hanumankind, Jasmine Sandlas",
                genre: "Rock",
                image: "./songs/cover/gehra-hua-dhurandhar.jpg",
                path: "./songs/Gehra Hua Dhurandhar.mp3"
            },
            {
                name: "Ishq Jalakar Dhurandhar",
                artist: "Shashwat Sachdev, Shahzad Ali",
                genre: "Hip-Hop",
                image: "./songs/cover/ishq-jalakar-dhurandhar.jpg",
                path: "./songs/Ishq Jalakar Dhurandhar.mp3",
            },
        ];
        // Theme Toggle Button Design
        themeToggle.addEventListener("change", () => {
            if (themeToggle.checked) {
                document.body.classList.add("dark");
                localStorage.setItem("theme", "dark");
            } else {
                document.body.classList.remove("dark");
                localStorage.setItem("theme", "light");
            }
        });
        // Load saved theme
        const savedTheme = localStorage.getItem("theme");
        // Logic for the dark Theme
        if (savedTheme === "dark") {
            document.body.classList.add("dark");
            themeToggle.checked = true;
        }
        // Load Track
        function loadTrack(track_index) {
            clearInterval(updateTimer);
            resetValues();
            curr_track.src = track_list[track_index].path;
            curr_track.load();
            track_art.style.backgroundImage = "url(" + track_list[track_index].image + ")";
            track_name.textContent = track_list[track_index].name;
            track_artist.textContent = track_list[track_index].artist;
            now_playing.textContent = "PLAYING " + (track_index + 1) + " OF " + track_list.length;
            updateTimer = setInterval(seekUpdate, 1000);
            curr_track.addEventListener("ended", nextTrack);
        }
        // Render All Songs
        function renderAllSongs(list) {
            allSongsContainer.innerHTML = "";
            list.forEach((song, index) => {
                const div = document.createElement("div");
                div.className = "song-card";
                div.innerHTML = `
                                <strong>${song.name}</strong>
                                <i class="fa-solid fa-1x fa-circle-plus add-btn"></i><br/>
                                <small>${song.artist}</small>`;
                div.addEventListener("click", () => {
                    track_index = index;
                    loadTrack(track_index);
                    playpauseTrack();
                });
                div.querySelector(".add-btn").addEventListener("click", (e) => {
                    e.stopPropagation();
                    addSongToPlaylist(index);
                });
                allSongsContainer.appendChild(div);
            });
        }
        // PLAYLIST LOGIC
        createPlaylistBtn.addEventListener("click", () => {
            const name = playlistInput.value.trim();
            if (!name) return;
            playlists.push({ name, songs: [] });
            activePlaylistIndex = playlists.length - 1;
            playlistInput.value = "";
            renderPlaylists();
        });
        function renderPlaylists() {
            playlistList.innerHTML = "";
            playlists.forEach((pl, index) => {
                const li = document.createElement("li");
                li.textContent = pl.name;
                li.className = "song-card";
                li.onclick = () => {
                    activePlaylistIndex = index;
                    renderPlaylists();
                    renderPlaylistSongs();
                };
                playlistList.appendChild(li);
            });
        }
        function addSongToPlaylist(songIndex) {
            if (activePlaylistIndex === null) return;
            const playlist = playlists[activePlaylistIndex];
            if (!playlist.songs.includes(songIndex)) {
                playlist.songs.push(songIndex);
                renderPlaylistSongs();
            }
        }
        function renderPlaylistSongs() {
            playlistSongs.innerHTML = "";
            if (activePlaylistIndex === null) return;
            playlists[activePlaylistIndex].songs.forEach((i) => {
                const li = document.createElement("li");
                li.textContent = `${track_list[i].name} - ${track_list[i].artist}`;
                li.className = "song-card";
                playlistSongs.appendChild(li);
            });
        }
        renderAllSongs(track_list);
        function resetValues() {
            curr_time.textContent = "00:00";
            total_duration.textContent = "00:00";
            seek_slider.value = 0;
        }
        // Load the first track in the track list
        loadTrack(track_index);
        function playpauseTrack() {
            if (!isPlaying) playTrack();
            else pauseTrack();
        }
        function playTrack() {
            curr_track.play();
            isPlaying = true;
            playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
        }
        function pauseTrack() {
            curr_track.pause();
            isPlaying = false;
            playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
        }
        function nextTrack() {
            if (track_index < track_list.length - 1)
                track_index += 1;
            else track_index = 0;
            loadTrack(track_index);
            playTrack();
        }
        function prevTrack() {
            if (track_index > 0)
                track_index -= 1;
            else track_index = track_list.length - 1;
            loadTrack(track_index);
            playTrack();
        }
        function seekTo() {
            let seekto = curr_track.duration * (seek_slider.value / 100);
            curr_track.currentTime = seekto;
        }
        function setVolume() {
            curr_track.volume = volume_slider.value / 100;
        }
        function seekUpdate() {
            let seekPosition = 0;
            if (!isNaN(curr_track.duration)) {
                seekPosition = curr_track.currentTime * (100 / curr_track.duration);
                seek_slider.value = seekPosition;
                let currentMinutes = Math.floor(curr_track.currentTime / 60);
                let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
                let durationMinutes = Math.floor(curr_track.duration / 60);
                let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);
                if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
                if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
                if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
                if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }
                curr_time.textContent = currentMinutes + ":" + currentSeconds;
                total_duration.textContent = durationMinutes + ":" + durationSeconds;
            }
        }
