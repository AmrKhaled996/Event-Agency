import { Goal, Settings, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Title } from "react-head";

/* ── Palette ── */
const P = "#BB52E0";
const S = "#FF49B5";
const GRAD = `linear-gradient(135deg, ${P}, ${S})`;

/* ── Reusable fade-in on scroll ── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = "" ,style = {}}) {
  const [ref, vis] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        ...style
      }}
    >
      {children}
    </div>
  );
}

/* ── Animated counter ── */
function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const [ref, vis] = useReveal();
  useEffect(() => {
    if (!vis) return;
    let start = 0;
    const step = Math.ceil(to / 60);
    const t = setInterval(() => {
      start = Math.min(start + step, to);
      setVal(start);
      if (start >= to) clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, [vis, to]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/* ── Main ── */
export default function AboutPage() {
  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "#fff",
        color: "#111",
        overflowX: "hidden",
      }}
    >
      <Title>About Us | Fa3liat</Title>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap"
        rel="stylesheet"
      />

      {/* ════ HERO ════ */}
      <section className="relative px-6 py-20 md:py-28 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* bg blob */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${P}22, transparent 70%)`,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        <div className="relative z-10 flex-1">
          <Reveal>
            <span
              className="text-xs font-semibold tracking-widest uppercase mb-4 block"
              style={{ color: P }}
            >
              About Our Mission
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(2.4rem,5vw,3.6rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                color: "#0d0d0d",
              }}
            >
              Redefining How You{" "}
              <span
                style={{
                  background: GRAD,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Experience
              </span>{" "}
              the World
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p
              className="mt-5 text-base leading-relaxed max-w-md"
              style={{ color: "#555" }}
            >
              Fa3liat isn't just a platform; it's a movement towards seamless,
              high-energy connections between the people who create moments and
              those who live them.
            </p>
          </Reveal>
        </div>

        <Reveal
          delay={200}
          className="relative z-10 flex-1 flex justify-center"
        >
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              width: "100%",
              maxWidth: 420,
              aspectRatio: "16/10",
              background: `linear-gradient(160deg, ${P}44, ${S}55)`,
              boxShadow: `0 24px 80px ${P}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Concert crowd illustration */}
            <svg
              viewBox="0 0 420 260"
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="spotG" cx="50%" cy="30%" r="50%">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <radialGradient id="bgG" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#2d0050" />
                  <stop offset="100%" stopColor="#0a0015" />
                </radialGradient>
              </defs>
              <rect width="420" height="260" fill="url(#bgG)" />
              {/* crowd silhouettes */}
              {[
                20, 50, 80, 110, 140, 170, 200, 230, 260, 290, 320, 350, 380,
              ].map((x, i) => (
                <ellipse
                  key={i}
                  cx={x}
                  cy={240}
                  rx={12}
                  ry={28 + Math.sin(i) * 8}
                  fill={`${i % 2 === 0 ? P : S}88`}
                />
              ))}
              {/* spotlight beam */}
              <polygon
                points="210,0 160,260 260,260"
                fill="url(#spotG)"
                opacity="0.18"
              />
              {/* stage light */}
              <circle cx="210" cy="30" r="18" fill="#fff" opacity="0.9" />
              <circle cx="210" cy="30" r="30" fill={P} opacity="0.3" />
              {/* floating orbs */}
              {[
                [60, 60],
                [350, 80],
                [120, 110],
                [300, 100],
              ].map(([cx, cy], i) => (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={6 - i}
                  fill={S}
                  opacity={0.5 - i * 0.08}
                />
              ))}
            </svg>
          </div>
        </Reveal>
      </section>

      {/* ════ SEAMLESS CONNECTION ════ */}
      <section className="max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-14">
        <Reveal delay={0} className="flex-1">
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              width: "100%",
              maxWidth: 380,
              aspectRatio: "4/3",
              background: `linear-gradient(135deg, #1a1a2e, #16213e)`,
              position: "relative",
              boxShadow: "0 20px 60px #00000033",
            }}
          >
            {/* Team meeting illustration */}
            <svg
              viewBox="0 0 380 285"
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="380" height="285" fill="#1a1a2e" />
              <rect
                x="40"
                y="140"
                width="300"
                height="120"
                rx="8"
                fill="#242448"
              />
              {/* people */}
              {[80, 160, 220, 300].map((x, i) => (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={110}
                    r={22}
                    fill={i % 2 === 0 ? "#2d2d5e" : "#3d1f5e"}
                  />
                  <ellipse
                    cx={x}
                    cy={90}
                    rx={10}
                    ry={12}
                    fill={`${i % 2 === 0 ? P : S}bb`}
                  />
                  <rect
                    x={x - 18}
                    y={120}
                    width={36}
                    height={40}
                    rx={8}
                    fill={i % 2 === 0 ? "#2d2d5e" : "#3d1f5e"}
                  />
                </g>
              ))}
              <rect
                x="100"
                y="165"
                width="180"
                height="8"
                rx="4"
                fill={P}
                opacity="0.4"
              />
              <rect
                x="130"
                y="185"
                width="120"
                height="6"
                rx="3"
                fill={S}
                opacity="0.3"
              />
              {/* glow */}
              <circle cx="190" cy="142" r="60" fill={P} opacity="0.06" />
            </svg>
          </div>
        </Reveal>

        <div className="flex-1">
          <Reveal>
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(1.8rem,3.5vw,2.6rem)",
                fontWeight: 800,
                color: "#0d0d0d",
                lineHeight: 1.15,
              }}
            >
              The Seamless
              <br />
              Connection
            </h2>
          </Reveal>
          <div className="mt-8 flex flex-col gap-6">
            {[
              {
                icon: <User fill="blue" color="blue" />,
                title: "For Users",
                desc: "Discovering experiences should be as thrilling as attending them. Our interface is designed for instant inspiration and effortless booking.",
              },
              {
                icon: <Settings  color="green" />,
                title: "For Organizers",
                desc: "Scale your vision with tools that handle the complexity of management, leaving you free to focus on the magic of the event.",
              },
              {
                icon: <Goal color="red" />,
                title: "For Admins",
                desc: "Complete oversight and real-time data orchestration. We empower the backbone of every transaction with unparalleled control.",
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="flex gap-4 items-start">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: `${P}18`, border: `1px solid ${P}33` }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p
                      className="font-semibold text-sm mb-1"
                      style={{ color: "#111" }}
                    >
                      {item.title}
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#666" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════ STATS ════ */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div
          className="rounded-3xl p-2"
          style={{
            background: "linear-gradient(135deg, #f9f0ff, #fff0f9)",
            border: `1px solid ${P}22`,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {/* Stat 1 */}
            <Reveal className="rounded-2xl p-8 bg-white">
              <p
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "3rem",
                  fontWeight: 800,
                  background: GRAD,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                <Counter to={10} suffix="k+" />
              </p>
              <p className="font-semibold mt-1" style={{ color: "#111" }}>
                Events Booked
              </p>
              <p
                className="text-sm mt-2 leading-relaxed"
                style={{ color: "#888" }}
              >
                A decade's worth of memories created in just the last two years.
              </p>
            </Reveal>

            {/* Stat 2 col */}
            <div className="flex flex-col gap-2">
              <Reveal
                delay={80}
                className="rounded-2xl p-6 flex items-center justify-between bg-white"
                
              >
                <div>
                  <p
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: "2.4rem",
                      fontWeight: 800,
                      background: GRAD,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    <Counter to={500} suffix="+" />
                  </p>
                  <p
                    className="text-sm font-medium mt-1"
                    style={{ color: "#444" }}
                  >
                    Active Organizers
                  </p>
                </div>
                
              </Reveal>
              <Reveal
                delay={120}
                className="rounded-2xl p-6 flex items-center justify-between bg-white"
                  
              >
                <div>
                  <p
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: "2.4rem",
                      fontWeight: 800,
                      color: "#111",
                    }}
                  >
                    <Counter to={98} suffix="%" />
                  </p>
                  <p
                    className="text-sm font-medium mt-1"
                    style={{ color: "#444" }}
                  >
                    Customer Satisfaction
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Stat 3 */}
            <Reveal
              delay={160}
              className="rounded-2xl p-8 flex flex-col justify-between"
              style={{ background: GRAD }}
            >
              <div className="w-10 h-10 rounded-xl bg-white bg-opacity-20 flex items-center justify-center text-xl">
                🚀
              </div>
              <div>
                <p className="font-bold text-white text-lg mt-6 leading-snug">
                  Fastest growing booking platform in 2024
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════ JOURNEY TIMELINE ════ */}
      <section className="py-24 mt-8" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(1.8rem,4vw,2.8rem)",
                fontWeight: 800,
                color: "#fff",
                textAlign: "center",
                marginBottom: "4rem",
              }}
            >
              Our Journey
            </h2>
          </Reveal>

          <div className="relative">
            {/* vertical line */}
            <div
              className="absolute left-1/2 top-0 bottom-0 w-px"
              style={{
                background: `linear-gradient(to bottom, transparent, ${P}, ${S}, transparent)`,
                transform: "translateX(-50%)",
              }}
            />

            {[
              {
                year: "2021",
                side: "left",
                title: "The Spark",
                desc: "Fa3liat was founded in a garage with a single massive idea — the Matrix in event discovery.",
              },
              {
                year: "2022",
                side: "right",
                title: "Going Global",
                desc: "Expansion to 35 cities across 3 continents. Our infrastructure scaled to meet the bold demands of global organizers.",
              },
              {
                year: "2024",
                side: "left",
                title: "The Evolution",
                desc: "Introducing VIVAX, our predictive engine that matches users with experiences they didn't even know they wanted.",
              },
            ].map((item, i) => (
              <Reveal
                key={i}
                delay={i * 120}
                className={`flex items-center gap-6 mb-16 ${item.side === "right" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex-1 ${item.side === "right" ? "text-left" : "text-right"}`}
                >
                  <p
                    className="font-bold text-white text-lg mb-1"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#aaa" }}
                  >
                    {item.desc}
                  </p>
                </div>
                {/* dot */}
                <div
                  className="flex-shrink-0 z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-xs"
                  style={{ background: GRAD, boxShadow: `0 0 20px ${P}66` }}
                >
                  {item.year}
                </div>
                <div className="flex-1" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════ TEAM ════ */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <Reveal>
              <span
                className="text-xs font-semibold tracking-widest uppercase block mb-2"
                style={{ color: P }}
              >
                Our People
              </span>
            </Reveal>
            <Reveal delay={60}>
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(1.8rem,4vw,2.8rem)",
                  fontWeight: 800,
                  color: "#0d0d0d",
                }}
              >
                The Minds Behind
                <br />
                the Magic
              </h2>
            </Reveal>
          </div>
          <Reveal delay={100}>
            <button
              className="text-sm font-semibold flex items-center gap-1 transition-opacity hover:opacity-70"
              style={{ color: P }}
            >
              View All Positions <span>→</span>
            </button>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            {
              name: "Ali Magdy",
              role: "Team leader ",
              img: "https://avatars.githubusercontent.com/u/166527591?v=4",
            },
            {
              name: "Muhammad Hesham",
              role: "Backend developer ",
              img: "https://avatars.githubusercontent.com/u/166527591?v=4",
            },
            {
              name: "Mohammad Ashraf",
              role: "Backend developer ",
              img: "https://avatars.githubusercontent.com/u/166527591?v=4",
            },
            {
              name: "Amr Mahanna",
              role: "Frontend developer",
              img: "https://avatars.githubusercontent.com/u/177994139?v=4",
            },
          ].map((person, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="group cursor-pointer">
                <div
                  className="rounded-2xl overflow-hidden mb-4"
                  style={{
                    aspectRatio: "3/4",
                    background: `linear-gradient(160deg, #1c1c2e, #2a1040)`,
                    position: "relative",
                  }}
                >
                  <img
                    src={person.img}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />

                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(to top, ${P}88, transparent)`,
                    }}
                  />
                </div>
                <p
                  className="font-semibold text-sm"
                  style={{ color: "#0d0d0d" }}
                >
                  {person.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#888" }}>
                  {person.role}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

    
    </div>
  );
}
