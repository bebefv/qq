$(document).ready(function () {
    const albumsContainer = $('.albums');
    const albumModal = $('#albumModal');
    const photoModal = $('#photoModal');
    const photoViewModal = $('#photoViewModal');
    const createAlbumForm = $('#createAlbumForm');
    const uploadPhotosForm = $('#uploadPhotosForm');
    //示例数据，用于相册
    let albums = [
        {
            title: '相册1',
            cover: 'https://th.bing.com/th/id/R.8d52fd88fbacb0bc34afa0d3e3d3fbf0?rik=YLBGQ2YxYJczDg&riu=http%3a%2f%2fwww.08lr.cn%2fuploads%2fallimg%2f220330%2f1-2300134436.jpg&ehk=h6QkPS87X6L6Vb7h5F10YmPZlLWLGKOMcKNcY9zMLRA%3d&risl=&pid=ImgRaw&r=0',
            photos: [
                'https://th.bing.com/th/id/R.8d52fd88fbacb0bc34afa0d3e3d3fbf0?rik=YLBGQ2YxYJczDg&riu=http%3a%2f%2fwww.08lr.cn%2fuploads%2fallimg%2f220330%2f1-2300134436.jpg&ehk=h6QkPS87X6L6Vb7h5F10YmPZlLWLGKOMcKNcY9zMLRA%3d&risl=&pid=ImgRaw&r=0',
            ]
        },
        {
            title: '相册2',
            cover: 'https://th.bing.com/th/id/R.eec02321ea106169d757f427b98b358d?rik=%2bgK43uKTPrZbCw&riu=http%3a%2f%2f00.minipic.eastday.com%2f20170823%2f20170823152907_d41d8cd98f00b204e9800998ecf8427e_4.jpeg&ehk=FsISayQ5Gjp%2boHXA8OW7nhrZdn2JEzUKk3lfW%2br0P70%3d&risl=&pid=ImgRaw&r=0',
            photos: [
                'https://th.bing.com/th/id/OIP.oE-0dG4KZ2588LRzUO_lmAHaEo?rs=1&pid=ImgDetMain',
                'https://th.bing.com/th/id/R.2c7e4d41fc29592168145efb4c27f825?rik=4794EMzh3Rx9ug&riu=http%3a%2f%2fimg.lanimg.com%2ftuku%2fyulantu%2f110611%2f9120-110611114P085.jpg&ehk=uBrnEmSPv3B98LfDY7ZZWBo1h51P1eMitJLnNCDMrGA%3d&risl=&pid=ImgRaw&r=0'
            ]
        },
    ];
    //页面加载时加载相册
    loadAlbums();
    // 加载相册的函数
    function loadAlbums() {
        albumsContainer.empty();
        albums.forEach(album => {
            const albumElement = `
                <div class="album">
                    <img src="${album.cover}" alt="${album.title}">
                    <div class="album-info">
                        <div class="album-title">${album.title}</div>
                        <div>${album.photos.length} 张照片</div>
                        <div class="album-actions">
                            <button class="view-album" data-title="${album.title}">查看</button>
                            <button class="delete-album" data-title="${album.title}">删除</button>
                            <button class="add-photo" data-title="${album.title}">添加照片</button>
                        </div>
                    </div>
                </div>
            `;
            albumsContainer.append(albumElement);
        });
    }
    //打开创建相册的模态框
    $('#createAlbumBtn').click(function () {
        albumModal.css('display', 'block');
    });
    //关闭模态框
    $('.close').click(function () {
        albumModal.css('display', 'none');
        photoModal.css('display', 'none');
        photoViewModal.css('display', 'none');
    });
    //创建新相册
    createAlbumForm.submit(function (event) {
        event.preventDefault();
        const albumTitle = $('#albumTitle').val();
        albums.push({
            title: albumTitle,
            cover: 'https://via.placeholder.com/200x150',
            photos: []
        });
        loadAlbums();//重新加载相册
        albumModal.css('display', 'none');
    });
    //删除相册
    albumsContainer.on('click', '.delete-album', function () {
        const albumTitle = $(this).data('title');
        albums = albums.filter(album => album.title !== albumTitle);
        loadAlbums(); // 重新加载相册
    });
    //显示相册中的照片
    albumsContainer.on('click', '.view-album', function () {
        const albumTitle = $(this).data('title');
        const album = albums.find(album => album.title === albumTitle);
        if (album) {
            const photosContainer = $('<div class="photos"></div>');
            album.photos.forEach(photo => {
                const photoElement = `
                    <div class="photo">
                        <img src="${photo}" alt="照片">
                        <button class="delete-photo" data-photo="${photo}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                photosContainer.append(photoElement);
            });
            photoViewModal.find('.photos').html(photosContainer);
            photoViewModal.css('display', 'block');
        }
    });
    //从查看照片返回到相册
    photoViewModal.on('click', '#backToAlbums', function () {
        loadAlbums();
        photoViewModal.css('display', 'none');
    });
    //打开上传照片框
    albumsContainer.on('click', '.add-photo', function () {
        const albumTitle = $(this).data('title');
        $('#uploadAlbumTitle').val(albumTitle);
        photoModal.css('display', 'block');
    });
    //上传照片
    uploadPhotosForm.submit(function (event) {
        event.preventDefault();
        const albumTitle = $('#uploadAlbumTitle').val();
        const files = $('#fileInput')[0].files;
        if (files.length > 0) {
            const urls = Array.from(files).map(file => URL.createObjectURL(file));
            const album = albums.find(album => album.title === albumTitle);
            if (album) {
                album.photos.push(...urls);
                saveAlbumData(albumTitle, album.photos); // 模拟保存数据到服务器
                loadAlbums(); // 重新加载相册
                photoModal.css('display', 'none');
            }
        }
    });
    // 删除照片
    albumsContainer.on('click', '.delete-photo', function () {
        const photoUrl = $(this).data('photo');
        albums.forEach(album => {
            album.photos = album.photos.filter(photo => photo !== photoUrl);
        });
        loadAlbums(); // 重新加载相册
    });
    //将相册数据保存到服务器
    function saveAlbumData(albumTitle, photos) {
        //发送数据到服务器
        console.log(`保存相册 ${albumTitle} 的数据:`, photos);
    }
});
