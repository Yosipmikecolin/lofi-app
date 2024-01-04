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
  const [activeMinimizar, setActiveMinimizar] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );

  const handleMusic = (selectedMusic: Music) => {
    if (audioElement) {
      audioElement.pause();
      audioElement.remove();
      audioElement.currentTime = 0;
    }

    const newAudioElement = new Audio(selectedMusic.music);
    newAudioElement.onloadedmetadata = handleLoadedMetadata;
    newAudioElement.autoplay = true;

    setAudioElement(newAudioElement);
    setPlaying(true);
    setMusic(selectedMusic);
  };

  const toggleReproduccion = () => {
    setPlaying(!playing);
  };

  const nextMusic = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.remove();
      audioElement.currentTime = 0;
    }

    const index = music ? listMusic.indexOf(music) : 0;
    const selectedMusic = listMusic[index + 1 > 15 ? 0 : index + 1];
    const newAudioElement = new Audio(selectedMusic.music);
    newAudioElement.onloadedmetadata = handleLoadedMetadata;
    newAudioElement.autoplay = true;

    setAudioElement(newAudioElement);
    setPlaying(true);
    setMusic(selectedMusic);
  };

  const prevMusic = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.remove();
      audioElement.currentTime = 0;
    }

    const index = (music ? listMusic.indexOf(music) : 0) - 1;
    const selectedMusic = listMusic[index <= 0 ? 15 : index];
    if (selectedMusic) {
      const newAudioElement = new Audio(selectedMusic.music);
      newAudioElement.onloadedmetadata = handleLoadedMetadata;
      newAudioElement.autoplay = true;

      setAudioElement(newAudioElement);
      setPlaying(true);
      setMusic(selectedMusic);
    }
  };

  const closeMusic = () => {
    removeMusic();
    setAudioElement(null);
    setActiveMinimizar(false);
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
  };

  const viewMusic = () => {
    setActiveMinimizar((prev) => !prev);
  };

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

  useEffect(() => {
    if (progress === 100) {
      nextMusic();
    }
  }, [progress]);

  return (
    <>
      {music && (
        <section
          className={`control-music animate__animated ${
            activeMinimizar ? "animate__fadeOutUp" : "animate__fadeInUp"
          }`}
        >
          <source src={music.music} type="audio/mp3" />
          <div className="container-progress">
            {music && playing && progress === 0 ? (
              <div className="disc-play-loader"></div>
            ) : (
              <div
                className="disc-play"
                style={{
                  animationPlayState: playing ? "running" : "paused",
                }}
              >
                <img src={music.post} />
              </div>
            )}

            <div className="buttons">
              <BiCaretLeft onClick={prevMusic} />
              {playing ? (
                <BiPauseCircle onClick={toggleReproduccion} />
              ) : (
                <BiPlayCircle onClick={toggleReproduccion} />
              )}
              <BiCaretRight onClick={nextMusic} />
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
                <BiCaretLeft onClick={prevMusic} />
                {playing ? (
                  <BiPauseCircle onClick={toggleReproduccion} />
                ) : (
                  <BiPlayCircle onClick={toggleReproduccion} />
                )}
                <BiCaretRight onClick={nextMusic} />
              </div>
            </div>
          </div>
        )}

        {listMusic.map((item) => (
          <div className="container-card" key={item.id}>
            {item.id === music?.id ? (
              <div className="card">
                <div className="card-hover">
                  {playing ? (
                    <img
                      src={IconPause}
                      width={50}
                      onClick={toggleReproduccion}
                    />
                  ) : (
                    <img
                      src={IconPlay}
                      width={50}
                      onClick={toggleReproduccion}
                    />
                  )}
                </div>
                <img src={item.post} className="image" />
              </div>
            ) : (
              <div className="card">
                <div className="card-hover">
                  <img
                    src={IconPlay}
                    width={50}
                    onClick={() => handleMusic(item)}
                  />
                </div>
                <img src={item.post} className="image" />
              </div>
            )}

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
