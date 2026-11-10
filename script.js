
document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // ELEMENTS
    // ==========================================

    const envelopeScreen = document.getElementById("envelopeScreen");
    const envelope = document.getElementById("envelope");
    const invitation = document.getElementById("invitation");

    const weddingMusic = document.getElementById("weddingMusic");
    const musicButton = document.getElementById("musicButton");

    // ==========================================
    // WEDDING MUSIC
    // ==========================================

    function updateMusicButton() {
        if (!weddingMusic || !musicButton) return;

        if (!weddingMusic.paused) {
            musicButton.classList.add("playing");
            musicButton.setAttribute(
                "aria-label",
                "Pause wedding music"
            );
        } else {
            musicButton.classList.remove("playing");
            musicButton.setAttribute(
                "aria-label",
                "Play wedding music"
            );
        }
    }

    function playWeddingMusic() {
        if (!weddingMusic) {
            console.error("Wedding music audio element was not found.");
            return;
        }

        weddingMusic.volume = 0.7;

        const playPromise = weddingMusic.play();

        if (playPromise !== undefined) {
            playPromise
                .then(function () {
                    updateMusicButton();
                    console.log("Wedding music is now playing.");
                })
                .catch(function (error) {
                    updateMusicButton();
                    console.error("Unable to play wedding music:", error);
                });
        }
    }

    function pauseWeddingMusic() {
        if (!weddingMusic) return;

        weddingMusic.pause();
        updateMusicButton();
    }

    function toggleMusic() {
        if (!weddingMusic) return;

        if (weddingMusic.paused) {
            playWeddingMusic();
        } else {
            pauseWeddingMusic();
        }
    }

    if (musicButton) {
        musicButton.addEventListener("click", function (event) {
            event.stopPropagation();
            toggleMusic();
        });
    }

    if (weddingMusic) {
        weddingMusic.addEventListener("play", updateMusicButton);
        weddingMusic.addEventListener("pause", updateMusicButton);
        weddingMusic.addEventListener("ended", updateMusicButton);

        weddingMusic.addEventListener("error", function () {
            console.error(
                "Music file could not be loaded. Check music/wedding-song.mp3."
            );
        });
    }

    // ==========================================
    // ENVELOPE OPENING ANIMATION
    // ==========================================

    let invitationOpened = false;

    function openInvitation() {

        if (invitationOpened) return;

        invitationOpened = true;

        // Start music when the visitor taps the envelope.
        playWeddingMusic();

        // Start the existing envelope animation.
        if (envelope) {
            envelope.classList.add("opening");
        }

        if (envelopeScreen) {
            envelopeScreen.classList.add("opening");
        }

        // Reveal the wedding invitation after the animation.
        setTimeout(function () {

            if (envelopeScreen) {
                envelopeScreen.style.display = "none";
            }

            if (invitation) {
                invitation.classList.add("visible");
                invitation.style.display = "block";
            }

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }, 1900);
    }

    if (envelope) {

        envelope.addEventListener("click", function () {
            openInvitation();
        });

        // Keyboard support: Enter or Space.
        envelope.addEventListener("keydown", function (event) {

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openInvitation();
            }

        });
    }

    // ==========================================
    // WEDDING COUNTDOWN
    // ==========================================

    const weddingDate = new Date(
        "2026-12-19T14:00:00+08:00"
    ).getTime();

    function updateCountdown() {

        const now = new Date().getTime();
        const difference = weddingDate - now;

        const daysElement = document.getElementById("days");
        const hoursElement = document.getElementById("hours");
        const minutesElement = document.getElementById("minutes");
        const secondsElement = document.getElementById("seconds");

        if (
            !daysElement ||
            !hoursElement ||
            !minutesElement ||
            !secondsElement
        ) {
            return;
        }

        if (difference <= 0) {
            daysElement.textContent = "00";
            hoursElement.textContent = "00";
            minutesElement.textContent = "00";
            secondsElement.textContent = "00";
            return;
        }

        const days = Math.floor(
            difference / (1000 * 60 * 60 * 24)
        );

        const hours = Math.floor(
            (difference % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        );

        const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) /
            (1000 * 60)
        );

        const seconds = Math.floor(
            (difference % (1000 * 60)) / 1000
        );

        daysElement.textContent = String(days).padStart(2, "0");
        hoursElement.textContent = String(hours).padStart(2, "0");
        minutesElement.textContent = String(minutes).padStart(2, "0");
        secondsElement.textContent = String(seconds).padStart(2, "0");
    }

    // Display countdown immediately.
    updateCountdown();

    // Update every second.
    const countdownInterval = setInterval(
        updateCountdown,
        1000
    );

    // ==========================================
    // LUCIDE ICONS
    // ==========================================

    if (window.lucide) {
        lucide.createIcons();
    }

    // ==========================================
    // INITIAL MUSIC BUTTON STATE
    // ==========================================

    updateMusicButton();

    console.log("Wedding invitation JavaScript loaded successfully.");

});
