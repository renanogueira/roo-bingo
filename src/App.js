import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';

const App = () => {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [characterName, setCharacterName] = useState('');
  const [message, setMessage] = useState('');
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/data`);
      setAllData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleNumberClick = (number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== number));
    } else {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/save`, {
        characterName,
        selectedNumbers,
      });
      setMessage(response.data.message);
      setCharacterName('');
      setSelectedNumbers([]);
      fetchData();
    } catch (error) {
      console.error('Error saving data:', error);
      setMessage('Error saving data. Please try again.');
    }
  };

  return (
    <div className="App">
      <h1>Number Selector App</h1>
      <div>
        <label htmlFor="characterName">Character Name:</label>
        <input
          type="text"
          id="characterName"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
        />
      </div>
      <div>
        <p>Select numbers (1-50):</p>
        <div className="number-grid">
          {Array.from({ length: 50 }, (_, index) => index + 1).map((number) => (
            <button
              key={number}
              className={selectedNumbers.includes(number) ? 'selected' : ''}
              onClick={() => handleNumberClick(number)}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
      <button onClick={handleSave}>Save</button>
      {message && <p>{message}</p>}
      <h2>Saved Data:</h2>
      <ul>
        {allData.map((item, index) => (
          <li key={index}>
            <strong>{item.character_name}</strong>: {item.selected_numbers.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
