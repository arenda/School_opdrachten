import { useState } from "react";
import "./css/Playbutton.css";
import play from "./img/play.jpg";
import jokki from "./img/jokki.png";
import pino from "./img/pino.png";
import loeki from "./img/loeki.png";
import Cookies from "js-cookie";

function Button() {
  const [loading, setLoading] = useState(false);
  
  const handleClick = () => {
    setLoading(true);

    setTimeout(() => {
      const user = Cookies.get("user");

      if (user) {
        window.location.href = "/home";
      } else {
        setTimeout(() => {
          setLoading(false);
          window.location.href = "/login.html";
        }, 900);
      }
    }, 1400);
  };

  return (
      <button onClick={handleClick} className="play-button">
        {loading ? (
            <div className="loader">
              <img src={jokki} alt="jokki"></img>
              <img src={pino} alt="pino"></img>
              <img src={loeki} alt="loeki"></img>
            </div>
        ) : (
            <img src={play} alt="play" id="play" />
        )}
      </button>
  );
}

export default Button;