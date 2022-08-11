const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const openplaylist = $('#list-music')
const playlist =$('.play-list')
const exitplaylist = $('#exitplaylist')
const heading = $('.name-of-song')
const cdThumb = $('.play-music__music-dis-url-image')
const singer = $('.name-singer')
const audio = $('#audio')
const playBtn = $('.start-end')
const progress = $('#progress')
const begin = $('.begin')
const end = $('.end')
const next = $('.fa-forward')
const prev = $('.fa-backward')
const randombtn = $('.fa-shuffle')


const listsong = $('.list-song')


const strokes = `
   <span class="stroke"></span>
   <span class="stroke"></span>
   <span class="stroke"></span>
   <span class="stroke"></span>
   <span class="stroke"></span>
`

const app = {
    currentIndext: 0,
    isPlaying: true,
    isRandom: false,
    songs: [
        {
            name: 'Em Của Ngày Hôm Qua',
            singer: 'Sơn Tùng M-TP',
            path: '/assets/music/song1.mp3',
            img: '/assets/img/song1.jpg'
        },
        {
            name: 'Sau Tất Cả',
            singer: 'Erik',
            path: '/assets/music/song2.mp3',
            img: '/assets/img/song2.jpg'
        },
        {
            name: 'Chạy Ngay Đi',
            singer: 'Sơn Tùng M-TP',
            path: '/assets/music/song3.mp3',
            img: '/assets/img/song3.jpg'
        },
        {
            name: 'Thất Tình',
            singer: 'Trịnh Đình Quang',
            path: '/assets/music/song4.mp3',
            img: '/assets/img/song4.jpg'
        },
        {
            name: 'Người Phản Bội',
            singer: 'Lê Bảo Bình',
            path: '/assets/music/song5.mp3',
            img: '/assets/img/song5.jpg'
        },
        {
            name: 'Yêu Vội Vàng',
            singer: 'Lê Bảo Bình',
            path: '/assets/music/song6.mp3',
            img: '/assets/img/song6.jpg'
        },
        {
            name: 'Hãy Trao Cho Anh',
            singer: 'Sơn Tùng M-TP',
            path: '/assets/music/song7.mp3',
            img: '/assets/img/song7.jpg'
        },
        {
            name: 'Nếu Em Còn Tồn Tại',
            singer: 'Trịnh Đình Quan',
            path: '/assets/music/song8.mp3',
            img: '/assets/img/song8.jpg'
        },
        {
            name: 'Kết Thúc Lâu Rồi',
            singer: 'Lê Bảo Bình',
            path: '/assets/music/song9.mp3',
            img: '/assets/img/song9.jpg'
        }
    ],
    rander: function() {
        htmls = this.songs.map((song, index) => {
            
            return `
            <li class="playlist-item" data="${index}">
                <div class="playlist-thumb" style="background-image: url('${song.img}')"></div>
                <div class="song-info">
                    <span class="playlist-title">${song.name}</span>
                    <span class="playlist-author">${song.singer}</span>
                </div>
                <audio class="duration-display" preload="metadata" src="${song.path}"></audio>
                <div class="wave">03:30</div>
            </li>`
        })
        listsong.innerHTML = htmls.join('');
        const durations = $$('.duration-display');
        const wave = $$('.wave');

        
        // Initialize isPlaying state and add song's duration at the end for every song in
        // the playlist
        durations.forEach((duration, index) => {
            duration.onloadedmetadata = () => {
                wave[index].innerHTML = this.setTime(duration.duration);
            }
        })
        
        
    },  
    
    setTime: function(b) {
        const a = Math.floor(b)
        return `${Math.floor(a / 60) >= 10 ? Math.floor(a / 60) : '0' + Math.floor(a / 60) }:${(a%60) >= 10 ? (a%60) : '0' + (a%60)} `
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currenSong', {
            get: function() {
                return this.songs[this.currentIndext]
            }
        })
    },
    handleEvents: function () {
        //xử lý đĩa quay
        const cdThumbAnimate = cdThumb.animate([
            {transform : 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        
        playBtn.onclick = function () {
            if(app.isPlaying){
                app.isPlaying = false
                audio.play()
                playBtn.classList.add('active')
                cdThumbAnimate.play()

            }
            else {
                app.isPlaying = true
                audio.pause()
                playBtn.classList.remove('active')
                cdThumbAnimate.pause()

            }

            //khi tiến độ bài hát thay đổi
            audio.ontimeupdate = function() {
                const progressPersent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPersent
                begin.textContent = app.setTime(audio.currentTime)
                end.textContent =  app.setTime(audio.duration)
            }

            //xử lý khi tua bài hát
            progress.onchange = function(e) {
                const seektime = (e.target.value)*(audio.duration)/100
                audio.currentTime = seektime
            }
        }

        //khi next bài hát 
        next.onclick = function() {
            if(app.isRandom) {
                app.playRandomSong()
                audio.play()
                app.isPlaying = false
                playBtn.classList.add('active')
                cdThumbAnimate.play()
            }
            else {
                app.nextsong()
                audio.play()
                app.isPlaying = false
                playBtn.classList.add('active')
                cdThumbAnimate.play()
            }
        }

        // khi prev bài hát
        prev.onclick = function() {
            if(app.isRandom) {
                app.playRandomSong()
                audio.play()
                app.isPlaying = false
                playBtn.classList.add('active')
                cdThumbAnimate.play()
            }
            else {
                app.prevsong()
                audio.play()
                app.isPlaying = false
                playBtn.classList.add('active')
                cdThumbAnimate.play()
            }
        }

        // nút random

        randombtn.onclick = function() {
            app.isRandom = !app.isRandom
            this.classList.toggle('active',app.isRandom)
            // app.playRandomSong()

        }
        // xử lý khi bài hát kết thúc
        audio.onended = function() {
            app.nextsong()
            audio.play()
        }
        // xử lý khi ấn vào bài hát trên list

        listsong.onclick = function(e) {
            const nodeElement = e.target.closest('.playlist-item')
            if(nodeElement) {
                app.currentIndext = nodeElement.getAttribute('data')
                app.loadCurrentSong()
                audio.play()
                app.isPlaying = false
                playBtn.classList.add('active')
                cdThumbAnimate.play()
            }
        }
    },
    nextsong: function() {
        this.currentIndext++
        if(this.currentIndext >=this.songs.length) {
            this.currentIndext = 0
        }
        this.loadCurrentSong()

    },
    prevsong: function() {
        this.currentIndext--
        if(this.currentIndext < 0) {
            this.currentIndext = this.songs.length-1
        }
        this.loadCurrentSong()

    },
    loadCurrentSong: function() {
        const heading = $('.name-of-song')
        const cdThumb = $('.play-music__music-dis-url-image')
        const singer = $('.name-singer')
        const audio = $('#audio')
        
        heading.textContent = this.currenSong.name
        singer.textContent = this.currenSong.singer
        cdThumb.style.backgroundImage = `url('${this.currenSong.img}')`
        audio.src = this.currenSong.path

    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex == this.currentIndext)
        this.currentIndext = newIndex
        this.loadCurrentSong()
    },
    setTimeSong: function () {
        $$('.wave')[app.currentIndext].innerHTML = strokes

    },

    start: function() {
        this.defineProperties()
        this.handleEvents()
        this.loadCurrentSong()
        this.rander();
    },


}   


// button play list


openplaylist.onclick = () => {
    playlist.classList.add('active')

}

exitplaylist.onclick = function() {
    playlist.classList.remove('active')
}


app.start()