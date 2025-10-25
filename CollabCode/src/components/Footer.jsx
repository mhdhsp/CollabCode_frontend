// src/components/Footer.js
import React from 'react';

function Footer() {
  return (
    <footer className="bg-light py-3 mt-auto">
      <div className="container text-center">
        <small className="text-muted">© {new Date().getFullYear()} Realtime Editor — Prototype</small>
      </div>
    </footer>
  );
}

export default Footer;