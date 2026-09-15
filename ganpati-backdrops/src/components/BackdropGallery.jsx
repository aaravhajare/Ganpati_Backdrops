import BackdropCard from "./BackdropCard";

function BackdropGallery({
  backdrops,
  onSelect,
}) {
  return (
    <section className="gallery-section">

      <div className="section-heading">
        <div>
          <span className="section-eyebrow">
            BACKDROP COLLECTION
          </span>

          <h2>
            Choose Your Backdrop
          </h2>
        </div>

        <span className="backdrop-count">
          {backdrops.length} backdrops
        </span>
      </div>

      {backdrops.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🪔</div>

          <h3>No backdrops found</h3>

          <p>
            Try another search.
          </p>
        </div>
      ) : (
        <div className="backdrop-grid">
          {backdrops.map((backdrop) => (
            <BackdropCard
              key={backdrop.id}
              backdrop={backdrop}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}

    </section>
  );
}

export default BackdropGallery;