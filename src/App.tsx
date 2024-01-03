import { useEffect, useState } from "react";
import { listMusic } from "./data/list-music";
import IconPlay from "./assets/icon-play.png";
import IconPause from "./assets/icon-pausa.png";
import IconMin from "./assets/minimizar.png";
import IconClose from "./assets/close.png";
import IconMin2 from "./assets/minimizar-2.png";
import IconClose2 from "./assets/close-2.png";
import "./App.css";
import "animate.css";
import { useMusic } from "./hooks/use-music";
import { Music } from "./interfaces/music";
import {
  BiCaretLeft,
  BiCaretRight,
  BiPauseCircle,
  BiPlayCircle,
} from "react-icons/bi";

function App() {
  const { music, setMusic, removeMusic } = useMusic();
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const [activeMinimizar, setActiveMinimizar] = useState(false);

  const handleMusic = (music: Music) => {
    setMusic(music);
  };

  const toggleReproduccion = () => {
    setPlaying(!playing);
  };

  const closeMusic = () => {
    removeMusic();
    setActiveMinimizar(false);
  };

  const viewMusic = () => {
    setActiveMinimizar((prev) => !prev);
  };

  useEffect(() => {
    if (audioElement) {
      if (playing) {
        audioElement.play();
      } else {
        audioElement.pause();
      }

      const handleTimeUpdate = () => {
        const nuevoProgreso =
          (audioElement.currentTime / audioElement.duration) * 100;
        setProgress(nuevoProgreso);
      };

      audioElement.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [playing, audioElement]);

  const handleLoadedMetadata = () => {
    setProgress(0);
  };

  const updatedProgress = (nuevoProgreso: number) => {
    setProgress(nuevoProgreso);
    if (audioElement) {
      const nuevoTiempo = (nuevoProgreso / 100) * audioElement.duration;
      audioElement.currentTime = nuevoTiempo;
    }
  };

  const handleProgressBarClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const barraProgreso = event.currentTarget;
    const clicX = event.clientX - barraProgreso.getBoundingClientRect().left;
    const nuevoProgreso = (clicX / barraProgreso.clientWidth) * 100;
    updatedProgress(nuevoProgreso);
  };

  return (
    <>
      {music && (
        <section
          className={`control-music animate__animated ${
            activeMinimizar ? "animate__fadeOutUp" : "animate__fadeInUp"
          }`}
        >
          <audio
            controls
            autoPlay={true}
            onLoadedMetadata={handleLoadedMetadata}
            ref={(audio) => setAudioElement(audio)}
          >
            <source src={music.music} type="audio/mp3" />
          </audio>

          <div className="container-progress">
            <div
              className="disc-play"
              style={{
                animationPlayState: playing ? "running" : "paused",
              }}
            >
              <img src={music.post} />
            </div>

            <div className="buttons">
              <BiCaretLeft />
              {playing ? (
                <BiPauseCircle onClick={toggleReproduccion} />
              ) : (
                <BiPlayCircle onClick={toggleReproduccion} />
              )}
              <BiCaretRight />
            </div>

            <div className="progress" onClick={handleProgressBarClick}>
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  backgroundColor: "orange",
                  borderRadius: 3,
                }}
              />
            </div>

            <div className="actions-control">
              <img src={IconMin} width={15} height={20} onClick={viewMusic} />
              <img src={IconClose} width={25} onClick={closeMusic} />
            </div>
          </div>
        </section>
      )}

      <section className="container-app">
        {activeMinimizar && music && (
          <div
            className={`disc-mini animate__animated ${
              activeMinimizar && "animate__fadeInDown"
            }`}
          >
            <div
              className={"disc-play"}
              style={{
                animationPlayState: playing ? "running" : "paused",
              }}
            >
              <img src={music.post} />
            </div>
            <div className="actions">
              <div className="header">
                <img
                  src={IconMin2}
                  width={15}
                  height={20}
                  onClick={viewMusic}
                />
                <img src={IconClose2} width={15} onClick={closeMusic} />
              </div>

              <h3>{music.name_music}</h3>
              <div className="buttons">
                <BiCaretLeft />
                {playing ? (
                  <BiPauseCircle onClick={toggleReproduccion} />
                ) : (
                  <BiPlayCircle onClick={toggleReproduccion} />
                )}
                <BiCaretRight />
              </div>
            </div>
          </div>
        )}

        {listMusic.map((item) => (
          <div className="container-card">
            <div className="card" key={item.id}>
              <div className="card-hover">
                {!music ? (
                  <img
                    src={IconPlay}
                    width={50}
                    onClick={() => handleMusic(item)}
                  />
                ) : playing && music.id === item.id ? (
                  <img
                    src={IconPause}
                    width={50}
                    onClick={toggleReproduccion}
                  />
                ) : (
                  <img src={IconPlay} width={50} onClick={toggleReproduccion} />
                )}
              </div>
              <img src={item.post} className="image" />
            </div>
            <div className="info">
              <img src={item.icon_user} className="image-icon" />
              <div className="title">
                <h3>{item.name_music}</h3>
                <span>{item.name_user}</span>
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

export default App;
