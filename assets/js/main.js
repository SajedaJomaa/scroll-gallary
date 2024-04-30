let currentPage = 1;
let isFetching = false;
let hasMore = true;
let root = document.getElementById('root');
let lastImage;
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isFetching && hasMore) {
        fetchData();
    }
}, { threshold: 0.2 });

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
        imageContainer = document.querySelector('.image-container');
        lastImage = imageContainer.lastElementChild;


        document.querySelectorAll('.image-container .image img').forEach(image => {
            image.onclick = () => {
                document.querySelector('.popup-image').style.display = 'block';
                document.querySelector('.popup-image img').src = image.getAttribute('src');

            }
        });

        document.querySelector('.popup-image span').onclick = () => {
            document.querySelector('.popup-image ').style.display = 'none';

        }
        observer.observe(lastImage);
    }
    currentPage++;
    observer.unobserve(lastImage);
}

function downloadImage(url, filename) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        })
        .catch(error => console.error('Download failed:', error));
}

document.querySelector('.downloadImage').addEventListener('click', function () {
    let imageUrl = document.querySelector('.popup-image img').src;
    downloadImage(imageUrl, 'image.jpg');
});

fetchData();
