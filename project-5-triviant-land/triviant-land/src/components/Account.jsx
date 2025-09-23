import React, { useState, useEffect } from 'react';
import './css/account.css';
import Cookies from 'js-cookie';

const Account = () => {
  // Bestaande state variables...
  const [isDeleting, setIsDeleting] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '' // Nieuwe state voor wachtwoord bevestiging
  });

  // Voeg deze nieuwe useEffect toe om de username te laden
  useEffect(() => {
    const userCookie = Cookies.get('user');
    console.log('Alle cookies:', Cookies.get()); // Debug: bekijk alle beschikbare cookies
    
    if (userCookie) {
      try {
        // Probeer de cookie te parsen als het een JSON object is
        const userData = JSON.parse(userCookie);
        console.log('User data:', userData); // Debug: bekijk de cookie data
        
        // Update formData met de username uit de cookie
        setFormData(prev => ({
          ...prev,
          username: userData.username || userData.name || userData // afhankelijk van de structuur
        }));
      } catch (e) {
        // Als het geen JSON is, gebruik de cookie waarde direct
        setFormData(prev => ({
          ...prev,
          username: userCookie
        }));
      }
    }
  }, []); // Voer dit alleen uit bij het laden van de component

  // Rest van de code blijft hetzelfde...
  // Redirect if user is not logged in
  useEffect(() => {
    if (!Cookies.get('user')) {
      window.location.href = "/index";
    }
  }, []);

  // Handle countdown for redirect
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      window.location.href = '/';
    }
  }, [countdown]);

  // Aangepaste handleChange functie
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'password' || name === 'confirmPassword') {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Nieuwe validateForm functie
  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setMessage("Wachtwoorden komen niet overeen");
      return false;
    }
    if (formData.password.length < 6) {
      setMessage("Wachtwoord moet minimaal 6 tekens lang zijn");
      return false;
    }
    return true;
  };

  // Aangepaste handleSubmit functie
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/update-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }));
      } else {
        setMessage(data.error || 'Error updating account.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error updating account. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        setIsDeleting(true);
        const response = await fetch('http://localhost:3001/delete-account', {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          Cookies.remove('user');
          Cookies.remove('username');
          setMessage('Account successfully deleted');
          setCountdown(5);
        } else {
          setMessage(data.error || 'Could not delete account.');
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Error deleting account. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3001/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        Cookies.remove('user');
        Cookies.remove('username');
        Cookies.remove('userToken');
        window.location.href = "/index";
      } else {
        setMessage('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      setMessage('Logout failed. Please try again.');
    }
  };

  // In het return gedeelte, voeg het nieuwe wachtwoord bevestigingsveld toe
  return (
    <div>
      <div className="account-container">
        <h2 className="account">Manage Account</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              readOnly
              className="readonly-input"
            />
          </div>
          <div>
            <label htmlFor="password">New Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm New Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Save Changes</button>
        </form>

        <button
          type="button"
          onClick={handleDeleteAccount}
          className="delete-button"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting Account...' : 'Delete Account'}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </button>
          {message && (
              <div className={message.includes('successfully') ? 'success-message' : 'error-message'}>
                <p>{message}</p>
                {countdown !== null && (
                    <p>Redirecting to homepage in {countdown} seconds...</p>
                )}
              </div>
          )}
      </div>

      <button
        className="home-button"
        onClick={() => window.location.href = "/home"}
      >
        <img
          src="./src/components/img/home.png"
          alt="home"
          style={{ width: "31px", height: "35px" }}
        />
      </button>
        <button
            className="home-button"
            onClick={() => window.location.href = "/home"}
        >
          <img
              src="./src/components/img/home.png"
              alt="home"
              style={{ width: "31px", height: "35px" }}
          />
        </button>
    </div>
  );
};

export default Account;