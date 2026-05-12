import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=DM+Sans:wght@300;400;500;600&family=Hind+Siliguri:wght@400;500;600&display=swap');`;

const CITIES = [
  { name: "Dhaka", bn: "ঢাকা", count: 1842, color: "#1B4332", img: "🏙️", tag: "Capital City" },
  { name: "Rajshahi", bn: "রাজশাহী", count: 634, color: "#2D6A4F", img: "🎓", tag: "University City" },
  { name: "Chittagong", bn: "চট্টগ্রাম", count: 987, color: "#40916C", img: "⚓", tag: "Port City" },
  { name: "Sylhet", bn: "সিলেট", count: 412, color: "#52B788", img: "🍃", tag: "Tea Country" },
  { name: "Khulna", bn: "খুলনা", count: 328, color: "#74C69D", img: "🦁", tag: "Gateway City" },
  { name: "Mymensingh", bn: "ময়মনসিংহ", count: 219, color: "#95D5B2", img: "🌿", tag: "Agri Capital" },
];

const PROPERTIES = [
  {
    id: 1, title: "Modern Bachelor Flat", area: "Rajpara, Rajshahi",
    type: "Bachelor Flat", rent: 6500, rooms: 2, baths: 1,
    wifi: true, furnished: true, verified: true, gender: "Male",
    tags: ["WiFi", "Furnished", "Near RUET"],
    badge: "⭐ Featured",
    university: "Near RUET",
  },
  {
    id: 2, title: "Student Mess – 4 Seats", area: "Kazla, Rajshahi",
    type: "Student Mess", rent: 2800, rooms: 1, baths: 1,
    wifi: true, furnished: false, verified: true, gender: "Male",
    tags: ["WiFi", "Meal Available", "Near RU"],
    badge: "✅ Verified",
    university: "Near RU",
  },
  {
    id: 3, title: "Female Hostel – Premium", area: "Shiroil, Rajshahi",
    type: "Female Hostel", rent: 4200, rooms: 1, baths: 1,
    wifi: true, furnished: true, verified: true, gender: "Female",
    tags: ["WiFi", "CCTV", "Furnished"],
    badge: "🔒 Safe",
    university: "Near RU & RUET",
  },
  {
    id: 4, title: "Family Apartment 3BHK", area: "Uposhohor, Rajshahi",
    type: "Family Apartment", rent: 14000, rooms: 3, baths: 2,
    wifi: false, furnished: false, verified: true, gender: "Family",
    tags: ["Balcony", "Parking", "Gas Line"],
    badge: "🏠 Spacious",
    university: "City Center",
  },
];

const STEPS = [
  { icon: "🔍", title: "Search Your City", desc: "Pick your city, set budget and filters" },
  { icon: "📍", title: "Browse on Map", desc: "View all listings live on interactive map" },
  { icon: "💬", title: "Chat with Owner", desc: "Message directly, no middlemen" },
  { icon: "🏠", title: "Move In Safely", desc: "Verified listings, real photos only" },
];

const STATS = [
  { value: "12,400+", label: "Active Listings" },
  { value: "8 Cities", label: "Covered Across BD" },
  { value: "98%", label: "Verified Properties" },
  { value: "45,000+", label: "Happy Tenants" },
];

const TESTIMONIALS = [
  { name: "Rahim Uddin", role: "RUET Student", text: "Found my mess in 10 minutes. The map view is amazing — I could see exactly how far I was from campus.", avatar: "RU" },
  { name: "Fatema Begum", role: "Job Seeker, Dhaka", text: "As a woman moving alone, the verified female hostels section gave me so much peace of mind.", avatar: "FB" },
  { name: "Karim Hossain", role: "Property Owner", text: "Listed my flat and got 3 tenant requests in 2 days. Best platform in Bangladesh!", avatar: "KH" },
];

function NavBar({ dark, setDark }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? (dark ? "rgba(15,25,20,0.97)" : "rgba(255,254,250,0.97)") : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}` : "none",
      transition: "all 0.35s ease",
      padding: "0 2rem",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #1B4332, #52B788)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏠</div>
          <div>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: dark ? "#E8F5E9" : "#1B4332", letterSpacing: "-0.3px" }}>BashaFinder</span>
            <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: "#F4A261", marginLeft: 4, fontWeight: 600 }}>BD</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {["Find Room", "For Owners", "Cities", "Blog"].map(item => (
            <button key={item} style={{ background: "none", border: "none", padding: "8px 14px", borderRadius: 8, fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: dark ? "rgba(255,255,255,0.8)" : "rgba(27,67,50,0.8)", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => e.target.style.color = dark ? "#fff" : "#1B4332"}
              onMouseLeave={e => e.target.style.color = dark ? "rgba(255,255,255,0.8)" : "rgba(27,67,50,0.8)"}
            >{item}</button>
          ))}
          <button onClick={() => setDark(!dark)} style={{ background: dark ? "rgba(255,255,255,0.1)" : "rgba(27,67,50,0.08)", border: "none", borderRadius: 8, width: 36, height: 36, fontSize: 16, cursor: "pointer", transition: "all 0.2s" }}>{dark ? "☀️" : "🌙"}</button>
          <button style={{ background: "#1B4332", color: "#fff", border: "none", padding: "9px 20px", borderRadius: 10, fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => e.target.style.background = "#2D6A4F"}
            onMouseLeave={e => e.target.style.background = "#1B4332"}
          >List Property</button>
        </div>
      </div>
    </nav>
  );
}

function HeroSection({ dark }) {
  const [city, setCity] = useState("Rajshahi");
  const [type, setType] = useState("All");
  const [budget, setBudget] = useState("Any Budget");
  const [focused, setFocused] = useState(false);

  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: dark
        ? "radial-gradient(ellipse at 60% 0%, #0D2818 0%, #0A1F14 40%, #061209 100%)"
        : "radial-gradient(ellipse at 60% 0%, #D8F3DC 0%, #F0FBF3 40%, #F8F7F2 100%)",
      position: "relative", overflow: "hidden", paddingTop: 80,
    }}>
      {/* Decorative blobs */}
      <div style={{ position: "absolute", top: "8%", right: "6%", width: 380, height: 380, borderRadius: "50%", background: dark ? "rgba(82,183,136,0.06)" : "rgba(27,67,50,0.05)", filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "4%", width: 280, height: 280, borderRadius: "50%", background: dark ? "rgba(244,162,97,0.05)" : "rgba(244,162,97,0.08)", filter: "blur(50px)", pointerEvents: "none" }} />
      {/* Pattern */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle, ${dark ? "rgba(82,183,136,0.05)" : "rgba(27,67,50,0.04)"} 1px, transparent 1px)`, backgroundSize: "32px 32px", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, width: "100%", padding: "0 2rem", textAlign: "center", position: "relative", zIndex: 2 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: dark ? "rgba(82,183,136,0.12)" : "rgba(27,67,50,0.07)", border: `1px solid ${dark ? "rgba(82,183,136,0.2)" : "rgba(27,67,50,0.12)"}`, borderRadius: 100, padding: "6px 16px", marginBottom: 28 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#52B788", display: "inline-block", animation: "pulse 2s infinite" }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: dark ? "#95D5B2" : "#2D6A4F", fontWeight: 500 }}>12,400+ Verified Listings Across Bangladesh</span>
        </div>

        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(42px, 6vw, 78px)", fontWeight: 700, color: dark ? "#E8F5E9" : "#1B4332", lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: 16 }}>
          Find Your Perfect<br />
          <em style={{ fontStyle: "italic", color: "#F4A261" }}>বাসা</em>
          <span style={{ color: dark ? "#95D5B2" : "#40916C" }}> in Bangladesh</span>
        </h1>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: dark ? "rgba(200,230,210,0.7)" : "rgba(27,67,50,0.65)", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7, fontWeight: 400 }}>
          Student mess, bachelor flat, family apartment — search by city, map, university, and budget. No middlemen. Real photos. Safe & verified.
        </p>

        {/* Search Bar */}
        <div style={{
          background: dark ? "rgba(255,255,255,0.06)" : "#fff",
          border: `2px solid ${focused ? "#52B788" : dark ? "rgba(255,255,255,0.1)" : "rgba(27,67,50,0.1)"}`,
          borderRadius: 18, padding: "8px 8px 8px 8px", display: "flex", alignItems: "center", gap: 0,
          maxWidth: 780, margin: "0 auto 20px", transition: "border-color 0.2s",
          boxShadow: focused ? "0 0 0 4px rgba(82,183,136,0.12)" : dark ? "0 8px 40px rgba(0,0,0,0.3)" : "0 8px 40px rgba(27,67,50,0.08)",
        }} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "0 16px" }}>
            <span style={{ fontSize: 20 }}>📍</span>
            <select value={city} onChange={e => setCity(e.target.value)} style={{ background: "none", border: "none", outline: "none", fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: dark ? "#E8F5E9" : "#1B4332", cursor: "pointer", fontWeight: 500, flex: 1 }}>
              {["Rajshahi", "Dhaka", "Chittagong", "Sylhet", "Khulna", "Mymensingh", "Barisal", "Rangpur"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ width: 1, height: 32, background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }} />
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "0 16px" }}>
            <span style={{ fontSize: 18 }}>🏠</span>
            <select value={type} onChange={e => setType(e.target.value)} style={{ background: "none", border: "none", outline: "none", fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: dark ? "#E8F5E9" : "#1B4332", cursor: "pointer", fontWeight: 500, flex: 1 }}>
              {["All Types", "Student Mess", "Bachelor Flat", "Family Apartment", "Female Hostel", "Sublet", "Office Space"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ width: 1, height: 32, background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }} />
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "0 16px" }}>
            <span style={{ fontSize: 18 }}>💰</span>
            <select value={budget} onChange={e => setBudget(e.target.value)} style={{ background: "none", border: "none", outline: "none", fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: dark ? "#E8F5E9" : "#1B4332", cursor: "pointer", fontWeight: 500, flex: 1 }}>
              {["Any Budget", "Under ৳3,000", "৳3K–৳6K", "৳6K–৳12K", "Above ৳12K"].map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <button style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 28px", fontSize: 15, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}
            onMouseEnter={e => e.target.style.transform = "scale(1.02)"}
            onMouseLeave={e => e.target.style.transform = "scale(1)"}
          >🔍 Search</button>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
          {["📚 Near University", "👩 Female Only", "🍽️ Meal Included", "📶 WiFi", "🗺️ Map Search"].map(tag => (
            <button key={tag} style={{ background: "none", border: `1px solid ${dark ? "rgba(82,183,136,0.25)" : "rgba(27,67,50,0.15)"}`, borderRadius: 100, padding: "6px 14px", fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: dark ? "#95D5B2" : "#2D6A4F", cursor: "pointer", transition: "all 0.2s", fontWeight: 500 }}
              onMouseEnter={e => { e.target.style.background = dark ? "rgba(82,183,136,0.12)" : "rgba(27,67,50,0.06)"; }}
              onMouseLeave={e => { e.target.style.background = "none"; }}
            >{tag}</button>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsBar({ dark }) {
  return (
    <section style={{ background: dark ? "#0D2818" : "#1B4332", padding: "32px 2rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
        {STATS.map((s, i) => (
          <div key={i} style={{ textAlign: "center", padding: "8px 0", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 34, fontWeight: 700, color: "#F4A261", letterSpacing: "-0.5px" }}>{s.value}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 4, fontWeight: 400 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CitiesSection({ dark }) {
  const [hovered, setHovered] = useState(null);
  return (
    <section style={{ padding: "80px 2rem", background: dark ? "#0A1F14" : "#F8F7F2" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#52B788", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 10 }}>Explore Bangladesh</p>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 42, fontWeight: 700, color: dark ? "#E8F5E9" : "#1B4332", letterSpacing: "-0.8px", lineHeight: 1.1, margin: 0 }}>Popular Cities</h2>
          </div>
          <button style={{ background: "none", border: `1.5px solid ${dark ? "rgba(82,183,136,0.3)" : "rgba(27,67,50,0.2)"}`, borderRadius: 10, padding: "10px 20px", fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: dark ? "#95D5B2" : "#2D6A4F", cursor: "pointer", fontWeight: 500 }}>View All Cities →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {CITIES.map((city, i) => (
            <div key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              style={{ borderRadius: 18, overflow: "hidden", cursor: "pointer", position: "relative", background: hovered === i ? city.color : dark ? "rgba(255,255,255,0.04)" : "#fff", border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(27,67,50,0.08)"}`, transition: "all 0.35s cubic-bezier(.4,0,.2,1)", transform: hovered === i ? "translateY(-4px)" : "none", boxShadow: hovered === i ? "0 20px 50px rgba(27,67,50,0.2)" : "none", padding: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{city.img}</div>
                  <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, color: hovered === i ? "#fff" : dark ? "#E8F5E9" : "#1B4332", margin: "0 0 4px", letterSpacing: "-0.3px" }}>{city.name}</h3>
                  <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 17, color: hovered === i ? "rgba(255,255,255,0.7)" : dark ? "#95D5B2" : "#2D6A4F", margin: "0 0 12px", fontWeight: 500 }}>{city.bn}</p>
                  <span style={{ display: "inline-block", background: hovered === i ? "rgba(255,255,255,0.18)" : dark ? "rgba(82,183,136,0.12)" : "rgba(27,67,50,0.07)", borderRadius: 100, padding: "4px 12px", fontSize: 12, fontFamily: "'DM Sans', sans-serif", color: hovered === i ? "#fff" : dark ? "#95D5B2" : "#2D6A4F", fontWeight: 500 }}>{city.tag}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700, color: hovered === i ? "#F4A261" : "#F4A261" }}>{city.count}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: hovered === i ? "rgba(255,255,255,0.6)" : dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)", fontWeight: 400 }}>listings</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PropertyCard({ p, dark }) {
  const [hovered, setHovered] = useState(false);
  const typeColors = { "Bachelor Flat": "#1B4332", "Student Mess": "#2D6A4F", "Female Hostel": "#884EA0", "Family Apartment": "#1A5276" };
  const color = typeColors[p.type] || "#1B4332";
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ borderRadius: 18, overflow: "hidden", background: dark ? "rgba(255,255,255,0.04)" : "#fff", border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(27,67,50,0.08)"}`, transition: "all 0.3s ease", transform: hovered ? "translateY(-3px)" : "none", boxShadow: hovered ? "0 16px 40px rgba(27,67,50,0.12)" : "none", cursor: "pointer" }}>
      {/* Image placeholder */}
      <div style={{ height: 180, background: `linear-gradient(135deg, ${color}dd, ${color}88)`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 52 }}>🏠</span>
        <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(255,255,255,0.92)", borderRadius: 8, padding: "4px 10px", fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color }}>
          {p.badge}
        </div>
        <div style={{ position: "absolute", top: 12, right: 12, background: color, borderRadius: 8, padding: "4px 10px", fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#fff" }}>
          {p.gender}
        </div>
      </div>
      <div style={{ padding: "20px 20px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <div>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: dark ? "#E8F5E9" : "#1B4332", margin: "0 0 4px", letterSpacing: "-0.2px" }}>{p.title}</h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: dark ? "rgba(200,230,210,0.55)" : "rgba(27,67,50,0.5)", margin: 0 }}>📍 {p.area}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: "#F4A261" }}>৳{p.rent.toLocaleString()}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: dark ? "rgba(200,230,210,0.4)" : "rgba(0,0,0,0.35)" }}>/month</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, margin: "12px 0", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: dark ? "rgba(200,230,210,0.6)" : "rgba(27,67,50,0.6)" }}>
          <span>🛏 {p.rooms} Room{p.rooms > 1 ? "s" : ""}</span>
          <span>🚿 {p.baths} Bath</span>
          {p.wifi && <span>📶 WiFi</span>}
          {p.furnished && <span>🛋 Furnished</span>}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {p.tags.map(t => <span key={t} style={{ background: dark ? "rgba(82,183,136,0.1)" : "rgba(27,67,50,0.06)", borderRadius: 6, padding: "3px 9px", fontSize: 11, fontFamily: "'DM Sans', sans-serif", color: dark ? "#95D5B2" : "#2D6A4F", fontWeight: 500 }}>{t}</span>)}
        </div>
        <div style={{ borderTop: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, paddingTop: 12, display: "flex", gap: 8 }}>
          <button style={{ flex: 1, background: "#1B4332", color: "#fff", border: "none", borderRadius: 10, padding: "10px", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: "pointer" }}>View Details</button>
          <button style={{ width: 40, background: dark ? "rgba(255,255,255,0.06)" : "rgba(27,67,50,0.06)", border: "none", borderRadius: 10, fontSize: 16, cursor: "pointer" }}>💚</button>
          <button style={{ width: 40, background: "#25D366", border: "none", borderRadius: 10, fontSize: 16, cursor: "pointer" }}>💬</button>
        </div>
      </div>
    </div>
  );
}

function PropertiesSection({ dark }) {
  return (
    <section style={{ padding: "80px 2rem", background: dark ? "#061209" : "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#F4A261", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 10 }}>Hand-Picked</p>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 42, fontWeight: 700, color: dark ? "#E8F5E9" : "#1B4332", letterSpacing: "-0.8px", lineHeight: 1.1, margin: 0 }}>Featured Properties</h2>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["All", "Mess", "Flat", "Hostel", "Family"].map(f => (
              <button key={f} style={{ background: f === "All" ? "#1B4332" : dark ? "rgba(255,255,255,0.06)" : "rgba(27,67,50,0.06)", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: f === "All" ? "#fff" : dark ? "#95D5B2" : "#2D6A4F", cursor: "pointer", fontWeight: 500 }}>{f}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {PROPERTIES.map(p => <PropertyCard key={p.id} p={p} dark={dark} />)}
        </div>
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <button style={{ background: "none", border: `2px solid ${dark ? "rgba(82,183,136,0.4)" : "rgba(27,67,50,0.2)"}`, borderRadius: 14, padding: "14px 40px", fontSize: 16, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: dark ? "#95D5B2" : "#2D6A4F", cursor: "pointer" }}>Browse All Listings →</button>
        </div>
      </div>
    </section>
  );
}

function MapSection({ dark }) {
  return (
    <section style={{ padding: "80px 2rem", background: dark ? "#0A1F14" : "#F0FBF3" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        <div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#52B788", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 14 }}>Live Map Search</p>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 42, fontWeight: 700, color: dark ? "#E8F5E9" : "#1B4332", letterSpacing: "-0.8px", lineHeight: 1.15, margin: "0 0 20px" }}>See Every Room on the Map</h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: dark ? "rgba(200,230,210,0.65)" : "rgba(27,67,50,0.6)", lineHeight: 1.75, marginBottom: 32 }}>View all listings pinned on an interactive map. Filter by distance from your university, bus stand, or office. See nearby landmarks and get directions instantly.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {["📍 Pin-drop precise property locations", "🎓 Distance from universities shown", "🚌 Nearby bus stands & landmarks", "📐 Draw your own search radius"].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: dark ? "rgba(200,230,210,0.8)" : "rgba(27,67,50,0.8)" }}>
                <span style={{ fontSize: 16 }}>✓</span>{f}
              </div>
            ))}
          </div>
          <button style={{ marginTop: 32, background: "#1B4332", color: "#fff", border: "none", borderRadius: 14, padding: "14px 32px", fontSize: 15, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: "pointer" }}>Open Map Search 🗺️</button>
        </div>
        {/* Map mockup */}
        <div style={{ borderRadius: 20, overflow: "hidden", border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(27,67,50,0.1)"}`, background: dark ? "#0D2818" : "#E8F5E9", position: "relative", height: 380 }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(0deg, ${dark ? "rgba(255,255,255,0.03)" : "rgba(27,67,50,0.04)"} 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, ${dark ? "rgba(255,255,255,0.03)" : "rgba(27,67,50,0.04)"} 0px, transparent 1px, transparent 40px)` }} />
          {/* Roads */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <line x1="0" y1="180" x2="100%" y2="180" stroke={dark ? "rgba(255,255,255,0.1)" : "rgba(27,67,50,0.12)"} strokeWidth="8" />
            <line x1="200" y1="0" x2="200" y2="100%" stroke={dark ? "rgba(255,255,255,0.1)" : "rgba(27,67,50,0.12)"} strokeWidth="6" />
            <line x1="0" y1="290" x2="100%" y2="290" stroke={dark ? "rgba(255,255,255,0.07)" : "rgba(27,67,50,0.07)"} strokeWidth="4" />
            <line x1="350" y1="0" x2="350" y2="100%" stroke={dark ? "rgba(255,255,255,0.07)" : "rgba(27,67,50,0.07)"} strokeWidth="4" />
          </svg>
          {/* Map pins */}
          {[[120, 130], [220, 220], [300, 150], [380, 250], [160, 300]].map(([x, y], i) => (
            <div key={i} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-100%)" }}>
              <div style={{ background: i === 0 ? "#F4A261" : "#1B4332", color: "#fff", borderRadius: "10px 10px 2px 10px", padding: "4px 8px", fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
                ৳{[6500, 2800, 4200, 3500, 8000][i].toLocaleString()}
              </div>
            </div>
          ))}
          <div style={{ position: "absolute", bottom: 16, right: 16, background: dark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.9)", borderRadius: 12, padding: "8px 12px", fontSize: 12, fontFamily: "'DM Sans', sans-serif", color: dark ? "#95D5B2" : "#1B4332", fontWeight: 500 }}>
            📍 Rajshahi City
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ dark }) {
  return (
    <section style={{ padding: "80px 2rem", background: dark ? "#061209" : "#fff" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#52B788", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 14 }}>Simple Process</p>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 42, fontWeight: 700, color: dark ? "#E8F5E9" : "#1B4332", letterSpacing: "-0.8px", marginBottom: 56 }}>How BashaFinder Works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, position: "relative" }}>
          <div style={{ position: "absolute", top: 40, left: "12%", right: "12%", height: 2, background: dark ? "rgba(82,183,136,0.15)" : "rgba(27,67,50,0.08)", zIndex: 0 }} />
          {STEPS.map((s, i) => (
            <div key={i} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: dark ? "rgba(82,183,136,0.1)" : "rgba(27,67,50,0.06)", border: `2px solid ${dark ? "rgba(82,183,136,0.2)" : "rgba(27,67,50,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 32 }}>
                {s.icon}
              </div>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#F4A261", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, margin: "-56px auto 28px", fontFamily: "'DM Sans', sans-serif", position: "relative" }}>{i + 1}</div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: dark ? "#E8F5E9" : "#1B4332", marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: dark ? "rgba(200,230,210,0.55)" : "rgba(27,67,50,0.5)", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StudentSection({ dark }) {
  return (
    <section style={{ padding: "80px 2rem", background: dark ? "#0A1F14" : "#1B4332", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle, rgba(82,183,136,0.06) 1px, transparent 1px)`, backgroundSize: "32px 32px" }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <span style={{ display: "inline-block", background: "rgba(244,162,97,0.2)", border: "1px solid rgba(244,162,97,0.3)", borderRadius: 100, padding: "6px 16px", fontSize: 13, color: "#F4A261", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, marginBottom: 20 }}>🎓 For Students</span>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 42, fontWeight: 700, color: "#E8F5E9", letterSpacing: "-0.8px", lineHeight: 1.15, margin: "0 0 20px" }}>Moving to a New City for University?</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "rgba(200,230,210,0.7)", lineHeight: 1.75, marginBottom: 32 }}>We specialize in safe, affordable student messes and hostels near every major university in Bangladesh — RU, RUET, BUET, CU, KU, SUST and more.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
              {[["🎓", "Near Your University", "Filtered by proximity"], ["🔒", "Safe & Verified", "Real photos, no scam"], ["💰", "Budget Friendly", "Starting from ৳1,500"], ["🍽️", "Meal Available", "Full mess facilities"]].map(([icon, title, desc]) => (
                <div key={title} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px 18px" }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#E8F5E9", marginBottom: 4 }}>{title}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(200,230,210,0.5)" }}>{desc}</div>
                </div>
              ))}
            </div>
            <button style={{ background: "#F4A261", color: "#1B4332", border: "none", borderRadius: 14, padding: "14px 32px", fontSize: 15, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, cursor: "pointer" }}>Find Student Mess Now 🎓</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[{ uni: "Rajshahi University", short: "RU", count: 234, dist: "0.5 km", icon: "🏛️" }, { uni: "RUET Rajshahi", short: "RUET", count: 187, dist: "1.2 km", icon: "⚙️" }, { uni: "BUET Dhaka", short: "BUET", count: 312, dist: "0.8 km", icon: "🏗️" }, { uni: "CU Chittagong", short: "CU", count: 156, dist: "0.6 km", icon: "🌊" }].map(u => (
              <div key={u.short} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.09)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>{u.icon}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#52B788", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>{u.short}</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, color: "#E8F5E9", marginBottom: 8, fontWeight: 600, lineHeight: 1.3 }}>{u.uni}</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#F4A261", fontWeight: 600 }}>{u.count} listings</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(200,230,210,0.4)" }}>from {u.dist}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ dark }) {
  return (
    <section style={{ padding: "80px 2rem", background: dark ? "#061209" : "#F8F7F2" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#52B788", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 14 }}>Real Stories</p>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 42, fontWeight: 700, color: dark ? "#E8F5E9" : "#1B4332", letterSpacing: "-0.8px" }}>Loved Across Bangladesh</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{ background: dark ? "rgba(255,255,255,0.04)" : "#fff", border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(27,67,50,0.08)"}`, borderRadius: 20, padding: 28 }}>
              <div style={{ fontSize: 24, marginBottom: 16 }}>{"⭐".repeat(5)}</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: dark ? "rgba(200,230,210,0.75)" : "rgba(27,67,50,0.7)", lineHeight: 1.75, marginBottom: 24, fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #1B4332, #52B788)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff" }}>{t.avatar}</div>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: dark ? "#E8F5E9" : "#1B4332" }}>{t.name}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#52B788", fontWeight: 500 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ dark }) {
  return (
    <section style={{ padding: "80px 2rem", background: dark ? "#0A1F14" : "#E8F5E9" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 48, fontWeight: 700, color: dark ? "#E8F5E9" : "#1B4332", letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 16 }}>
          Own a Property? List it <em style={{ color: "#F4A261", fontStyle: "italic" }}>Free</em>
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: dark ? "rgba(200,230,210,0.65)" : "rgba(27,67,50,0.6)", lineHeight: 1.75, marginBottom: 36 }}>Reach thousands of students and job seekers searching in your city. Get verified, boost your listing, and find tenants faster than ever.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button style={{ background: "#1B4332", color: "#fff", border: "none", borderRadius: 14, padding: "16px 36px", fontSize: 16, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: "pointer" }}>List Your Property Free →</button>
          <button style={{ background: "none", border: "2px solid rgba(27,67,50,0.25)", borderRadius: 14, padding: "16px 28px", fontSize: 16, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: dark ? "#95D5B2" : "#2D6A4F", cursor: "pointer" }}>Learn More</button>
        </div>
      </div>
    </section>
  );
}

function Footer({ dark }) {
  return (
    <footer style={{ background: dark ? "#030D06" : "#1B4332", padding: "60px 2rem 32px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, background: "rgba(82,183,136,0.2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏠</div>
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, color: "#E8F5E9" }}>BashaFinder <span style={{ color: "#F4A261" }}>BD</span></span>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(200,230,210,0.5)", lineHeight: 1.75, maxWidth: 280 }}>Bangladesh's most trusted platform for finding verified rooms, messes, and apartments. Safe, affordable, remote search.</p>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {["Facebook", "WhatsApp", "YouTube"].map(s => <button key={s} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "rgba(200,230,210,0.6)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{s}</button>)}
            </div>
          </div>
          {[["Cities", ["Dhaka", "Rajshahi", "Chittagong", "Sylhet", "Khulna", "Mymensingh"]], ["Property", ["Student Mess", "Bachelor Flat", "Female Hostel", "Family Apt", "Sublet"]], ["Company", ["About Us", "Blog", "Careers", "Contact", "Terms & Privacy"]]].map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "rgba(200,230,210,0.5)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 16 }}>{title}</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map(l => <a key={l} href="#" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(200,230,210,0.7)", textDecoration: "none" }}>{l}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(200,230,210,0.35)", margin: 0 }}>© 2025 BashaFinder BD. Made with ❤️ in Bangladesh.</p>
          <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: "rgba(200,230,210,0.3)", margin: 0 }}>বাংলাদেশের সেরা বাসা খোঁজার প্ল্যাটফর্ম</p>
        </div>
      </div>
    </footer>
  );
}

export default function BashaFinderBD() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = FONTS + `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { transition: background 0.3s; }
      @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      select option { background: #1B4332; color: #fff; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: dark ? "#061209" : "#F8F7F2", minHeight: "100vh", transition: "background 0.3s" }}>
      <NavBar dark={dark} setDark={setDark} />
      <HeroSection dark={dark} />
      <StatsBar dark={dark} />
      <CitiesSection dark={dark} />
      <PropertiesSection dark={dark} />
      <MapSection dark={dark} />
      <HowItWorks dark={dark} />
      <StudentSection dark={dark} />
      <TestimonialsSection dark={dark} />
      <CTASection dark={dark} />
      <Footer dark={dark} />
    </div>
  );
}
