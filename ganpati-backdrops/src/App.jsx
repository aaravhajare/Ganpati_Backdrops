import { useMemo, useState } from "react";

import { backdrops } from "./data/backdrops";

import BackdropGallery from "./components/BackdropGallery";

import FullscreenPlayer from "./components/FullscreenPlayer";

function App() {
  const [activeBackdrop, setActiveBackdrop] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const filteredBackdrops = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return backdrops;
    }

    return backdrops.filter((backdrop) =>
      `${backdrop.name} ${backdrop.category}`
        .toLowerCase()
        .includes(query)
    );
  }, [search]);

  return (
    <>
      <main className="app">

        {/* Background decoration */}

        <div className="ambient ambient-one"></div>
        <div className="ambient ambient-two"></div>

        {/* HEADER */}

        <header className="site-header">

          <div className="brand">

            <div className="brand-symbol">
              ॐ
            </div>

            <div className="brand-text">
              <span>
                GANPATI
              </span>

              <strong>
                BACKDROPS
              </strong>
            </div>

          </div>

          <div className="header-status">
            <span className="status-dot"></span>
            READY TO DISPLAY
          </div>

        </header>


        {/* HERO */}

        <section className="hero">

          <div className="hero-content">

            <div className="hero-tag">
              <span>✦</span>
              FESTIVE VISUAL COLLECTION
            </div>

            <h1>
              Make Your
              <br />

              <span>
                Ganpati
              </span>

              <br />

              Come Alive.
            </h1>

            <p>
              Immersive animated backdrops
              designed for your Ganpati
              celebration.
            </p>

          </div>


          <div className="hero-symbol">

            <div className="symbol-ring ring-one"></div>
            <div className="symbol-ring ring-two"></div>

            <div className="hero-om">
              ॐ
            </div>

          </div>

        </section>


        {/* SEARCH */}

        <section className="toolbar">

          <div className="search-box">

            <span className="search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search backdrops..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            {search && (
              <button
                className="clear-search"
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}

          </div>

        </section>


        {/* GALLERY */}

        <BackdropGallery
          backdrops={filteredBackdrops}
          onSelect={setActiveBackdrop}
        />


        {/* FOOTER */}

        <footer className="footer">

          <div>
            🪔 Ganpati Backdrops
          </div>

          <span>
            Made for celebration
          </span>

        </footer>

      </main>


      {/* FULLSCREEN PLAYER */}

      {activeBackdrop && (
        <FullscreenPlayer
          backdrop={activeBackdrop}
          onClose={() =>
            setActiveBackdrop(null)
          }
        />
      )}
    </>
  );
}

export default App;