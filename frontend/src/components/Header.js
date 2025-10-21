import React from 'react';

function Header({ activeView }) {
  return (
    <header className="header">
      <h1 className="header-title">{activeView}</h1>
      <span className="header-version">v1.0</span>
    </header>
  );
}

export default Header;