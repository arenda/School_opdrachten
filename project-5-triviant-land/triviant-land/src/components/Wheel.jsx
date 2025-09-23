import { useState, useEffect, useRef } from "react";
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from "@headlessui/react";
import Confetti from "react-confetti";
import "./css/wheel.css";
import Cookies from "js-cookie";

const visInfo = {
  "vis-1": {
    title: "Captain Bubbles",
    text: "Blub blub! Found my secret bubble stash... don’t tell anyone, or I’ll start singing sea shanties! 🫧🎶",
    coords: { top: "78%", left: "9%" },
  },
  "vis-2": {
    title: "Sir Splashalot",
    text: "Blub blub! Look at me now – underwater fabulousness at its finest. 💦✨ #SorryNotSorry",
    coords: { top: "41%", left: "3%" },
  },
  "vis-3": {
    title: "Fin the Philosofish",
    text: "Blub blub... if a fish selfies but no one sees it, did it really happen? 🤳🐟",
    coords: { top: "47%", left: "16%" },
  },
  "vis-4": {
    title: "Agent Gill",
    text: "Blub blub! Codename: Fish Outta Water. Mission: Make you laugh. Mission status: SUCCESS 🕺💦",
    coords: { top: "65%", left: "62%" },
  },
};

const categories = [
  { id: "art", label: "Art", description: "Time to get messy and create your masterpiece!", quizId: 25, image: "./src/components/img/art.jpg", gradient: "linear-gradient(135deg, red 0%, red 60%, #ff7eb3 100%)" },
  { id: "history", label: "History", description: "Step back in time—how much do you really know?", quizId: 23, image: "./src/components/img/spongebob.png", gradient: "linear-gradient(135deg, #fff700 0%, #fff700 60%,rgb(202, 192, 0) 100%)" },
  { id: "geography", label: "Geography", description: "Zoom around the world—can you name them all?", quizId: 22, image: "./src/components/img/pino.png", gradient: "linear-gradient(135deg, #0d47a1 0%, #0d47a1 60%,rgb(100, 111, 171) 100%)" },
  { id: "sport", label: "Sports", description: "Game on! Are you a true sports expert?", quizId: 21, image: "./src/components/img/loeki.png", gradient: "linear-gradient(135deg, orange 0%,rgb(232, 129, 19) 60%, #ffd200 100%)" },
  { id: "general", label: "General", description: "Anything goes—are you up for the trivia challenge?", quizId: 9, image: "./src/components/img/panther.png", gradient: "linear-gradient(135deg, pink 0%,rgb(222, 100, 187) 60%, #fbc2eb 100%)" },
  { id: "science", label: "Science", description: "Kaboom! Can you crack the science mysteries?", quizId: 17, image: "./src/components/img/kermit.png", gradient: "linear-gradient(135deg, green 0%,rgb(93, 161, 89) 60%, #0ffd02 100%)" },
];

const sliceAngle = 360 / categories.length;

// Global handler reference to allow removing beforeunload in startQuiz
let globalBeforeUnloadHandler = null;

export default function Rad() {
  const [rotation, setRotation] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // pop-up hoofdresultaat
  const [isSpinning, setIsSpinning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [popupVis, setPopupVis] = useState(null);
  const [quizQuestion, setQuizQuestion] = useState(null);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isMuted, setIsMuted] = useState(() => Cookies.get('muted') === 'true');

  const audioRef = useRef(null);
  const visAudioRef = useRef(null);

  // Check login
  useEffect(() => {
    if (!Cookies.get('user')) {
      window.location.href = "/index";
    }
  }, []);

  // Heropen pop-up na refresh indien nodig
  useEffect(() => {
    const storedCategory = sessionStorage.getItem("selectedCategory");
    if (storedCategory) {
      const chosen = JSON.parse(storedCategory);
      setSelected(chosen);
      setIsOpen(true);
      setShowConfetti(true);
      fetchQuizQuestion(chosen.quizId);
    }
    // eslint-disable-next-line
  }, []); // Alleen op mount

  // Blijf popup open forceren bij refresh/terug
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isOpen) {
        event.preventDefault();
        event.returnValue = '';
        return '';
      }
    };
    globalBeforeUnloadHandler = handleBeforeUnload;
    window.addEventListener('beforeunload', handleBeforeUnload);

    const handlePopState = () => {
      if (isOpen) {
        window.history.pushState(null, document.title, window.location.href);
      }
    };
    window.addEventListener('popstate', handlePopState);

    if (isOpen) {
      sessionStorage.setItem("forcePopupOpen", "true");
      window.history.pushState(null, document.title, window.location.href);
    } else {
      sessionStorage.removeItem("forcePopupOpen");
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      globalBeforeUnloadHandler = null;
    };
  }, [isOpen]);

  // Confetti window size
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Audio mute logic
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      if (isMuted) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
    if (visAudioRef.current) {
      visAudioRef.current.volume = 0.7;
      if (isMuted) {
        visAudioRef.current.pause();
        visAudioRef.current.currentTime = 0;
      }
    }
  }, [isMuted]);

  // Quiz ophalen
  const fetchQuizQuestion = async (quizId) => {
    const cached = sessionStorage.getItem(`quiz_${quizId}`);
    if (cached) {
      setQuizQuestion(JSON.parse(cached));
      return;
    }
    try {
      const res = await fetch(`https://opentdb.com/api.php?amount=1&category=${quizId}&difficulty=easy&type=multiple`);
      const data = await res.json();
      if (data.response_code === 0) {
        setQuizQuestion(data.results[0]);
        sessionStorage.setItem(`quiz_${quizId}`, JSON.stringify(data.results[0]));
      }
    } catch (err) {
      console.error("Quiz fetch error:", err);
    }
  };

  // Spin logic
  const spin = () => {
    if (isSpinning || selected) return;
    if (!isMuted && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    setIsSpinning(true);
    setShowConfetti(false);
    const randomSpin = 360 * 5 + Math.floor(Math.random() * 360);
    const totalRotation = rotation + randomSpin;
    setRotation(totalRotation);

    const normalized = (totalRotation % 360 + 360) % 360;
    const index = Math.floor(normalized / sliceAngle);
    const correctedIndex = (categories.length - index) % categories.length;

    setTimeout(() => {
      const chosen = categories[correctedIndex];
      setSelected(chosen);
      sessionStorage.setItem("selectedCategory", JSON.stringify(chosen));
      setIsSpinning(false);
      setShowConfetti(true);
      setIsOpen(true);
      fetchQuizQuestion(chosen.quizId);
    }, 4200);
  };

  // Start quiz - verwijder beforeunload event vóór navigatie
  const startQuiz = (difficulty) => {
    if (!selected?.quizId || !quizQuestion) return;
    sessionStorage.setItem("quizData", JSON.stringify(quizQuestion));
    sessionStorage.setItem("quizCategoryId", selected.quizId);
    sessionStorage.setItem("quizCategoryName", selected.label);
    sessionStorage.removeItem("selectedCategory");
    // --- FIX: verwijder beforeunload event ---
    if (globalBeforeUnloadHandler) {
      window.removeEventListener('beforeunload', globalBeforeUnloadHandler);
      globalBeforeUnloadHandler = null;
    }
    window.location.href = `./quiz.html?category=${selected.quizId}&name=${selected.label}&difficulty=${difficulty}`;
  };

  return (
    <div className="wheel-container" style={{ position: "relative" }}>
      <div className="bubbel-container">
        {[...Array(15)].map((_, i) => (
          <span key={i} className={`bubbel bubbel-${i + 1}`}></span>
        ))}
      </div>

      <div className="image-map-container">
        {Object.entries(visInfo).map(([id, vis]) => (
          <button
            key={id}
            className={`${id}`}
            title={vis.title}
            onClick={() => {
              setPopupVis(id);
              if (!isMuted && visAudioRef.current) {
                visAudioRef.current.currentTime = 0;
                visAudioRef.current.play();
              }
            }}
            style={{
              position: "absolute",
              top: vis.coords.top,
              left: vis.coords.left,
              width: "15vw",
              height: "15vw",
              maxWidth: "250px",
              maxHeight: "250px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      <div className="wheel-wrapper">
        <img className="bordje" src="./src/components/img/bordje.png" alt="Bordje" />
        <div className={`wheel ${isSpinning ? "spinning" : ""}`} style={{ transform: `rotate(${rotation}deg)` }}>
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              className="slice"
              style={{
                transform: `rotate(${i * sliceAngle}deg) skewY(${90 - sliceAngle}deg)`,
                backgroundImage: cat.gradient,
              }}
            >
              <div
                className="slice-content"
                style={{
                  transform: `skewY(${sliceAngle - 90}deg) rotate(${sliceAngle / 2}deg)`,
                }}
              >
                <img src={cat.image} alt={cat.label} className="slice-image" />
                <span className="label">{cat.label}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="arrow">
          <div className="arrow-tip"></div>
          <div className="arrow-stem"></div>
        </div>
        <div
          className={`center-circle ${isSpinning || selected ? "disabled" : ""}`}
          onClick={!isSpinning && !selected ? spin : undefined}
        >
          <img src="./src/components/img/naam.png" alt="Logo" className="center-logo" />
        </div>
      </div>

      {/* Vis pop-up */}
      <Dialog open={!!popupVis} onClose={() => setPopupVis(null)}>
        <div className="vis-oceaan">
          <DialogPanel className="vis-popup-bubbel">
            <div className="vis-content">
              <h2>{visInfo[popupVis]?.title}</h2>
              <p>{visInfo[popupVis]?.text}</p>
              <button onClick={() => setPopupVis(null)} className="vis-sluiten">Close</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Hoofd pop-up */}
      <Dialog open={isOpen} onClose={() => {}}>
        <div className="popup-overlay">
          <DialogPanel className="popup" style={{ backgroundImage: selected?.gradient }}>
            <div className="popup-content">
              <img src={selected?.image} alt={selected?.label} className="popup-image" />
              <DialogTitle className="popup-title">You are now playing: {selected?.label}</DialogTitle>
              <DialogDescription className="popup-text">{selected?.description}</DialogDescription>
              {showConfetti && (
                <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={250} />
              )}
              <div className="difficulty-buttons">
                <button onClick={() => startQuiz("easy")}>Easy</button>
                <button onClick={() => startQuiz("medium")}>Medium</button>
                <button onClick={() => startQuiz("hard")}>Hard</button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Home + geluid */}
      <div style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        display: "flex",
        gap: "15px",
        alignItems: "center",
        zIndex: 1000,
      }}> <button
          onClick={() => {
            const newMute = !isMuted;
            setIsMuted(newMute);
            Cookies.set("muted", newMute, { expires: 365 });
          }}
          style={{
            background: "linear-gradient(135deg, rgb(255, 126, 95), rgb(254, 180, 123))",
            border: "none",
            borderRadius: "50px",
            padding: "12px 15px",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "50px",
            height: "50px",
          }}
          title={isMuted ? "Geluid aanzetten" : "Geluid uitzetten"}
        >
          <img
            src={isMuted ? "./src/components/img/mute.png" : "./src/components/img/sound.png"}
            alt={isMuted ? "Mute" : "Sound"}
            style={{ width: "40px", height: "40px" }}
          />
        </button>
        <button
          className="home-button"
          onClick={() => window.location.href = "/home"}
          style={{
            background: "linear-gradient(135deg, rgb(255, 126, 95), rgb(254, 180, 123))",
            border: "none",
            borderRadius: "50px",
            padding: "12px 15px",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "50px",
            height: "50px",
          }}
        >
          <img src="./src/components/img/home.png" alt="home" style={{ width: "31px", height: "35px" }} />
        </button>


      </div>

      {/* Audio */}
      <audio ref={audioRef} src="./src/components/sounds/sound.mp3" preload="auto" />
      <audio ref={visAudioRef} src="./src/components/sounds/fish-sound.mp3" preload="auto" />
    </div>
  );
}