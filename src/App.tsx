import { listMusic } from "./data/list-music"
import IconPlay from "./assets/icon-play.png"
import './App.css'
import { useMusic } from "./hooks/use-music"
import { Music } from "./interfaces/music"
import { useEffect, useState } from "react"

function App() {

  const { music, setMusic } = useMusic()
  const [progreso, setProgreso] = useState(0);
  const [reproduciendo, setReproduciendo] = useState(true);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const handleMusic = (music: Music) => {
    setMusic(music)
  }

  const toggleReproduccion = () => {
    setReproduciendo(!reproduciendo);
  };

  useEffect(() => {
    if (audioElement) {
      if (reproduciendo) {
        audioElement.play();
      } else {
        audioElement.pause();
      }

      const handleTimeUpdate = () => {
        const nuevoProgreso = (audioElement.currentTime / audioElement.duration) * 100;
        setProgreso(nuevoProgreso);
      };

      audioElement.addEventListener('timeupdate', handleTimeUpdate);

      return () => {
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [reproduciendo, audioElement]);



  const handleLoadedMetadata = () => {
    setProgreso(0);
  };

  const actualizarProgreso = (nuevoProgreso: number) => {
    setProgreso(nuevoProgreso);
    if (audioElement) {
      const nuevoTiempo = (nuevoProgreso / 100) * audioElement.duration;
      audioElement.currentTime = nuevoTiempo;
    }
  };


  const handleProgressBarClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const barraProgreso = event.currentTarget;
    const clicX = event.clientX - barraProgreso.getBoundingClientRect().left;
    const nuevoProgreso = (clicX / barraProgreso.clientWidth) * 100;
    actualizarProgreso(nuevoProgreso);
  };

  return (

    <>
      {music &&
        <section className="control-music">
          <audio controls autoPlay={true} onLoadedMetadata={handleLoadedMetadata} ref={(audio) => setAudioElement(audio)}>
            <source src={music.music} type="audio/mp3" />
          </audio>

          <div className="container-progress">
            <div className="disc" onClick={toggleReproduccion}>
            <img src={music.post}/>
          </div>

          <div className="progress" onClick={handleProgressBarClick}>
            <div style={{ width: `${progreso}%`, height: "100%", backgroundColor: "orange",borderRadius:3 }} />
          </div>

          </div>
   
        </section>
      }

      <section className='container-app'>
        {listMusic.map((item) => (
          <div className="container-card">
            <div className='card' key={item.id}>
              <div className="card-hover">
                <img src={IconPlay} width={50} onClick={() => handleMusic(item)} />
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

  )
}

export default App
