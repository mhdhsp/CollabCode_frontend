// src/pages/LandingPage.js
import React from 'react';
import LandingHero from "../components/LandingHero";
import CallToAction from '../components/CallToAction';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <LandingHero />
      <section className="py-5">
        <div className="container">
          <h2 className="h4">Features</h2>
          <p className="text-muted">
            Real-time collaboration, instant syncing, and lightweight editor integrations to keep your team productive.
          </p>

          <div className="row">
            <div className="col-md-4">
              <h5>Low Latency</h5>
              <p className="text-muted">Optimized sync for near-instant updates across teammates.</p>
            </div>
            <div className="col-md-4">
              <h5>Editor Agnostic</h5>
              <p className="text-muted">Works with your workflow and supports external editors.</p>
            </div>
            <div className="col-md-4">
              <h5>Secure</h5>
              <p className="text-muted">Authentication and secure transport by default.</p>
            </div>
          </div>

          <CallToAction
            primaryText="Get Started"
            secondaryText="Contact"
            onPrimary={() => navigate('/signup')}
            onSecondary={() => navigate('/contact')}
          />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;