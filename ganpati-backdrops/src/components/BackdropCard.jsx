import { useEffect, useRef, useState } from "react";

function BackdropCard({ backdrop, onSelect }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const createThumbnail = () => {
      if (!video.videoWidth || !video.videoHeight) {
        setLoading(false);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");

      context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      );

      try {
        setThumbnail(canvas.toDataURL("image/jpeg", 0.82));
      } catch (error) {
        console.error("Could not create thumbnail:", error);
      }

      setLoading(false);
    };

    const handleMetadata = () => {
      /*
        Seek slightly into the video instead of
        using the very first frame.
      */

      const previewTime = Math.min(
        1,
        Math.max(0, video.duration / 2)
      );

      video.currentTime = previewTime;
    };

    const handleSeeked = () => {
      createThumbnail();
    };

    const handleError = () => {
      console.error(
        `Could not load ${backdrop.video}`
      );

      setLoading(false);
    };

    video.addEventListener(
      "loadedmetadata",
      handleMetadata
    );

    video.addEventListener(
      "seeked",
      handleSeeked
    );

    video.addEventListener(
      "error",
      handleError
    );

    return () => {
      video.removeEventListener(
        "loadedmetadata",
        handleMetadata
      );

      video.removeEventListener(
        "seeked",
        handleSeeked
      );

      video.removeEventListener(
        "error",
        handleError
      );
    };
  }, [backdrop.video]);

  return (
    <button
      className="backdrop-card"
      onClick={() => onSelect(backdrop)}
      aria-label={`Open ${backdrop.name}`}
    >
      <video
        ref={videoRef}
        src={backdrop.video}
        muted
        preload="metadata"
        playsInline
        className="thumbnail-source"
      />

      <canvas
        ref={canvasRef}
        className="thumbnail-canvas"
      />

      {loading && (
        <div className="thumbnail-loading">
          <div className="spinner"></div>
          <span>Preparing preview</span>
        </div>
      )}

      {thumbnail && (
        <img
          src={thumbnail}
          alt=""
          className="backdrop-thumbnail"
        />
      )}

      <div className="card-gradient"></div>

      <div className="card-top">
        <span className="category-badge">
          {backdrop.category}
        </span>

        <span className="play-icon">
          ▶
        </span>
      </div>

      <div className="card-bottom">
        <h2>{backdrop.name}</h2>

        <div className="open-label">
          <span>Open backdrop</span>
          <span>↗</span>
        </div>
      </div>
    </button>
  );
}

export default BackdropCard;