const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  // *
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: 'Nevada',
      singer: 'Vicetone',
      path: './assets/music/song1.mp3',
      image: './assets/img/song1.jpg',
    },
    {
      name: 'SummerTime',
      singer: 'K-391',
      path: './assets/music/song2.mp3',
      image: './assets/img/song2.jpg',
    },
    {
      name: 'Attention',
      singer: 'Charlie Puth',
      path: './assets/music/song3.mp3',
      image: './assets/img/song3.jpg',
    },
    {
      name: 'Reality',
      singer: 'Lost Frequencies',
      path: './assets/music/song4.mp3',
      image: './assets/img/song4.jpg',
    },
    {
      name: 'Ngày Khác Lạ',
      singer: 'Đen Vâu',
      path: './assets/music/song5.mp3',
      image: './assets/img/song5.jpg',
    },
    {
      name: 'My love',
      singer: 'Westlife',
      path: './assets/music/song6.mp3',
      image: './assets/img/song6.jpg',
    },
    {
      name: 'Lemon tree',
      singer: 'Jason Chen',
      path: './assets/music/song7.mp3',
      image: './assets/img/song7.jpg',
    },
    {
      name: 'Nghe Như Tình Yêu',
      singer: 'HIEUTHUHAI',
      path: './assets/music/song8.mp3',
      image: './assets/img/song8.jpg',
    },
    {
      name: 'Sugar',
      singer: 'Maroon 5',
      path: './assets/music/song9.mp3',
      image: './assets/img/song9.jpg',
    },
  ],
  // *
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  // Render ra các bài hát
  render: function () {
    // app.songs.map -> lấy ra từng phần tử trong songs
    // map (function (song) {return ...})
    const htmls = this.songs.map((song, index) => {
      return `
      <div class="song ${
        index === this.currentIndex ? 'active' : ''
      }" data-index = ${index}>
        <div class="thumb" style="background-image: url(${song.image});"></div>
        <div class="body"> 
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>
      `;
    });
    playlist.innerHTML = htmls.join('');
  },
  // Định nghĩa các thuộc tính mới
  defineProperties: function () {
    // Định nghĩa để khi gọi app.currentSong sẽ trả ra bài hát tại currentIndex
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  // Xử lý các sự kiện
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý CD quay / dừng
    const cdThumbAnimate = cdThumb.animate(
      // Xoay 360deg
      [{ transform: 'rotate(360deg)' }],
      {
        duration: 10000, // Quay trong 10 seconds
        iterations: Infinity, // Lặp lại
      }
    );
    cdThumbAnimate.pause();

    // Xử lý khi phòng to / thu nhỏ
    // Khi document được scroll thì chạy hàm
    document.onscroll = function () {
      // Bắt sự kiện scroll
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      // Sau khi có vị trí đã scroll đến hiện tại, lấy width cũ trừ đi -> newWidth
      const newWidth = cdWidth - scrollTop;
      // newWidth > 0 thì gán newWidth, nếu < 0 thì gán 0, nếu không sẽ xảy ra hiển thị
      cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
      cd.style.opacity = newWidth / cdWidth;
    };

    // Xử lý khi click play
    playBtn.onclick = function () {
      // Nếu bài hát đang phát (isPlaying == true) thì nhảy vào đây
      if (_this.isPlaying) {
        audio.pause();
      }
      // Nếu bài hát đang dừng (isPlaying == false) thì nhảy vào đây
      else {
        audio.play();
      }
    };

    // Khi play bài hát
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add('playing');
      // Xoay đĩa
      cdThumbAnimate.play();
    };

    // Khi pause bài hát
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove('playing');
      // Dừng xoay đĩa
      cdThumbAnimate.pause();
    };

    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      // Lúc đầu do duration == NaN nên sẽ nhảy vào else, nhưng sau đó != NaN nên nhảy vào if
      // duration là tổng thời lượng bài hát
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      } else {
      }
    };

    // Xử lý khi tua bài hát
    progress.onchange = function (e) {
      // audio.duration là tổng thời gian của bài hát, ta chia thành 100 lần, rồi nhân cho giá trị của vị trí ta tua đến
      // Ví dụ ta chọn ở giữa bài hát thì duration * 50, cuối bài hát thì duration * 100
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Next song
    nextBtn.onclick = function () {
      // Nếu isRandom == true
      if (_this.isRandom) {
        _this.playRandomSong();
      }
      // Không thì next như thường
      else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Prev song
    prevBtn.onclick = function () {
      // Nếu isRandom == true
      if (this.isRandom) {
        this.playRandomSong();
      }
      // Không thì back như thường
      else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Xử lý khi bật / tắt random
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig('isRandom', _this.isRandom);
      // Nếu boolean == true thì add active, == false thì remove
      randomBtn.classList.toggle('active', _this.isRandom);
    };

    // Xử lý khi bật / tắt repeat
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig('isRepeat', _this.isRepeat);
      // Nếu boolean == true thì add active, == false thì remove
      repeatBtn.classList.toggle('active', _this.isRepeat);
    };

    // Xử lý khi hết bài hát
    audio.onended = function () {
      // Nếu isRepeat == true thì play bài cũ
      if (_this.isRepeat) {
        audio.play();
      }
      // Không thì next
      else {
        nextBtn.click();
      }
    };

    // Lắng nghe hành vi click vào playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active)');
      // Element được click có == .song không, nếu là con thì nhảy ra cha xem có == .song không
      // Nếu == .song và không có .active HOẶC sự kiện click trúng option thì chạy
      if (songNode || e.target.closest('.option')) {
        // Xử lý khi click vào bài hát
        if (songNode) {
          // Do index được lấy ra từ dataIndex ở dạng String nên convert sang dạng Number nếu không sẽ lỗi mất .active
          const dataIndex = Number(songNode.dataset.index);
          _this.currentIndex = dataIndex;
          _this.loadCurrentSong();
          audio.play();
          _this.render();
        }

        // Xử lý khi click vào option
      }
    };
  },
  // Cuộn màn hình đến bài hát đang phát
  scrollToActiveSong: function () {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }, 300);
  },
  // Load bài hát đầu tiên trong playlist
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    {
      this.currentIndex = newIndex;
      this.loadCurrentSong();
    }
  },
  start: function () {
    // this ở đây là app

    // Gán cấu hình từ config vào ứng dụng
    this.loadConfig();
    // Định nghĩa các thuộc tính cho Object
    this.defineProperties();

    // Lắng nghe / xử lý các sự kiện (DOM events)
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();
    // Render Playlist
    this.render();

    // Hiển trạng thái ban đầu của button Repeat & Random
    randomBtn.classList.toggle('active', this.isRandom);
    repeatBtn.classList.toggle('active', this.isRepeat);
  },
};

app.start();
