// 1. 音乐数据配置 - 添加曲绘路径
const musicData = [
  { 
    id: 0, 
    title: "逆光-变奏", 
    author: "芳贺敬太", 
    url: "./music/逆光-变奏.mp3",
    cover: "./images/逆光-变奏.png"
  },
  { 
    id: 1, 
    title: "どんな結末がお望みだい？", 
    author: "神代類 初音ミク 天馬司 鳳えむ 草薙寧々", 
    url: "./music/どんな結末がお望みだい.mp3",
    cover: "./images/どんな結末がお望みだい.png"
  },
  { 
    id: 2, 
    title: "月姫", 
    author: "芳贺敬太", 
    url: "./music/月姫.mp3",
    cover: "./images/月姫.png"
  },
  { 
    id: 3, 
    title: "星が瞬くこんな夜に", 
    author: "Supercell", 
    url: "./music/星が瞬くこんな夜に.mp3",
    cover: "./images/星が瞬くこんな夜に ~ゲームVer.jpg"
  }
];

let currentIndex = 0;
let playMode = 0; // 0: 顺序循环, 1: 单曲循环, 2: 随机播放
let currentSpeed = 1.0;

// 2. 获取 DOM 元素
const audio = document.getElementById('audioTag');
const playPauseBtn = document.getElementById('playPause');
const recordImg = document.getElementById('record-img');
const musicTitle = document.getElementById('music-title');
const authorName = document.getElementById('author-name');
const progress = document.getElementById('progress');
const progressTotal = document.getElementById('progress-total');
const playedTime = document.getElementById('playedTime');
const audioTime = document.getElementById('audioTime');
const volumeSlider = document.getElementById('volumn-togger');
const playModeBtn = document.getElementById('playMode');
const skipForwardBtn = document.getElementById('skipForward');
const skipBackwardBtn = document.getElementById('skipBackward');
const speedBtn = document.getElementById('speed');
const listBtn = document.getElementById('list');
const musicList = document.getElementById('music-list');
const closeList = document.getElementById('close-list');
const queuePreview = document.getElementById('queuePreview');
const closeListBtn = document.getElementById('closeListBtn');
const queueCount = document.getElementById('queueCount');
const dynamicBg = document.getElementById('dynamic-bg');

// 3. 辅助函数：格式化时间
function formatTime(seconds) {
  if (isNaN(seconds) || seconds === Infinity) return '00:00';
  let min = Math.floor(seconds / 60);
  let sec = Math.floor(seconds % 60);
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

// 4. 更新队列数量显示
function updateQueueCount() {
  if (queueCount) {
    queueCount.textContent = musicData.length;
  }
}

// 5. 更新列表选中状态
function updateQueueActiveState() {
  const allItems = document.querySelectorAll('.queue-item');
  allItems.forEach((el, i) => {
    if (i === currentIndex) {
      el.classList.add('active-song');
    } else {
      el.classList.remove('active-song');
    }
  });
}

// 6. 更新动态背景
function updateBackground(coverUrl) {
  if (!dynamicBg) return;
  
  if (coverUrl && coverUrl !== '../img/album-cover-default.png') {
    // 使用曲绘作为背景
    dynamicBg.style.backgroundImage = `url('${coverUrl}')`;
    dynamicBg.style.backgroundSize = "cover";
    dynamicBg.style.backgroundPosition = "center";
    dynamicBg.style.transition = "background-image 0.5s ease";
    console.log('✓ 动态背景已更新');
  } else {
    // 如果没有曲绘，使用默认背景
    dynamicBg.style.backgroundImage = "url('./img/bg0.png')";
  }
}

// 7. 加载音乐
function loadMusic(index) {
  // 处理索引边界
  if (index < 0) index = musicData.length - 1;
  if (index >= musicData.length) index = 0;
  
  currentIndex = index;
  const music = musicData[currentIndex];
  
  audio.src = music.url;
  musicTitle.innerText = music.title;
  authorName.innerText = music.author;
  
  // 更新唱片曲绘和动态背景
  if (music.cover) {
    recordImg.style.backgroundImage = `url('${music.cover}')`;
    recordImg.style.backgroundSize = "cover";
    recordImg.style.backgroundPosition = "center";
    updateBackground(music.cover);
    console.log(`✓ 加载曲绘: ${music.title}`);
  } else {
    recordImg.style.backgroundImage = "url('../img/album-cover-default.png')";
    updateBackground(null);
    console.log(`✗ 没有曲绘，使用默认图片: ${music.title}`);
  }
  
  // 更新列表选中状态
  updateQueueActiveState();
  
  // 加载完成后自动播放
  audio.load();
  audio.play().then(() => {
    updatePlayPauseUI(true);
  }).catch(e => {
    console.log('自动播放被阻止，需要用户交互');
    updatePlayPauseUI(false);
  });
}

// 8. 更新播放/暂停 UI
function updatePlayPauseUI(isPlaying) {
  if (isPlaying) {
    playPauseBtn.classList.remove('icon-play');
    playPauseBtn.classList.add('icon-pause');
    recordImg.classList.add('rotate-play');
  } else {
    playPauseBtn.classList.remove('icon-pause');
    playPauseBtn.classList.add('icon-play');
    recordImg.classList.remove('rotate-play');
  }
}

// 9. 播放/暂停
function togglePlayPause() {
  if (audio.paused) {
    audio.play();
    updatePlayPauseUI(true);
  } else {
    audio.pause();
    updatePlayPauseUI(false);
  }
}

playPauseBtn.onclick = togglePlayPause;

// 10. 下一首
function nextSong() {
  if (playMode === 2) {
    // 随机播放
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * musicData.length);
    } while (newIndex === currentIndex && musicData.length > 1);
    currentIndex = newIndex;
  } else {
    // 顺序播放
    currentIndex++;
    if (currentIndex >= musicData.length) {
      currentIndex = 0;
    }
  }
  loadMusic(currentIndex);
}

// 11. 上一首
function prevSong() {
  if (playMode === 2) {
    // 随机播放
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * musicData.length);
    } while (newIndex === currentIndex && musicData.length > 1);
    currentIndex = newIndex;
  } else {
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = musicData.length - 1;
    }
  }
  loadMusic(currentIndex);
}

skipBackwardBtn.onclick = prevSong;
skipForwardBtn.onclick = nextSong;

// 12. 播放结束处理
audio.onended = function() {
  if (playMode === 1) {
    // 单曲循环
    audio.currentTime = 0;
    audio.play();
  } else {
    nextSong();
  }
};

// 13. 进度条更新
audio.ontimeupdate = function() {
  if (!isNaN(audio.duration) && audio.duration > 0) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = percent + '%';
    playedTime.innerText = formatTime(audio.currentTime);
    audioTime.innerText = formatTime(audio.duration);
  }
};

// 14. 点击进度条跳转
progressTotal.onclick = function(e) {
  const rect = this.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const newTime = (clickX / width) * audio.duration;
  if (!isNaN(newTime)) {
    audio.currentTime = newTime;
  }
};

// 15. 音量控制
volumeSlider.oninput = function() {
  audio.volume = this.value / 100;
  const volumeIcon = document.getElementById('volume');
  if (this.value == 0) {
    volumeIcon.style.opacity = '0.5';
  } else {
    volumeIcon.style.opacity = '1';
  }
};

// 设置默认音量
audio.volume = 0.7;
volumeSlider.value = 70;

// 16. 播放模式切换
function switchPlayMode() {
  playMode = (playMode + 1) % 3;
  const modeBtn = document.getElementById('playMode');
  
  switch(playMode) {
    case 0:
      modeBtn.style.opacity = '1';
      modeBtn.style.filter = 'none';
      modeBtn.title = '顺序循环';
      break;
    case 1:
      modeBtn.style.opacity = '0.7';
      modeBtn.style.filter = 'drop-shadow(0 0 2px gold)';
      modeBtn.title = '单曲循环';
      break;
    case 2:
      modeBtn.style.opacity = '1';
      modeBtn.style.filter = 'hue-rotate(30deg)';
      modeBtn.title = '随机播放';
      break;
  }
}

playModeBtn.onclick = switchPlayMode;

// 17. 倍速切换
function switchSpeed() {
  const speeds = [1.0, 1.25, 1.5, 2.0, 0.75];
  const currentSpeedIndex = speeds.indexOf(currentSpeed);
  const nextIndex = (currentSpeedIndex + 1) % speeds.length;
  currentSpeed = speeds[nextIndex];
  
  audio.playbackRate = currentSpeed;
  speedBtn.innerText = currentSpeed.toFixed(1) + 'X';
  
  speedBtn.style.transform = 'scale(1.1)';
  setTimeout(() => {
    speedBtn.style.transform = 'scale(1)';
  }, 200);
}

speedBtn.onclick = switchSpeed;

// 18. 列表显示/隐藏
function toggleMusicList() {
  if (musicList) musicList.classList.toggle('show');
  if (closeList) closeList.classList.toggle('show');
}

// 确保页面一开始右侧列表隐藏
if (musicList) musicList.classList.remove('show');
if (closeList) closeList.classList.remove('show');

// 预览条点击事件
if (queuePreview) {
  queuePreview.onclick = toggleMusicList;
}

// 列表按钮点击事件
if (listBtn) {
  listBtn.onclick = toggleMusicList;
}

// 遮罩层点击事件
if (closeList) {
  closeList.onclick = toggleMusicList;
}

// 关闭按钮点击事件
if (closeListBtn) {
  closeListBtn.onclick = toggleMusicList;
}

// 19. 列表点击播放
function bindQueueItemEvents() {
  const queueItems = document.querySelectorAll('.queue-item');
  queueItems.forEach((item, index) => {
    item.onclick = function(e) {
      e.stopPropagation();
      currentIndex = index;
      loadMusic(currentIndex);
    };
  });
}

// 初始化绑定
bindQueueItemEvents();

// 20. 键盘快捷键支持
document.addEventListener('keydown', function(e) {
  // 防止与页面滚动冲突
  const tagName = e.target.tagName.toLowerCase();
  if (tagName === 'input' || tagName === 'textarea') return;
  
  switch(e.code) {
    case 'Space':
      e.preventDefault();
      togglePlayPause();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      prevSong();
      break;
    case 'ArrowRight':
      e.preventDefault();
      nextSong();
      break;
    case 'ArrowUp':
      e.preventDefault();
      audio.volume = Math.min(1, audio.volume + 0.1);
      volumeSlider.value = audio.volume * 100;
      break;
    case 'ArrowDown':
      e.preventDefault();
      audio.volume = Math.max(0, audio.volume - 0.1);
      volumeSlider.value = audio.volume * 100;
      break;
  }
});

// 21. 初始化
console.log('播放器初始化完成，共加载', musicData.length, '首歌曲');
updateQueueCount();
loadMusic(0);