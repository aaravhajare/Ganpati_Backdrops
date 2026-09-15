import { useEffect, useRef, useState } from "react";

function FullscreenPlayer({ backdrop, onClose }) {
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimer = useRef(null);

  useEffect(() => {
    if (!backdrop) return;

    const video = videoRef.current;
    const audio = audioRef.current;

    if (!video) return;

    document.body.classList.add("player-open");

    video.currentTime = 0;
    video.muted = true;

    if (audio) {
      audio.currentTime = 0;
      audio.loop = true;
    }

    const startPlayback = async () => {
      try {
        await video.play();

        if (audio) {
          await audio.play();
        }
      } catch (error) {
        console.error("Video playback failed:", error);
      }
    };

    startPlayback();
    showControls();

    return () => {
      video.pause();
      video.currentTime = 0;

      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }

      document.body.classList.remove("player-open");

      clearTimeout(hideTimer.current);
    };
  }, [backdrop]);

  function showControls() {
    setControlsVisible(true);

    clearTimeout(hideTimer.current);

    hideTimer.current = setTimeout(() => {
      setControlsVisible(false);
    }, 3000);
  }

  function closePlayer() {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (video) {
      video.pause();
      video.currentTime = 0;
    }

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    onClose();
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closePlayer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  if (!backdrop) return null;

  return (
    <div
      className="fullscreen-player"
      onMouseMove={showControls}
      onTouchStart={showControls}
      onClick={showControls}
    >
      <video
        ref={videoRef}
        src={backdrop.video}
        className="fullscreen-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {backdrop.music && (
        <audio
          ref={audioRef}
          src={backdrop.music}
          loop
          preload="auto"
        />
      )}

      <div
        className={`player-ui ${
          controlsVisible ? "visible" : ""
        }`}
      >
        <div className="player-topbar">
          <div className="playing-info">
            <span className="live-dot"></span>

            <div>
              <small>NOW DISPLAYING</small>

              <strong>{backdrop.name}</strong>
            </div>
          </div>

          <button
            className="close-button"
            onClick={closePlayer}
            aria-label="Close backdrop"
          >
            ×
          </button>
        </div>

        <div className="player-bottom">
          <div className="loop-indicator">
            <span>↻</span>
            LOOPING
          </div>

          <button
            className="exit-button"
            onClick={closePlayer}
          >
            <span>✕</span>
            Exit Backdrop
          </button>
        </div>
      </div>
    </div>
  );
}

export default FullscreenPlayer;

