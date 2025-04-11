document.addEventListener("DOMContentLoaded", function() {
    const marqueeTrack = document.querySelector('.marquee-track');
    let scrollSpeed = 2;
    
    function calculateScrollWidth() {
        return marqueeTrack.scrollWidth;
    }

    let scrollWidth = calculateScrollWidth();

    function scrollMarquee() {
        let currentScrollPosition = marqueeTrack.scrollLeft;

        if (currentScrollPosition >= scrollWidth / 2) { 
            marqueeTrack.scrollLeft = 0;
        } else {
            marqueeTrack.scrollLeft += scrollSpeed;
        }
    }

    window.addEventListener('load', () => {
        scrollWidth = calculateScrollWidth();
    });

    setInterval(scrollMarquee, 20);
});