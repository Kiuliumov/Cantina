document.addEventListener("DOMContentLoaded", function () {
    const marqueeTrack = document.querySelector('.marquee-track');

    let scrollSpeed = 1.2;
    let scrollDirection = 1;
    let isDragging = false;
    let startX = 0;
    let lastX = 0;
    let velocity = 0;
    let momentum = 0;

    marqueeTrack.innerHTML += marqueeTrack.innerHTML;
    let scrollWidth = marqueeTrack.scrollWidth;

    function animateMarquee() {
        if (!isDragging) {
            marqueeTrack.scrollLeft += scrollSpeed * scrollDirection + momentum;
            momentum *= 0.9;
            if (Math.abs(momentum) < 0.05) momentum = 0;
        }

        if (marqueeTrack.scrollLeft >= scrollWidth / 2) {
            marqueeTrack.scrollLeft = 0;
        } else if (marqueeTrack.scrollLeft <= 0 && (scrollSpeed < 0 || momentum < 0)) {
            marqueeTrack.scrollLeft = scrollWidth / 2;
        }

        requestAnimationFrame(animateMarquee);
    }

    animateMarquee();

    function startDrag(e) {
        isDragging = true;
        startX = lastX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
        velocity = 0;
        momentum = 0;
    }

    function duringDrag(e) {
        if (!isDragging) return;
        const currentX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
        const dx = currentX - lastX;
        marqueeTrack.scrollLeft -= dx;
        velocity = dx;
        lastX = currentX;
    }

    function endDrag() {
        isDragging = false;
        momentum = velocity / 2;
        scrollDirection = momentum < 0 ? -1 : 1;
    }

    marqueeTrack.addEventListener("mousedown", startDrag);
    marqueeTrack.addEventListener("touchstart", startDrag, { passive: true });

    window.addEventListener("mousemove", duringDrag);
    window.addEventListener("touchmove", duringDrag, { passive: false });

    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchend", endDrag);
});
