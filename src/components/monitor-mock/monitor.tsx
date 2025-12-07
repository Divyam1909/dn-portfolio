import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="keyboard">
        <div className="row">
          <div className="key function-key">esc</div>
          <div className="key function-key">F1</div>
          <div className="key function-key">F2</div>
          <div className="key function-key">F3</div>
          <div className="key function-key">F4</div>
          <div className="key function-key">F5</div>
          <div className="key function-key">F6</div>
          <div className="key function-key">F7</div>
          <div className="key function-key">F8</div>
          <div className="key function-key">F9</div>
          <div className="key function-key">F10</div>
          <div className="key function-key">F11</div>
          <div className="key function-key">F12</div>
          <div className="key eject-key">⏏</div>
        </div>
        <div className="row">
          <div className="key">`</div>
          <div className="key">1</div>
          <div className="key">2</div>
          <div className="key">3</div>
          <div className="key">4</div>
          <div className="key">5</div>
          <div className="key">6</div>
          <div className="key">7</div>
          <div className="key">8</div>
          <div className="key">9</div>
          <div className="key">0</div>
          <div className="key">-</div>
          <div className="key">=</div>
          <div className="key delete-key">delete</div>
        </div>
        <div className="row">
          <div className="key tab-key">tab</div>
          <div className="key">Q</div>
          <div className="key">W</div>
          <div className="key">E</div>
          <div className="key">R</div>
          <div className="key">T</div>
          <div className="key">Y</div>
          <div className="key">U</div>
          <div className="key">I</div>
          <div className="key">O</div>
          <div className="key">P</div>
          <div className="key">[</div>
          <div className="key">]</div>
          <div className="key backslash-key">\</div>
        </div>
        <div className="row">
          <div className="key caps-lock-key">caps lock</div>
          <div className="key">A</div>
          <div className="key">S</div>
          <div className="key">D</div>
          <div className="key">F</div>
          <div className="key">G</div>
          <div className="key">H</div>
          <div className="key">J</div>
          <div className="key">K</div>
          <div className="key">L</div>
          <div className="key">;</div>
          <div className="key">'</div>
          <div className="key return-key">return</div>
        </div>
        <div className="row">
          <div className="key shift-key">shift</div>
          <div className="key">Z</div>
          <div className="key">X</div>
          <div className="key">C</div>
          <div className="key">V</div>
          <div className="key">B</div>
          <div className="key">N</div>
          <div className="key">M</div>
          <div className="key">,</div>
          <div className="key">.</div>
          <div className="key">/</div>
          <div className="key shift-key">shift</div>
        </div>
        <div className="row">
          <div className="key">fn</div>
          <div className="key ctrl-key">ctrl</div>
          <div className="key alt-key">⌥</div>
          <div className="key command-key">⌘</div>
          <div className="key space-key" />
          <div className="key command-key">⌘</div>
          <div className="key alt-key">⌥</div>
          <div className="key arrow-key">◀</div>
          <div className="key arrow-key">▼</div>
          <div className="key arrow-key">▲</div>
          <div className="key arrow-key">▶</div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .keyboard {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 16px;
    padding-bottom: 19px;
    border-radius: 16px;
    background-color: #666666;
    background-image: linear-gradient(to bottom, #383838, #1f1f1f);
    box-shadow:
      rgba(0, 0, 0, 0.76) 0px 2px 4px,
      rgba(0, 0, 0, 0.39) 0px 7px 13px -3px,
      rgba(0, 0, 0, 0.247) 0px -3px 0px inset;
    width: 600px;
    user-select: none;
  }

  .row {
    display: flex;
    gap: 3px;
  }

  .key {
    background-color: #1f1e1e;
    border: 1px solid rgb(0, 59, 32);
    border-radius: 6px;
    box-shadow:
      rgba(0, 0, 0, 0.801) 0px 2px 4px,
      rgba(1, 255, 213, 0.288) 0px 7px 13px -3px,
      rgba(9, 255, 202, 0.247) 0px -1px 0px inset;
    min-width: 35px;
    text-align: center;
    padding: 8px 5px;
    font-size: 10px;
    color: #00ffbf;
    cursor: pointer;
    transition:
      box-shadow 0.2s,
      background-color 0.2s,
      transform 0.1s;
  }

  .key:hover {
    background-color: #2e2e2e;
    transform: translateY(-2px);
    box-shadow:
      rgba(0, 0, 0, 0.4) 0px 2px 5px,
      rgba(0, 0, 0, 0.3) 0px 7px 16px -3px,
      rgba(0, 0, 0, 0.2) 0px -1px 0px inset;
  }

  .key:active {
    transform: translateY(1px);
    box-shadow:
      rgba(0, 255, 191, 0.644) 0px 2px 3px,
      rgb(0, 0, 0) 0px 5px 10px -3px,
      rgba(0, 255, 191, 0.973) 0px -1px 0px inset;
  }

  .function-key {
    max-height: 25px;
    padding: 4px;
  }

  .eject-key {
    margin-left: 16px;
    padding: 4px 24px;
  }

  .delete-key {
    padding: 8px 24px;
  }

  .tab-key,
  .backslash-key,
  .caps-lock-key,
  .return-key {
    flex: 2;
  }

  .shift-key {
    flex: 3;
  }

  .space-key {
    flex: 5;
    padding: 8px;
    min-width: 175px;
  }

  .command-key,
  .alt-key {
    min-width: 35px;
    padding: 2px;
    font-size: 16px;
  }

  .arrow-key {
    min-width: 30px;
  }`;

export default Card;
