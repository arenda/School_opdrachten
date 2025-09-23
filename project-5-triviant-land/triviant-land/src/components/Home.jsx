import React, { useState, useRef, useEffect } from "react";
import "./css/home.css";
import Cookies from "js-cookie";

function Home() {
  // Redirect if no user cookie found
  useEffect(() => {
    if (!Cookies.get("user")) {
      window.location.href = "/index";
    }
  }, []);

  const [selectedArea, setSelectedArea] = useState(null);
  const [showCurtains, setShowCurtains] = useState(false);
  const backgroundAudioRef = useRef(null);
  const audioRefs = useRef({
    "Captain Hook": new Audio("./src/components/sounds/piraten.mp3"),
    "Piet Piraat": new Audio("./src/components/sounds/piraten.mp3"),
    "Tempest of Trouble": new Audio("./src/components/sounds/devil.mp3"),
    "Cloud of Kindness": new Audio("./src/components/sounds/angel.mp3"),
  });

  const [isMuted, setIsMuted] = useState(Cookies.get("muted") === "true");

  // Listen for mute cookie changes (polling)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsMuted(Cookies.get("muted") === "true");
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Initialize sounds, play/pause based on mute
  useEffect(() => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = 0.3;
      backgroundAudioRef.current.loop = true;
      if (!isMuted) {
        backgroundAudioRef.current
          .play()
          .catch((e) => console.log("Autoplay prevented:", e));
      } else {
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current.currentTime = 0;
      }
    }

    Object.values(audioRefs.current).forEach((audio) => {
      audio.volume = 0.7;
      if (isMuted) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    return () => {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
      }
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, [isMuted]);

  const playSound = (area) => {
    if (isMuted) return;
    const audio = audioRefs.current[area];
    if (audio) {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
      }
      audio.currentTime = 0;
      audio
        .play()
        .then(() => {
          audio.onended = () => {
            if (backgroundAudioRef.current && !isMuted) {
              backgroundAudioRef.current.play();
            }
          };
        })
        .catch((e) => console.log("Audio play error:", e));
    }
  };

  const stopAllSounds = () => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    if (backgroundAudioRef.current && !isMuted) {
      backgroundAudioRef.current.play();
    }
  };

  const areaInfo = {
    General: {
      text: `Hi, I'm the Pink Panther and I know a little bit of everything!
Tricky riddles, fun facts, and brain teasers – I'm your guide for all the general knowledge you need. Let's get clever together!`,
      image: "./src/components/img/general.jpg",
    },
    Sport: {
      text: `Hi, I'm Loekie and I'm all about sports!
From football to gymnastics, I love to play and move.
Get ready to sweat your brain with sporty questions!`,
      image: "./src/components/img/sport.jpg",
    },
    Science: {
      text: `Hi, I'm Kermit the Frog and I'm crazy about science!
Whether it's space, animals, or cool experiments – I'll help you understand how the world works.
Science is ribbit-ing!`,
      image: "./src/components/img/science.jpg",
    },
    Geography: {
      text: `Hi, I'm Pino and I love exploring the world!
From mountains to oceans, I'm here to take you on a journey across the globe.
Let's discover countries, continents, and curious places together!`,
      image: "./src/components/img/geography.jpg",
    },
    Art: {
      text: `Hi, I'm Jokie and I adore art!
Colors, paintings, music, and dance – I'll show you the fun side of creativity.
Get ready to think outside the frame!`,
      image: "./src/components/img/art.jpg",
    },
    History: {
      text: `Hi, I'm SpongeBob and I'm diving into the past!
From ancient pyramids to kings and queens – we'll learn all about history's coolest stories.
Time to travel through time!`,
      image: "./src/components/img/history.jpg",
    },
    Start: {
      text: "Ready to start your adventure? Let's spin the wheel!",
      image: "./src/components/img/triviant-land-extended+enhanced.jpg",
      link: "/wheel.html",
    },
    Logo: {
      text: "Click the logo to begin your trivia journey!",
      image: "./src/components/img/logo.jpg",
    },
    "Captain Hook": {
      text: `Ahoy, matey! Captain Hook reporting for duty!
The winds are strong and the sea is full of secrets...
If you look closely, you might just find a hidden treasure — or something even more curious. 🗺️`,
      image: "./src/components/img/piraten.png",
    },
    "Piet Piraat": {
      text: `All aboard! Piet Piraat is ready to set sail!
The quiz seas are calling, and only the sharpest minds will spot the clues along the way.
(Keep an eye out for the golden question… but you didn't hear that from me!) 🦜`,
      image: "./src/components/img/piraat.png",
    },
    "Tempest of Trouble": {
      text: `Boo! It's Devil Ruben 😈,
The Tempest of Trouble is here to stir up some chaos!
Get ready to feel the heat as we throw tricky questions your way. No escaping this storm of fun!`,
      image: "./src/components/img/cloudy.png",
    },
    "Cloud of Kindness": {
      text: `Hey there, it's Angel Ruben 😇,
The Cloud of Kindness floating above to guide you!
I'm here to sprinkle some positivity and encouragement while you tackle these questions. You got this, champ!`,
      image: "./src/components/img/cloud.png",
    },
  };

  const responsivePositions = {
    General: { top: "11.03%", left: "30.03%" },
    Sport: { top: "6.91%", left: "55.5%" },
    Science: { top: "22.74%", left: "51.44%" },
    Geography: { top: "39.32%", left: "62.88%" },
    Art: { top: "56.08%", left: "27.71%" },
    History: { top: "38.47%", left: "23.55%" },
    Start: { top: "37.64%", left: "42.66%" },
    Logo: { top: "4.99%", left: "11.21%" },
    "Tempest of Trouble": { top: "3.53%", left: "85.84%" },
    "Cloud of Kindness": { top: "73.4%", left: "84.12%" },
    "Piet Piraat": { top: "50.08%", left: "80.64%" },
    "Captain Hook": { top: "34.63%", left: "88.17%" },
  };

  const handleStartClick = () => {
    setShowCurtains(true);
    setTimeout(() => {
      document.querySelector(".curtain-animation")?.classList.add("show-curtains");
    }, 100);
    setTimeout(() => {
      window.location.href = areaInfo["Start"].link;
    }, 1700);
  };

  const formatText = (text) =>
    text.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));

  return (
    <div className="home" style={{ position: "relative" }}>
      <audio ref={backgroundAudioRef} src="./src/components/sounds/water.mp3" />

      {showCurtains && (
        <div className="curtain-animation">
          <div className="curtain left-curtain" />
          <div className="curtain right-curtain" />
        </div>
      )}

      <div className="buttons"
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={() => {
            const newMute = !isMuted;
            setIsMuted(newMute);
            Cookies.set("muted", newMute, { expires: 365 });
          }}
          style={{
            ...buttonStyle,
            background: "linear-gradient(135deg, rgb(255, 126, 95), rgb(254, 180, 123))",
            color: isMuted ? "#333" : "#fff",
          }}
          title={isMuted ? "Unmute all sounds" : "Mute all sounds"}
        >
          {isMuted ? (
            <img
              src="./src/components/img/mute.png"
              alt="Mute"
              style={{ width: "31px", height: "35px" }}
            />
          ) : (
            <img
              src="./src/components/img/sound.png"
              alt="Sound"
              style={{ width: "31px", height: "35px" }}
            />
          )}
        </button>
 <button
          onClick={() => (window.location.href = "/Info")}
          style={buttonStyle}
        >
          <img
            src="./src/components/img/info.png"
            alt="Info"
            style={{ width: "31px", height: "35px" }}
          />
        </button>
        <button
          onClick={() => (window.location.href = "/leaderboard")}
          style={buttonStyle}
        >
          <img
            src="./src/components/img/leaderboard.png"
            alt="Leaderboard"
            style={{ width: "31px", height: "35px" }}
          />
        </button>

        <button
          onClick={() => (window.location.href = "/account")}
          style={buttonStyle}
        >
          <img
            src="./src/components/img/account.svg"
            alt="Account"
            style={{ width: "43px", height: "34px" }}
          />
        </button>


      </div>

      <img
        src="./src/components/img/eiland.jpg"
        alt="Eiland"
        className="responsive-map"
        style={{ width: "100%", height: "auto", objectFit: "cover" }}
      />

      <div className="responsive-pin-container">
        {Object.entries(responsivePositions).map(([area, pos]) => (
          <button
            key={area}
            className="responsive-pin"
            style={{
              top: pos.top,
              left: pos.left,
              position: "absolute",
              width: 100,
              height: 100,
              backgroundColor: "transparent",
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
            }}
            onClick={() => {
              if (area === "Start") {
                handleStartClick();
              } else if (area === "Logo") {
                window.location.href = "/playbutton";
              } else {
                setSelectedArea(area);
                playSound(area);
              }
            }}
            aria-label={`Select area ${area}`}
          />
        ))}
      </div>

      {selectedArea && (
        <div className="popup">
          <div
            className={`popup-content ${selectedArea
              .toLowerCase()
              .replace(/\s/g, "-")}`}
          >
            <h2>{selectedArea}</h2>
            {areaInfo[selectedArea]?.image && (
              <img
                src={areaInfo[selectedArea].image}
                alt={selectedArea}
                className="popup-image"
              />
            )}
            <p>{formatText(areaInfo[selectedArea]?.text || "")}</p>
            <button
              onClick={() => {
                setSelectedArea(null);
                stopAllSounds();
              }}
              style={{ marginTop: "10px" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: "12px 15px",
  background: "linear-gradient(135deg, #ff7e5f, #feb47b)",
  color: "white",
  border: "none",
  borderRadius: "50px",
  fontWeight: "bold",
  fontSize: "16px",
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(255, 255, 255, 0.3)",
  transition: "all 0.3s ease",
  opacity: "0.9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "50px",
  height: "50px",
};

export default Home;
