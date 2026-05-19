import { Goal, Rocket, Settings, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Title } from "react-head";

const P = "#BB52E0";
const S = "#FF49B5";
const GRAD = `linear-gradient(135deg, ${P}, ${S})`;

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

function Reveal({ children, delay = 0, className = "", style = {} }) {
  const [ref, vis] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

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

export default function AboutPageAR() {
  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "'Cairo', 'DM Sans', sans-serif",
        background: "#fff",
        color: "#111",
        overflowX: "hidden",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <Title>حول | Fa3liat</Title>
      {/* ════ HERO ════ */}
      <section className="relative px-6 py-20 md:py-28 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div
          style={{
            position: "absolute",
            top: -80,
            left: -120,
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
              style={{ color: P, letterSpacing: "0.1em" }}
            >
              عن مهمتنا
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: "clamp(2.2rem,5vw,3.4rem)",
                fontWeight: 800,
                lineHeight: 1.2,
                color: "#0d0d0d",
              }}
            >
              نعيد تعريف كيف{" "}
              <span
                style={{
                  background: GRAD,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                تختبر
              </span>{" "}
              العالم
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p
              className="mt-5 text-base leading-relaxed max-w-md"
              style={{ color: "#555" }}
            >
              <b>Fa3liat</b> ليست مجرد منصة؛ إنها حركة نحو تواصل سلس وعالي
              الطاقة بين من يصنعون اللحظات ومن يعيشونها.
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
            <svg
              viewBox="0 0 420 260"
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="spotG2" cx="50%" cy="30%" r="50%">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <radialGradient id="bgG2" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#2d0050" />
                  <stop offset="100%" stopColor="#0a0015" />
                </radialGradient>
              </defs>
              <rect width="420" height="260" fill="url(#bgG2)" />
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
              <polygon
                points="210,0 160,260 260,260"
                fill="url(#spotG2)"
                opacity="0.18"
              />
              <circle cx="210" cy="30" r="18" fill="#fff" opacity="0.9" />
              <circle cx="210" cy="30" r="30" fill={P} opacity="0.3" />
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
              <circle cx="190" cy="142" r="60" fill={P} opacity="0.06" />
            </svg>
          </div>
        </Reveal>

        <div className="flex-1">
          <Reveal>
            <h2
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: "clamp(1.8rem,3.5vw,2.6rem)",
                fontWeight: 800,
                color: "#0d0d0d",
                lineHeight: 1.3,
              }}
            >
              التواصل السلس
            </h2>
          </Reveal>
          <div className="mt-8 flex flex-col gap-6">
            {[
              {
                icon: <User fill="blue" color="blue" />,
                title: "للمستخدمين",
                desc: "يجب أن يكون اكتشاف التجارب مثيراً كحضورها. واجهتنا مصممة للإلهام الفوري والحجز السلس.",
              },
              {
                icon: <Settings color="green" />,
                title: "للمنظِّمين",
                desc: "وسِّع رؤيتك بأدوات تتولى تعقيدات الإدارة، لتبقى حراً في التركيز على سحر الفعالية.",
              },
              {
                icon: <Goal color="red" />,
                title: "للمديرين",
                desc: "إشراف كامل وتنسيق بيانات فوري. نمنح العمود الفقري لكل معاملة تحكماً لا مثيل له.",
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
            <Reveal className="rounded-2xl p-8" style={{ background: "#fff" }}>
              <p
                style={{
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: "3rem",
                  fontWeight: 800,
                  background: GRAD,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                <Counter to={10} suffix="آلاف+" />
              </p>
              <p className="font-semibold mt-1" style={{ color: "#111" }}>
                فعالية محجوزة
              </p>
              <p
                className="text-sm mt-2 leading-relaxed"
                style={{ color: "#888" }}
              >
                عقد كامل من الذكريات تحقّق في السنتين الأخيرتين فقط.
              </p>
            </Reveal>

            <div className="flex flex-col gap-2">
              <Reveal
                delay={80}
                className="rounded-2xl p-6 flex items-center justify-between"
                style={{ background: "#fff" }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "'Cairo', sans-serif",
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
                    منظِّم نشط
                  </p>
                </div>
                {/* <div className="w-16 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ background: `linear-gradient(135deg, ${P}66, ${S}66)` }}>
                  <svg viewBox="0 0 64 48" width="64" height="48">
                    {[8,16,24,32,40,48,56].map((x,i)=>(<circle key={i} cx={x} cy={24} r={4+Math.sin(i)*3} fill="#fff" opacity={0.5+i*0.07}/>))}
                  </svg>
                </div> */}
              </Reveal>
              <Reveal
                delay={120}
                className="rounded-2xl p-6 flex items-center justify-between"
                style={{ background: "#fff" }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "'Cairo', sans-serif",
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
                    رضا العملاء
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal
              delay={160}
              className="rounded-2xl p-8 flex flex-col justify-between"
              style={{ background: GRAD }}
            >
              <div className="w-10 h-10 rounded-xl bg-white bg-opacity-20 flex items-center justify-center text-xl">
                <Rocket fill="orange" />
              </div>
              <p className="font-bold text-white text-lg mt-6 leading-snug">
                أسرع منصة حجز نمواً في 2026
              </p>
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
                fontFamily: "'Cairo', sans-serif",
                fontSize: "clamp(1.8rem,4vw,2.8rem)",
                fontWeight: 800,
                color: "#fff",
                textAlign: "center",
                marginBottom: "4rem",
              }}
            >
              مسيرتنا
            </h2>
          </Reveal>

          <div className="relative">
            <div
              className="absolute left-1/2 top-0 bottom-0 w-px"
              style={{
                background: `linear-gradient(to bottom, transparent, ${P}, ${S}, transparent)`,
                transform: "translateX(-50%)",
              }}
            />

            {[
              {
                year: "2025",
                side: "right",
                title: "البدايةو الفكرة",
                desc: "بدأت فعليات كمشروع تخرج بفكرة طموحة تهدف لتسهيل اكتشاف الفعاليات وحجز التذاكر بطريقة أسرع وأسهل وأكثر تنظيمًا للمستخدمين.",
              },
              {
                year: "",
                side: "left",
                title: "٩ شهور من التطوير",
                desc: "من شهر أكتوبر وحتى الآن، مرّ المشروع بمراحل متواصلة من التصميم والتطوير والاختبار لتحويل الفكرة إلى منصة متكاملة لحجز وإدارة الفعاليات.",
              },
              {
                year: "2026",
                side: "right",
                title: "الرؤية المستقبلية",
                desc: "فعليات ليس مجرد مشروع جامعي، بل خطوة أولى نحو بناء منصة حديثة تربط بين منظمي الفعاليات والمستخدمين من خلال تجربة حجز سلسة وعصرية.",
              },
            ].map((item, i) => (
              <Reveal
                key={i}
                delay={i * 120}
                className={`flex items-center gap-6 mb-16 ${item.side === "left" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex-1 ${item.side === "left" ? "text-right" : "text-left"}`}
                >
                  <p
                    className="font-bold text-white text-lg mb-1"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
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
                <div
                  className={`flex-shrink-0 z-10 ${i==1?"w-6 h-6":"w-12 h-12"} rounded-full flex items-center justify-center font-bold text-white text-xs`}
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
                فريقنا
              </span>
            </Reveal>
            <Reveal delay={60}>
              <h2
                style={{
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: "clamp(1.8rem,4vw,2.8rem)",
                  fontWeight: 800,
                  color: "#0d0d0d",
                }}
              >
                العقول التي تصنع
                <br />
                السحر
              </h2>
            </Reveal>
          </div>
          <Reveal delay={100}>
            <button
              className="text-sm font-semibold flex items-center gap-1 transition-opacity hover:opacity-70"
              style={{ color: P }}
            ></button>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            {
              name: "علي مجدي ابو المحاسن",
              role: "Team leader ",
              img: "https://avatars.githubusercontent.com/u/166527591?v=4",
            },
            {
              name: "محمد هشام وهبه",
              role: "Backend developer ",
              img: "/images/MuhammedHesham.png",
            },
            {
              name: "محمد اشرف",
              role: "Backend developer ",
              img: `/images/MohammedAshraf.png`,
            },
            {
              name: "عمرو خالد اسماعيل",
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
