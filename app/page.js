"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  // --- UI Interactivity States ---
  const [scrolled, setScrolled] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  
  // --- Modal Configurator & Simulation States ---
  const [modalStep, setModalStep] = useState(1); // 1: Config, 2: HUD, 3: Success
  const [selectedDosa, setSelectedDosa] = useState("Classic Masala");
  const [selectedPrice, setSelectedPrice] = useState(129);
  const [selectedCrispness, setSelectedCrispness] = useState("Golden Crispy");
  const [balconyCoords, setBalconyCoords] = useState("");

  const [hudTelemetry, setHudTelemetry] = useState("LOCKING COORDINATES...");
  const [hudPilot, setHudPilot] = useState("DISPATCHING FROM HUB-7");
  const [hudProgressBarWidth, setHudProgressBarWidth] = useState(0);
  const [hudLogs, setHudLogs] = useState([
    { text: "> Establishing drone communication...", active: true }
  ]);
  const [droneBlipStyle, setDroneBlipStyle] = useState({
    top: "35px",
    left: "60px",
    transition: ""
  });

  const activeTimersRef = useRef([]);

  const clearAllTimers = () => {
    activeTimersRef.current.forEach(timer => {
      if (timer.type === 'interval') {
        clearInterval(timer.id);
      } else {
        clearTimeout(timer.id);
      }
    });
    activeTimersRef.current = [];
  };

  // --- Scroll & Reveal Effects ---
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Scroll Reveal Intersection Observer
    const revealCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    };
    const revealObserver = new IntersectionObserver(revealCallback, {
      root: null,
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });
    document.querySelectorAll(".reveal").forEach(el => {
      revealObserver.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      revealObserver.disconnect();
      clearAllTimers();
    };
  }, []);

  // --- Modal scroll lock ---
  useEffect(() => {
    if (modalActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalActive]);

  // --- State Handlers ---
  const toggleMenu = () => {
    setMenuActive(prev => !prev);
  };

  const openOrderModal = () => {
    setModalActive(true);
  };

  const closeOrderModal = () => {
    setModalActive(false);
    // Reset back to step 1 after modal transition finishes
    setTimeout(resetToStep1, 400);
  };

  const closeOrderModalOutside = (e) => {
    if (e.target.id === "orderModal") {
      closeOrderModal();
    }
  };

  const selectDosaCard = (name, price) => {
    setSelectedDosa(name);
    setSelectedPrice(price);
  };

  const selectSpice = (level) => {
    setSelectedCrispness(level);
  };

  const resetToStep1 = () => {
    clearAllTimers();
    setModalStep(1);
  };

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  // --- Flight Simulation Controller ---
  const startFlightSimulation = () => {
    clearAllTimers();
    setModalStep(2);
    setHudProgressBarWidth(0);
    setHudTelemetry("LOCKING COORDINATES...");
    setHudPilot("DISPATCHING FROM HUB-7");
    setHudLogs([{ text: "> Establishing drone communication...", active: true }]);

    // Reset radar position style
    setDroneBlipStyle({
      top: "35px",
      left: "60px",
      transition: ""
    });

    // Start movement simulation
    const blipTimeout = setTimeout(() => {
      setDroneBlipStyle({
        top: "90px",
        left: "90px",
        transition: "all 10.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      });
    }, 50);
    activeTimersRef.current.push({ id: blipTimeout, type: "timeout" });

    // Progress bar ticker (increases linearly over 10.5 seconds)
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 1;
      setHudProgressBarWidth(progress);
      if (progress >= 100) {
        clearInterval(progressInterval);
      }
    }, 105);
    activeTimersRef.current.push({ id: progressInterval, type: "interval" });

    // Simulation logs timetable
    const simulationLogs = [
      { time: 1000, log: "> Battery at 98.6%. Motors calibrated.", telemetry: "COORDINATE LOCK ACQUIRED", pilot: "AVIONICS: GO FOR LAUNCH" },
      { time: 2000, log: "> Dosa batter poured. TawaAI induction firing (180°C)", telemetry: "BAKING ACTIVE", pilot: "PREP IN PROGRESS" },
      { time: 3500, log: "> Dispensation complete. Golden skin verified by visual AI.", telemetry: "BAKE COMPLETED (99.2% CRISPY)", pilot: "TAKEOFF IMMINENT" },
      { time: 5000, log: "> Takeoff sequence initiated. Altitude rising to 80m.", telemetry: "CRUISING - ALTITUDE 80M", pilot: "PILOT: AUTONOMOUS FLYWAY" },
      { time: 6500, log: "> Cruise velocity Mach 0.7. Correcting for wind shear.", telemetry: "CRUISING - MACH 0.70", pilot: "AUTOPILOT EN-ROUTE" },
      { time: 8000, log: "> Dropzone visual range. Balcony identified via LIDAR.", telemetry: "DESCENT MODE ACTIVE", pilot: "HOVERING OVER DROPZONE" },
      { time: 9200, log: "> Lowering Cryo-Thermal Pod via electro-magnetic winch.", telemetry: "POD DEPLOYING", pilot: "DEPLOYING CARRIER CAPSULE" },
      { time: 10500, log: "> Capsule released. Winch retracted. Heading home.", telemetry: "FLIGHT COMPLETED", pilot: "RETURNING TO BASE" }
    ];

    simulationLogs.forEach(step => {
      const t = setTimeout(() => {
        setHudLogs(prev => {
          const updated = prev.map(item => ({ ...item, active: false }));
          return [...updated, { text: step.log, active: true }];
        });
        setHudTelemetry(step.telemetry);
        setHudPilot(step.pilot);
      }, step.time);
      activeTimersRef.current.push({ id: t, type: "timeout" });
    });

    const successTimeout = setTimeout(() => {
      setModalStep(3);
      setDroneBlipStyle({
        top: "35px",
        left: "60px",
        transition: ""
      });
    }, 11500);
    activeTimersRef.current.push({ id: successTimeout, type: "timeout" });
  };

  return (
    <>
      {/* Floating Bouncing FAB (Order Button) */}
      <button className="floating-cta" onClick={openOrderModal} aria-label="Order Dosa Now">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
        <span>Order Now</span>
      </button>

      {/* ==========================================================================
           NAVIGATION HEADER
           ========================================================================== */}
      <header id="header" className={scrolled ? "scrolled" : ""}>
        <div className="container nav-container">
          <a href="#" className="logo" aria-label="AirDosa Home">
            {/* Logo SVG Drone Icon */}
            <svg className="logo-drone" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="16" fill="url(#dosaGrad)" />
              <path d="M50 34 V12 M50 66 V88 M34 50 H12 M66 50 H88" stroke="#00f0ff" strokeWidth="4" strokeLinecap="round" />
              <circle cx="50" cy="12" r="6" fill="#ff7a00" />
              <circle cx="50" cy="88" r="6" fill="#ff7a00" />
              <circle cx="12" cy="50" r="6" fill="#ff7a00" />
              <circle cx="88" cy="50" r="6" fill="#ff7a00" />
              <defs>
                <linearGradient id="dosaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff9f43" />
                  <stop offset="100%" stopColor="#ff3d00" />
                </linearGradient>
              </defs>
            </svg>
            Air<span>Dosa</span>
          </a>
          
          <ul className={`nav-menu ${menuActive ? "active" : ""}`} id="navMenu">
            <li><a href="#features" className="nav-link" onClick={toggleMenu}>System Features</a></li>
            <li><a href="#tech" className="nav-link" onClick={toggleMenu}>Aerospace Tech</a></li>
            <li><a href="#pricing" className="nav-link" onClick={toggleMenu}>Pricing Plans</a></li>
          </ul>

          <div className="nav-cta">
            <button className="btn btn-secondary" onClick={openOrderModal}>Dispatch Drone</button>
          </div>

          <button className={`menu-toggle ${menuActive ? "active" : ""}`} id="menuToggle" onClick={toggleMenu} aria-label="Toggle Navigation Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* ==========================================================================
           HERO SECTION
           ========================================================================== */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content reveal">
            <div className="hero-badge">
              <span className="dot"></span> Flight Status: Active & Cruising
            </div>
            <h1 className="hero-title">
              Hypersonic <span className="grad-dosa">Dosa</span> Delivery. <br />
              From Tawa to <span className="grad-drone">Terrace</span>.
            </h1>
            <p className="hero-tagline">
              Skip Bengaluru traffic. AirDosa fuses state-of-the-art autonomous flight engineering with traditional fermentation science to land steaming, crispy ghee roasts directly on your balcony in under 5 minutes.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={openOrderModal}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                Order Flight Now
              </button>
              <a href="#tech" className="btn btn-secondary">
                Aerospace Specs
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <h3>4.3 Min</h3>
                <p>Avg Delivery</p>
              </div>
              <div className="stat-item">
                <h3>Mach 0.7</h3>
                <p>Top Flight Speed</p>
              </div>
              <div className="stat-item">
                <h3>78°C</h3>
                <p>Thermal Lock Temperature</p>
              </div>
            </div>
          </div>

          <div className="hero-media reveal reveal-delay-2">
            <div className="hero-media-wrapper">
              <div className="hero-glow-ring ring-lg"></div>
              <div className="hero-glow-ring ring-md"></div>
              
              {/* Custom-designed futuristic drone holding a steaming rolled dosa */}
              <svg className="drone-illustration" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background Glow Elements (inside SVG for scaling) */}
                <circle cx="250" cy="220" r="100" fill="#00f0ff" opacity="0.1" filter="blur(40px)" />
                <circle cx="250" cy="340" r="80" fill="#ff7a00" opacity="0.15" filter="blur(40px)" />

                {/* Flight Paths/Laser targeting */}
                <line x1="250" y1="260" x2="250" y2="440" stroke="#00f0ff" strokeWidth="2" strokeDasharray="8 8" opacity="0.5" />
                <path d="M 230 440 L 250 450 L 270 440" stroke="#00f0ff" strokeWidth="2" fill="none" opacity="0.8" />
                
                {/* Propeller Arms / Carbon-fiber frame */}
                <path d="M 250 220 L 120 150 M 250 220 L 380 150 M 250 220 L 90 260 M 250 220 L 410 260" stroke="#1f2937" strokeWidth="12" strokeLinecap="round" />
                <path d="M 250 220 L 120 150 M 250 220 L 380 150 M 250 220 L 90 260 M 250 220 L 410 260" stroke="#4b5563" strokeWidth="4" strokeLinecap="round" />
                
                {/* Propeller Motors */}
                <circle cx="120" cy="150" r="14" fill="#111827" stroke="#374151" strokeWidth="4" />
                <circle cx="380" cy="150" r="14" fill="#111827" stroke="#374151" strokeWidth="4" />
                <circle cx="90" cy="260" r="14" fill="#111827" stroke="#374151" strokeWidth="4" />
                <circle cx="410" cy="260" r="14" fill="#111827" stroke="#374151" strokeWidth="4" />

                {/* Spin Propellers (Rotors) */}
                <g className="propeller propeller-fl">
                  <ellipse cx="120" cy="150" rx="35" ry="5" fill="rgba(0, 240, 255, 0.4)" stroke="rgba(0, 240, 255, 0.7)" strokeWidth="1"/>
                </g>
                <g className="propeller propeller-fr">
                  <ellipse cx="380" cy="150" rx="35" ry="5" fill="rgba(0, 240, 255, 0.4)" stroke="rgba(0, 240, 255, 0.7)" strokeWidth="1"/>
                </g>
                <g className="propeller propeller-bl">
                  <ellipse cx="90" cy="260" rx="35" ry="5" fill="rgba(0, 240, 255, 0.4)" stroke="rgba(0, 240, 255, 0.7)" strokeWidth="1"/>
                </g>
                <g className="propeller propeller-br">
                  <ellipse cx="410" cy="260" rx="35" ry="5" fill="rgba(0, 240, 255, 0.4)" stroke="rgba(0, 240, 255, 0.7)" strokeWidth="1"/>
                </g>

                {/* Main Central Avionics Pod */}
                <rect x="200" y="170" width="100" height="90" rx="20" fill="#111827" stroke="#374151" strokeWidth="6" />
                <rect x="204" y="174" width="92" height="82" rx="16" fill="url(#avionicsGrad)" />
                {/* LED Sensor bar */}
                <rect x="220" y="195" width="60" height="8" rx="4" fill="#1f2937" />
                <circle className="led-cyan" cx="230" cy="199" r="3" fill="#00f0ff" />
                <circle className="led-cyan" cx="250" cy="199" r="3" fill="#00f0ff" />
                <circle className="led-cyan" cx="270" cy="199" r="3" fill="#00f0ff" />

                {/* Custom battery pack & power coupling */}
                <path d="M 230 170 L 230 160 H 270 L 270 170" fill="#111827" stroke="#374151" strokeWidth="2" />
                <rect x="240" y="152" width="20" height="8" rx="2" fill="#00f0ff" />

                {/* Steaming Thermal Container Support Brackets */}
                <path d="M 220 260 L 210 300 H 290 L 280 260" fill="none" stroke="#4b5563" strokeWidth="5" strokeLinejoin="round" />
                <path d="M 220 260 L 210 300 H 290 L 280 260" fill="none" stroke="#00f0ff" strokeWidth="1.5" opacity="0.7" />

                {/* Active Cryo-Thermal Pod / Dosa Carrier Capsule */}
                <g>
                  <rect x="180" y="300" width="140" height="70" rx="35" fill="#111827" stroke="#ff7a00" strokeWidth="6" />
                  {/* Glass window on container */}
                  <rect x="200" y="315" width="100" height="40" rx="20" fill="#0c0f17" stroke="rgba(255, 122, 0, 0.3)" strokeWidth="2" />
                  
                  {/* Giant Crispy Rolled Dosa Inside */}
                  <path d="M 215 335 C 220 330, 280 330, 285 335" stroke="url(#dosaCrispGrad)" strokeWidth="20" strokeLinecap="round" />
                  {/* Swirl folds on dosa to look delicious */}
                  <path d="M 230 335 L 245 330 M 260 335 L 275 330" stroke="#b25300" strokeWidth="3" strokeLinecap="round" />
                  
                  {/* Indicator status lights on pod */}
                  <circle className="led-orange" cx="195" cy="335" r="4" fill="#ff7a00" />
                  <circle className="led-cyan" cx="305" cy="335" r="4" fill="#00f0ff" />
                </g>

                {/* Steam rising out from thermal pod vents */}
                <path className="steam-wave steam-1" d="M 215 295 Q 210 280 220 270 T 215 250" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />
                <path className="steam-wave steam-2" d="M 250 295 Q 245 280 255 270 T 250 250" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />
                <path className="steam-wave steam-3" d="M 285 295 Q 280 280 290 270 T 285 250" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />

                {/* Gradients */}
                <defs>
                  <linearGradient id="avionicsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1f2937" />
                    <stop offset="100%" stopColor="#0b0f19" />
                  </linearGradient>
                  <linearGradient id="dosaCrispGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#ffd000" />
                    <stop offset="50%" stopColor="#ff7a00" />
                    <stop offset="100%" stopColor="#b25300" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           FEATURES SECTION
           ========================================================================== */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-subtitle">Intelligent Food Logistics</span>
            <h2 className="section-title">Re-Engineering Dosa Delivery</h2>
          </div>

          <div className="features-grid">
            {/* Feature Card 1 */}
            <div className="feature-card reveal" onMouseMove={handleMouseMove}>
              <div className="icon-box">
                {/* Dosa Grill / Baking AI Icon */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  <path d="M2 12h20"></path>
                </svg>
              </div>
              <h3>TawaAI™ Baking Core</h3>
              <p>Dosa batter expands dynamically. Our on-board neural net continuously measures tawa moisture & heat to pour and spread batter with sub-millimeter precision, achieving the perfect golden crisp ratio.</p>
            </div>

            {/* Feature Card 2 */}
            <div className="feature-card reveal reveal-delay-1" onMouseMove={handleMouseMove}>
              <div className="icon-box">
                {/* Autopilot Speed Icon */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <h3>Hypersonic Autopilot</h3>
              <p>Built to overcome extreme urban density. The AirDosa fleet coordinates via decentralized flight grids, navigating balconies, low-hanging electric cables, and balconies with military-grade LIDAR.</p>
            </div>

            {/* Feature Card 3 */}
            <div className="feature-card reveal reveal-delay-2" onMouseMove={handleMouseMove}>
              <div className="icon-box">
                {/* Duo Thermal Icon */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3>Duo-Temp Thermal Pod</h3>
              <p>No soggy dosas allowed. Active induction heating locks in dosa crispness and sambar steam at 78°C, while an isolated secondary nitrogen-cooler keeps coconut chutney frosty cold at exactly 4°C.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           HOW IT WORKS (TECH FLOW)
           ========================================================================== */}
      <section className="tech-flow" id="tech">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-subtitle">Real-Time Dispatch Flow</span>
            <h2 className="section-title">Order to Bite in 4 Minutes</h2>
          </div>

          <div className="flow-grid">
            <div className="flow-step reveal">
              <div className="flow-num">01</div>
              <h4>Smart Customization</h4>
              <p>Configure golden crispiness, Ghee saturation, and spice metrics on our dynamic application menu.</p>
            </div>
            <div className="flow-step reveal reveal-delay-1">
              <div className="flow-num">02</div>
              <h4>Flight Deck Prep</h4>
              <p>TawaAI™ starts baking inside the drone container pod during takeoff. Drone acquires real-time GPS coordinates.</p>
            </div>
            <div className="flow-step reveal reveal-delay-2">
              <div className="flow-num">03</div>
              <h4>Precision Delivery</h4>
              <p>Drone hovers safely over your selected balcony or rooftop, lowering your thermal pod package via retractable tether.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           PRICING SECTION
           ========================================================================== */}
      <section className="pricing" id="pricing">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-subtitle">Flexible Dispatch Passes</span>
            <h2 className="section-title">Tailored Dosa Subscriptions</h2>
          </div>

          <div className="pricing-grid">
            {/* Plan 1 */}
            <div className="pricing-card reveal">
              <div className="pricing-header">
                <h3>Casual Flyer</h3>
                <p>Perfect for occasional weekend breakfast cravings.</p>
                <div className="pricing-price">
                  ₹199<span className="period">/ month access</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Standard drone priority (10-12m arrival)
                </li>
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Access to Standard Dosa Menu
                </li>
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Live radar flight tracking
                </li>
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  ₹49 flat delivery surcharge per flight
                </li>
              </ul>
              <button className="btn btn-secondary" onClick={openOrderModal}>Get Casual Pass</button>
            </div>

            {/* Plan 2 */}
            <div className="pricing-card premium reveal reveal-delay-1">
              <div className="pricing-header">
                <h3>Tawa Unlimited</h3>
                <p>For hard-core foodies demanding peak crispiness.</p>
                <div className="pricing-price">
                  ₹599<span className="period">/ month</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Priority Mach 0.7 Routing (under 5 mins)
                </li>
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Access to Secret Menu (Podi Roast, Cheese Rava)
                </li>
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Zero flight dispatch surcharges
                </li>
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Unlimited complimentary sambar topups
                </li>
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Dedicated drone drop sound customization
                </li>
              </ul>
              <button className="btn btn-primary" onClick={openOrderModal}>Activate Unlimited</button>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           FOOTER
           ========================================================================== */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="#" className="logo">
                <svg className="logo-drone" viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="50" r="16" fill="url(#dosaGradFooter)" />
                  <path d="M50 34 V12 M50 66 V88 M34 50 H12 M66 50 H88" stroke="#00f0ff" strokeWidth="4" />
                  <circle cx="50" cy="12" r="6" fill="#ff7a00" />
                  <circle cx="50" cy="88" r="6" fill="#ff7a00" />
                  <circle cx="12" cy="50" r="6" fill="#ff7a00" />
                  <circle cx="88" cy="50" r="6" fill="#ff7a00" />
                  <defs>
                    <linearGradient id="dosaGradFooter" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff9f43" />
                      <stop offset="100%" stopColor="#ff3d00" />
                    </linearGradient>
                  </defs>
                </svg>
                Air<span>Dosa</span>
              </a>
              <p>Decentralizing breakfast. Serving the tech capitals of India with aerospace precision tawa technologies.</p>
              <div className="footer-socials">
                <a href="#" className="social-btn" aria-label="Twitter">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="social-btn" aria-label="LinkedIn">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="#" className="social-btn" aria-label="Instagram">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Launch Hubs</h4>
              <ul className="footer-links">
                <li><a href="#">Indiranagar, BLR</a></li>
                <li><a href="#">Koramangala, BLR</a></li>
                <li><a href="#">HSR Layout, BLR</a></li>
                <li><a href="#">Jayanagar, BLR</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Engineering</h4>
              <ul className="footer-links">
                <li><a href="#">TawaAI Engine</a></li>
                <li><a href="#">Hypersonic Avionics</a></li>
                <li><a href="#">Thermal pod patent</a></li>
                <li><a href="#">Safety & Grid API</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <ul className="footer-links">
                <li><a href="#">Careers (We're hiring!)</a></li>
                <li><a href="#">Press Kit</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms & Clearance</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 AirDosa Technologies Pvt Ltd. All rights reserved.</p>
            <div className="regulatory-tag">
              <span className="circle"></span> Approved by DGCA for low-altitude breakfast dispatch
            </div>
          </div>
        </div>
      </footer>

      {/* ==========================================================================
           MODAL SYSTEM (DRONE DEPLOY SIMULATION)
           ========================================================================== */}
      <div 
        className={`modal-overlay ${modalActive ? "active" : ""}`} 
        id="orderModal" 
        onClick={closeOrderModalOutside}
      >
        <div className="modal-box" onClick={e => e.stopPropagation()}>
          <button className="close-modal" onClick={closeOrderModal} aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Step 1: Customize Order */}
          <div className={`modal-step ${modalStep === 1 ? "active" : ""}`} id="modalStep1">
            <h3 className="modal-title">Configure Dosa Payload</h3>
            <p className="modal-desc">Calibrate your flight parameters and select batter crispness metrics.</p>
            
            <div className="form-group">
              <label className="form-label">Dosa Spec</label>
              <div className="dosa-options">
                <div 
                  className={`dosa-card ${selectedDosa === "Classic Masala" ? "selected" : ""}`} 
                  onClick={() => selectDosaCard('Classic Masala', 129)}
                >
                  <span className="dosa-card-icon">🥞</span>
                  <span className="dosa-card-name">Classic Masala</span>
                  <span className="dosa-card-price">₹129</span>
                </div>
                <div 
                  className={`dosa-card ${selectedDosa === "Ghee Podi Roast" ? "selected" : ""}`} 
                  onClick={() => selectDosaCard('Ghee Podi Roast', 149)}
                >
                  <span className="dosa-card-icon">🔥</span>
                  <span className="dosa-card-name">Ghee Podi Roast</span>
                  <span className="dosa-card-price">₹149</span>
                </div>
                <div 
                  className={`dosa-card ${selectedDosa === "Cheese Onion Rava" ? "selected" : ""}`} 
                  onClick={() => selectDosaCard('Cheese Onion Rava', 169)}
                >
                  <span className="dosa-card-icon">🧀</span>
                  <span className="dosa-card-name">Cheese Onion Rava</span>
                  <span className="dosa-card-price">₹169</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Crisp Factor (TawaAI Calibrator)</label>
              <div className="spice-slider">
                <button 
                  className={`spice-btn ${selectedCrispness === "Soft & Fluffy" ? "selected" : ""}`} 
                  onClick={() => selectSpice('Soft & Fluffy')}
                >
                  Soft
                </button>
                <button 
                  className={`spice-btn ${selectedCrispness === "Golden Crispy" ? "selected" : ""}`} 
                  onClick={() => selectSpice('Golden Crispy')}
                >
                  Golden
                </button>
                <button 
                  className={`spice-btn ${selectedCrispness === "Extra Shatter-Crispy" ? "selected" : ""}`} 
                  onClick={() => selectSpice('Extra Shatter-Crispy')}
                >
                  Glass-Crisp
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="balconyCoords">Balcony Coordinates (Rooftop / Balcony Description)</label>
              <input 
                type="text" 
                className="delivery-input" 
                id="balconyCoords" 
                placeholder="e.g. Indiranagar 4th Cross, 3rd Floor, West Balcony (Drone Friendly)"
                value={balconyCoords}
                onChange={e => setBalconyCoords(e.target.value)}
              />
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: "100%", fontSize: "1.1rem", marginTop: "10px" }} 
              onClick={startFlightSimulation}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              Launch Dosa Drone
            </button>
          </div>

          {/* Step 2: Simulation HUD */}
          <div className={`modal-step ${modalStep === 2 ? "active" : ""}`} id="modalStep2">
            <h3 className="hud-title">FLIGHT SYSTEM HUD</h3>
            
            {/* Radar Simulation Graphic */}
            <div className="radar-wrapper">
              <div className="radar-sweep"></div>
              <div className="radar-crosshair-v"></div>
              <div className="radar-crosshair-h"></div>
              <div className="radar-ring radar-ring-1"></div>
              <div className="radar-ring radar-ring-2"></div>
              <div className="radar-ring radar-ring-3"></div>
              <div className="radar-blip-center"></div>
              <div className="radar-blip-drone" style={droneBlipStyle} id="hudDroneBlip"></div>
            </div>

            {/* Telemetry Data */}
            <div className="status-hud">
              <div className="hud-line">
                <span>DRONE PAYLOAD:</span>
                <span className="active" id="hudDosaName">{selectedDosa} ({selectedCrispness})</span>
              </div>
              <div className="hud-line">
                <span>GRID TELEMETRY:</span>
                <span id="hudTelemetry">{hudTelemetry}</span>
              </div>
              <div className="hud-line">
                <span>DRONE AUTOPILOT:</span>
                <span id="hudPilot">{hudPilot}</span>
              </div>
              <div className="hud-line">
                <span>POD THERMALS:</span>
                <span id="hudThermals">INDUCTION ACTIVE (78°C)</span>
              </div>
              
              {/* Progress Bar */}
              <div className="progress-track">
                <div className="progress-bar" style={{ width: `${hudProgressBarWidth}%` }} id="hudProgressBar"></div>
              </div>
            </div>

            {/* Live Terminal logs */}
            <div className="hud-log-window" id="hudLogWindow">
              {hudLogs.map((log, idx) => (
                <div key={idx} className={`log-line ${log.active ? "active" : ""}`}>
                  {log.text}
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Success Screen */}
          <div className={`modal-step ${modalStep === 3 ? "active" : ""}`} id="modalStep3">
            <div className="success-icon">✓</div>
            <h3 className="success-title">Payload Delivered!</h3>
            <p className="success-desc">Drone <b>AD-4902</b> has hovered over your balcony, lowered the capsule, and successfully deployed your piping-hot dosa. Check your outdoor dropzone immediately!</p>
            
            <div style={{ textAlign: "center" }}>
              <button className="btn btn-primary" onClick={resetToStep1}>
                Order Another Flight
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
