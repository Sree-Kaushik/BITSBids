import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
  const lastUpdated = "January 15, 2024";

  return (
    <div className="legal-page">
      <div className="legal-header">
        <div className="container">
          <h1>Terms of Service</h1>
          <p>Please read these terms carefully before using BITSBids</p>
          <div className="last-updated">
            Last updated: {lastUpdated}
          </div>
        </div>
      </div>

      <div className="legal-content">
        <div className="container">
          <div className="legal-document">
            <div className="table-of-contents">
              <h3>Table of Contents</h3>
              <ul>
                <li><a href="#acceptance">1. Acceptance of Terms</a></li>
                <li><a href="#eligibility">2. Eligibility</a></li>
                <li><a href="#account">3. Account Registration</a></li>
                <li><a href="#platform-use">4. Platform Use</a></li>
                <li><a href="#auctions">5. Auctions and Bidding</a></li>
                <li><a href="#payments">6. Payments and Transactions</a></li>
                <li><a href="#prohibited">7. Prohibited Activities</a></li>
                <li><a href="#content">8. User Content</a></li>
                <li><a href="#privacy">9. Privacy and Data</a></li>
                <li><a href="#liability">10. Limitation of Liability</a></li>
                <li><a href="#termination">11. Termination</a></li>
                <li><a href="#changes">12. Changes to Terms</a></li>
                <li><a href="#contact">13. Contact Information</a></li>
              </ul>
            </div>

            <div className="legal-sections">
              <section id="acceptance" className="legal-section">
                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing and using BITSBids ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <p>
                  These Terms of Service ("Terms") govern your use of our website and services provided by BITSBids in connection with the Platform.
                </p>
              </section>

              <section id="eligibility" className="legal-section">
                <h2>2. Eligibility</h2>
                <p>
                  BITSBids is exclusively available to current students of BITS Pilani (all campuses). To use our services, you must:
                </p>
                <ul>
                  <li>Be a currently enrolled student at any BITS Pilani campus</li>
                  <li>Have a valid BITS email address (@pilani.bits-pilani.ac.in, @goa.bits-pilani.ac.in, @hyderabad.bits-pilani.ac.in, or @dubai.bits-pilani.ac.in)</li>
                  <li>Be at least 18 years old or have parental consent</li>
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the security of your account credentials</li>
                </ul>
                <p>
                  We reserve the right to verify your student status at any time and may suspend or terminate accounts that do not meet eligibility requirements.
                </p>
              </section>

              <section id="account" className="legal-section">
                <h2>3. Account Registration</h2>
                <p>
                  To access certain features of the Platform, you must register for an account. When you register, you agree to:
                </p>
                <ul>
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security and confidentiality of your password</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
                <p>
                  You may not create multiple accounts, share your account with others, or use someone else's account without permission.
                </p>
              </section>

              <section id="platform-use" className="legal-section">
                <h2>4. Platform Use</h2>
                <p>
                  BITSBids provides a platform for BITS students to buy and sell items through an auction system. You agree to use the Platform only for lawful purposes and in accordance with these Terms.
                </p>
                <h4>Permitted Uses:</h4>
                <ul>
                  <li>Listing items for sale through auctions</li>
                  <li>Bidding on items listed by other users</li>
                  <li>Communicating with other users regarding transactions</li>
                  <li>Browsing and searching for items</li>
                  <li>Managing your account and preferences</li>
                </ul>
                <h4>Platform Availability:</h4>
                <p>
                  We strive to maintain platform availability but do not guarantee uninterrupted service. We may temporarily suspend the Platform for maintenance, updates, or other operational reasons.
                </p>
              </section>

              <section id="auctions" className="legal-section">
                <h2>5. Auctions and Bidding</h2>
                <h4>Listing Items:</h4>
                <ul>
                  <li>You must own the items you list or have explicit permission to sell them</li>
                  <li>Item descriptions must be accurate and complete</li>
                  <li>Photos must accurately represent the item's condition</li>
                  <li>You must honor all successful auction sales</li>
                  <li>Items must be available for pickup/delivery as specified</li>
                </ul>
                
                <h4>Bidding:</h4>
                <ul>
                  <li>All bids are binding commitments to purchase</li>
                  <li>You may not retract bids except in exceptional circumstances</li>
                  <li>The highest bidder at auction end is obligated to complete the purchase</li>
                  <li>Proxy bidding is available and operates automatically within your set limits</li>
                  <li>You must have sufficient funds to complete any purchase you bid on</li>
                </ul>

                <h4>Auction Rules:</h4>
                <ul>
                  <li>Auctions run for the duration specified by the seller</li>
                  <li>Bidding increments are set by the seller</li>
                  <li>Auctions cannot be cancelled once bids are placed (except in exceptional circumstances)</li>
                  <li>Winners must contact sellers within 24 hours of auction end</li>
                  <li>Payment and pickup must be completed within 7 days unless otherwise agreed</li>
                </ul>
              </section>

              <section id="payments" className="legal-section">
                <h2>6. Payments and Transactions</h2>
                <p>
                  BITSBids facilitates connections between buyers and sellers but does not process payments directly. All financial transactions occur between users.
                </p>
                
                <h4>Payment Responsibility:</h4>
                <ul>
                  <li>Buyers are responsible for payment to sellers</li>
                  <li>Sellers are responsible for delivering items as described</li>
                  <li>Both parties must agree on payment method and timing</li>
                  <li>We recommend secure payment methods (UPI, bank transfer)</li>
                  <li>Cash transactions should occur in safe, public locations</li>
                </ul>

                <h4>Disputes:</h4>
                <p>
                  While we provide a dispute resolution system, users are primarily responsible for resolving transaction issues directly. We may assist in mediation but are not liable for transaction outcomes.
                </p>
              </section>

              <section id="prohibited" className="legal-section">
                <h2>7. Prohibited Activities</h2>
                <p>You may not use the Platform to:</p>
                <ul>
                  <li>List illegal items or items that violate campus policies</li>
                  <li>Engage in fraudulent or deceptive practices</li>
                  <li>Manipulate auctions or bidding processes</li>
                  <li>Harass, threaten, or abuse other users</li>
                  <li>Spam or send unsolicited communications</li>
                  <li>Violate intellectual property rights</li>
                  <li>Attempt to circumvent platform security measures</li>
                  <li>Create fake accounts or impersonate others</li>
                  <li>Use automated systems to interact with the Platform</li>
                  <li>Collect user information for unauthorized purposes</li>
                </ul>
                
                <h4>Prohibited Items:</h4>
                <ul>
                  <li>Weapons, explosives, or dangerous materials</li>
                  <li>Illegal drugs or controlled substances</li>
                  <li>Stolen or counterfeit goods</li>
                  <li>Adult content or services</li>
                  <li>Live animals</li>
                  <li>Academic materials that violate honor codes</li>
                  <li>Items that violate campus housing policies</li>
                </ul>
              </section>

              <section id="content" className="legal-section">
                <h2>8. User Content</h2>
                <p>
                  You retain ownership of content you post on the Platform but grant us certain rights to use, display, and distribute your content in connection with the Platform.
                </p>
                
                <h4>Content Standards:</h4>
                <ul>
                  <li>Content must be accurate and not misleading</li>
                  <li>Photos must represent actual items being sold</li>
                  <li>Descriptions must include relevant condition information</li>
                  <li>Content must not violate others' rights or privacy</li>
                  <li>Content must comply with applicable laws and regulations</li>
                </ul>

                <h4>Content Moderation:</h4>
                <p>
                  We reserve the right to review, edit, or remove any content that violates these Terms or our community standards. We may also suspend or terminate accounts for repeated violations.
                </p>
              </section>

              <section id="privacy" className="legal-section">
                <h2>9. Privacy and Data</h2>
                <p>
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information. By using the Platform, you consent to our privacy practices as described in our Privacy Policy.
                </p>
                
                <h4>Data Security:</h4>
                <ul>
                  <li>We implement reasonable security measures to protect your data</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>We may retain certain data as required by law or for legitimate business purposes</li>
                  <li>You may request data deletion subject to legal and operational requirements</li>
                </ul>
              </section>

              <section id="liability" className="legal-section">
                <h2>10. Limitation of Liability</h2>
                <p>
                  BITSBids provides the Platform "as is" without warranties of any kind. We do not guarantee the accuracy of listings, the quality of items, or the reliability of users.
                </p>
                
                <h4>Disclaimers:</h4>
                <ul>
                  <li>We are not party to transactions between users</li>
                  <li>We do not verify the accuracy of item descriptions</li>
                  <li>We are not responsible for user conduct or transaction outcomes</li>
                  <li>We do not guarantee platform availability or functionality</li>
                  <li>We are not liable for any direct, indirect, or consequential damages</li>
                </ul>

                <h4>Indemnification:</h4>
                <p>
                  You agree to indemnify and hold harmless BITSBids from any claims, damages, or expenses arising from your use of the Platform or violation of these Terms.
                </p>
              </section>

              <section id="termination" className="legal-section">
                <h2>11. Termination</h2>
                <p>
                  Either party may terminate this agreement at any time. We may suspend or terminate your account for violations of these Terms or for any other reason at our discretion.
                </p>
                
                <h4>Effect of Termination:</h4>
                <ul>
                  <li>Your access to the Platform will be immediately revoked</li>
                  <li>Active auctions may be cancelled or transferred</li>
                  <li>You remain responsible for completing pending transactions</li>
                  <li>Certain provisions of these Terms survive termination</li>
                </ul>
              </section>

              <section id="changes" className="legal-section">
                <h2>12. Changes to Terms</h2>
                <p>
                  We may modify these Terms at any time by posting updated terms on the Platform. Your continued use of the Platform after changes constitutes acceptance of the new Terms.
                </p>
                <p>
                  We will notify users of significant changes via email or platform notifications. We encourage you to review these Terms periodically.
                </p>
              </section>

              <section id="contact" className="legal-section">
                <h2>13. Contact Information</h2>
                <p>
                  If you have questions about these Terms, please contact us:
                </p>
                <div className="contact-info">
                  <p><strong>Email:</strong> legal@bitsbids.com</p>
                  <p><strong>Support:</strong> support@bitsbids.com</p>
                  <p><strong>Address:</strong> BITS Pilani, Pilani Campus, Rajasthan, India</p>
                </div>
                
                <div className="legal-footer">
                  <p>
                    By using BITSBids, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                  </p>
                  <div className="legal-links">
                    <Link to="/privacy">Privacy Policy</Link>
                    <Link to="/contact">Contact Us</Link>
                    <Link to="/help">Help Center</Link>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
