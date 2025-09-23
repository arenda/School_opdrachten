import { useState, useEffect, useRef } from "react";
import "./css/question.css";
import Cookies from "js-cookie";

function Question() {
  if (!Cookies.get("user")) {
    window.location.href = "/index";
  }
  const queryParams = new URLSearchParams(window.location.search);
  const category = parseInt(queryParams.get("category"));
  const difficulty = queryParams.get("difficulty") || "easy";

  if (!category || isNaN(category)) {
    window.location.replace("/wheel.html");
    return null;
  }

  const categories = {
    9: "General Knowledge",
    17: "Science",
    21: "Sports",
    22: "Geography",
    23: "History",
    25: "Art",
  };
  const categoryName = categories[category] || "General Knowledge";

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [showPopupTime, setShowPopupTime] = useState(false);
  const [showPopupCorrect, setShowPopupCorrect] = useState(false);
  const [showPopupWrong, setShowPopupWrong] = useState(false);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [userScore, setUserScore] = useState(null);
  const [progressDots, setProgressDots] = useState(Array(7).fill(null));
  const [questionCount, setQuestionCount] = useState(0);

  // Power-up states
  const [powerUps, setPowerUps] = useState({
    fiftyFifty: 1,
    extraTime: 1,
    doubleScore: 1,
  });
  const [usedPowerUp, setUsedPowerUp] = useState(null);

  // Mute button state
  const [isMuted, setIsMuted] = useState(() => {
    return Cookies.get("muted") === "true";
  });

  const totalTime = 30000;
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const timerRef = useRef(null);
  const correctSoundRef = useRef(null);
  const incorrectSoundRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(totalTime);
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 50) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prevTime - 50;
      });
    }, 50);
  };

  const decodeEntities = (str) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = str;
    return textarea.value;
  };

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  const getBarColor = (timeMs) => {
    const percentage = (timeMs / totalTime) * 100;
    let r, g;
    if (percentage > 50) {
      const ratio = (100 - percentage) / 50;
      r = Math.round(255 * ratio);
      g = 255;
    } else {
      const ratio = percentage / 50;
      r = 255;
      g = Math.round(255 * ratio);
    }
    return `rgb(${r},${g},0)`;
  };

  const fetchQuestions = () => {
    fetch(
      `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          const decodedQuestions = data.results.map((q) => ({
            ...q,
            question: decodeEntities(q.question),
            correct_answer: decodeEntities(q.correct_answer),
            incorrect_answers: q.incorrect_answers.map(decodeEntities),
          }));
          setQuestions(decodedQuestions);
        }
      });
  };

  useEffect(() => {
    fetchQuestions();
  }, [category, difficulty]);

  useEffect(() => {
    setCurrentIndex(0);
    setAnswers([]);
    setCorrectAnswer("");
    setSelectedAnswer(null);
    setIsDisabled(false);
    setShowCorrectAnswer(false);
    setShowPopupTime(false);
    setShowPopupCorrect(false);
    setShowPopupWrong(false);
    setShowEndPopup(false);
    setUserScore(null);
    setProgressDots(Array(7).fill(null));
    setQuestionCount(0);
    setPowerUps({
      fiftyFifty: 1,
      extraTime: 1,
      doubleScore: 1,
    });
    setUsedPowerUp(null);
  }, []);

  useEffect(() => {
    const username = Cookies.get("user");
    if (username) {
      fetch(`http://localhost:3001/users/${username}`)
        .then((res) => res.json())
        .then((data) => setUserScore(data.score))
        .catch((err) => console.error("Error fetching score:", err));
    }
  }, []);

  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      const q = questions[currentIndex];
      const allAnswers = shuffleArray([
        ...q.incorrect_answers,
        q.correct_answer,
      ]);
      setAnswers(allAnswers);
      setCorrectAnswer(q.correct_answer);
      resetState();
      startTimer();
      window.scrollTo(0, 0);
      setQuestionCount(currentIndex + 1);
    }
  }, [questions, currentIndex]);

  const resetState = () => {
    setSelectedAnswer(null);
    setIsDisabled(false);
    setShowCorrectAnswer(false);
    setShowPopupCorrect(false);
    setShowPopupWrong(false);
    setShowPopupTime(false);
    setUsedPowerUp(null);
  };

  const handleTimeUp = () => {
    setShowPopupTime(true);
    updateProgressDots(false);
    const username = Cookies.get("user");
    fetch(`http://localhost:3001/users/${username}/${difficulty}/decrease-score`, {
      method: "PUT",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update score");
        return res.json();
      })
      .then(() => fetch(`http://localhost:3001/users/${username}`))
      .then((res) => res.json())
      .then((data) => setUserScore(data.score))
      .catch((err) => console.error("Error updating or fetching score:", err));
  };

  const checkAnswer = (answer) => {
    clearInterval(timerRef.current);
    setSelectedAnswer(answer);
    setIsDisabled(true);
    setShowCorrectAnswer(true);

    const isCorrect = answer === correctAnswer;

    if (!isMuted) {
      if (isCorrect) {
        correctSoundRef.current?.play();
      } else {
        incorrectSoundRef.current?.play();
      }
    }

    setTimeout(() => {
      if (isCorrect) {
        updateProgressDots(isCorrect);
        setShowPopupCorrect(true);
        const username = Cookies.get("user");
        fetch(`http://localhost:3001/users/${username}/${difficulty}/increase-score`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            multiplier: usedPowerUp === "doubleScore" ? 2 : 1,
          }),
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to update score");
            return res.json();
          })
          .then(() => fetch(`http://localhost:3001/users/${username}`))
          .then((res) => res.json())
          .then((data) => setUserScore(data.score))
          .catch((err) =>
            console.error("Error updating or fetching score:", err)
          );
      } else {
        updateProgressDots(isCorrect);
        setShowPopupWrong(true);
        const username = Cookies.get("user");
        fetch(`http://localhost:3001/users/${username}/${difficulty}/decrease-score`, {
          method: "PUT",
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to update score");
            return res.json();
          })
          .then(() => fetch(`http://localhost:3001/users/${username}`))
          .then((res) => res.json())
          .then((data) => setUserScore(data.score))
          .catch((err) => console.error("Error updating or fetching score:", err));
      }
    }, 1000);
  };

  const updateProgressDots = (isCorrect) => {
    setProgressDots(prevDots => {
      const newDots = [...prevDots];
      const firstEmptyIndex = newDots.findIndex(dot => dot === null);
      if (firstEmptyIndex !== -1) {
        newDots[firstEmptyIndex] = isCorrect ? "green" : "red";
      }
      return newDots;
    });
  };

  const applyFiftyFifty = () => {
    if (powerUps.fiftyFifty < 1 || isDisabled) return;

    const wrongAnswers = answers.filter((ans) => ans !== correctAnswer);
    const toRemove = shuffleArray(wrongAnswers).slice(0, 2);
    const newAnswers = answers.filter(
      (ans) => ans === correctAnswer || !toRemove.includes(ans)
    );

    setAnswers(newAnswers);
    setPowerUps((prev) => ({ ...prev, fiftyFifty: prev.fiftyFifty - 1 }));
    setUsedPowerUp("fiftyFifty");
  };

  const applyExtraTime = () => {
    if (powerUps.extraTime < 1 || isDisabled) return;

    setTimeLeft((prev) => Math.min(prev + 10000, totalTime));
    setPowerUps((prev) => ({ ...prev, extraTime: prev.extraTime - 1 }));
    setUsedPowerUp("extraTime");
  };

  const applyDoubleScore = () => {
    if (powerUps.doubleScore < 1 || isDisabled) return;

    setPowerUps((prev) => ({ ...prev, doubleScore: prev.doubleScore - 1 }));
    setUsedPowerUp("doubleScore");
  };

  const handleMuteToggle = () => {
    const newMute = !isMuted;
    setIsMuted(newMute);
    Cookies.set("muted", newMute, { expires: 365 });
  };

  const handleNextQuestion = () => {
    clearInterval(timerRef.current);
    resetState();
    setShowPopupTime(false);
    setShowPopupCorrect(false);
    setShowPopupWrong(false);
    if (currentIndex >= questions.length - 1 || questionCount >= 7) {
      setShowEndPopup(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="question-container">
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          display: "flex",
          gap: "15px",
          alignItems: "center",
          zIndex: 1000,
        }}
      >

      </div>

      <div className="timer-bar-container">

        <div
          className="timer-bar-fill"
          style={{
            width: `${(timeLeft / totalTime) * 100}%`,
            backgroundColor: getBarColor(timeLeft),
            transition: "width 50ms linear, background-color 50ms linear",
          }}
        ></div>
      </div>

      <p
        className={`category ${categoryName
          .toLowerCase()
          .replace(/\s+/g, "-")}`}
      >
        <div
          className={`mascotte-logo ${categoryName
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
        ></div>
        {categoryName} - {difficulty.toUpperCase()}
        <div
          className={`mascotte-logo ${categoryName
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
        ></div>
      </p>

      <div className="powerup-bar">
        <button
          onClick={applyFiftyFifty}
          disabled={powerUps.fiftyFifty < 1 || isDisabled}
          className="powerup-button"
          title="Delete two wrong answers"
        >
          50/50
        </button>
        <button
          onClick={applyExtraTime}
          disabled={powerUps.extraTime < 1 || isDisabled}
          className="powerup-button"
          title="Extra 10 secondes time"
        >
          + 10 seconds Time
        </button>
      </div>
      <div className="question-card-wrapper">
        <button
          className="mute-button"
          onClick={handleMuteToggle}
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
        <div
          className={`question-card ${categoryName
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          <div className="content">
            <div
              className={`mascotte ${categoryName
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            ></div>
            <div>
              <p
                className={`question ${categoryName
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                {questions.length > 0 && currentIndex < questions.length
                  ? questions[currentIndex].question
                  : "Loading question..."}
              </p>
              <div
                className={`answers ${categoryName
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                {answers.map((answer, index) => (
                  <button
                    key={index}
                    className={`answer ${selectedAnswer === answer
                      ? answer === correctAnswer
                        ? "correct"
                        : "incorrect"
                      : showCorrectAnswer && answer === correctAnswer
                        ? "correct"
                        : ""
                      }`}
                    onClick={() => checkAnswer(answer)}
                    disabled={isDisabled}
                  >
                    {answer}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPopupTime && (
        <div className="popup-overlay">
          <div
            className={`popup-content ${categoryName
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            <p>Time is up!</p>
            <p>Answer: {correctAnswer}</p>
            <button onClick={handleNextQuestion}>Next Question</button>
            <div className="dot-container">
              {progressDots.map((dot, index) => (
                <span
                  key={index}
                  className="dot"
                  style={{
                    backgroundColor:
                      dot === "green"
                        ? "#4caf50"
                        : dot === "red"
                          ? "#f44336"
                          : "#ddd",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {showPopupCorrect && (
        <div className="popup-overlay">
          <div
            className={`popup-content ${categoryName
              .toLowerCase()
              .replace(/\s+/g, "-")}`}>
            <p>Correct!</p>
            <div className="score">
              <p>Score:</p>
              <p id="score">{userScore !== null ? userScore : "..."}</p>
            </div>

            {difficulty === "easy" && <p id="correct">+5</p>}
            {difficulty === "medium" && <p id="correct">+10</p>}
            {difficulty === "hard" && <p id="correct">+15</p>}

            <button onClick={handleNextQuestion}>Next Question</button>
            <div className="dot-container">
              {progressDots.map((dot, index) => (
                <span
                  key={index}
                  className="dot"
                  style={{
                    backgroundColor:
                      dot === "green"
                        ? "#4caf50"
                        : dot === "red"
                          ? "#f44336"
                          : "#ddd",
                  }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {showPopupWrong && (
        <div className="popup-overlay">
          <div
            className={`popup-content ${categoryName
              .toLowerCase()
              .replace(/\s+/g, "-")}`}>
            <p>That is not the right answer!</p>
            <div className="score">
              <p>Score:</p>
              <p id="score">{userScore !== null ? userScore : "..."}</p>
            </div>
            <p>Answer: {correctAnswer}</p>

            {difficulty === "easy" && <p id="incorrect">-2</p>}
            {difficulty === "medium" && <p id="incorrect">-5</p>}
            {difficulty === "hard" && <p id="incorrect">-10</p>}

            <button onClick={handleNextQuestion}>Next Question</button>
            <div className="dot-container">
              {progressDots.map((dot, index) => (
                <span
                  key={index}
                  className="dot"
                  style={{
                    backgroundColor:
                      dot === "green"
                        ? "#4caf50"
                        : dot === "red"
                          ? "#f44336"
                          : "#ddd",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {showEndPopup && (
        <div className="popup-overlay">
          <div
            className={`popup-content ${categoryName
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            <div className="score">
              <div
                className={`mascotte ${categoryName
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              ></div>
              <div className="score-text">
                <p>Final Score:</p>
                <p id="score">{userScore !== null ? userScore : "..."}</p>
              </div>
            </div>
            <div className="dot-container">
              {progressDots.map((dot, index) => (
                <span
                  key={index}
                  className="dot"
                  style={{
                    backgroundColor:
                      dot === "green"
                        ? "#4caf50"
                        : dot === "red"
                          ? "#f44336"
                          : "#ddd",
                  }}
                />
              ))}
            </div>
            <button onClick={() => (window.location.href = "/home.html")}>Return to Island</button>
          </div>
        </div>
      )}

      <audio ref={correctSoundRef} src="./src/components/sounds/correct.mp3" />
      <audio ref={incorrectSoundRef} src="./src/components/sounds/incorrect.mp3" />
    </div>
  );
}

export default Question;