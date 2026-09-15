import { useEffect, useRef, useState } from "react";

function FullscreenPlayer({ backdrop, onClose }) {
  const playerRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const [controlsVisible, setControlsVisible] =
    useState(true);

  const hideTimer = useRef(null);

  useEffect(() => {
    if (!backdrop) return;

    const player = playerRef.current;
    const video = videoRef.current;
    const audio = audioRef.current;

    if (!player || !video) return;

    video.currentTime = 0;

    if (audio) {
      audio.currentTime = 0;
      audio.loop = true;
    }

    const startPlayback = async () => {
      try {
        // Start video
        await video.play();

        // Start separate music
        if (audio) {
          await audio.play();
        }
      } catch (error) {
        console.log(
          "Playback was blocked by the browser:",
          error
        );
      }
    };

    const enterFullscreen = async () => {
      try {
        if (
          !document.fullscreenElement &&
          player.requestFullscreen
        ) {
          await player.requestFullscreen();
        }
      } catch (error) {
        console.log(
          "Fullscreen unavailable:",
          error
        );
      }
    };

    document.body.classList.add("player-open");

    showControls();

    startPlayback();
    enterFullscreen();

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

  async function closePlayer() {
    const video = videoRef.current;
    const audio = audioRef.current;

    // Stop video
    if (video) {
      video.pause();
      video.currentTime = 0;
    }

    // Stop separate music
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    // Exit browser fullscreen
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.log(
        "Could not exit fullscreen:",
        error
      );
    }

    onClose();
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closePlayer();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  });

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (
        !document.fullscreenElement &&
        playerRef.current
      ) {
        closePlayer();
      }
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  });

  if (!backdrop) return null;

  return (
    <div
      ref={playerRef}
      className="fullscreen-player"
      onMouseMove={showControls}
      onTouchStart={showControls}
    >
      {/* Background video */}
      <video
        ref={videoRef}
        src={backdrop.video}
        className="fullscreen-video"
        autoPlay
        loop
        playsInline
      />

      {/* Separate background music */}
      {backdrop.music && (
        <audio
          ref={audioRef}
          src={backdrop.music}
          loop
          preload="auto"
        />
      )}

      {/* Player interface */}
      <div
        className={`player-ui ${
          controlsVisible ? "visible" : ""
        }`}
      >
        <div className="player-topbar">
          <div className="playing-info">
            <span className="live-dot"></span>

            <div>
              <small>
                NOW DISPLAYING
              </small>

              <strong>
                {backdrop.name}
              </strong>
            </div>
          </div>

          <button
            className="close-button"
            onClick={closePlayer}
            aria-label="Close backdrop"
          >
            <span>×</span>
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