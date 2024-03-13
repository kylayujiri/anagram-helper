import React from 'react';
import { useState, useRef, useEffect } from 'react';

function LockButton({ i, value, isLocked, handleLock, circular=false, circleX=0, circleY=0 }) {
  let classStr = "lockBtn";
  let styles = {};

  if (circular) {
    styles = {
      transform: `translate(-50%, -50%) translate(${circleX}px, ${circleY}px)`
    };
    classStr += " circularTile";
  }

  if (isLocked) {
    classStr += " locked";
  } else {
    classStr += " unlocked";
  }

  return (
    <button key={i} className={classStr} style={styles} onClick={() => handleLock(i)}>{value}</button>
  );
}

function TileDisplay({ circular, word, locked, handleLock }) {

  const displayRef = useRef(null);

  const [displayHeight, setDisplayHeight] = useState(0);
   useEffect(() => {
      const height = displayRef.current.offsetHeight;
      setDisplayHeight(height);
   }, [displayRef]);

  let lockButtons = [];

  let radius = displayHeight / 2;

  if (circular) {

    for (let i = 0; i < word.length; i++) {
      let circleX = getTileX(radius, word.length, i);
      let circleY = getTileY(radius, word.length, i);

      lockButtons.push(<LockButton i={i} value={word[i]} isLocked={locked[i]} handleLock={handleLock} circular={circular} circleX={circleX} circleY={circleY} />);
    }

    return (
      <div class="tileDisplay" ref={displayRef}>
        {lockButtons}
      </div>
    );

  } else {

    for (let i = 0; i < word.length; i++) {
      lockButtons.push(<LockButton i={i} value={word[i]} isLocked={locked[i]} handleLock={handleLock} />);
    }

    return (
      <div class="tileDisplay" ref={displayRef}>
        <div class="wordDisplay">
          <h1>{word}</h1>
        </div>
        <div class="lockButtons">
          {lockButtons}
        </div>
      </div>
    );

  }
}

function getTileX(radius, numTiles, tileNum) {
  if (tileNum >= numTiles) console.log("pointNum must be less than divisions");

  let x = Math.sin(tileNum * 2 * Math.PI / numTiles) * radius;

  return x;
}

function getTileY(radius, numTiles, tileNum) {
  if (tileNum >= numTiles) console.log("tileNum must be less than numTiles");

  // translation up is a negative y value instead of a positive value
  let y = -Math.cos(tileNum * 2 * Math.PI / numTiles) * radius;

  return y;
}

export default function Shuffler() {
  const [word, setWord] = useState([]);
  const [locked, setLocked] = useState([]);
  const [circular, setCircular] = useState(false);

  const handleChange = (evt) => {
    setWord([...evt.target.value]);
    let arr = new Array(evt.target.value.length);
    arr.fill(0);
    setLocked(arr);
  };

  function handleShuffle() {
    // https://stackoverflow.com/questions/3943772/how-do-i-shuffle-the-characters-in-a-string-in-javascript
    let shuffle = [];
    locked.forEach((ele, i) => {
      if (ele === 0) {
        shuffle.push(word[i]);
      }
    });
    const rand = (i, N) => Math.floor(Math.random() * (N - i) + i);
    shuffle.forEach( (elem, i, arr, j = rand(i, arr.length)) => [arr[i], arr[j]] = [arr[j], arr[i]] );

    let newWord = [];
    let shuffleI = 0;
    locked.forEach((ele, i) => {
      if (ele === 0) {
        newWord[i] = shuffle[shuffleI];
        shuffleI++;
      } else {
        newWord[i] = word[i];
      }
    });
    setWord(newWord);
  };

  function handleLock(i) {
    let newLocked = locked.slice();
    if (newLocked[i] === 0) {
      newLocked[i] = 1;
    } else {
      newLocked[i] = 0;
    }
    setLocked(newLocked);
  }

  function handleSwitch() {
    setCircular(!circular);
  }

  return (
    <div class="content">
      <button id="switchButton" onClick={handleSwitch}>SWITCH</button>
      <div class="topBanner">
        <input type="text" id="wordInput" onChange={handleChange} />
      </div>
      <TileDisplay circular={circular} word={word} locked={locked} handleLock={handleLock} />
      <div class="shuffle">
        <button id="shuffleButton" onClick={handleShuffle}>
          SHUFFLE
        </button>
      </div>
    </div>
  );
}
