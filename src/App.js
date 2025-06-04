import React, { useState } from 'react';
import { lineup } from './data';
import './App.css';

function App() {
  const [selected, setSelected] = useState([]);

  const toggleArtist = (index) => {
    setSelected(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const checkClashes = (performances) => {
    let clashes = [];
    for (let i = 0; i < performances.length; i++) {
      for (let j = i + 1; j < performances.length; j++) {
        const a = performances[i];
        const b = performances[j];

        const aStart = new Date(a.start);
        const bStart = new Date(b.start);
        const aEnd = new Date(a.end);
        const bEnd = new Date(b.end);

        const sameDay = aStart.toDateString() === bStart.toDateString();

        if (sameDay && aEnd > bStart && bEnd > aStart) {
          clashes.push([a.artist, b.artist]);
        }
      }
    }
    return clashes;
  };

  const selectedPerformances = selected.map(i => lineup[i]).sort((a, b) =>
    new Date(a.start) - new Date(b.start)
  );
  const clashes = checkClashes(selectedPerformances);

  return (
    <div className="App">
      <h1>Glastonbury Clash Finder</h1>
      <div className="artist-list">
        {lineup.map((a, i) => (
          <div key={i}>
            <label>
              <input
                type="checkbox"
                checked={selected.includes(i)}
                onChange={() => toggleArtist(i)}
              />
              {a.artist} ({a.stage} - {a.day})
            </label>
          </div>
        ))}
      </div>

      <h2>Timetable</h2>
      <div className="timetable">
        {selectedPerformances.map((a, i) => {
          const isClash = clashes.some(clash => clash.includes(a.artist));
          return (
            <div key={i} className={isClash ? 'clash' : ''}>
              <strong>{a.artist}</strong> ({a.stage})<br />
              <em>{a.day}</em><br />
              {new Date(a.start).toLocaleTimeString()} - {new Date(a.end).toLocaleTimeString()}
            </div>
          );
        })}
      </div>

      {clashes.length > 0 && (
        <div className="clashes">
          <h3>Clashes</h3>
          <ul>
            {clashes.map(([a, b], i) => (
              <li key={i}>{a} vs {b}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;