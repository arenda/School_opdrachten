import React from 'react';

export default function Info() {
  return (
    <div className="info-container">
      <div className="info-box">
        <h1>Info & Instructions</h1>

        <p>
          Welcome to the Triviant Game! On this website, you’ll find everything you need to know about the project — from how it works to who built it and the technology behind it.
        </p>

        <h2>🧠 How Does the Game Work?</h2>
        <div className="steps">
          <div className="step">
            <span className="badge">1️</span>
            <p><strong>🎮 Play Button:</strong> Click the play button to access the login and registration page.</p>
          </div>
          <div className="step">
            <span className="badge">2️</span>
            <p><strong>🏠 Homepage:</strong> Once logged in, you'll land on the homepage where you can:</p>
            <p>📍 Click on pinpoints to explore questions by category.</p>
            <p>🏆 Check the leaderboard to see top player scores.</p>
            <p>👤 Manage your account details.</p>
          </div>
          <div className="step">
            <span className="badge">3️</span>
            <p><strong>🎲 Start the Game:</strong> Click <em>Start</em> to spin the wheel and select a question difficulty — <em>Easy</em>, <em>Medium</em>, or <em>Hard</em>.</p>
          </div>
          <div className="step">
            <span className="badge">4️</span>
            <p><strong>💡 Score Points:</strong> Answer questions correctly to earn points — then spin the wheel again for the next challenge!</p>
          </div>
          <div className="step">
            <span className="badge">5️</span>
            <p><strong>📊 Final Results:</strong> After 7 rounds, you’ll see a summary of your final score. Enjoyed it? Start a new game anytime!</p>
          </div>
          <div className="step">
            <span className="badge">💥</span>
            <p><strong>📈 Scoring System:</strong></p>
            <ul>
              <li>✅ Easy question correct: <strong>+5 points</strong> | ❌ Wrong: <strong>-2 points</strong></li>
              <li>✅ Medium question correct: <strong>+10 points</strong> | ❌ Wrong: <strong>-5 points</strong></li>
              <li>✅ Hard question correct: <strong>+15 points</strong> | ❌ Wrong: <strong>-10 points</strong></li>
            </ul>
          </div>
        </div>

        <button
          className="home-button"
          onClick={() => (window.location.href = "/home")}
          aria-label="Go to the homepage"
        >
          <img
            src="./src/components/img/home.png"
            alt="Home"
            style={{ width: "31px", height: "35px" }}
          />
        </button>
      </div>
    </div>
  );
}
