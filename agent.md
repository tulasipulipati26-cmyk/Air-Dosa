# AirDosa Landing Page Agent Specification

This document details the design system, structure, and interactive components implemented for the **AirDosa** landing page in response to the user request.

---

## Original Prompt
> Create a modern animated landing page for a fictional Indian startup called "AirDosa" — an AI-powered instant dosa delivery drone service. Include: hero section with big headline and tagline, 3 feature cards with icons, pricing section with 2 plans, and a footer. Add smooth scroll animations and a floating "Order Now" button that bounces. Everything in one index.html file.

---

## Technical Overview & Design Details

### 1. Visual Aesthetics
* **Theme**: Cyberpunk-inspired South Indian tech theme. Deep obsidian background (`#07090e`) with active light panels.
* **Accents**:
  * **Hot Golden Orange** (`linear-gradient(135deg, #ff8a00, #ff3d00)`): Represents fresh, crispy dosas off the tawa.
  * **Neon Tech Cyan** (`linear-gradient(135deg, #00f0ff, #0072ff)`): Represents aerospace avionics and AI flight routing.
* **Typography**: Modern typography utilizing Google Fonts `Outfit` (Headings) and `Plus Jakarta Sans` (Body).
* **Glassmorphic Cards**: Features high-blur backdrop filters, glowing border rings, and mouse-aligned hover coordinates.

---

## Core Components (in [index.html](file:///c:/Users/6LABSYSTEM07/Downloads/gnanalytica%20project/index.html))

### 1. Navigation Bar
* Sticky glassmorphic design that dynamically shrinks on scroll.
* Futuristic custom-animated drone SVG logo.

### 2. Hero Section
* **Headline**: *"Hypersonic Dosa Delivery. From Tawa to Terrace."*
* **Tagline**: Fully detailed copy contextualizing autonomous fermentation and low-altitude flight paths.
* **Vector Art**: Scalable inline SVG drone holding a steaming rolled dosa within a thermal induction capsule.
* **Rotors**: CSS-animated high-speed rotor spins.
* **Steam**: Rising path animations to simulate freshly prepared food.

### 3. Features Section (3 Cards)
* **TawaAI™ Baking Core**: Sub-millimeter batter dispensation.
* **Hypersonic Autopilot**: LIDAR-guided flight paths avoiding Bangalore traffic.
* **Duo-Temp Thermal Pod**: Active 78°C heating and nitrogen 4°C chilling chambers.

### 4. Tech Flow Timeline
* Graphic representation of the delivery chain: Customization -> Baking & Takeoff -> Balcony Drop-off.

### 5. Pricing Section (2 Plans)
* **Casual Flyer**: Flexible ₹199 pay-as-you-fly tier.
* **Tawa Unlimited**: Priority ₹599 premium subscription with zero delivery fees and priority routing.

### 6. Floating Action Button (FAB)
* Persistent floating button in the bottom right corner with a continuous keyframe bounce animation (`floatButtonBounce`), opening the Dispatch HUD on click.

### 7. Interactive Dosa Dispatch HUD Simulator
* **Configurator**: Dynamic choice cards (Classic Masala, Ghee Podi Roast, Onion Rava Dosa) and crisp-factor controls.
* **Active Radar**: Conic-gradient sweeping radar display with animating blips tracking the drone path.
* **Live Telemetry & Logs**: Ticks up altitude, tracks coordinates, and prints progress status logs dynamically.

---

## How to Run
Simply double-click the [index.html](file:///c:/Users/6LABSYSTEM07/Downloads/gnanalytica%20project/index.html) file to open it in any web browser.
