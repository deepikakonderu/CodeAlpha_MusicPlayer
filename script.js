const folderInput =
document.getElementById("folderInput");

const playlist =
document.getElementById("playlist");

const audio =
document.getElementById("audio");

const title =
document.getElementById("title");

const artist =
document.getElementById("artist");

const cover =
document.getElementById("cover");

const playBtn =
document.getElementById("play");

const prevBtn =
document.getElementById("prev");

const nextBtn =
document.getElementById("next");

const progress =
document.getElementById("progress");

const progressContainer =
document.getElementById("progressContainer");

const currentTime =
document.getElementById("currentTime");

const duration =
document.getElementById("duration");

const volume =
document.getElementById("volume");


let songs = [];
let images = [];

let currentSong = 0;
let isPlaying = false;


/* LOAD FOLDER */

folderInput.addEventListener("change",(e)=>{

  const files =
  Array.from(e.target.files);

  songs = files.filter(file =>
    file.name.endsWith(".mp3")
  );

  images = files.filter(file =>
    file.name.match(/\.(jpg|jpeg|png)$/i)
  );

  if(songs.length > 0){

    createPlaylist();

    loadSong(0);
  }
});


/* LOAD SONG */

function loadSong(index){

  const song = songs[index];

  audio.src =
  URL.createObjectURL(song);

  const cleanName =
  song.name.replace(".mp3","");


  /* TITLE + ARTIST */

  if(cleanName.includes("-")){

    const parts =
    cleanName.split("-");

    artist.innerText =
    parts[0].trim();

    title.innerText =
    parts[1].trim();
  }
  else{

    title.innerText =
    cleanName;

    artist.innerText =
    "Unknown Artist";
  }


  /* IMAGE */

  const imageFile =
  images.find(img => {

    const imageName =
    img.name.replace(/\.(jpg|jpeg|png)$/i,"");

    return imageName === cleanName;
  });

  if(imageFile){

    cover.src =
    URL.createObjectURL(imageFile);
  }

  updatePlaylist();
}


/* PLAY */

function playSong(){

  audio.play();

  isPlaying = true;

  playBtn.innerHTML =
  `<i class="fa-solid fa-pause"></i>`;
}


/* PAUSE */

function pauseSong(){

  audio.pause();

  isPlaying = false;

  playBtn.innerHTML =
  `<i class="fa-solid fa-play"></i>`;
}


/* TOGGLE */

playBtn.addEventListener("click",()=>{

  if(songs.length === 0) return;

  if(isPlaying){
    pauseSong();
  }
  else{
    playSong();
  }
});


/* NEXT */

function nextSong(){

  currentSong++;

  if(currentSong >= songs.length){
    currentSong = 0;
  }

  loadSong(currentSong);

  playSong();
}


/* PREVIOUS */

function prevSong(){

  currentSong--;

  if(currentSong < 0){
    currentSong = songs.length - 1;
  }

  loadSong(currentSong);

  playSong();
}

nextBtn.addEventListener("click",nextSong);

prevBtn.addEventListener("click",prevSong);


/* AUTOPLAY */

audio.addEventListener("ended",nextSong);


/* PROGRESS */

audio.addEventListener("timeupdate",()=>{

  const percent =
  (audio.currentTime / audio.duration) * 100;

  progress.style.width =
  `${percent}%`;

  currentTime.innerText =
  formatTime(audio.currentTime);

  duration.innerText =
  formatTime(audio.duration);
});


/* SEEK */

progressContainer.addEventListener("click",(e)=>{

  const width =
  progressContainer.clientWidth;

  const clickX =
  e.offsetX;

  audio.currentTime =
  (clickX / width) * audio.duration;
});


/* FORMAT */

function formatTime(time){

  if(isNaN(time)) return "0:00";

  const mins =
  Math.floor(time / 60);

  const secs =
  Math.floor(time % 60)
  .toString()
  .padStart(2,"0");

  return `${mins}:${secs}`;
}


/* VOLUME */

volume.addEventListener("input",()=>{

  audio.volume = volume.value;
});


/* PLAYLIST */

function createPlaylist(){

  playlist.innerHTML = "";

  songs.forEach((song,index)=>{

    const li =
    document.createElement("li");

    li.innerText =
    song.name.replace(".mp3","");

    li.addEventListener("click",()=>{

      currentSong = index;

      loadSong(currentSong);

      playSong();
    });

    playlist.appendChild(li);
  });

  updatePlaylist();
}


/* ACTIVE SONG */

function updatePlaylist(){

  const items =
  playlist.querySelectorAll("li");

  items.forEach((item,index)=>{

    item.classList.remove("active");

    if(index === currentSong){
      item.classList.add("active");
    }
  });
}