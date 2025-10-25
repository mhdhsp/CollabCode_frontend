import React from 'react';
import ContactForm from '../components/ContactForm';

const ContactPage = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2>Contact Us</h2>
          <p className="text-muted">Have questions or feedback? Send us a message and we'll respond as soon as possible.</p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;