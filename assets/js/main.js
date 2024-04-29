let currentPage = 1;
let isFetching = false;
let hasMore = true;

let root = document.getElementById('root');
async function fetchData() {
    isFetching = true;
    let response = await fetch(`https://picsum.photos/v2/list?page=${currentPage}&limit=10`)
    let data = await response.json();
    console.log(data);
    isFetching = false;
    if (data.length === 0) {
        hasMore = false;
        return
    }
    for (let image of data) {

        let div = document.createElement('div');
        div.className = 'image';
        div.innerHTML = `<img src="${image.download_url}" alt="">`
        document.querySelector('.imageId').innerHTML = `Image ID : ${image.id}<br>  Image Auther :${image.author}`;
        root.appendChild(div);
        document.querySelectorAll('.image-container .image img').forEach(image => {
            image.onclick = () => {
                document.querySelector('.popup-image').style.display = 'block';
                document.querySelector('.popup-image img').src = image.getAttribute('src');
                let btnDownload = document.querySelector('.downloadImage');
                btnDownload.addEventListener('click', () => {

                });

            }
        });

        document.querySelector('.popup-image span').onclick = () => {
            document.querySelector('.popup-image ').style.display = 'none';

        }
    }
    currentPage++;
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isFetching && hasMore) {
            fetchData();
        }
    }, { threshold: 0.2 });

    observer.observe(document.querySelector('.image-container'));

}




fetchData();
function downloadImage(url, filename) {
    let a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

document.querySelector('.downloadImage').addEventListener('click', function () {
    let imageUrl = document.querySelector('.popup-image img').src;
    downloadImage(imageUrl, 'image.jpg');
});
