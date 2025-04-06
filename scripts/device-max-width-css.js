window.addEventListener('load', getDeviceWidth);


function getDeviceWidth(){
    const container = document.querySelector('.container')
    const width = window.innerWidth;
    container.style.width = width + 'px';
    console.log(width)
}