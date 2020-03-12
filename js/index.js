let $ = require('jquery');

require('../css/index.css');

let pauseImg=require('../images/pause.png');
let playImg=require('../images/paly.png');

let hongseaixinImg=require('../images/hongseaixin.png');
let baisexinImg=require('../images/baisexin.png');
let moreImg=require('../images/more.png');

let delImg=require('../images/delete.png');

$(function () {

    //初始化最近播放，收藏数据结构
    function initSongConstruct() {
        var songItems = ['recentlymusic', 'lovemusic'];

        for (var i = 0; i < songItems.length; i++) {
            var d = localStorage.getItem(songItems[i]);

            //如果不存在数据结构
            if (!d) {
                localStorage.setItem(songItems[i], JSON.stringify([]));
            }
        }

    }

    initSongConstruct();

    //获取音频元素
    var $audio = $('audio')[0];
    // console.log('$audio==>', $audio);

    //获取遮罩层
    var $layer = $('.layer');
    // console.log('$layer==>', $layer);

    //获取滑块层
    var $mask = $('.mask');
    // console.log('$mask==>', $mask);

    //获取激活进度层
    var $proActive = $('.pro-active');
    // console.log('$proActive==>', $proActive);

    var minleft = 0;
    var maxleft = $layer.width() - $mask.width();


    //点击播放暂停事件
    $('.play-box').on('click', function () {

        //获取链接

        var src = $($audio).attr('src');

        // // 播放
        // this.play();

        if (!src) {
            return;
        }

        //获取播放状态 0暂停 1播放

        var status = $(this).data('play');
        // console.log(status);

        if (status == 0) {

            $audio.play();
            $(this).data('play', 1).css({
                backgroundImage: 'url("'+ pauseImg +'")'
            })
        } else {
            $audio.pause();
            $(this).data('play', 0).css({
                backgroundImage: 'url("'+ playImg +'")',
                backgroundSize: '24px 24px'
            })
        }

    })

    // //是否播放完成
    // var isEnd = false;


    //当音频播放结束时
    audio.onended = function () {
        //将data-play修改为0
        $('.play-box').data('play', 0);
        // isEnd = true;

        playAudio('next');
    }

    //点击显示选择播放模式
    $('.liebiao').on('click', function () {
        $('.xunhuan').css({
            display: 'block'
        })

    });


    //显示隐藏选择模式
    $('.xunhuan>ul>li').on('click', function () {
        var schmema = $(this).text();
        var num = $(this).attr('name');
        $('.liebiao').attr('name', num).attr('title', schmema);

        // console.log($('.liebiao').attr('name'));
        $('.xunhuan').css({
            display: 'none'
        })
    });

    function playAudio(type, isAuto) {

        isFirstPlay = true;
        //获取所有歌曲列表
        var $songs = $('.music-box');
        // console.log('$songs==>', $songs);

        //获取当前激活的歌曲
        var $activeSong = $('.music-box.active');
        // console.log('$activeSong==>', $activeSong);

        //获取播放模式的标识
        var iden = $('.liebiao').attr('name');
        // console.log('iden==>', iden);

        if (iden == 0 || (iden == 1 && isAuto === false)) {

            var $activeIndex = $activeSong.index();

            var $nextSong = null;
            if (type == 'next') {
                if ($activeIndex == $songs.length - 1) {
                    // console.log('aaa');
                    $nextSong = $songs.eq(0);
                } else {
                    $nextSong = $songs.eq($activeIndex + 1);
                }

            } else {
                if ($activeIndex == 0) {
                    $nextSong = $songs.eq($songs.length - 1);
                } else {
                    $nextSong = $songs.eq($activeIndex - 1);
                }
            }

            $activeSong.removeClass('active');

            $nextSong.addClass('active');

            var id = $nextSong.attr('id');

            $('.play-box').attr('name', id);

            var audiourl = $nextSong.data('url');
            $($audio).attr('src', audiourl);

        } else if (iden == 2) {

            var random = Math.floor(Math.random() * $songs.length);
            // console.log('random==>', random);
            var $randomSong = $songs.eq(random);

            $activeSong.removeClass('active');

            $randomSong.addClass('active');

            var id = $randomSong.attr('id');

            $('.play-box').attr('name', id);

            var audiourl = $randomSong.data('url');
            $($audio).attr('src', audiourl);

        } else {
            $audio.load();
        }
    }

    //下一首
    $('.next-box').on('click', function () {
        playAudio('next', false);
        // console.log($('.liebiao').attr('name'));

    })

    //上一首
    $('.prev-box').on('click', function () {
        playAudio('prev', false);

    })

    //是否是第一次播放
    var isFirstPlay = true;

    var duration = 0;

    //当音频可播放时执行
    $audio.onplay = function () {
        if (isFirstPlay) {
            //获取音频总时间
            duration = this.duration;
            // console.log('duration ==> ', duration);
            isFirstPlay = false;

            var alltime = Time(duration);
            // console.log('alltime==>', alltime);

            //设置歌词的总时间
            $('.all-time').text(alltime);
            // console.log('$alltime==>', $alltime);

            //获取最近播放歌曲
            var recentSong = JSON.parse(localStorage.getItem('recentlymusic'));

            //获取播放的给歌曲id
            var songId = $('.play-box').attr('name');
            // console.log('songId==>', songId);

            $('.song-word-list').empty().css({
                top: '200px'
            })

            moveIndex = 0;

            //获取当前歌曲的歌词链接
            var lrc = $('.music-box.active').eq(0).data('lrc');

            getlyric(lrc);


            for (var i = 0; i < recentSong.length; i++) {
                if (recentSong[i].id == songId) {
                    //如果存在，则不添加到最近播放列表中
                    return;
                }
            }

            //根据歌曲id查询歌曲信息
            $.each(defaltSongs, function () {
                if (this.id == songId) {
                    recentSong.push(this);
                    localStorage.setItem('recentlymusic', JSON.stringify(recentSong));
                }
            })


        }

        // //尚未播放完成
        // isEnd = false;

    }


    //鼠标按下时
    var isDown = false;

    function move(e) {
        var left = e.offsetX - $mask.width() / 2;
        // console.log('left==>', left);

        left = left > maxleft ? maxleft : left < minleft ? minleft : left;

        $mask.css({
            left: left + 'px'
        })

        $proActive.css({
            width: e.offsetX + 'px'
        })

        var percent = left / maxleft * duration;

        if (isLeave) {
            $audio.currentTime = percent;
            isLeave = false;
        }

        if (!isDown) {
            var $lis = $('.song-word-list>li');

            $lis.each(function (i) {

                //获取当前li的data-time
                var currentlitime = $(this).data('time');

                if (i == 0 && currentlitime > percent) {
                    moveIndex = 0;
                    $('.song-word-list').css({
                        top: 200 + 'px'
                    })

                    $(this).siblings().removeClass('now');

                    return false;
                }

                //获取下一个li的data-time

                var nextlitime = $(this).next().data('time');

                if (currentlitime <= percent && nextlitime > percent) {
                    moveIndex = i;

                    $('.song-word-list').css({
                        top: 200 - i * 40 + 'px'
                    })
                    $(this).addClass('now').siblings().removeClass('now');

                    return false;
                }


            })
        }

    }

    $layer.on('mousedown', function (e) {

        isDown = true;
        move(e);

        $(this).on('mousemove', function (e) {
            e.preventDefault();
            move(e);
        })
    })

    //鼠标松开时
    var isLeave = false;

    $layer.on('mouseup', function (e) {
        //清除onmousemove事件
        $(this).off('mousemove');

        isLeave = true;
        isDown = false;
        move(e);
    })

    $layer.on('mouseleave', function (e) {
        if (isDown) {
            //清除onmousemove事件
            $(this).off('mousemove');
            isLeave = true;
            isDown = false;
            move(e);
        }
    })

    //当前音频可以播放时，只会一次
    $audio.oncanplay = function () {

        //播放
        this.play();

        $('.play-box').data('play', 1);
        $('.play-box').css({
            backgroundImage: 'url("' + pauseImg + '")'
        })

        // console.log($('.music-box.active:not(:hidden)'));

        //获取当前歌曲的id
        var id = $('.music-box.active:not(:hidden)').attr('id');
        $('.play-box').attr('name', id);
        // console.log(id);

        //设置歌曲的信息
        var sp = $('.music-box.active:not(:hidden)').find('img')[0].src;
        var singername = $('.music-box.active:not(:hidden)').find('.name').text();
        var songname = $('.music-box.active:not(:hidden)').find('.song-name').text();

        $('.name-time>.music-name').text(singername + ' - ' + songname);
        $('.imgbox>img').attr('src', sp);

        // $('.music-box.active:hidden').removeClass('active');

        //首次播放
        // isFirstPlay = true;
    }

    //封装一个方法转换时间
    function Time(time) {
        time = Math.floor(time);

        var minute = Math.floor(time / 60).toString();

        minute = minute < 10 ? '0' + minute : minute;

        var secend = (time - parseInt(minute) * 60).toString();

        secend = secend < 10 ? '0' + secend : secend;

        return minute + ':' + secend;
    }

    var moveIndex = 0;

    //当前音频播发时刻发生变化时触发事件
    $audio.ontimeupdate = function () {

        if (isDown) {
            return;
        }
        //获取音频当前的播放时间
        var currentTime = this.currentTime;

        var CT = Time(currentTime);
        $('.gap-time').text(CT);

        //音频时间的百分比
        var percent = currentTime / duration;
        // console.log('percent==>', percent);

        //设置滑块的left值
        $mask.css({
            left: $layer.width() * percent - 5 + 'px'
        })

        //设置进度条颜色
        var w = $layer.width() * percent;

        $proActive.css({
            width: w + 'px'
        })


        //获取当前歌曲所有的歌词
        var lrcall = $('.song-word-list>li');
        // console.log('lrcall==>', lrcall);

        for (var i = moveIndex; i < lrcall.length; i++) {
            //获取当前li的data-time
            var litime = $(lrcall[i]).data('time');
            // console.log('litime==>',litime);

            if (litime > currentTime) {
                break;
            }

            //获取下一个li的data-time
            var nextlitime = $(lrcall[i]).next().data('time');
            // console.log('nextlitime==>', nextlitime);

            //判断nextlitime是否存在，如果不存在则赋值最大值
            nextlitime = nextlitime === undefined ? Number.MAX_VALUE : nextlitime;

            if (litime <= currentTime && nextlitime > currentTime) {

                //播放当前歌词

                //获取当前歌词的top

                var $songWordlist = $('.song-word-list');
                var top = $songWordlist.position().top;

                // console.log('top==>', top);

                $songWordlist.animate({
                    top: top - 40
                }, 200)

                //获取当前li宽度，span的宽度

                var liwidth = $(lrcall[i]).width();
                var spanwidth = $(lrcall[i]).find('span').width();

                if (spanwidth > liwidth) {
                    $(lrcall[i]).find('span').animate({
                        left: -(spanwidth - liwidth) + 'px'
                    }, 100)
                }

                //获取上一个节点
                var parents = $(lrcall[i]).parents('.song-word-list');
                var now = parents.find('.now');
                var prevliwidth = now.removeClass('now').width();
                var prevspanwidth = now.find('span').width();

                if (prevspanwidth > prevliwidth) {
                    now.find('span').find('span').css({
                        left: -(prevspanwidth - prevliwidth) + 'px'
                    })
                }

                $(lrcall[i]).addClass('now');

                moveIndex = i + 1;
                break;
            }

        }

    }


    //保存音乐歌单（默认歌单）
    var defaltSongs = null;

    //moren歌曲列表加载歌曲数量
    var countDatas = {};
    countDatas.defaultcount = {
        start: 0,
        count: 20
    };

    //最近播放歌曲列表加载歌曲数量
    countDatas.recentlycount = {
        start: 0,
        count: 15
    };

    //最近播放歌曲列表加载歌曲数量
    countDatas.lovecount = {
        start: 0,
        count: 20
    };


    function create(data, countData) {

        //每次截取20条数据
        var songData = null;
        if (countData) {
            songData = data.slice(countData.start, countData.count + countData.start);
            countData.start += countData.count;
        } else {
            songData = data;
        }

        // console.log('songData==>', songData);

        //获取当前激活的index
        var dataIndex = $('.music-nav>div.active').data('index');
        // console.log('dataIndex==>', dataIndex);

        //获取收藏歌曲数据
        var lovemusic = JSON.parse(localStorage.getItem('lovemusic'));
        // console.log(lovemusic);

        $.each(songData, function () {

            var self = this;

            //当前歌曲是否被收藏
            var isHas = false;

            // 获取当前歌曲id到likeSong查询收藏歌曲
            $.each(lovemusic, function () {

                //如果id匹配，则表明该歌曲已经被收藏
                if (this.id == self.id) {
                    isHas = true;
                    return false;
                }
            })
            var $item = $(`
                <div class="music-box" id="${this.id}" data-url="${this.url}" data-lrc="${this.lrc}" data-songid="${this.id}">
                    <div class="music-box-img">
                        <img class="auto-img" src="${this.pic}" alt="">
                    </div>
                    <div class="song-info">
                        <div class="song-info-top">
                            <span class="name">${this.singer}</span> - <span class="song-name">${this.name}</span>
                        </div>
                        <div class="song-info-bottom">
                            <div class="song-info-bottom-left">
                                <span class="">时长</span>
                                :
                                <span class=time>${Time(this.time)}</span>
                            </div>
                            <div class="song-info-bottom-right">
                            <div class="like ${dataIndex=='lovemusic'? 'not':''}" data-like="${isHas ? 1 : 0}">
                                <img class="auto-img" src="${isHas ? '' + hongseaixinImg +'' : '' + baisexinImg + ''}" alt="">
                            </div>
                            <div class="more">
                                <img class="auto-img" src="${moreImg}" alt="">
                            </div>
                            <div class="del ${dataIndex == 'defaultmusic' ? 'not' : ''}">
                                <img class="auto-img" src="${delImg}" alt="">
                            </div>
                        </div>              
                    </div>
                </div>
            `);

            $('.musics>#' + dataIndex).append($item);
        })

        //将热门歌曲缓存
        localStorage.setItem('defaultmusic', JSON.stringify(defaltSongs));
    }

    //初始化默认歌曲列表
    function initDefaultSong() {

        //判断是否存在默认歌曲列表
        var defaltSong = localStorage.getItem('defaultmusic');

        // console.log('countDatas.defaultcount==>', countDatas.defaultcount);

        if (defaltSong) {
            defaltSongs = JSON.parse(defaltSong);
            create(defaltSongs, countDatas.defaultcount);
            // console.log('从缓存获取');
            return;
        }
        //发起ajax请求
        $.ajax({
            // async: false,
            //请求类型
            type: 'GET',

            //请求地址
            url: 'https://v1.itooi.cn/netease/songList',

            //请求参数
            data: {
                id: 141998290,
                format: 1
            },

            //请求成功后执行的回调函数
            success: function (data) {

                defaltSongs = data.data.concat();

                create(defaltSongs, countDatas.defaultcount);

            }

        })

    }
    initDefaultSong();


    // 绑定点击歌曲事件
    $('.musics').on('click', '.music-box', function () {
        // console.log('$(this)==>', $(this));
        // $(this).find('.like').attr('name',1);
        if ($(this).hasClass('active')) {

            var $play = $('#playbox');
            // console.log('$play==>', $play);

            var statu = $play.data('play');
            // console.log('statu==>', statu);
            if (statu == 0) {
                $audio.play();
                $play.data('play', 1).css({
                    backgroundImage: 'url("'+ pauseImg +'")'
                })
            } else {
                $audio.pause();
                $play.data('play', 0).css({
                    backgroundImage: 'url("'+ playImg +'")',
                    backgroundSize: '24px 24px'
                })
            }
            return;
        }
        //激活当前的active
        $(this).addClass('active').siblings().removeClass('active');

        //移除其他隐藏歌曲列表的歌曲激活状态
        $('.music-box.active:hidden').removeClass('active');

        //获取歌曲id
        var songId = $(this).attr('id');

        $('[data-songid="' + songId + '"]:not(.active)').addClass('active');

        //获取当前的播放地址
        var audioUrl = $(this).data('url');

        $($audio).attr('src', audioUrl);


        //首次播放
        isFirstPlay = true;

    });


    //切换歌单
    $('.music-nav>div').on('click', function () {

        if ($(this).hasClass('active')) {
            return;
        }
        //给当前添加类名，移除其他元素的类名
        $(this).addClass('active').siblings().removeClass('active');

        //获取当前的dataIndex
        var dataIndex = $(this).data('index');
        // console.log('dataIndex==>', dataIndex);

        //根据dataIndex获取歌曲数据
        var currentSongData = JSON.parse(localStorage.getItem(dataIndex));
        // console.log('currentSongData==>', currentSongData);


        //获取截取歌曲数量标识
        var currentSongCount = $(this).data('count');
        // console.log('currentSongCount==>', currentSongCount);


        //获取当前歌曲列表歌曲数量
        var counts = $('#' + dataIndex + '>.music-box').length;
        // console.log('counts==>', counts);


        if (currentSongCount != 'defaultcount') {
            create(currentSongData.slice(counts));
            var songId = $('.music-box.active').eq(0).attr('id');
            // console.log('songId==>', songId);

            $('[data-songid="' + songId + '"]:not(.active)').addClass('active');
        }

        //显示隐藏歌曲列表
        $('#' + dataIndex).addClass('show').siblings().removeClass('show');
    })

    //收藏歌曲
    $('.musics').on('click', '.like', function (e) {

        //阻止事件冒泡
        e.stopPropagation();

        //0:没有就收藏 1：已经收藏
        var datalike = $(this).data('like');
        // console.log(datalike);

        //获取歌曲id
        var songid = $(this).parents('.music-box').attr('id');
        // console.log('songid==>', songid);

        // 获取收藏歌曲
        var lovemusic = JSON.parse(localStorage.getItem('lovemusic'));
        // console.log('lovemusic==>', lovemusic);

        //获取所有列表的歌曲

        var $lovesong = $('.music-box[data-songid="' + songid + '"]');
        // console.log('$lovesong==>', $lovesong);

        if (datalike == 0) {
            // $(this).data('like', 1).find('img').attr('src', './images/hongseaixin.png');


            $.each($lovesong, function () {
                $(this).find('.like').data('like', 1).find('img').attr('src', hongseaixinImg);
            })

            //通过歌曲id查询歌曲
            $.each(defaltSongs, function () {
                if (this.id == songid) {
                    lovemusic.push(this);
                    localStorage.setItem('lovemusic', JSON.stringify(lovemusic));

                    return false;
                }
            })

        } else {
            $.each($lovesong, function () {

                $(this).find('.like').data('like', 0).find('img').attr('src', baisexinImg);

            })
            for (var i = 0; i < lovemusic.length; i++) {
                if (songid == lovemusic[i].id) {

                    //删除本地数据
                    lovemusic.splice(i, 1);
                    localStorage.setItem('lovemusic', JSON.stringify(lovemusic));

                    //删除页面音乐
                    $('#lovemusic>[data-songid="' + songid + '"]').remove();

                    break;
                }
            }

        }
    })


    //删除最近播放
    $('#recentlymusic').on('click', '.del', function (e) {

        //阻止事件冒泡
        e.stopPropagation();

        //获取最近播放的全部歌曲
        var $recentlymusic = JSON.parse(localStorage.getItem('recentlymusic'));
        console.log('$recentilmusic==>', $recentlymusic);

        //获取歌曲id
        var songid = $(this).parents('.music-box').attr('id');
        console.log('songid==>', songid);

        for (var i = 0; i < $recentlymusic.length; i++) {
            if (songid == $recentlymusic[i].id) {

                // console.log('aaa');
                //删除本地数据
                $recentlymusic.splice(i, 1);
                // console.log('$recentlymusic==>',$recentlymusic);
                //刷新本地存储
                localStorage.setItem('recentlymusic', JSON.stringify($recentlymusic));

                //删除页面最近播放歌曲

                $('#recentlymusic>[data-songid="' + songid + '"]').remove();
            }
        }

    })


    //收藏列表删除收藏歌曲
    $('#lovemusic').on('click', '.del', function (e) {
        //阻止事件冒泡
        e.stopPropagation();
        // console.log('aaa');

        //获取收藏列表的歌曲
        var $lovemusic = JSON.parse(localStorage.getItem('lovemusic'));
        // console.log('$lovemusic==>', $lovemusic);

        //获取当前点击删除歌曲的id
        var songid = $(this).parents('.music-box').data('songid');
        // console.log('songid==>',songid);

        var $defaultsong = $('.music-box[data-songid="' + songid + '"]');
        // console.log('$lovesong==>', $lovesong);

        //把其他歌单红心取消
        $.each($defaultsong, function () {
            $(this).find('.like').data('like', 0).find('img').attr('src', baisexinImg);
        })

        //遍历歌单查找id删除数据
        for (var i = 0; i < $lovemusic.length; i++) {
            if (songid == $lovemusic[i].id) {
                //删除本地数据
                $lovemusic.splice(i, 1);

                //刷新本地存储
                localStorage.setItem('lovemusic', JSON.stringify($lovemusic));

                //删除页面收藏歌曲
                $('#lovemusic>[data-songid="' + songid + '"]').remove();

            }
        }
    })


    //获取歌词
    function getlyric(url) {
        $.ajax({
            type: 'GET',
            url: url,
            success: function (data) {
                var lyric = data.split('\n[');
                // console.log(lyric);

                for (var i = 0; i < lyric.length; i++) {
                    var lrc = lyric[i].split(']');


                    if (i == 0) {
                        lrc[0] = lrc[0].replace('[', '');
                    }

                    if (i == lyric.length - 1) {
                        lrc[1] = lrc[1].trim();
                    }

                    if (lrc[1] == '') {
                        continue;
                    }

                    // console.log('lrc==>', lrc);

                    var time = lrc[0].split(':');
                    // console.log('time==>', time);

                    var minute = Number(parseFloat(time[0]) * 60);
                    // console.log('minute==>', minute);

                    var secend = parseFloat(time[1]);

                    var times = (minute + secend).toFixed(2);
                    // console.log('times==>', times);

                    //创建li

                    var $li = $('<li data-time="' + times + '" class="' + (i == 0 ? 'now' : '') + '"><span>' + lrc[1] + '</span></li>');

                    $('.song-word-list').append($li);

                }
            },
            error: function (err) {
                console.log('找不到歌词');
            }
        })
    }


    //滚动加载热门歌曲
    var timers = [];
    var songListHeight = $('.musics').height();
    console.log('songListHeight ==> ', songListHeight);

    $('#defaultmusic').on('scroll', function () {

        var self = this;

        var timer = setTimeout(function () {

            //清除后续定时器
            for (var i = 1; i < timers.length; i++) {
                clearTimeout(timers[i]);
            }

            timers = [];

            //获取当前的滚动距离
            var scrollTop = $(self).scrollTop();
            // console.log('scrollTop ==> ', scrollTop);

            //获取当前所有热门歌曲列表的总高度
            var $allLis = $(self).find('.music-box');
            // console.log('$allLis ==> ', $allLis);

            var allLisHeight = $allLis.eq(0).outerHeight() * $allLis.length;

            // console.log('allLisHeight ==> ', allLisHeight);

            if (songListHeight + scrollTop >= allLisHeight-20) {

                create(defaltSongs, countDatas.defaultcount);
            }

        }, 550)

        //将当前定时器的序号保存在timers
        timers.push(timer);

    })


})