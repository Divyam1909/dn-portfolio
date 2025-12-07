import React from 'react';
import styled from 'styled-components';

const Button = () => {
  return (
    <StyledWrapper>
      <div className="action-wrap">
        <button className="action" type="button">
          <svg className="action-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none">
            <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
            <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
          </svg>
          <span className="action-content" data-content="x" />
        </button>
        <button className="action" type="button">
          <svg className="action-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none">
            <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
          </svg>
          <span className="action-content" data-content="github" />
        </button>
        <button className="action" type="button">
          <svg className="action-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none">
            <path d="M8 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
            <path d="M14 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
            <path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-.972 1.923a11.913 11.913 0 0 0 -4.053 0l-.975 -1.923c-1.5 .16 -3.043 .485 -4.5 1.5c-2 5.667 -2.167 9.833 -1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2 -2 2 -3" />
            <path d="M7 16.5c3.5 1 6.5 1 10 0" />
          </svg>
          <span className="action-content" data-content="discord" />
        </button>
        <div className="backdrop" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .action-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-radius: 9999px;
  }

  .backdrop {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .backdrop::before {
    content: "";
    position: absolute;
    height: 10.5rem;
    width: 10.5rem;
    border-radius: 9999px;
    background: linear-gradient(144deg, #af40ff, #4f46e5);
    animation: rotate 1.5s linear infinite;
  }
  .backdrop::after {
    content: "";
    position: absolute;
    height: 100%;
    width: 100%;
    backdrop-filter: blur(8px);
    border-radius: 9999px;
    z-index: 1;
  }

  .action {
    --sz-light-hover: 60px;
    --rd-light-hover: 9999px;
    --l-light-hover: 14px;
    --cl-light: #0000;
    --cr-light: #af40ff;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      transform,
      color,
      background-color,
      300ms ease;
    height: 3.5rem;
    width: 3.5rem;
    border: none;
    color: #444444;
    background: none transparent;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 9999px;
  }

  .action-icon {
    height: 100%;
    width: 100%;
    position: relative;
    z-index: 9;
    padding: 0.5rem;
    border-radius: 9999px;
    background-color: #f1f1f1;
    transition:
      transform,
      color,
      background,
      300ms ease;
  }

  .action-content {
    --sz-light-hover: 100px;
    --rd-light-hover: 6px;
    --l-light-hover: 0px;
    --cl-light: #fff;
    --cr-light: #af40ff;
    transition:
      transform,
      400ms ease;
    opacity: 0;
    font-size: 1.25rem;
    line-height: 1.5;
    background-color: inherit;
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
    flex-direction: row;
    width: max-content;
    height: 1.75rem;
    padding: 8px 1px;
    position: absolute;
    left: 0;
    z-index: -1;
    border: 1px solid #ccc;
  }

  .action-content::before {
    content: attr(data-content);
    transition:
      transform,
      300ms ease;
    text-transform: capitalize;
    font-size: medium;
    font-weight: 600;
    z-index: 1;
    transform: translateX(-100%);
    background-color: #fff;
    border-radius: calc(var(--rd-light-hover) - 2px);
    padding-inline: 4px;
  }

  .action::after,
  .action-content::after {
    content: "";
    opacity: 0;
    position: absolute;
    border-radius: var(--rd-light-hover);
    transition: all 50ms ease 200ms;
    background: conic-gradient(
      from 45deg at 50% 50%,
      var(--cl-light),
      var(--cr-light),
      var(--cl-light),
      var(--cl-light),
      var(--cl-light),
      var(--cr-light),
      var(--cl-light),
      var(--cl-light),
      var(--cl-light)
    );
  }

  .action:hover .action-icon {
    color: #000;
    background-color: #fff;
    transform: scale(1.4) translate3d(12px, 0px, 12px);
  }

  .action:hover::after,
  .action-content::after {
    height: var(--sz-light-hover);
    width: var(--sz-light-hover);
    left: var(--l-light-hover);
    opacity: 1;
    animation: rotate 4s linear infinite;
  }
  @keyframes rotate {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(1turn);
    }
  }

  .action:hover .action-content {
    color: #000;
    background-color: #fff;
    opacity: 1;
    width: max-content;
    left: calc(100% + 24px);
    z-index: 9;
  }

  .action:hover .action-content::before {
    transform: translateX(0px);
  }`;

export default Button;
