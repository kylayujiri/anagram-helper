import React from 'react';
import { useState } from 'react';

function LockButton({ i, value, isLocked ,handleLock }) {
  let classStr = "lockBtn"

  if (isLocked) {
    classStr += " locked";
  } else {
    classStr += " unlocked";
  }

  return (
    <button key={i} className={classStr} onClick={() => handleLock(i)}>{value}</button>
  );
}

export default function Shuffler() {
  const [word, setWord] = useState([]);
  const [locked, setLocked] = useState([]);

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

  let lockButtons = [];
  for (let i = 0; i < word.length; i++) {
    lockButtons.push(<LockButton i={i} value={word[i]} isLocked={locked[i]} handleLock={handleLock} />);
  }

  return (
    <div class="content">
      <div>
        <input type="text" id="word" onChange={handleChange} />
      </div>
      <div>
        <h1>{word}</h1>
      </div>
      <div class="lockButtons">
        {lockButtons}
      </div>
      <div class="shuffle">
        <button id="shuffle" onClick={handleShuffle}>
          SHUFFLE
        </button>
      </div>
    </div>
  );
}
