import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  const lastUpdated = "January 15, 2024";

  return (
    <div className="legal-page">
      <div className="legal-header">
        <div className="container">
          <h1>Privacy Policy</h1>
          <p>Your privacy is important to us. This policy explains how we handle your data.</p>
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
                <li><a href="#overview">1. Overview</a></li>
                <li><a href="#information-collected">2. Information We Collect</a></li>
                <li><a href="#how-we-use">3. How We Use Your Information</a></li>
                <li><a href="#information-sharing">4. Information Sharing</a></li>
                <li><a href="#data-security">5. Data Security</a></li>
                <li><a href="#your-rights">6. Your Rights and Choices</a></li>
                <li><a href="#cookies">7. Cookies and Tracking</a></li>
                <li><a href="#data-retention">8. Data Retention</a></li>
                <li><a href="#international-transfers">9. International Data Transfers</a></li>
                <li><a href="#children-privacy">10. Children's Privacy</a></li>
                <li><a href="#changes">11. Changes to This Policy</a></li>
                <li><a href="#contact">12. Contact Us</a></li>
              </ul>
            </div>

            <div className="legal-sections">
              <section id="overview" className="legal-section">
                <h2>1. Overview</h2>
                <p>
                  BITSBids ("we," "us," or "our") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                </p>
                <p>
                  This policy applies to all users of BITSBids, including visitors to our website and registered users of our services.
                </p>
                <div className="privacy-highlights">
                  <h4>Key Privacy Highlights:</h4>
                  <ul>
                    <li>We only collect information necessary to provide our services</li>
                    <li>Your BITS email is used solely for verification and communication</li>
                    <li>We never sell your personal information to third parties</li>
                    <li>You have control over your data and can delete your account anytime</li>
                    <li>We use industry-standard security measures to protect your data</li>
                  </ul>
                </div>
              </section>

              <section id="information-collected" className="legal-section">
                <h2>2. Information We Collect</h2>
                
                <h4>Information You Provide Directly:</h4>
                <ul>
                  <li><strong>Account Information:</strong> Name, BITS email address, campus, year of study, branch/program</li>
                  <li><strong>Profile Information:</strong> Profile photo, bio, contact preferences, social media links</li>
                  <li><strong>Listing Information:</strong> Item descriptions, photos, pricing, location details</li>
                  <li><strong>Communication Data:</strong> Messages between users, support communications</li>
                  <li><strong>Transaction Information:</strong> Bidding history, auction participation, feedback and ratings</li>
                </ul>

                <h4>Information Collected Automatically:</h4>
                <ul>
                  <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                  <li><strong>Usage Data:</strong> Pages visited, time spent on platform, search queries, click patterns</li>
                  <li><strong>Location Data:</strong> General location based on IP address (not precise location)</li>
                  <li><strong>Performance Data:</strong> Error logs, crash reports, performance metrics</li>
                </ul>

                <h4>Information from Third Parties:</h4>
                <ul>
                  <li><strong>BITS Email Verification:</strong> We verify your student status through your BITS email</li>
                  <li><strong>Social Media:</strong> If you choose to link social media accounts (optional)</li>
                </ul>
              </section>

              <section id="how-we-use" className="legal-section">
                <h2>3. How We Use Your Information</h2>
                
                <h4>Primary Uses:</h4>
                <ul>
                  <li><strong>Account Management:</strong> Creating and maintaining your account, verifying student status</li>
                  <li><strong>Platform Services:</strong> Facilitating auctions, processing bids, enabling communication</li>
                  <li><strong>Safety and Security:</strong> Preventing fraud, ensuring platform security, enforcing terms</li>
                  <li><strong>Communication:</strong> Sending notifications, updates, and support responses</li>
                  <li><strong>Improvement:</strong> Analyzing usage to improve platform features and user experience</li>
                </ul>

                <h4>Legal Basis for Processing:</h4>
                <ul>
                  <li><strong>Contract Performance:</strong> Processing necessary to provide our services</li>
                  <li><strong>Legitimate Interests:</strong> Platform security, fraud prevention, service improvement</li>
                  <li><strong>Consent:</strong> Marketing communications, optional features</li>
                  <li><strong>Legal Compliance:</strong> Compliance with applicable laws and regulations</li>
                </ul>

                <h4>Marketing and Communications:</h4>
                <p>
                  We may send you service-related communications and, with your consent, promotional materials about new features or relevant offers. You can opt out of marketing communications at any time.
                </p>
              </section>

              <section id="information-sharing" className="legal-section">
                <h2>4. Information Sharing</h2>
                
                <h4>We Share Information:</h4>
                <ul>
                  <li><strong>With Other Users:</strong> Profile information, listing details, public communications</li>
                  <li><strong>Service Providers:</strong> Third-party services that help us operate the platform</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
                  <li><strong>Safety and Security:</strong> To protect users, prevent fraud, or address security issues</li>
                  <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                </ul>

                <h4>We Do Not:</h4>
                <ul>
                  <li>Sell your personal information to third parties</li>
                  <li>Share your BITS email address with other users</li>
                  <li>Provide your data to advertisers for targeting</li>
                  <li>Share more information than necessary for platform functionality</li>
                </ul>

                <h4>Public Information:</h4>
                <p>
                  Some information is visible to other users by design, including your name, campus, profile photo, listings, and public communications. You can control some of these visibility settings in your account preferences.
                </p>
              </section>

              <section id="data-security" className="legal-section">
                <h2>5. Data Security</h2>
                
                <h4>Security Measures:</h4>
                <ul>
                  <li><strong>Encryption:</strong> Data transmission and storage encryption using industry standards</li>
                  <li><strong>Access Controls:</strong> Limited access to personal data on a need-to-know basis</li>
                  <li><strong>Authentication:</strong> Secure login systems and session management</li>
                  <li><strong>Monitoring:</strong> Continuous monitoring for security threats and vulnerabilities</li>
                  <li><strong>Regular Audits:</strong> Periodic security assessments and updates</li>
                </ul>

                <h4>Your Security Responsibilities:</h4>
                <ul>
                  <li>Keep your password secure and don't share account credentials</li>
                  <li>Log out of shared or public devices</li>
                  <li>Report suspicious activity immediately</li>
                  <li>Keep your contact information updated</li>
                  <li>Use strong, unique passwords</li>
                </ul>

                <h4>Data Breach Response:</h4>
                <p>
                  In the unlikely event of a data breach affecting your personal information, we will notify you and relevant authorities as required by law, typically within 72 hours of discovery.
                </p>
              </section>

              <section id="your-rights" className="legal-section">
                <h2>6. Your Rights and Choices</h2>
                
                <h4>Your Rights Include:</h4>
                <ul>
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                  <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                  <li><strong>Restriction:</strong> Limit how we process your data</li>
                  <li><strong>Objection:</strong> Object to certain types of data processing</li>
                </ul>

                <h4>How to Exercise Your Rights:</h4>
                <ul>
                  <li>Update most information directly in your account settings</li>
                  <li>Contact our support team for data requests</li>
                  <li>Use the account deletion option in your settings</li>
                  <li>Opt out of marketing communications using unsubscribe links</li>
                </ul>

                <h4>Account Deletion:</h4>
                <p>
                  You can delete your account at any time through your account settings. This will remove your profile and personal data, though some information may be retained for legal or security purposes as outlined in our data retention policy.
                </p>
              </section>

              <section id="cookies" className="legal-section">
                <h2>7. Cookies and Tracking</h2>
                
                <h4>Types of Cookies We Use:</h4>
                <ul>
                  <li><strong>Essential Cookies:</strong> Required for platform functionality and security</li>
                  <li><strong>Performance Cookies:</strong> Help us understand how users interact with our platform</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Analytics Cookies:</strong> Provide insights into platform usage and performance</li>
                </ul>

                <h4>Managing Cookies:</h4>
                <p>
                  You can control cookies through your browser settings, though disabling essential cookies may affect platform functionality. We provide a cookie preference center where you can manage non-essential cookies.
                </p>

                <h4>Third-Party Analytics:</h4>
                <p>
                  We use analytics services to understand platform usage. These services may use cookies and similar technologies. We ensure these providers comply with privacy standards and limit data collection to what's necessary for analytics.
                </p>
              </section>

              <section id="data-retention" className="legal-section">
                <h2>8. Data Retention</h2>
                
                <h4>Retention Periods:</h4>
                <ul>
                  <li><strong>Account Data:</strong> Retained while your account is active</li>
                  <li><strong>Transaction History:</strong> Retained for 7 years for legal and dispute resolution purposes</li>
                  <li><strong>Communication Records:</strong> Retained for 2 years for support and safety purposes</li>
                  <li><strong>Usage Analytics:</strong> Aggregated data retained indefinitely, personal identifiers removed after 2 years</li>
                  <li><strong>Security Logs:</strong> Retained for 1 year for security monitoring</li>
                </ul>

                <h4>Deletion Criteria:</h4>
                <p>
                  We delete personal data when it's no longer necessary for the purposes it was collected, when you request deletion, or when legal retention periods expire, whichever comes first.
                </p>
              </section>

              <section id="international-transfers" className="legal-section">
                <h2>9. International Data Transfers</h2>
                <p>
                  BITSBids primarily operates within India, and your data is stored on servers located in India. If we need to transfer data internationally, we ensure appropriate safeguards are in place to protect your privacy rights.
                </p>
                
                <h4>Safeguards for International Transfers:</h4>
                <ul>
                  <li>Adequacy decisions by relevant authorities</li>
                  <li>Standard contractual clauses</li>
                  <li>Certification schemes and codes of conduct</li>
                  <li>Your explicit consent for specific transfers</li>
                </ul>
              </section>

              <section id="children-privacy" className="legal-section">
                <h2>10. Children's Privacy</h2>
                <p>
                  BITSBids is intended for college students who are typically 18 years or older. We do not knowingly collect personal information from children under 18 without parental consent.
                </p>
                <p>
                  If you are under 18 and wish to use our platform, you must have verifiable parental consent. If we become aware that we have collected personal information from a child under 18 without proper consent, we will take steps to delete that information.
                </p>
              </section>

              <section id="changes" className="legal-section">
                <h2>11. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors.
                </p>
                
                <h4>How We Notify You:</h4>
                <ul>
                  <li>Email notification for significant changes</li>
                  <li>Platform notifications for important updates</li>
                  <li>Updated "last modified" date on this page</li>
                  <li>Prominent notices on our website for major changes</li>
                </ul>

                <p>
                  Your continued use of the platform after changes become effective constitutes acceptance of the updated policy.
                </p>
              </section>

              <section id="contact" className="legal-section">
                <h2>12. Contact Us</h2>
                <p>
                  If you have questions about this Privacy Policy or our data practices, please contact us:
                </p>
                
                <div className="contact-info">
                  <div className="contact-method">
                    <h4>Privacy Officer</h4>
                    <p><strong>Email:</strong> privacy@bitsbids.com</p>
                    <p><strong>Response Time:</strong> Within 48 hours</p>
                  </div>
                  
                  <div className="contact-method">
                    <h4>General Support</h4>
                    <p><strong>Email:</strong> support@bitsbids.com</p>
                    <p><strong>Response Time:</strong> Within 24 hours</p>
                  </div>
                  
                  <div className="contact-method">
                    <h4>Postal Address</h4>
                    <p>BITSBids Privacy Team<br/>
                    BITS Pilani, Pilani Campus<br/>
                    Pilani, Rajasthan 333031<br/>
                    India</p>
                  </div>
                </div>

                <div className="privacy-footer">
                  <p>
                    We are committed to protecting your privacy and will respond to your inquiries promptly and professionally.
                  </p>
                  <div className="legal-links">
                    <Link to="/terms">Terms of Service</Link>
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

export default Privacy;
