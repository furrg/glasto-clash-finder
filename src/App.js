import React, { useState } from 'react';
import { lineup } from './data';
import './App.css';

function App() {
  const [selected, setSelected] = useState([]);
  const [sortKey, setSortKey] = useState('artist');
  

  const toggleArtist = (index) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
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

  
  const selectedPerformances = selected
    .map((i) => lineup[i])
    .sort((a, b) => new Date(a.start) - new Date(b.start));

    const sortedLineup = [...lineup].map((artist, index) => ({ ...artist, index }));
  sortedLineup.sort((a, b) => {
    if (sortKey === 'time') {
      return new Date(a.start) - new Date(b.start);
    }
    return a[sortKey].localeCompare(b[sortKey]);
  });

  const clashes = checkClashes(selectedPerformances);
  const isClashing = (artist) => clashes.some((pair) => pair.includes(artist));

  return (
    <div className="App">
      <h1 className="title">Glastonbury Clash Finder</h1>
      <div className="main">
        <div className="left-panel">
          <div className="sort-controls">
            <label>Sort by: </label>
            <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
              <option value="artist">Artist</option>
              <option value="stage">Stage</option>
              <option value="day">Day</option>
              <option value="time">Time</option>
            </select>
          </div>
          <div className="artist-list">
  <table className="artist-table">
  <thead>
    <tr>
      <th>Select</th>
      <th>Artist</th>
      <th>Time</th>
      <th>Day</th>
      <th>Stage</th>
    </tr>
  </thead>
  <tbody>
  {sortedLineup.map((a) => {
    const startTime = new Date(a.start).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const endTime = new Date(a.end).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const isChecked = selected.includes(a.index);

    return (
      <tr
        key={a.index}
        className={`clickable-row ${isChecked ? 'selected' : ''}`}
        onClick={() => toggleArtist(a.index)}
      >
        <td data-label="Select">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => toggleArtist(a.index)}
            onClick={(e) => e.stopPropagation()} // prevent double toggle
          />
        </td>
        <td data-label="Artist" className="artist-cell">{a.artist}</td>
        <td data-label="Time">{startTime} - {endTime}</td>
        <td data-label="Day">{a.day}</td>
        <td data-label="Stage">{a.stage}</td>
      </tr>
    );
  })}
</tbody>
</table>

</div>
        </div>

        <div className="clash-panel">
          <h3>Clashes</h3>
          {clashes.length > 0 ? (
            <ul>
              {clashes.map(([a, b], i) => (
                <li key={i}>{a} vs {b}</li>
              ))}
            </ul>
          ) : (
            <p>No clashes detected</p>
          )}
        </div>

        <div className="right-panel">
          <h2 className="subtitle">Your Timetable</h2>
          <table className="timetable">
            <thead>
              <tr>
                <th>Artist</th>
                <th>Stage</th>
                <th>Day</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {selectedPerformances.map((a, i) => (
                <tr key={i} className={isClashing(a.artist) ? 'clash-row' : ''}>
                  <td className={isClashing(a.artist) ? 'clash-artist' : ''}>{a.artist}</td>
                  <td>{a.stage}</td>
                  <td>{a.day}</td>
                  <td>
                    {new Date(a.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                    {new Date(a.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
