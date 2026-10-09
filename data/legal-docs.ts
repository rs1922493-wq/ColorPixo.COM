export const LEGAL_METADATA = {
  lastUpdated: 'September 28, 2026',
  effectiveDate: 'September 28, 2026',
  companyName: 'ColorPixo.Com',
  supportEmail: 'contact@colorpixo.com',
  websiteUrl: 'https://colorpixo.com',
  governingLaw: 'Applicable International Digital Commerce and Consumer Protection Laws',
};

export const DATA_USAGE_REGISTRY = [
  {
    feature: 'Image Color Picker & Extractor',
    dataCollected: 'Selected image files (JPG, PNG, WEBP, SVG)',
    processingLocation: '100% Client-side (HTML5 Canvas 2D in local browser memory)',
    storageLocation: 'Volatile browser RAM (freed immediately upon tab closure)',
    serverTransmission: 'No. Zero image bytes are ever transmitted to or stored on ColorPixo servers.',
    purpose: 'Local pixel coordinate sampling, color quantization, and dominant palette extraction.',
  },
  {
    feature: 'Color Blindness Simulation',
    dataCollected: 'Local canvas pixel data or color swatch values',
    processingLocation: '100% Client-side (in-browser matrix transformations)',
    storageLocation: 'Volatile browser RAM',
    serverTransmission: 'No. Never uploaded or transmitted.',
    purpose: 'Simulating Protanopia, Deuteranopia, Tritanopia, and Achromatopsia vision profiles.',
  },
  {
    feature: 'Saved Favorites & Recent Color History',
    dataCollected: 'User-selected HEX codes, palette arrays, and save timestamps',
    processingLocation: 'Client-side only',
    storageLocation: 'Browser local storage (`colorpixo.favorites`, `colorpixo.history`)',
    serverTransmission: 'No. Data remains strictly on your local device.',
    purpose: 'Allowing users to save and retrieve favorite colors and palettes across sessions without an account.',
  },
  {
    feature: 'Theme Settings (Light / Dark Mode)',
    dataCollected: 'Display preference (`system`, `light`, or `dark`)',
    processingLocation: 'Client-side only',
    storageLocation: 'Browser local storage (`colorpixo.settings`)',
    serverTransmission: 'No.',
    purpose: 'Remembering your display theme preference across visits.',
  },
  {
    feature: 'Privacy & Cookie Consent Preferences',
    dataCollected: 'User privacy preference flags and timestamp',
    processingLocation: 'Client-side only',
    storageLocation: 'Browser local storage (`colorpixo.privacy_consent`)',
    serverTransmission: 'No.',
    purpose: 'Honoring and persisting user choices regarding local site preferences and the non-personalized advertising signal.',
  },
  {
    feature: 'Contact & Support Inquiries',
    dataCollected: 'Name, email address, inquiry subject, message body',
    processingLocation: 'Server-side API (/api/contact)',
    storageLocation: 'Volatile server application memory during request validation; logged to temporary server console output with no persistent database storage',
    serverTransmission: 'Yes (Encrypted via HTTPS POST to /api/contact)',
    purpose: 'Processing user feedback, bug reports, and accessibility questions.',
  },
  {
    feature: 'AI Palette Generation',
    dataCollected: 'User-entered descriptive prompt (e.g. "Nordic forest winter")',
    processingLocation: 'Server-side API (/api/ai-palette)',
    storageLocation: 'Processed in-flight; prompts are not stored with or linked to personal user identities',
    serverTransmission: 'Yes (Encrypted via HTTPS POST to API)',
    purpose: 'Converting natural language themes into harmonious 5-swatch color schemes.',
  },
];

export type LegalDocKey =
  | 'privacy'
  | 'terms'
  | 'disclaimer'
  | 'cookie-policy'
  | 'advertising'
  | 'data-usage'
  | 'accessibility-statement';

export interface LegalDocItem {
  title: string;
  lastUpdated: string;
  sections: { heading: string; content: string }[];
}

export const LEGAL_DOCS: Record<LegalDocKey, LegalDocItem> = {
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'September 28, 2026',
    sections: [
      {
        heading: '1. Introduction & Overview',
        content:
          'Welcome to ColorPixo.Com ("ColorPixo", "we", "our", or "us"). We provide free, browser-based color tools, palette generators, gradient builders, and accessibility contrast checkers. We are committed to transparency, user privacy, and data minimization.\n\nThis Privacy Policy explains what information we collect, what information we deliberately do NOT collect, how local storage and cookies are utilized, how advertising is handled via Google AdSense, and your rights and choices regarding your data.',
      },
      {
        heading: '2. Information We Do NOT Collect (Local Browser Processing)',
        content:
          'ColorPixo is engineered around a client-side first architecture:\n\n• No Account Required: You do not need to register, create an account, or log in to use ColorPixo tools.\n• Zero Image Uploads: When you use the Image Color Picker, Image Palette Extractor, or Color Blindness Simulator, your uploaded images are processed entirely within your device’s local browser memory using HTML5 Canvas APIs. Images are never transmitted to, inspected by, or stored on our servers.\n• No Biometrics or Personal Tracking: We do not capture user keystrokes outside of standard form fields, nor do we record screen interactions or video sessions.',
      },
      {
        heading: '3. Information We Collect Automatically',
        content:
          'Like standard web platforms, when you access ColorPixo.Com, our hosting infrastructure may temporarily process technical server log data strictly necessary to deliver pages securely:\n\n• Device & Browser Information: Browser type and version, operating system, preferred language, and referring URL.\n• Network Data: Anonymized IP address, request timestamps, and requested resources.\n• Purpose: Ensuring network security, mitigating DDoS attacks, preventing abusive automated rate-limit abuse, and maintaining website stability.',
      },
      {
        heading: '4. Information You Explicitly Provide',
        content:
          'When you choose to contact us using our Contact Form (/contact), you voluntarily provide:\n\n• Name (or display handle)\n• Email address\n• Subject and message details\n\nThis information is transmitted securely over encrypted HTTPS directly to our server API endpoint (/api/contact). The API validates input fields, enforces rate limiting to mitigate spam, and transmits the message directly to our official inbox (contact@colorpixo.com) using the transactional email service Resend. Contact submissions are not stored in a public or persistent database, are not sent to marketing aggregators, and are never sold or shared. If you prefer direct email communication, you may contact us directly at contact@colorpixo.com.',
      },
      {
        heading: '5. Local Storage (HTML5 localStorage)',
        content:
          'Instead of tracking cookies for site functionality, ColorPixo uses your browser’s local storage (HTML5 localStorage):\n\n• Display Theme (`colorpixo.settings`): Remembers your choice between Light and Dark mode.\n• Bookmarked Colors & Palettes (`colorpixo.favorites`): Stores colors and palettes you deliberately favorite for easy recall.\n• Recent Color History (`colorpixo.history`): Stores recently inspected color codes on your device.\n• Consent Preferences (`colorpixo.privacy_consent`): Saves your local site preferences and advertising personalization signal.\n\nThis data lives strictly on your personal device and can be cleared at any time directly through your browser settings.',
      },
      {
        heading: '6. Advertising & Google AdSense',
        content:
          'ColorPixo is supported by digital advertising to keep our tools and guides 100% free for everyone. When advertising is active, we partner with Google AdSense and certified advertising networks.\n\n• Google Advertising Cookies: Google uses cookies (including the DoubleClick cookie) to serve advertisements based on a user’s prior visits to ColorPixo.Com or other websites across the internet.\n• Third-Party Vendors: Third-party advertising vendors and ad networks may also place and read cookies on your browser, or use web beacons to collect information as a result of ad serving on this website.\n• Personalized vs. Non-Personalized Advertising: Depending on your location (such as the European Economic Area, United Kingdom, or California), applicable privacy regulations, and your consent choices, advertisements served may be personalized (tailored to your general interests based on browsing history) or non-personalized (contextual, based on the page content being viewed).\n• How Google Uses Data: For comprehensive details on how Google handles data from sites that use its services, review Google’s official documentation at: https://policies.google.com/technologies/ads\n• No Deceptive Ads: We enforce strict advertising quality standards. Advertisements on ColorPixo are always clearly labeled as "Advertisement" and are never disguised as navigation buttons, download links, or tool controls.',
      },
      {
        heading: '7. How Users Can Control Cookies & Personalized Advertising',
        content:
          'You have multiple ways to control cookies and opt out of personalized advertising:\n\n• In-Site Privacy Choices: You can click the "Privacy Choices" link in our website footer at any time to update your advertising and optional cookie preferences.\n• Google Ad Settings: You can opt out of personalized advertising from Google by visiting Google Ads Settings: https://adssettings.google.com\n• Industry Opt-Out Tools: You can opt out of third-party vendors’ use of cookies for personalized advertising through:\n  - Network Advertising Initiative (NAI): https://optout.networkadvertising.org\n  - Digital Advertising Alliance (DAA): https://optout.aboutads.info\n  - European Interactive Digital Advertising Alliance (EDAA): https://www.youronlinechoices.eu\n• Browser Controls: You can configure your browser to block all cookies, accept only first-party cookies, or alert you before a cookie is placed.',
      },
      {
        heading: '8. Data Retention & Security',
        content:
          '• Contact Inquiries: Handled in volatile server runtime memory and recorded in temporary application logs without persistent database storage.\n• Local Storage: Persists on your physical device until you delete your browser data or click "Clear History" inside our tools.\n• Security Measures: All traffic to ColorPixo.Com is encrypted in transit using industry-standard TLS/HTTPS protocols. We employ rate-limiting and server security configurations to safeguard our infrastructure.',
      },
      {
        heading: '9. Your Privacy Rights (GDPR, UK GDPR & CCPA/CPRA)',
        content:
          'Depending on your geographic jurisdiction, you have statutory rights concerning your personal data:\n\n• Right of Access: You may request details about any personal data we hold about you.\n• Right to Rectification or Erasure: You may request correction or deletion of personal data you previously provided via our contact form.\n• Right to Object or Restrict Processing: You may object to certain processing activities, including personalized advertising.\n• Do Not Sell or Share My Personal Information (CCPA/CPRA): We do not sell personal data for monetary consideration. Under California law, the use of certain third-party advertising cookies may be considered "sharing" or "targeted advertising." California residents can exercise their opt-out rights via our "Privacy Choices" footer link or through global privacy signals (GPC).\n\nTo exercise any of these rights, please email contact@colorpixo.com.',
      },
      {
        heading: '10. Children’s Online Privacy Protection',
        content:
          'ColorPixo is a general audience creative and utility toolkit for designers, engineers, and creators. We do not knowingly solicit or collect personal data from children under the age of 13 (or under 16 in applicable European jurisdictions). If we become aware that personal information has been collected from a child without verified parental consent, we will promptly delete that information from our records.',
      },
      {
        heading: '11. Changes to This Privacy Policy',
        content:
          'We may update this Privacy Policy from time to time to reflect operational, technological, or legal developments. When changes are published, we will revise the "Last Updated" date at the top of this document. Continued use of ColorPixo.Com following posted changes constitutes your acceptance of the updated policy.',
      },
      {
        heading: '12. Contact Information',
        content:
          'If you have questions, comments, or data requests regarding this Privacy Policy or our data practices, please reach out to us:\n\nColorPixo.Com\nEmail: contact@colorpixo.com\nWebsite: https://colorpixo.com/contact',
      },
    ],
  },
  terms: {
    title: 'Terms and Conditions',
    lastUpdated: 'September 28, 2026',
    sections: [
      {
        heading: '1. Agreement to Terms',
        content:
          'By accessing, browsing, or using ColorPixo.Com ("ColorPixo", the "Service"), you agree to be bound by these Terms and Conditions ("Terms") and our Privacy Policy. If you do not agree with any part of these Terms, you must immediately discontinue use of the website and tools.',
      },
      {
        heading: '2. Description of Service & Free License',
        content:
          'ColorPixo provides online color pickers, palette generators, gradient tools, shade calculators, WCAG contrast checkers, and educational design guides.\n\n• Free Asset Usage: All color palettes, hexadecimal codes, RGB values, CSS variables, Tailwind tokens, and exported PNG swatch cards generated using our tools are 100% free for both personal and commercial use in your websites, applications, graphic design, and print materials without any attribution required.\n• Intellectual Property: The ColorPixo website design, logo, branding, custom source code, written guides, and layout are the exclusive intellectual property of ColorPixo.Com and are protected by applicable copyright and trademark laws.',
      },
      {
        heading: '3. Acceptable Use Policy',
        content:
          'You agree to use ColorPixo solely for lawful purposes. You must not:\n\n• Interfere with, disrupt, or place an unreasonable load on our servers, networks, or API endpoints.\n• Use automated scrapers, crawlers, or extraction bots that degrade service availability for other users.\n• Attempt to reverse engineer, decompile, or compromise the security architecture of the website.\n• Transmit malicious code, viruses, or unsolicited promotional communications (spam) through our contact forms.',
      },
      {
        heading: '4. Third-Party Services & Advertising',
        content:
          'ColorPixo may display advertisements served by Google AdSense and other advertising networks, and may contain links to third-party websites or resources. ColorPixo is not responsible for the availability, content, policies, or practices of third-party websites. Accessing third-party resources is entirely at your own risk.',
      },
      {
        heading: '5. Disclaimer of Warranties',
        content:
          'ColorPixo is provided strictly on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express, implied, statutory, or otherwise, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.\n\nWhile we strive for high uptime, mathematical precision, and bug-free tools, we do not guarantee that the service will be uninterrupted, error-free, secure, or free from omissions.',
      },
      {
        heading: '6. Limitation of Liability',
        content:
          'To the fullest extent permitted by applicable law, in no event shall ColorPixo.Com, its developers, or affiliates be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of, or inability to use, our website, tools, or generated output.\n\nColor calculations, contrast ratios, and palette suggestions are provided as helpful digital aids. You are solely responsible for verifying critical color accuracy prior to commercial manufacturing, printing, or high-stakes production.',
      },
      {
        heading: '7. Modifications to Service & Terms',
        content:
          'We reserve the right to modify, suspend, or discontinue any aspect of ColorPixo at any time without prior notice. We may also revise these Terms periodically. Your continued use of the website following published updates signifies your binding acceptance of the revised Terms.',
      },
      {
        heading: '8. Governing Law & Contact',
        content:
          'These Terms are governed by applicable digital commerce laws and international standards without regard to conflict of law principles. If you have questions concerning these Terms, please contact us at contact@colorpixo.com.',
      },
    ],
  },
  disclaimer: {
    title: 'Disclaimer & Mathematical Notice',
    lastUpdated: 'September 28, 2026',
    sections: [
      {
        heading: '1. General Informational & Utility Purpose',
        content:
          'ColorPixo.Com provides browser-based color utility tools, conversion calculators, palette generation algorithms, and educational articles for designers, frontend developers, and digital creators. All content, recommendations, and tool outputs are provided for convenience and general informational purposes only.',
      },
      {
        heading: '2. Display Hardware & Color Gamut Variations',
        content:
          'Digital color reproduction depends fundamentally on physical hardware characteristics, operating system color management, display calibration, ambient lighting, and color space rendering (e.g., sRGB, Display P3, Adobe RGB, or CMYK printing inks).\n\nWhile ColorPixo calculates exact mathematical transformations according to published standards (such as sRGB IEC 61966-2-1 and CIE 1931), colors rendered on your physical monitor or mobile screen may appear noticeably different from physical print swatches, textile dyes, or other uncalibrated monitors.',
      },
      {
        heading: '3. Independent Verification Required for Production',
        content:
          'Color palettes, conversions, and contrast ratios generated by ColorPixo are automated creative suggestions. When color accuracy is critical—including corporate branding guidelines, high-volume commercial offset printing, product manufacturing, or industrial signage—you must independently test and verify color specifications with certified physical color books (such as Pantone or RAL) and hardware spectrophotometers.\n\nColorPixo is not responsible for financial losses, reprint costs, or aesthetic discrepancies resulting from decisions based solely on tool outputs.',
      },
      {
        heading: '4. Web Accessibility (WCAG 2.1) Disclaimer',
        content:
          'Our Contrast Checker evaluates color pairs using the mathematical relative luminance formula defined in W3C Web Content Accessibility Guidelines (WCAG) 2.1 Level AA and AAA.\n\nPassing mathematical contrast scores serve as a valuable engineering benchmark but do not replace comprehensive human accessibility audits across varying real-world lighting conditions, low-vision assistive technology, and diverse screen backlights.',
      },
      {
        heading: '5. Third-Party Links & Content',
        content:
          'ColorPixo may contain links to external documentation, standards organizations (such as W3C), or third-party web services. We do not endorse, guarantee, or assume responsibility for the accuracy or practices of external websites.',
      },
    ],
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    lastUpdated: 'September 28, 2026',
    sections: [
      {
        heading: '1. What Are Cookies and Local Storage?',
        content:
          'Cookies are small text files placed on your computer or mobile device by websites that you visit. They are widely used to make websites work efficiently, remember your preferences, and provide reporting information to site operators.\n\nHTML5 Local Storage is a modern web browser technology that allows websites to store key-value data directly on your device without sending that data back and forth to servers on every single web page request.',
      },
      {
        heading: '2. How ColorPixo Uses Local Storage',
        content:
          'ColorPixo prioritizes lightweight local browser storage over tracking cookies for all core site features:\n\n• `colorpixo.settings`: Saves your preference for Light or Dark interface mode.\n• `colorpixo.favorites`: Stores your saved favorite colors and custom palettes.\n• `colorpixo.history`: Keeps your recent color inspection history for fast access.\n• `colorpixo.privacy_consent`: Remembers your cookie and privacy preferences.\n\nBecause this data resides solely in your browser’s localStorage, it is under your direct control and is not collected into server databases.',
      },
      {
        heading: '3. Cookies Used on ColorPixo',
        content:
          'When advertising or third-party integrations are active, the following categories of cookies may be utilized:\n\n• Essential Cookies: Strictly necessary for page routing, security, and fraud prevention. These cannot be disabled without breaking basic website functionality.\n• Advertising Cookies (Google AdSense & Certified Partners): Used by Google and third-party advertising networks to serve relevant ads, prevent repetitive ads from being shown to the same visitor, verify ad clicks, and measure advertising performance.\n• Preference & Consent Cookies: Used to record whether you have accepted or declined optional advertising personalization.',
      },
      {
        heading: '4. Third-Party Advertising Cookies & Google AdSense',
        content:
          'Google, as a third-party vendor, uses cookies to serve ads on ColorPixo.Com. Google’s use of advertising cookies enables it and its partners to serve ads to users based on their visit to ColorPixo and/or other sites on the Internet.\n\nUsers may opt out of personalized advertising by visiting Google Ads Settings at https://adssettings.google.com or through industry opt-out portals such as https://optout.networkadvertising.org.',
      },
      {
        heading: '5. Managing Cookies in Your Browser',
        content:
          'Most web browsers allow you to control cookies through browser settings. You can set your browser to refuse all cookies, reject third-party cookies, or alert you when a cookie is sent. Instructions for popular browsers:\n\n• Google Chrome: Settings > Privacy and Security > Cookies and other site data\n• Mozilla Firefox: Settings > Privacy & Security > Cookies and Site Data\n• Apple Safari: Preferences > Privacy > Block all cookies\n• Microsoft Edge: Settings > Cookies and site permissions > Manage and delete cookies\n\nIf you block all cookies, essential tools will continue to work, but certain advertising personalization or third-party features may not function as intended.',
      },
      {
        heading: '6. Updates & Contact',
        content:
          'We may update this Cookie Policy periodically to reflect technological or regulatory changes. If you have questions about our cookie usage, please contact us at contact@colorpixo.com.',
      },
    ],
  },
  advertising: {
    title: 'Advertising Policy & Disclosures',
    lastUpdated: 'September 28, 2026',
    sections: [
      {
        heading: '1. Mission & Funding Disclosure',
        content:
          'ColorPixo.Com is dedicated to providing high-quality, privacy-first, professional digital color tools and educational guides to designers, developers, students, and creators worldwide at zero cost. To keep our infrastructure, development, and hosting sustainable without charging subscription fees or selling user data, we display digital advertisements through Google AdSense and verified advertising networks.',
      },
      {
        heading: '2. Editorial & Algorithmic Independence',
        content:
          'We maintain complete editorial, scientific, and mathematical independence:\n\n• Advertisers have zero influence over our color conversion algorithms, contrast calculation formulas, palette generator logic, or color theory articles.\n• We do not publish paid product reviews disguised as objective editorial guides.\n• Sponsored content, if ever present, is clearly and conspicuously labeled.',
      },
      {
        heading: '3. Ad Standards & User Experience Commitments',
        content:
          'We are committed to a clean, non-intrusive user experience. We strictly adhere to the following principles:\n\n• Clear Labeling: Every advertising placement is clearly identified with an "Advertisement" label in accordance with industry standards.\n• No Deceptive Placements: Ads are never placed in positions where they can be accidentally clicked, nor are they disguised as navigation buttons, download links, color swatches, or tool controls.\n• No Fake Ads or Interstitials: We do not display fake or simulated advertisements. Opening a tool takes you directly to that tool with zero artificial delay or countdown timer.\n• Prohibited Formats: We strictly prohibit intrusive advertising formats such as autoplay audio, screen-takeover popups, deceptive software download prompts, or malware delivery.',
      },
      {
        heading: '4. Prohibition of Invalid Clicks & Artificial Engagement',
        content:
          'In strict adherence to Google AdSense program policies, users must never click advertisements for the purpose of supporting ColorPixo.Com or generating publisher revenue. We do not encourage, request, incentivize, or solicit artificial clicks, impressions, or automated traffic under any circumstances.\n\nInteracting with advertisements must always be driven solely by genuine user interest in the advertised products or services.',
      },
      {
        heading: '5. Personalized vs. Non-Personalized Advertising',
        content:
          'Depending on your geographic location, applicable privacy frameworks (such as GDPR or CCPA), and your explicit consent choices, ads displayed on ColorPixo may be personalized (based on your prior web browsing history across other sites) or non-personalized (contextual to the color topic you are currently viewing).\n\nYou can manage your advertising preferences anytime through the "Privacy Choices" link in our footer, or via Google Ad Settings at https://adssettings.google.com.',
      },
      {
        heading: '6. Reporting Ad Issues',
        content:
          'If you encounter an advertisement on ColorPixo that violates our standards, appears broken, or delivers deceptive claims, please report it immediately to contact@colorpixo.com with a screenshot and URL so we can investigate and block the offending ad unit.',
      },
    ],
  },
  'data-usage': {
    title: 'Data Usage & Local Architecture',
    lastUpdated: 'September 28, 2026',
    sections: [
      {
        heading: '1. Edge & Client-Side Architecture',
        content:
          'ColorPixo is built around modern browser capabilities. Rather than streaming megabytes of user imagery to remote servers for color analysis, our tools execute intensive color extraction, spatial clustering, and contrast calculations directly on your device’s CPU and GPU via the browser HTML5 Canvas API sandbox.',
      },
      {
        heading: '2. Auditable Network Transparency',
        content:
          'You can independently verify our privacy architecture using your web browser’s Developer Tools (F12 > Network tab). When you drag and drop a 25MB photograph into our Image Color Picker, you will observe zero bytes of image payload transmitted over the network. The computation completes locally in sub-millisecond time.',
      },
      {
        heading: '3. Specific Server-Side Endpoints',
        content:
          'Only two features utilize server-side API communication:\n\n1. Contact Form (/api/contact): When you deliberately submit a message, your inquiry details are sent to our API to facilitate support communication.\n2. AI Palette Generator (/api/ai-palette): When you submit a descriptive text prompt (such as "sunset over lavender fields"), the text prompt is processed in-flight to generate corresponding color tokens. No personal imagery or identity tokens are transmitted.',
      },
    ],
  },
  'accessibility-statement': {
    title: 'Accessibility Statement',
    lastUpdated: 'September 28, 2026',
    sections: [
      {
        heading: '1. Our Accessibility Pledge',
        content:
          'ColorPixo.Com is committed to digital inclusion and ensuring that our color tools and informational guides are accessible to users of all abilities, including individuals with visual, motor, auditory, or cognitive disabilities.',
      },
      {
        heading: '2. Standards & Conformance',
        content:
          'We continuously design and test our platform to conform with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA criteria. Key implementations include:\n\n• High Contrast UI: Clear, readable typography with strict contrast ratios across both Light and Dark themes.\n• Keyboard Operability: Full keyboard accessibility across all major tools, sliders, interactive swatches, and navigation menus with visible focus indicator rings.\n• Screen Reader Optimization: Semantic HTML5 landmarks, descriptive ARIA attributes, and clear button labels for assistive technologies.\n• Color Blindness Awareness: We do not rely solely on color to communicate status or data, and we provide a built-in Color Blindness Simulator so designers can audit their own work.',
      },
      {
        heading: '3. Feedback & Contact Channel',
        content:
          'We welcome feedback on the accessibility of ColorPixo.Com. If you encounter an accessibility barrier or have suggestions for improvement, please contact us at:\n\nEmail: contact@colorpixo.com\nSubject: Accessibility Inquiry\n\nWe prioritize accessibility remediation requests and review all feedback to improve site usability.',
      },
    ],
  },
};
