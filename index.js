const searchBar = document.getElementById("search-bar");
const container = document.getElementById("image-container");
const searchResult = document.getElementById("search-for");
const fullImgContainer = document.querySelector(".full-img-container");
const myToken = "&client_id=WuyuwBxVneJd4VKCXbFu2rP4QMzI8pmBT2AMRfNKKNE";
const defaultAuthor = "https://unsplash.com/@anniespratt?utm_source=PrettyImages&utm_medium=referral"
const defaultUnsplashLink = "https://unsplash.com/?utm_source=PrettyImages&utm_medium=referral"

searchBar.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        loadImages();
        searchResult.textContent = `Kết quả tìm kiếm của "${searchBar.value}"`;
    }
})

const handleDownload = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.url;
    } catch(error) {console.error(error)}
}

const openDownload = (link) => {
    var element = document.createElement('a');
    element.setAttribute('href', link);
    element.setAttribute('download', 'image');
    element.setAttribute('target', '_blank');
    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

const toggleImage = (obj) => {
    if (!obj.name) {obj.name = "Annie Spratt"}
    if (!obj.profile) {obj.profile = defaultAuthor}
    const authorName = document.getElementById("author");
    authorName.setAttribute("href", obj.profile);
    authorName.textContent = obj.name;
    const image = document.getElementById("full-img");
    const downloadButton = document.querySelector(".big-download");
    downloadButton.onclick = () => {openDownload(obj.downloadSRC);};     
    image.src = obj.src;
    image.id = "full-img";
    image.setAttribute('alt', "full-image");
    fullImgContainer.classList.toggle("activated");
}

const loadImages = () => {
    clearImages();
    const url = `https://api.unsplash.com/search/photos?query=${searchBar.value}&per_page=100&client_id=WuyuwBxVneJd4VKCXbFu2rP4QMzI8pmBT2AMRfNKKNE`
    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            alert(response.status);
        }
    })
    .then(data => {
        const images = [];
        for (let i = 0; i < data.results.length; i++) {
            images[i] = document.createElement("div");
            images[i].classList.add("img");
            
            const downloadIcon = document.createElement("i");
            downloadIcon.classList.add("fa-solid", "fa-download");

            const expandIcon = document.createElement("i");
            expandIcon.classList.add("fa-solid", "fa-expand");
            
            const img = document.createElement("img");
            img.src = data.results[i].urls.thumb;

            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("img-button-container");
            
            const downloadButton = document.createElement("button");
            const expandButton = document.createElement("button");
            handleDownload(data.results[i].links.download_location + myToken)
            .then(newUrl => {
                downloadButton.onclick = () => openDownload(newUrl);
                expandButton.onclick = () => toggleImage({
                    src: data.results[i].urls.full, 
                    downloadSRC: newUrl,
                    profile: data.results[i].user.links.html + "?utm_source=PrettyImages&utm_medium=referral",
                    name: data.results[i].user.name
                });
                console.log(newUrl);
            })            
            downloadButton.classList.add("small-download");
            downloadButton.appendChild(downloadIcon);

            expandButton.classList.add("expand");
            expandButton.appendChild(expandIcon);

            buttonContainer.appendChild(downloadButton);
            buttonContainer.appendChild(expandButton);
            
            images[i].appendChild(img);
            images[i].appendChild(buttonContainer);

            container.appendChild(images[i]);
        }
    })
}
const clearImages = () => {
    container.innerHTML = "";
}