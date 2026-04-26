"use client";

import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { NavBar, NAV_BAR_HEIGHT_PX } from "@/components/layout/NavBar";

ChartJS.register(ArcElement, Tooltip, Legend);

const projects = [
  {
    title: "Olympic Figure Skating Data Analysis (2006–2026)",
    description:
      "This end-to-end analysis of Olympic figure skating (2006–2026) quantifies the balance between technical and artistic performance using a custom 'tech dominance' metric. I built the dataset from scratch and used Python and interactive visuals to reveal how scoring trends have evolved over time.",
    gif: "/images/projects/new-skating.gif",
    mp4: "/images/projects/new-skating.mp4",
    github: "https://github.com/Nupur-Gudigar/olympic-skating-analysis",
    live: "https://nupur-gudigar.github.io/olympic-skating-analysis/",
    tags: [
      "https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white",
      "https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white",
      "https://img.shields.io/badge/Plotly-3F4F75?style=flat-square&logo=plotly&logoColor=white",
      "https://img.shields.io/badge/Jupyter-F37626?style=flat-square&logo=jupyter&logoColor=white",
      "https://img.shields.io/badge/Data%20Visualization-0F6E56?style=flat-square",
      "https://img.shields.io/badge/Data%20Analysis-185FA5?style=flat-square",
      "https://img.shields.io/badge/EDA-533AB7?style=flat-square",
      "https://img.shields.io/badge/Sports%20Analytics-993C1D?style=flat-square",
      "https://img.shields.io/badge/Dataset%20Creation-444441?style=flat-square",
      "https://img.shields.io/badge/Statistical%20Analysis-BA7517?style=flat-square",
      "https://img.shields.io/badge/Data%20Storytelling-993556?style=flat-square",
      "https://img.shields.io/badge/Custom%20Metrics%20Design-3C3489?style=flat-square",
    ],
  },
  {
    title: "SpinTember - The Ultimate Adventure Wheel!",
    description:
      "A cross-platform desktop application built with React, Vite, and Electron that generates randomized activity suggestions through an interactive spinning wheel. Features state management with Redux, webcam integration, and dynamic UI/UX elements. Fun Fact: This was recognized as a winner in the Codedex x GitHub Education September Coding Challenge.",
    gif: "/images/projects/spintember.gif",
    mp4: "/images/projects/spintember.mp4",
    github: "https://github.com/Nupur-Gudigar/Spintember",
    live: "https://nupur-gudigar.github.io/Spintember/",
    tags: [
      "https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB",
      "https://img.shields.io/badge/Electron-47848F?style=flat-square&logo=electron&logoColor=white",
      "https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white",
      "https://img.shields.io/badge/Redux%20Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white",
      "https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=333",
      "https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white",
      "https://img.shields.io/badge/Camera%20API-444441?style=flat-square",
      "https://img.shields.io/badge/Cross--Platform-0F6E56?style=flat-square",
    ],
  },
  {
    title: "Heart Screen",
    description:
      "A full-screen generative art sketch built with p5.js, featuring layered, animated hearts in shifting shades of pink and red. Designed as a minimal, immersive visual experience with continuous motion and responsive scaling. Fun Fact: this project was featured as a Staff Pick and highlighted in the Codedex newsletter.",
    gif: "/images/projects/hear-screen.gif",
    mp4: "/images/projects/hear-screen.mp4",
    github: "https://github.com/Nupur-Gudigar/Heart-Screen",
    live: "https://nupur-gudigar.github.io/Heart-Screen/",
    tags: [
      "https://img.shields.io/badge/p5.js-ED225D?style=flat-square&logo=p5dotjs&logoColor=white",
      "https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=333",
      "https://img.shields.io/badge/Creative%20Coding-533AB7?style=flat-square",
      "https://img.shields.io/badge/Generative%20Art-3F4F75?style=flat-square",
      "https://img.shields.io/badge/Interactive%20Animation-185FA5?style=flat-square",
      "https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white",
      "https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white",
    ],
  },
  {
    title: "Kirby Music Visualizer",
    description:
      "A lightweight audio visualizer built with p5.js and JavaScript, leveraging FFT-based spectrum analysis and beat detection to generate real-time, interactive visuals. Features responsive design, drag-and-drop audio input, and dynamic animations synced to music.",
    gif: "/images/projects/kirby.gif",
    mp4: "/images/projects/kirby.mp4",
    github: "https://github.com/Nupur-Gudigar/Kirby_Visualizer",
    live: "https://nupur-gudigar.github.io/Kirby_Visualizer/",
    tags: [
      "https://img.shields.io/badge/p5.js-ED225D?style=flat-square&logo=p5dotjs&logoColor=white",
      "https://img.shields.io/badge/p5.sound-B5154B?style=flat-square",
      "https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=333",
      "https://img.shields.io/badge/Audio%20Visualization-BA7517?style=flat-square",
      "https://img.shields.io/badge/FFT-3B6D11?style=flat-square",
      "https://img.shields.io/badge/Interactive%20Animation-185FA5?style=flat-square",
      "https://img.shields.io/badge/Music%20Tech-444441?style=flat-square",
    ],
  },
  {
    title: "Visualizing YouTube Data with Plotly",
    description:
      "An exploratory data analysis project visualizing YouTube channel data through interactive Plotly charts. The project examines subscriber distributions, content categories, and channel growth patterns to highlight key trends in platform popularity.",
    gif: "/images/projects/youtube-stats.gif",
    github: "https://github.com/Nupur-Gudigar/youtube-analysis",
    live: "https://colab.research.google.com/github/Nupur-Gudigar/youtube-analysis/blob/main/Visualize_Youtube_Data_with_Plotly.ipynb",
    tags: [
      "https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white",
      "https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white",
      "https://img.shields.io/badge/Plotly-3F4F75?style=flat-square&logo=plotly&logoColor=white",
      "https://img.shields.io/badge/Jupyter-F37626?style=flat-square&logo=jupyter&logoColor=white",
      "https://img.shields.io/badge/Data%20Visualization-0F6E56?style=flat-square",
      "https://img.shields.io/badge/EDA-533AB7?style=flat-square",
    ],
  },
];

const MOTION_DURATION = 0.6;
const STICKER_SIDEBAR_WIDTH = 84;
const SIDEBAR_STICKERS = [
  "/images/Rectangle 164.svg",
  "/images/Rectangle 155.svg",
  "/images/Rectangle 154.svg",
  "/images/Rectangle 157.svg",
  "/images/Rectangle 158.svg",
  "/images/Rectangle 159.svg",
  "/images/Rectangle 160.svg",
  "/images/Rectangle 161.svg",
  "/images/Rectangle 162.svg",
  "/images/Rectangle 163.svg",
  "/images/Rectangle 151.svg",
  "/images/Rectangle 153.svg",
] as const;
const SIDEBAR_REPEAT_COUNT = 18;
const SIDEBAR_ROTATION = [-8, 5, -4, 7, -6, 4, -5, 8, -7, 3, -6, 6] as const;
const SIDEBAR_WIDTH = [56, 58, 54, 60, 57, 62, 56, 59, 54, 60, 57, 61] as const;
const SIDEBAR_X_SHIFT = [-3, 2, -1, 3, -2, 2, -1, 3, -3, 1, -2, 2] as const;
const SIDEBAR_GAP = [8, 10, 6, 12, 8, 10, 7, 11, 7, 10, 8, 12] as const;

type DroppedSticker = {
  id: number;
  src: string;
  x: number;
  y: number;
  rotation: number;
  size: number;
};

type GhostData = {
  visible: boolean;
  src: string;
  x: number;
  y: number;
  size: number;
};

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: MOTION_DURATION },
};

const fadeFromTop = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: MOTION_DURATION },
};

/** Stickers / drag overlays are desktop-only (sidebar is `lg:flex`). */
function useMatchesMinWidth(minWidthPx: number) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width:${minWidthPx}px)`);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [minWidthPx]);
  return matches;
}

function useContainerScale(designWidth: number = 1440) {
  const ref = useRef<HTMLDivElement>(null);
  const [containerScale, setContainerScale] = useState(1);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const availableWidth = entry.contentRect.width;
        const adjustedWidth =
          window.innerWidth >= 1024
            ? Math.max(0, availableWidth - STICKER_SIDEBAR_WIDTH)
            : availableWidth;
        setContainerScale(Math.min(1, adjustedWidth / designWidth));
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [designWidth]);

  return { ref, containerScale };
}

const bioParagraphs = [
  "I'm a data analytics and consulting professional with a background in software engineering basically a bit of a Swiss Army knife when it comes to tech. I hold a Master's Degree in Computer Science (Data Analytics) from the Illinois Institute of Technology, Chicago",
  "I've always been more interested in the full picture not just dashboards and models, but how data turns into decisions people actually enjoy acting on. If it doesn't feel right, I'm probably already redesigning it (yes, in Figma, for fun).",
  "Outside of work, I'm a gamer at heart which honestly explains a lot. Good design, smooth systems, intuitive experiences I care about all of it, probably more than I should.",
] as const;

/** Desktop experience grid: Chicago Public Schools (photo left, card right). */
const CPS_TOP = 1100;
/** Job card / date / connector sit below the photo stamp for horizontal breathing room. */
const CPS_JOB_TOP = CPS_TOP + 72;
const CPS_CARD_H = 260;
const CPS_DESC_TOP = CPS_JOB_TOP + 340;
const CPS_CONNECTOR_TOP = CPS_JOB_TOP + CPS_CARD_H / 2 - 1;

/** Desktop experience grid: Data Science Consultant (job card left, photo right). */
const DS_TOP = 2250;
const DS_JOB_TOP = DS_TOP;
const DS_CONNECTOR_TOP = DS_JOB_TOP + 129;
const DS_DESC_TOP = DS_JOB_TOP + 320;

/** Desktop experience grid: Infosys (photo left, job cards right — CPS-style). */
const INF_TOP = 3500;
const INF_JOB_TOP = INF_TOP;
const INF_CONNECTOR_TOP = INF_JOB_TOP + 231;
const INF_DESC_TOP = INF_JOB_TOP + 480;

/** Shared inline style for date pills at timeline × connector junction (desktop lg). */
const experienceDateBadgeBaseStyle: CSSProperties = {
  position: "absolute",
  left: 728,
  transform: "translateX(-50%)",
  zIndex: 5,
  backgroundColor: "#400909",
  color: "#ffffff",
  borderRadius: 999,
  padding: "6px 20px",
  fontSize: 18,
  fontWeight: 800,
  fontStyle: "italic",
  fontFamily: "var(--font-nunito), Nunito Sans, system-ui, sans-serif",
  whiteSpace: "nowrap",
};

const dataScienceConsultantDescriptionFirstParagraph =
  "As a Data Science Consultant during my summer internship, I worked on an e-learning platform exploring how data can drive user engagement and product decisions.";

const dataScienceConsultantDescriptionSecondParagraph =
  "From building predictive models to designing data workflows and dashboards, my work focused on turning raw data into insights that actually meant something. This was the first time I realized data storytelling was the part I loved most.";

const infosysDescriptionFirstParagraph =
  "My time at Infosys was a journey of growth, from handling system operations to becoming a client facing Technology Analyst working on cloud based data systems for enterprise clients.";

const infosysDescriptionSecondParagraph =
  "I built automation solutions, analyzed production data to improve reliability and efficiency, and collaborated with stakeholders across teams. My team won the Best Team Award for Project Excellence, which was a genuine highlight, good work recognized by the right people.";

const cpsDescription =
  "At Chicago Public Schools, I managed and analyzed assessment data for over 5,000 student records across multiple school sites. I developed data validation workflows, performed trend and variance analysis, and improved data accuracy by identifying gaps in existing processes. The kind of work that isn't glamorous but matters enormously when the data is about kids' education.";

const beyondResumeCities: Array<{
  name: string;
  coords: [number, number];
  isCurrent?: boolean;
}> = [
    { name: "Chicago, IL", coords: [-87.6298, 41.8781], isCurrent: true },
    { name: "Dallas, TX", coords: [-96.797, 32.7767] },
    { name: "Los Angeles, CA", coords: [-118.2437, 34.0522] },
    { name: "San Francisco, CA", coords: [-122.4194, 37.7749] },
    { name: "Aubrey, TX", coords: [-96.9864, 33.3043] },
    { name: "Miami, FL", coords: [-80.1918, 25.7617] },
    { name: "New Jersey, NJ", coords: [-74.1724, 40.7357] },
    { name: "New York, NY", coords: [-74.006, 40.7128] },
  ];

const beyondResumeTimeSplit = [
  { label: "Sleeping", value: 30, color: "#E8635A" },
  { label: "Music", value: 20, color: "#1DB954" },
  { label: "Actually coding", value: 15, color: "#1c1c1e" },
  { label: "Fixing bugs I created", value: 20, color: "#5865F2" },
  { label: "Convincing myself it's a feature", value: 5, color: "#EF9F27" },
  { label: "Gaming", value: 10, color: "#4B1528" },
] as const;

/** Touch / coarse pointers: tap to flip extras photos (desktop keeps hover). */
function toggleExtrasFlipOnTouch(e: React.MouseEvent<HTMLDivElement>) {
  if (typeof window === "undefined") return;
  if (!window.matchMedia("(hover: none)").matches) return;
  const el = e.currentTarget;
  const flipped = el.style.transform.includes("180");
  el.style.transform = flipped ? "rotateX(0deg)" : "rotateX(180deg)";
}

function BeyondResumeSection() {
  const [statesGeo, setStatesGeo] = useState<Array<{ id: string; d: string }>>(
    [],
  );
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [hoveredPin, setHoveredPin] = useState<{
    name: string;
    x: number;
    y: number;
  } | null>(null);
  const [activeSlice, setActiveSlice] = useState<number | null>(null);
  const width = 420;
  const height = 210;

  const projection = useMemo(
    () =>
      geoAlbersUsa()
        .scale(width * 0.86)
        .translate([width / 2, height / 2 + 10]),
    [width, height],
  );

  const pathGenerator = useMemo(() => geoPath(projection), [projection]);

  useEffect(() => {
    let mounted = true;

    fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
      .then((response) => response.json())
      .then((usAtlas: any) => {
        if (!mounted) return;
        const statesFeature = feature(usAtlas, usAtlas.objects.states) as any;
        const rawStates: Array<{ id?: string }> = Array.isArray(
          statesFeature.features,
        )
          ? statesFeature.features
          : [];
        const paths = rawStates
          .map((state) => {
            const d = pathGenerator(state as never);
            if (!d) return null;
            return { id: String(state.id), d };
          })
          .filter((state): state is { id: string; d: string } => state !== null);
        setStatesGeo(paths);
      })
      .catch(() => {
        setStatesGeo([]);
      });

    return () => {
      mounted = false;
    };
  }, [pathGenerator]);

  const chartData = useMemo<ChartData<"doughnut">>(
    () => ({
      labels: beyondResumeTimeSplit.map((item) => item.label),
      datasets: [
        {
          data: beyondResumeTimeSplit.map((item) => item.value),
          backgroundColor: beyondResumeTimeSplit.map((item) => item.color),
          borderColor: "#FAF0DC",
          borderWidth: 2,
          offset: beyondResumeTimeSplit.map((_, idx) =>
            activeSlice === idx ? 8 : 0,
          ),
        },
      ],
    }),
    [activeSlice],
  );

  const chartOptions = useMemo<ChartOptions<"doughnut">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "56%",
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`,
          },
        },
      },
      animation: { duration: 220 },
    }),
    [],
  );

  const getStarPath = (
    cx: number,
    cy: number,
    outerRadius: number,
    innerRadius: number,
  ) => {
    let d = "";
    for (let i = 0; i < 10; i += 1) {
      const angle = (Math.PI / 5) * i - Math.PI / 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      d += `${i === 0 ? "M" : "L"} ${x} ${y} `;
    }
    return `${d}Z`;
  };

  return (
    <section
      id="beyond-resume"
      className="relative w-full max-w-[100%] scroll-mt-28 overflow-x-hidden bg-[#db5e5e] px-4 pb-20 pt-10 md:px-8 md:pb-24"
      aria-label="Beyond the resume"
    >
      <div className="mx-auto w-full min-w-0 max-w-[1240px]">
        <div className="mx-auto w-fit max-w-full text-center lg:mx-0 lg:w-fit lg:-rotate-[0.7deg] lg:text-left">
          <h2
            className="inline-block max-w-full text-balance whitespace-normal lg:whitespace-nowrap"
            style={{
              fontFamily:
                "var(--font-nunito), 'Nunito Sans', system-ui, sans-serif",
              fontSize: "clamp(1.35rem, 4vw, 2.5rem)",
              fontWeight: 800,
              fontStyle: "italic",
              color: "#FAF0DC",
              lineHeight: 1.1,
              background: "#400909",
              padding: "8px 14px",
              display: "inline-block",
            }}
          >
            beyond the resume
          </h2>
          <div
            style={{
              height: 4,
              background: "#FAF0DC",
              marginTop: 6,
              width: "100%",
            }}
          />
          <p
            className="mt-2 max-w-full break-words px-0 text-center font-mono text-sm leading-snug text-balance sm:text-base md:text-[18px] lg:text-left"
            style={{ color: "#ffffff", opacity: 0.8 }}
          >
            some data about the human behind the data
          </p>
        </div>

        <div className="mt-6 grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="min-w-0 rounded-[16px] border-[3px] border-[#1a1a1a] bg-[#FAF0DC] p-4 shadow-[4px_4px_0_#1a1a1a] md:p-5">
            <span className="inline-block rounded bg-[#E8635A] px-3 py-1 font-mono text-[13px] font-bold text-[#FAF0DC]">
              places i&apos;ve been
            </span>
            <div className="relative mt-3 w-full max-w-full overflow-hidden rounded-[10px] bg-[#FAF0DC]">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-auto w-full max-w-full"
                role="img"
                aria-label="Map of the United States with city pins"
                preserveAspectRatio="xMidYMid meet"
              >
                {statesGeo.map((state) => (
                  <path
                    key={state.id}
                    d={state.d}
                    fill="#D4534A"
                    stroke="#FAF0DC"
                    strokeWidth={0.7}
                  />
                ))}
                {beyondResumeCities.map((city) => {
                  const point = projection(city.coords);
                  if (!point) return null;
                  const isActive = hoveredCity === city.name;
                  return (
                    <g
                      key={city.name}
                      className="cursor-pointer transition-all duration-150"
                      onMouseEnter={() => {
                        setHoveredCity(city.name);
                        setHoveredPin({
                          name: city.name,
                          x: point[0],
                          y: point[1],
                        });
                      }}
                      onMouseLeave={() => {
                        setHoveredCity(null);
                        setHoveredPin(null);
                      }}
                    >
                      {city.isCurrent ? (
                        <path
                          d={getStarPath(point[0], point[1], isActive ? 10 : 8, 4.5)}
                          fill={isActive ? "#1a1a1a" : "#FAF0DC"}
                          stroke="#1a1a1a"
                          strokeWidth={1.8}
                        />
                      ) : (
                        <circle
                          cx={point[0]}
                          cy={point[1]}
                          r={isActive ? 8 : 6}
                          fill={isActive ? "#1a1a1a" : "#FAF0DC"}
                          stroke="#1a1a1a"
                          strokeWidth={1.8}
                        />
                      )}
                      <circle cx={point[0]} cy={point[1]} r={11} fill="transparent" />
                    </g>
                  );
                })}
              </svg>
              {hoveredPin ? (
                <div
                  className="pointer-events-none absolute z-10 rounded bg-[#1a1a1a] px-2 py-1 font-mono text-[11px] text-[#FAF0DC] shadow"
                  style={{
                    left: `${(hoveredPin.x / width) * 100}%`,
                    top: `${(hoveredPin.y / height) * 100}%`,
                    transform: "translate(-50%, calc(-100% - 6px))",
                  }}
                >
                  {hoveredPin.name}
                </div>
              ) : null}
            </div>
            <p className="mt-2 font-mono text-[11px] italic text-[#666]">
              {hoveredCity ?? "hover over a pin to see the city"}
            </p>
            <p className="mt-1 font-mono text-[11px] text-[#666]">
              n = {beyondResumeCities.length} cities · data collection ongoing
            </p>
            <p className="mt-0.5 font-mono text-[11px] text-[#666]">
              data gathered from: Nupur&apos;s Life · source: her phone
            </p>
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <div className="min-w-0 rounded-[16px] border-[3px] border-[#1a1a1a] bg-[#FAF0DC] p-4 shadow-[4px_4px_0_#1a1a1a] md:p-5">
              <span className="inline-block rounded bg-[#E8635A] px-3 py-1 font-mono text-[13px] font-bold text-[#FAF0DC]">
                how i spend my time
              </span>
              <div className="relative mx-auto mt-2 h-[min(220px,55vw)] w-full max-w-full min-w-0 sm:h-[220px]">
                <Doughnut
                  data={chartData}
                  options={chartOptions}
                  aria-label="Doughnut chart showing time split"
                />
              </div>
              <div className="mt-3 grid gap-2">
                {beyondResumeTimeSplit.map((item, idx) => (
                  <button
                    key={item.label}
                    type="button"
                    className="flex items-center gap-2 text-left font-mono text-[12px] text-[#3a3a3a]"
                    onMouseEnter={() => setActiveSlice(idx)}
                    onMouseLeave={() => setActiveSlice(null)}
                    onFocus={() => setActiveSlice(idx)}
                    onBlur={() => setActiveSlice(null)}
                  >
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.label} - {item.value}%
                  </button>
                ))}
              </div>
            </div>

            <div className="min-w-0 rounded-[16px] border-[3px] border-[#1a1a1a] bg-[#FAF0DC] p-4 shadow-[4px_4px_0_#1a1a1a] md:p-5">
              <span className="inline-block rounded bg-[#E8635A] px-3 py-1 font-mono text-[11px] font-bold text-[#FAF0DC]">
                fun facts
              </span>
              <div className="mt-3 grid gap-2.5">
                <div className="rounded-r-md border-l-[3px] border-[#E8635A] bg-[#f4e8d0] px-3 py-2">
                  <p className="font-mono text-[12px] text-[#3a3a3a]">
                    lived in 4 countries before 25 and survived an earthquake and a tsunami
                    (turns out i have very good disaster recovery)
                  </p>
                </div>
                <div className="rounded-r-md border-l-[3px] border-[#E8635A] bg-[#f4e8d0] px-3 py-2">
                  <p className="font-mono text-[12px] text-[#3a3a3a]">
                    team secretary of Illinois Tech Esports — NACE level competitive gaming
                    (yes, it&apos;s on my resume. yes, i&apos;m serious. yes, it counts.)
                  </p>
                </div>
                <div className="rounded-r-md border-l-[3px] border-[#E8635A] bg-[#f4e8d0] px-3 py-2">
                  <p className="font-mono text-[12px] text-[#3a3a3a]">
                    makes notion dashboards and spreadsheets for everything — including tracking
                    birthday freebies (the data analyst was not a career choice, it was a
                    diagnosis)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [failedMp4s, setFailedMp4s] = useState<Record<string, boolean>>({});
  const total = projects.length;
  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + total) % total);
  };
  const next = () => {
    setDirection(1);
    setCurrent((c) => (c + 1) % total);
  };
  const goToSlide = (i: number) => {
    if (i === current) return;
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
  };
  const project = projects[current];
  const shouldUseVideo = Boolean(project.mp4) && !failedMp4s[project.title];
  const hasFunFact = project.description.includes("Fun Fact:");
  const useCompactMobileCopy = hasFunFact || project.description.length > 290;
  const isOlympicProject = project.title.includes("Olympic Figure Skating");
  const isKirbyProject = project.title.includes("Kirby Music Visualizer");
  const isYoutubeProject = project.title.includes("Visualizing YouTube Data");
  const isHeartScreenProject = project.title.includes("Heart Screen");

  useEffect(() => {
    projects.forEach((p) => {
      const img = new window.Image();
      img.src = p.gif;
    });
  }, []);

  if (total === 0) return null;

  const navBtnMobileClass =
    "z-10 flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 text-xl text-white shadow-md transition active:scale-95 lg:hidden";
  const navBtnMobileStyle: React.CSSProperties = { backgroundColor: "#400909" };

  const desktopNavBtnStyle: React.CSSProperties = {
    position: "absolute",
    top: "35%",
    transform: "translateY(-50%)",
    backgroundColor: "#400909",
    color: "white",
    border: "none",
    borderRadius: 999,
    width: 48,
    height: 48,
    fontSize: 20,
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  };

  return (
    <div className="relative mx-auto mt-10 w-full max-w-[1200px] px-3 pb-16 sm:px-5 sm:pb-20 md:px-8 lg:px-[60px] lg:pb-0">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-10">
        <div className="relative mx-auto w-full max-w-[1100px]">
          <button
            type="button"
            aria-label="Previous project"
            onClick={prev}
            className="hidden items-center justify-center lg:flex"
            style={{ ...desktopNavBtnStyle, left: -60 }}
          >
            ←
          </button>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex w-full min-w-0 max-w-full flex-col items-center gap-10"
            >
              <div className="relative mx-auto w-full min-w-0 max-w-[1100px]">
                <button
                  type="button"
                  aria-label="Previous project"
                  onClick={prev}
                  className={`${navBtnMobileClass} absolute left-2 top-1/2 -translate-y-1/2`}
                  style={navBtnMobileStyle}
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="Next project"
                  onClick={next}
                  className={`${navBtnMobileClass} absolute right-2 top-1/2 -translate-y-1/2`}
                  style={navBtnMobileStyle}
                >
                  →
                </button>
                <div
                  className="mx-auto w-full min-w-0 max-w-[1100px]"
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "3px solid #1e1e1e",
                    backgroundColor: "#000",
                  }}
                >
                  {shouldUseVideo ? (
                    <video
                      src={project.mp4}
                      autoPlay
                      loop
                      muted
                      playsInline
                      onError={() =>
                        setFailedMp4s((prev) => ({ ...prev, [project.title]: true }))
                      }
                      style={{ width: "100%", height: "auto", display: "block" }}
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.gif}
                      alt={project.title}
                      style={{ width: "100%", height: "auto", display: "block" }}
                    />
                  )}
                </div>
              </div>

              <div
                className="flex w-full min-w-0 max-w-[1100px] flex-col items-stretch justify-center gap-10 lg:flex-row lg:items-stretch"
                style={{ gap: 40, maxWidth: 1100 }}
              >
                <div
                  className="flex min-w-0 flex-1 flex-col items-center lg:items-start"
                  style={{ gap: 16 }}
                >
                  <h3
                    className="m-0 w-full max-w-full text-balance break-words text-center text-[clamp(1.15rem,4.2vw,1.75rem)] font-extrabold italic leading-tight text-white lg:text-left lg:text-[28px]"
                    style={{
                      fontFamily:
                        "var(--font-nunito), Nunito Sans, system-ui, sans-serif",
                    }}
                  >
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap justify-center lg:justify-start">
                    {project.tags.map((badgeUrl, i) => (
                      <Fragment key={i}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={badgeUrl}
                          alt=""
                          className="mb-1 mr-1 inline-block h-[22px]"
                        />
                      </Fragment>
                    ))}
                  </div>
                  <div
                    className="flex flex-wrap justify-center gap-3 lg:justify-start"
                    style={{ marginTop: 4 }}
                  >
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[#1e1e1e] px-7 py-3 text-[15px] font-extrabold italic text-white no-underline transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      <svg
                        aria-hidden
                        className="h-5 w-5 shrink-0"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      GitHub
                    </a>
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border-[3px] border-[#1e1e1e] bg-white px-7 py-3 text-[15px] font-extrabold italic text-[#1e1e1e] no-underline transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1e1e1e] hover:text-white"
                    >
                      <span aria-hidden className="text-base leading-none">
                        ▶
                      </span>
                      Live Site
                    </a>
                  </div>
                </div>

                <div
                  className={`mx-auto w-full max-w-[580px] shrink-0 ${
                    useCompactMobileCopy ? "min-h-[260px]" : ""
                  } lg:mx-0 lg:min-h-0 lg:h-[245px] lg:w-[580px] lg:max-w-full`}
                  style={{
                    flexShrink: 0,
                    backgroundImage: "url('/images/Component_14.svg')",
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div
                    className={`flex h-full items-start justify-center ${
                      isOlympicProject
                        ? "px-9 pb-[40px] pt-[116px]"
                        : isHeartScreenProject
                          ? "px-8 pb-8 pt-[108px]"
                        : isYoutubeProject
                          ? "px-9 pb-[40px] pt-[60px]"
                        : isKirbyProject
                          ? "px-9 pb-[40px] pt-[76px]"
                        : useCompactMobileCopy
                          ? "px-8 pb-8 pt-[100px]"
                          : "px-9 pb-[40px] pt-[108px]"
                    } lg:items-center lg:px-[80px] lg:pb-[24px] lg:pt-[68px]`}
                  >
                    <p
                      className="m-0 w-full break-words text-center [overflow-wrap:anywhere] lg:text-[13px]"
                      style={{
                        fontFamily: "Nunito Sans, sans-serif",
                        fontWeight: 800,
                        fontStyle: "italic",
                        fontSize: useCompactMobileCopy
                          ? "clamp(9px, 2.15vw, 10.5px)"
                          : "clamp(9.5px, 2.3vw, 11px)",
                        lineHeight: useCompactMobileCopy ? 1.28 : 1.35,
                        color: "#1e1e1e",
                      }}
                    >
                      {hasFunFact ? (
                        <>
                          <span style={{ fontWeight: 700 }}>
                            {project.description.split("Fun Fact:")[0].trim()}
                          </span>
                          <span className="block h-2 lg:h-3" />
                          <strong style={{ fontWeight: 900 }}>
                            {"Fun Fact: "}
                            {project.description.split("Fun Fact:")[1].trim()}
                          </strong>
                        </>
                      ) : (
                        project.description
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            aria-label="Next project"
            onClick={next}
            className="hidden items-center justify-center lg:flex"
            style={{ ...desktopNavBtnStyle, right: -60 }}
          >
            →
          </button>
        </div>
      </div>

      <div className="mt-10 flex justify-center gap-2">
        {projects.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goToSlide(i)}
            aria-label={`Go to project ${i + 1}`}
            className="h-3 w-3 rounded-full p-0 transition"
            style={
              current === i
                ? { backgroundColor: "#400909", border: "2px solid #400909" }
                : { backgroundColor: "transparent", border: "2px solid #400909" }
            }
          />
        ))}
      </div>
    </div>
  );
}

const DroppedStickersLayer = memo(function DroppedStickersLayer({
  droppedStickers,
  onRemoveSticker,
}: {
  droppedStickers: DroppedSticker[];
  onRemoveSticker: (id: number) => void;
}) {
  return (
    <div className="pointer-events-none absolute left-0 top-0 z-[220] min-h-full w-full">
      {droppedStickers.map((sticker) => (
        <div
          key={sticker.id}
          data-dropped-sticker-id={sticker.id}
          role="button"
          tabIndex={0}
          onContextMenu={(event) => {
            event.preventDefault();
            onRemoveSticker(sticker.id);
          }}
          className="pointer-events-auto absolute cursor-grab active:cursor-grabbing select-none"
          style={{
            left: sticker.x,
            top: sticker.y,
            width: sticker.size,
            transform: `rotate(${sticker.rotation}deg)`,
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.25))",
          }}
        >
          <img src={encodeURI(sticker.src)} alt="" draggable={false} className="h-auto w-full" />
        </div>
      ))}
    </div>
  );
});

const SidebarStickerRail = memo(function SidebarStickerRail({
  scale,
  repeatedSidebarStickers,
  startSidebarDrag,
}: {
  scale: number;
  repeatedSidebarStickers: string[];
  startSidebarDrag: (event: React.PointerEvent, src: string, index: number) => void;
}) {
  return (
    <aside
      className="absolute left-0 top-0 z-[240] hidden w-[84px] flex-col items-center overflow-hidden border-r border-white/10 bg-white/12 py-2 lg:flex"
      style={{ top: 0, bottom: "70px", overflow: "hidden" }}
    >
      <p className="mb-3 w-full px-3 pt-2 text-center text-[12px] font-extrabold uppercase leading-none tracking-[0.1em] text-[#f2d9d6]/90">
        STICKERS
      </p>
      <div className="flex w-full flex-col items-center pb-24">
        {repeatedSidebarStickers.map((src, index) => {
          const variant = index % SIDEBAR_STICKERS.length;
          return (
            <button
              key={`${src}-${index}`}
              type="button"
              onPointerDown={(event) => startSidebarDrag(event, src, index)}
              className="group cursor-grab border-0 bg-transparent p-0 active:cursor-grabbing"
              style={{
                marginTop: SIDEBAR_GAP[variant],
                transform: `translateX(${SIDEBAR_X_SHIFT[variant]}px) rotate(${SIDEBAR_ROTATION[variant]}deg)`,
                transition: "transform 180ms ease",
              }}
              aria-label="Drag sticker onto page"
            >
              <img
                src={encodeURI(src)}
                alt=""
                draggable={false}
                className="select-none object-contain transition-transform duration-200 ease-out group-hover:scale-110"
                style={{
                  width: SIDEBAR_WIDTH[variant],
                  height: "auto",
                  filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.24))",
                }}
              />
            </button>
          );
        })}
      </div>
    </aside>
  );
});

export default function HeroPage() {
  const desktopStickers = useMatchesMinWidth(1024);
  const [scale, setScale] = useState(1);
  const [droppedStickers, setDroppedStickers] = useState<DroppedSticker[]>([]);
  const [ghostVisible, setGhostVisible] = useState(false);
  const [showStickerHint, setShowStickerHint] = useState<boolean>(true);
  const [viewCount, setViewCount] = useState<number | "loading">("loading");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const SESSION_VIEW_KEY = "portfolio-view-counted-session";

    const parse = (data: unknown) =>
      data !== null && typeof data === "object" && "count" in data
        ? Number((data as { count: unknown }).count)
        : Number.NaN;

    const alreadyCountedThisTab = () => {
      try {
        return window.sessionStorage.getItem(SESSION_VIEW_KEY) === "1";
      } catch {
        return false;
      }
    };

    const markCountedThisTab = () => {
      try {
        window.sessionStorage.setItem(SESSION_VIEW_KEY, "1");
      } catch {
        // private mode / blocked storage — still show count via GET
      }
    };

    const run = async () => {
      if (!alreadyCountedThisTab()) {
        try {
          const res = await fetch("/api/views", {
            method: "POST",
            cache: "no-store",
          });
          if (res.ok) {
            const data: unknown = await res.json();
            const n = parse(data);
            if (!Number.isNaN(n)) {
              markCountedThisTab();
              setViewCount(n);
              return;
            }
          }
        } catch {
          // network or non-JSON error body — try GET
        }
      }
      try {
        const res = await fetch("/api/views", { cache: "no-store" });
        if (res.ok) {
          const data: unknown = await res.json();
          const n = parse(data);
          if (!Number.isNaN(n)) {
            setViewCount(n);
            return;
          }
        }
      } catch {
        // ignore
      }
      setViewCount(0);
    };

    void run();
  }, []);

  const ghostRef = useRef<HTMLDivElement>(null);
  const ghostDataRef = useRef<GhostData>({ visible: false, src: "", x: 0, y: 0, size: 56 });
  const stickerIdRef = useRef(1);
  const dragStartedFromSidebarRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const dragMoveRafRef = useRef<number | null>(null);
  const pendingDragPosRef = useRef<{ x: number; y: number } | null>(null);
  const glowActive = true;
  const repeatedSidebarStickers = useMemo(() => {
    const list: string[] = [];
    for (let i = 0; i < SIDEBAR_REPEAT_COUNT; i += 1) list.push(...SIDEBAR_STICKERS);
    return list;
  }, []);
  const { ref: extrasContainerRef, containerScale: extrasContainerScale } =
    useContainerScale();
  const { ref: contactContainerRef, containerScale: contactContainerScale } =
    useContainerScale();

  useEffect(() => {
    const updateScale = () => {
      setScale(window.innerWidth >= 1024 ? 0.8 : 1);
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const clampFromSidebarIndex = useCallback((index: number) => {
    const variant = index % SIDEBAR_STICKERS.length;
    return {
      size: SIDEBAR_WIDTH[variant],
      rotation: SIDEBAR_ROTATION[variant],
    };
  }, []);
  const clampStickerX = useCallback((x: number) => Math.max(STICKER_SIDEBAR_WIDTH, x), []);
  const setGhostPosition = useCallback((x: number, y: number) => {
    const node = ghostRef.current;
    if (!node) return;
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
  }, []);
  const removeSticker = useCallback((id: number) => {
    setDroppedStickers((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const startSidebarDrag = useCallback(
    (event: React.PointerEvent, src: string, index: number) => {
      if (event.button !== 0) return;
      event.preventDefault();
      setShowStickerHint(false);
      const { size } = clampFromSidebarIndex(index);
      dragStartedFromSidebarRef.current = true;
      const nextGhost: GhostData = {
        visible: true,
        src,
        size,
        x: event.clientX - size / 2,
        y: event.clientY - size / 2,
      };
      ghostDataRef.current = nextGhost;
      setGhostVisible(true);
      setGhostPosition(nextGhost.x, nextGhost.y);
    },
    [clampFromSidebarIndex, setGhostPosition],
  );

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const ghost = ghostDataRef.current;
      if (!dragStartedFromSidebarRef.current && !ghost.visible) return;
      if (!ghost.visible) return;
      ghost.x = event.clientX - ghost.size / 2;
      ghost.y = event.clientY - ghost.size / 2;
      setGhostPosition(ghost.x, ghost.y);
    };

    const onUp = (event: PointerEvent) => {
      const ghost = ghostDataRef.current;
      if (ghost.visible) {
        if (event.clientX > STICKER_SIDEBAR_WIDTH) {
          const newId = stickerIdRef.current;
          stickerIdRef.current += 1;
          const size = ghost.size;
          const nextX = clampStickerX(event.clientX + window.scrollX - size / 2);
          setDroppedStickers((prev) => [
            ...prev,
            {
              id: newId,
              src: ghost.src,
              x: nextX,
              y: event.clientY + window.scrollY - size / 2,
              rotation: Math.round((Math.random() * 16 - 8) * 10) / 10,
              size,
            },
          ]);
        }
        ghost.visible = false;
        setGhostVisible(false);
      }
      dragStartedFromSidebarRef.current = false;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [clampStickerX, setGhostPosition]);

  useEffect(() => {
    let draggingId: number | null = null;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const stickerNode = target.closest("[data-dropped-sticker-id]");
      if (!stickerNode) return;
      const idText = stickerNode.getAttribute("data-dropped-sticker-id");
      if (!idText) return;
      const id = Number(idText);
      if (!Number.isFinite(id)) return;
      draggingId = id;
      const rect = stickerNode.getBoundingClientRect();
      dragOffsetRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      if (draggingId === null) return;
      pendingDragPosRef.current = {
        x: clampStickerX(event.clientX + window.scrollX - dragOffsetRef.current.x),
        y: event.clientY + window.scrollY - dragOffsetRef.current.y,
      };
      if (dragMoveRafRef.current !== null) return;
      dragMoveRafRef.current = window.requestAnimationFrame(() => {
        const next = pendingDragPosRef.current;
        if (draggingId !== null && next) {
          setDroppedStickers((prev) =>
            prev.map((sticker) =>
              sticker.id === draggingId
                ? {
                  ...sticker,
                  x: next.x,
                  y: next.y,
                }
                : sticker,
            ),
          );
        }
        dragMoveRafRef.current = null;
      });
    };

    const onPointerUp = () => {
      draggingId = null;
      pendingDragPosRef.current = null;
      if (dragMoveRafRef.current !== null) {
        window.cancelAnimationFrame(dragMoveRafRef.current);
        dragMoveRafRef.current = null;
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      if (dragMoveRafRef.current !== null) {
        window.cancelAnimationFrame(dragMoveRafRef.current);
        dragMoveRafRef.current = null;
      }
    };
  }, [clampStickerX]);

  return (
    <div className="relative min-h-screen w-full select-none bg-[#db5e5e] overflow-y-visible overflow-x-hidden lg:overflow-x-visible">
      {/* Mobile hamburger — outside zoomed container */}
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setMobileMenuOpen(true)}
        className="fixed right-4 top-4 z-[9999] flex h-14 w-14 flex-col items-center justify-center gap-[5px] rounded-full bg-[#400909] shadow-[0_0_0_3px_#FAF0DC] lg:hidden"
      >
        <span className="block h-[2.5px] w-5 rounded-full bg-[#FAF0DC]" />
        <span className="block h-[2.5px] w-5 rounded-full bg-[#FAF0DC]" />
        <span className="block h-[2.5px] w-5 rounded-full bg-[#FAF0DC]" />
      </button>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-8 bg-[#400909] lg:hidden"
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-4 top-4 flex h-14 w-14 items-center justify-center rounded-full text-3xl font-bold text-[#FAF0DC]"
            >
              ×
            </button>
            {[
              { id: "about", label: "ABOUT ME" },
              { id: "experience", label: "WORK EXPERIENCE" },
              { id: "personal-projects", label: "PROJECTS" },
              { id: "extras", label: "EXTRAS" },
              { id: "contact", label: "CONTACT" },
            ].map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-center text-[28px] font-extrabold italic text-[#FAF0DC] no-underline"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              >
                {label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {desktopStickers ? (
        <DroppedStickersLayer droppedStickers={droppedStickers} onRemoveSticker={removeSticker} />
      ) : null}

      <SidebarStickerRail
        scale={scale}
        repeatedSidebarStickers={repeatedSidebarStickers}
        startSidebarDrag={startSidebarDrag}
      />
      <AnimatePresence>
        {showStickerHint ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="pointer-events-auto fixed left-[92px] top-[80px] z-[250] hidden w-[190px] rounded-[12px] bg-[#400909] px-3 pb-2 pt-2 text-white shadow-[0_6px_18px_rgba(0,0,0,0.28)] lg:block"
            style={{
              fontFamily: "var(--font-nunito), Nunito Sans, system-ui, sans-serif",
            }}
          >
            <button
              type="button"
              aria-label="Dismiss sticker instructions"
              onClick={() => setShowStickerHint(false)}
              className="absolute right-2 top-1 text-[14px] font-extrabold leading-none text-white/85 transition hover:text-white"
            >
              ×
            </button>
            <p className="pr-4 text-[12.5px] font-extrabold italic leading-[1.35]">
              Drag stickers onto the page!
            </p>
            <p className="mt-0.5 text-[12.5px] font-extrabold italic leading-[1.35]">
              Right-click to remove
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {desktopStickers && ghostVisible ? (
        <div
          ref={ghostRef}
          className="pointer-events-none fixed z-[9999]"
          style={{
            left: ghostDataRef.current.x,
            top: ghostDataRef.current.y,
            width: ghostDataRef.current.size,
            transform: "rotate(-4deg) scale(1.12)",
            filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.35))",
          }}
        >
          <img
            src={encodeURI(ghostDataRef.current.src)}
            alt=""
            draggable={false}
            className="h-auto w-full"
          />
        </div>
      ) : null}

      <div
        className={`relative z-[5] w-full min-w-0 pl-4 pr-4 pb-16 md:pr-8 ${scale < 1 ? "max-w-none" : "max-w-[100dvw]"}`}
        style={
          {
            paddingTop: NAV_BAR_HEIGHT_PX,
            ...(scale < 1
              ? ({
                zoom: scale,
                width: `${100 / scale}%`,
                marginLeft: `${-((100 / scale - 100) / 2)}%`,
              } as React.CSSProperties)
              : {}),
          } as React.CSSProperties
        }
      >
        <div className="relative mx-auto max-w-[1440px]">
          <motion.div {...fadeFromTop}>
            <NavBar />
          </motion.div>

          <section id="about" className="scroll-mt-28" aria-label="About">
            {/* Desktop-2 artboard: fixed 1440px canvas (scrolls horizontally if needed) */}
            <div className="relative hidden min-h-[780] overflow-x-clip overflow-y-visible lg:block">
              <div className="relative min-h-[780] min-w-[1440px]">
                {/* Subtle hero star backdrop */}
                <img
                  src={encodeURI("/images/Star 1.svg")}
                  alt=""
                  width={440}
                  height={440}
                  className="pointer-events-none absolute z-[0] opacity-40"
                  style={{ left: 220, top: -2 }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element -- Desktop-2 spec: native <img> */}
                <img
                  src="/images/quote-open.svg"
                  alt=""
                  width={106}
                  height={82}
                  className="pointer-events-none absolute z-[1]"
                  style={{ left: 114, top: 30 }}
                />

                <motion.h1
                  className="absolute z-[2] font-sans text-[100px] font-extrabold italic leading-none text-[#1e1e1e]"
                  style={{ left: 220, top: 50, maxWidth: 900 }}
                  initial={fadeUp.initial}
                  animate={fadeUp.animate}
                  transition={fadeUp.transition}
                >
                  <span className="block">Hey!</span>
                  <span className="mt-2 block">I&apos;m Nupur!</span>
                </motion.h1>

                <motion.div
                  className="absolute z-[2] text-center font-sans text-[20px] font-extrabold italic leading-snug text-white"
                  style={{ left: 172, top: 280, width: 665 }}
                  initial={fadeUp.initial}
                  animate={fadeUp.animate}
                  transition={{ ...fadeUp.transition, delay: 0.08 }}
                >
                  {bioParagraphs.map((text, i) => (
                    <p key={i} className={i > 0 ? "mt-6" : ""}>
                      {text}
                    </p>
                  ))}
                </motion.div>

                {/* eslint-disable-next-line @next/next/no-img-element -- Desktop-2 spec: native <img> */}
                <img
                  src="/images/quote-close.svg"
                  alt=""
                  width={98}
                  height={80}
                  className="pointer-events-none absolute z-[1]"
                  style={{ left: 671, top: 630 }}
                />

                <motion.div
                  className="absolute right-0 top-[12px] flex items-start justify-end "
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    glowActive
                      ? {
                        opacity: 1,
                        y: 0,
                        filter: [
                          "drop-shadow(0 0 8px rgba(255,255,255,0.4))",
                          "drop-shadow(0 0 20px rgba(255,255,255,0.7))",
                          "drop-shadow(0 0 8px rgba(255,255,255,0.4))",
                        ],
                      }
                      : {
                        opacity: 1,
                        y: 0,
                        filter: "drop-shadow(0 0 0px rgba(255,255,255,0))",
                      }
                  }
                  transition={
                    glowActive
                      ? {
                        opacity: { duration: 0.6, delay: 0.2 },
                        y: { duration: 0.6, delay: 0.2 },
                        filter: {
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.2,
                        },
                      }
                      : { duration: 0.15 }
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/hero/polaroid-frame.png"
                    alt="Photos"
                    className="h-auto max-h-[min(86vh,760px)] w-auto max-w-full object-contain"
                  />
                </motion.div>
              </div>
            </div>

            {/* Smaller viewports: stacked layout */}
            <div className="relative flex flex-col gap-10 px-4 pb-8 pt-20 lg:hidden">
              <img
                src={encodeURI("/images/Star 1.svg")}
                alt=""
                width={280}
                height={280}
                className="pointer-events-none absolute left-1/2 top-4 z-0 w-[min(78vw,260px)] max-w-[280px] -translate-x-1/2 opacity-40"
              />
              {/* eslint-disable-next-line @next/next/no-img-element -- Desktop-2 spec: native <img> */}
              <img
                src="/images/quote-open.svg"
                alt=""
                width={106}
                height={82}
                className="mx-auto w-20 max-w-full sm:w-auto"
              />
              <motion.h1
                className="text-center font-sans text-5xl font-extrabold italic leading-none text-[#1e1e1e] sm:text-6xl md:text-7xl"
                initial={fadeUp.initial}
                animate={fadeUp.animate}
                transition={fadeUp.transition}
              >
                <span className="block">Hey!</span>
                <span className="mt-2 block">I&apos;m Nupur!</span>
              </motion.h1>
              <motion.div
                className="mx-auto w-full max-w-[min(665px,100%)] px-1 text-center font-sans text-base font-extrabold italic leading-snug text-white sm:px-0 sm:text-lg"
                initial={fadeUp.initial}
                animate={fadeUp.animate}
                transition={{ ...fadeUp.transition, delay: 0.08 }}
              >
                {bioParagraphs.map((text, i) => (
                  <p key={i} className={i > 0 ? "mt-5" : ""}>
                    {text}
                  </p>
                ))}
              </motion.div>
              {/* eslint-disable-next-line @next/next/no-img-element -- Desktop-2 spec: native <img> */}
              <img
                src="/images/quote-close.svg"
                alt=""
                width={98}
                height={80}
                className="mx-auto w-20 max-w-full sm:w-auto"
              />
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  glowActive
                    ? {
                      opacity: 1,
                      y: 0,
                      filter: [
                        "drop-shadow(0 0 8px rgba(255,255,255,0.4))",
                        "drop-shadow(0 0 20px rgba(255,255,255,0.7))",
                        "drop-shadow(0 0 8px rgba(255,255,255,0.4))",
                      ],
                    }
                    : {
                      opacity: 1,
                      y: 0,
                      filter: "drop-shadow(0 0 0px rgba(255,255,255,0))",
                    }
                }
                transition={
                  glowActive
                    ? {
                      opacity: { duration: 0.6, delay: 0.2 },
                      y: { duration: 0.6, delay: 0.2 },
                      filter: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.2,
                      },
                    }
                    : { duration: 0.15 }
                }
              >
                <Image
                  src="/images/hero/polaroid-frame.png"
                  alt="Photos"
                  width={520}
                  height={760}
                  className="mx-auto h-auto max-h-[min(70vh,540px)] w-full max-w-[min(100%,420px)] object-contain"
                  priority
                />
              </motion.div>
            </div>
          </section>
        </div>

        <div className="relative mx-auto w-full max-w-[1440px] bg-[#db5e5e] lg:-mt-20">
          {/* Timeline stem uses bottom:0 — scoped to this wrapper so it ends with work experience. */}
          <div className="relative w-full">
            <section
              id="experience"
              className="relative z-[2] scroll-mt-28 bg-transparent py-10 lg:py-0"
              aria-label="Work experience"
            >
              {/* Desktop-14: quoted intro (artboard 1440px) */}
              <div
                className="relative bg-[#db5e5e] py-8 lg:py-0"
                role="region"
                aria-label="Portfolio introduction"
              >
                <div className="relative mx-auto hidden max-w-[1440px] overflow-visible lg:block">
                  <div className="relative min-h-[760px] min-w-[1440px]">
                    {/* eslint-disable-next-line @next/next/no-img-element -- Figma spec: native <img> */}
                    <img
                      src="/images/quote-open.svg"
                      alt=""
                      width={106}
                      height={82}
                      className="pointer-events-none absolute z-[1]"
                      style={{ left: 250, top: 31 }}
                    />

                    <div
                      className="absolute z-[2] text-center font-sans text-white"
                      style={{
                        left: "50%",
                        top: 82,
                        width: 693,
                        transform: "translateX(-50%) rotate(-0.16deg)",
                      }}
                    >
                      <p className="text-[20px] font-bold italic leading-snug">
                        {"this portfolio is a bit of a "}
                        <span className="text-[32px] font-black italic">
                          scrapbook
                        </span>
                        {" of what I've built, learned, and enjoyed along the way."}
                      </p>
                      <p className="mt-8 text-[20px] font-extrabold italic leading-snug">
                        {"Please take a look around."}
                      </p>
                    </div>

                    {/* eslint-disable-next-line @next/next/no-img-element -- Figma spec: native <img> */}
                    <img
                      src="/images/quote-close.svg"
                      alt=""
                      width={98}
                      height={80}
                      className="pointer-events-none absolute z-[1]"
                      style={{
                        left: 1091,
                        top: 180,
                        transform: "rotate(180deg) scaleX(-1)",
                      }}
                    />

                    <p
                      className="absolute z-[2] text-center font-sans text-[32px] font-bold italic leading-snug text-white"
                      style={{
                        left: "50%",
                        top: 312,
                        width: 709,
                        transform: "translateX(-50%)",
                      }}
                    >
                      {"alright, let's get into it."}
                    </p>

                    <div
                      className="absolute z-[2]"
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: 494,
                        transform: "translateX(-50%) rotate(-0.5deg)",
                        zIndex: 2,
                        width: "fit-content",
                      }}
                    >
                      <h2
                        style={{
                          fontFamily:
                            "var(--font-nunito), 'Nunito Sans', system-ui, sans-serif",
                          fontSize: 40,
                          fontWeight: 800,
                          fontStyle: "italic",
                          color: "#FAF0DC",
                          lineHeight: 1.1,
                          background: "#400909",
                          padding: "8px 20px",
                          display: "inline-block",
                          whiteSpace: "nowrap",
                        }}
                      >
                        WORK EXPERIENCE
                      </h2>
                      <div
                        style={{
                          height: 4,
                          background: "#FAF0DC",
                          marginTop: 6,
                          width: "100%",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-6 px-4 py-10 lg:hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/quote-open.svg"
                    alt=""
                    width={106}
                    height={82}
                    className="w-20 max-w-full sm:w-auto"
                  />
                  <div className="mx-auto max-w-[min(693px,100%)] px-1 text-center font-sans text-white lg:-rotate-[0.16deg]">
                    <p className="text-base font-bold italic leading-snug sm:text-[20px]">
                      {"this portfolio is a bit of a "}
                      <span className="text-2xl font-black italic sm:text-[32px]">
                        scrapbook
                      </span>
                      {" of what I've built, learned, and enjoyed along the way."}
                    </p>
                    <p className="mt-8 text-base font-extrabold italic leading-snug sm:text-[20px]">
                      {"Please take a look around."}
                    </p>
                  </div>
                  <p className="max-w-[709px] text-center font-sans text-xl font-bold italic leading-snug text-white sm:text-[32px]">
                    {"alright, let's get into it."}
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/quote-close.svg"
                    alt=""
                    width={98}
                    height={80}
                    className="mt-8 w-20 max-w-full rotate-180 -scale-x-100 sm:mt-12 sm:w-auto"
                  />
                  <div className="mt-8 text-center sm:mt-12">
                    <div className="mx-auto w-fit max-w-full lg:-rotate-[0.5deg]">
                      <h2
                        className="inline-block max-w-full text-balance whitespace-normal lg:whitespace-nowrap"
                        style={{
                          fontFamily:
                            "var(--font-nunito), 'Nunito Sans', system-ui, sans-serif",
                          fontSize: "clamp(1.35rem, 4vw, 2.5rem)",
                          fontWeight: 800,
                          fontStyle: "italic",
                          color: "#FAF0DC",
                          lineHeight: 1.1,
                          background: "#400909",
                          padding: "8px 14px",
                          display: "inline-block",
                        }}
                      >
                        WORK EXPERIENCE
                      </h2>
                      <div
                        style={{
                          height: 4,
                          background: "#FAF0DC",
                          marginTop: 6,
                          width: "100%",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Figma: vertical timeline at x = 728px (fixed); stem 727–729px. */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-[728px] top-[564px] z-[1] hidden h-[11px] w-[11px] -translate-x-1/2 rounded-full bg-[#1e1e1e] lg:block"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute left-[727px] top-[567px] z-[1] hidden w-[2px] bg-[#1e1e1e] lg:block"
                style={{ height: 4550 }}
              />

              <div className="relative mx-auto hidden max-w-[1440px] overflow-x-clip overflow-y-visible lg:block">
                <div className="relative z-[2] min-h-[4200px] min-w-[1440px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={encodeURI("/images/Component 4.svg")}
                    alt="Heartland Community Network — role card"
                    width={450}
                    height={200}
                    className="absolute left-[196px] top-[88px] z-[2] h-[200px] w-[450px] max-w-none object-contain"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none z-[1]"
                    style={{
                      position: "absolute",
                      left: 577,
                      top: 88 + 100 - 1,
                      width: 151,
                      height: 2,
                      backgroundColor: "#1e1e1e",
                    }}
                  />

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={encodeURI("/images/Component 3.svg")}
                    alt="Heartland Community Network — project collage"
                    width={591}
                    height={778}
                    className="absolute left-[756px] top-[88px] h-[778px] w-[591px] max-w-none object-contain"
                  />

                  <div
                    className="absolute left-[138px] top-[320px] flex h-[412px] w-[565px] flex-col justify-center gap-5 px-10 py-8 text-center font-sans text-[18px] font-extrabold italic leading-snug text-[#1e1e1e]"
                    style={{
                      backgroundImage: "url('/images/Rectangle 78.svg')",
                      backgroundSize: "100% 100%",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <p className="mx-auto max-w-[46ch]">
                      {
                        "At Heartland Community Network, I work as a Senior Consultant delivering data-driven solutions for clients across finance, healthcare, public safety, and small businesses."
                      }
                    </p>
                    <p className="mx-auto max-w-[46ch]">
                      {
                        "I build analytical models, define KPIs, and create dashboards that help people actually make decisions -- not just look at numbers. I also set up data governance standards because trustworthy data is the whole point. If the data isn't reliable, nothing downstream is."
                      }
                    </p>
                  </div>

                  {/* Chicago Public Schools — photo left, job card right (alternating). */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={encodeURI("/images/Component 5.svg")}
                    alt="Chicago Public Schools — photo collage"
                    width={619}
                    height={856}
                    className="absolute left-[94px] z-[2] h-[856px] w-[619px] max-w-none object-cover object-left"
                    style={{ top: CPS_TOP }}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={encodeURI("/images/Component 10.svg")}
                    alt="Chicago Public Schools — role card"
                    width={506}
                    height={260}
                    className="absolute left-[843px] z-[2] h-[260px] w-[506px] max-w-none object-contain"
                    style={{ top: CPS_JOB_TOP }}
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none z-[1]"
                    style={{
                      position: "absolute",
                      left: 728,
                      top: CPS_CONNECTOR_TOP,
                      width: 172,
                      height: 2,
                      backgroundColor: "#1e1e1e",
                    }}
                  />
                  <div
                    className="absolute z-[2] flex h-[410px] w-[552px] flex-col justify-center px-8 py-8 text-center font-sans text-[17px] font-extrabold italic leading-snug text-black"
                    style={{
                      left: 843,
                      top: CPS_DESC_TOP,
                      backgroundImage: "url('/images/Rectangle 78.svg')",
                      backgroundSize: "100% 100%",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <p className="mx-auto max-w-[46ch]">{cpsDescription}</p>
                  </div>

                  {/* Data Science Consultant — job card left, photo right (same orientation as HCN). */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={encodeURI("/images/Component 12.svg")}
                    alt="Data Science Consultant — role card"
                    width={450}
                    height={260}
                    className="absolute left-[207px] z-[2] h-[260px] w-[450px] max-w-none object-contain"
                    style={{ top: DS_JOB_TOP }}
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none z-[1]"
                    style={{
                      position: "absolute",
                      left: 657,
                      top: DS_CONNECTOR_TOP,
                      width: 71,
                      height: 2,
                      backgroundColor: "#1e1e1e",
                    }}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={encodeURI("/images/Component 11.svg")}
                    alt="Data Science Consultant — project collage"
                    width={687}
                    height={915}
                    className="absolute z-[2] max-w-none object-contain"
                    style={{ left: 750, top: DS_TOP, width: 687, height: 915 }}
                  />
                  <div
                    className="absolute z-[2] flex flex-col justify-center px-8 py-8 text-center font-sans text-[17px] font-extrabold italic leading-snug text-black"
                    style={{
                      left: 118,
                      top: DS_DESC_TOP,
                      width: 565,
                      height: 434,
                      backgroundImage: "url('/images/Rectangle 78.svg')",
                      backgroundSize: "100% 100%",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <p className="mx-auto max-w-[46ch]">
                      {dataScienceConsultantDescriptionFirstParagraph}
                    </p>
                    <p className="mx-auto mt-4 max-w-[46ch]">
                      {dataScienceConsultantDescriptionSecondParagraph}
                    </p>
                  </div>

                  {/* Infosys — photo left, job cards right. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={encodeURI("/images/Component 9.svg")}
                    alt="Infosys — photo collage"
                    width={661}
                    height={896}
                    className="absolute z-[2] max-w-none object-contain"
                    style={{ left: 50, top: INF_TOP, width: 661, height: 896 }}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={encodeURI("/images/Component 13.svg")}
                    alt="Infosys — role cards"
                    width={452}
                    height={462}
                    className="absolute left-[854px] z-[2] max-w-none object-contain"
                    style={{ top: INF_JOB_TOP, width: 452, height: 462 }}
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none z-[1]"
                    style={{
                      position: "absolute",
                      left: 728,
                      top: INF_CONNECTOR_TOP,
                      width: 126,
                      height: 2,
                      backgroundColor: "#1e1e1e",
                    }}
                  />
                  <div
                    className="absolute z-[2] flex flex-col justify-center px-8 py-8 text-center font-sans text-[17px] font-extrabold italic leading-snug text-black"
                    style={{
                      left: 796,
                      top: INF_DESC_TOP,
                      width: 565,
                      height: 424,
                      backgroundImage: "url('/images/Rectangle 78.svg')",
                      backgroundSize: "100% 100%",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <p className="mx-auto max-w-[46ch]">
                      {infosysDescriptionFirstParagraph}
                    </p>
                    <p className="mx-auto mt-4 max-w-[46ch]">
                      {infosysDescriptionSecondParagraph}
                    </p>
                  </div>

                  {/* Date pills on timeline (x=728); top = connector y − 12; z above z-[1] connectors. */}
                  <div
                    className="pointer-events-none font-sans"
                    style={{
                      ...experienceDateBadgeBaseStyle,
                      top: 25,
                    }}
                  >
                    AUG 2025 - PRESENT
                  </div>
                  <div
                    className="pointer-events-none font-sans"
                    style={{
                      ...experienceDateBadgeBaseStyle,
                      top: CPS_CONNECTOR_TOP - 290,
                    }}
                  >
                    OCT 2024 - MAY 2025
                  </div>
                  <div
                    className="pointer-events-none font-sans"
                    style={{
                      ...experienceDateBadgeBaseStyle,
                      top: DS_CONNECTOR_TOP - 250,
                    }}
                  >
                    OCT 2024 - MAY 2025
                  </div>
                  <div
                    className="pointer-events-none font-sans"
                    style={{
                      ...experienceDateBadgeBaseStyle,
                      top: INF_CONNECTOR_TOP - 360,
                    }}
                  >
                    OCT 2024 - MAY 2025
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-8 px-4 py-10 lg:hidden">
                <div className="mx-auto flex w-full max-w-[450px] flex-col items-center gap-2">
                  <div
                    className="max-w-[min(100%,280px)] text-center font-sans text-xs font-extrabold italic leading-snug text-white sm:text-[14px]"
                    style={{
                      borderRadius: 999,
                      padding: "6px 14px",
                      backgroundColor: "#1e1e1e",
                    }}
                  >
                    AUG 2025 - PRESENT
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={encodeURI("/images/Component 4.svg")}
                    alt="Heartland Community Network — role card"
                    width={450}
                    height={200}
                    className="h-auto w-full translate-x-4 object-contain sm:translate-x-5"
                  />
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={encodeURI("/images/Component 3.svg")}
                  alt="Heartland Community Network — project collage"
                  width={591}
                  height={778}
                  className="mx-auto h-auto w-full max-w-[591px] object-contain"
                />
                <div
                  className="mx-auto w-full max-w-[565px] px-[14%] pb-[9%] pt-[10%] text-center font-sans text-[12px] font-extrabold italic leading-[1.18] text-[#1e1e1e] sm:text-[13px]"
                  style={{
                    backgroundImage: "url('/images/Rectangle 78.svg')",
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="flex flex-col justify-center gap-3">
                    <p className="mx-auto max-w-[34ch]">
                      {
                        "At Heartland Community Network, I work as a Senior Consultant delivering data-driven solutions for clients across finance, healthcare, public safety, and small businesses."
                      }
                    </p>
                    <p className="mx-auto max-w-[34ch]">
                      {
                        "I build analytical models, define KPIs, and create dashboards that help people actually make decisions -- not just look at numbers. I also set up data governance standards because trustworthy data is the whole point. If the data isn't reliable, nothing downstream is."
                      }
                    </p>
                  </div>
                </div>

                <div className="mx-auto flex w-full max-w-[619px] flex-col items-center gap-2">
                  <div
                    className="max-w-[min(100%,280px)] text-center font-sans text-xs font-extrabold italic leading-snug text-white sm:text-[14px]"
                    style={{
                      borderRadius: 999,
                      padding: "6px 14px",
                      backgroundColor: "#1e1e1e",
                    }}
                  >
                    OCT 2024 - MAY 2025
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={encodeURI("/images/Component 10.svg")}
                    alt="Chicago Public Schools — role card"
                    width={506}
                    height={260}
                    className="h-auto w-full max-w-[506px] -translate-x-5 object-contain sm:-translate-x-6"
                  />
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={encodeURI("/images/Component 5.svg")}
                  alt="Chicago Public Schools — photo collage"
                  width={619}
                  height={856}
                  className="mx-auto mt-6 h-auto w-full max-w-[619px] translate-x-10 object-contain sm:mt-4 sm:translate-x-12"
                />
                <div
                  className="mx-auto w-full max-w-[552px] px-[14%] pb-[9%] pt-[10%] text-center font-sans text-[13px] font-extrabold italic leading-[1.2] text-black sm:text-[14px]"
                  style={{
                    backgroundImage: "url('/images/Rectangle 79.svg')",
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <p className="mx-auto max-w-[38ch]">{cpsDescription}</p>
                </div>

                <div className="mx-auto flex w-full max-w-[450px] flex-col items-center gap-2">
                  <div
                    className="max-w-[min(100%,280px)] text-center font-sans text-xs font-extrabold italic leading-snug text-white sm:text-[14px]"
                    style={{
                      borderRadius: 999,
                      padding: "6px 14px",
                      backgroundColor: "#1e1e1e",
                    }}
                  >
                    OCT 2024 - MAY 2025
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={encodeURI("/images/Component 12.svg")}
                    alt="Data Science Consultant — role card"
                    width={450}
                    height={260}
                    className="h-auto w-full object-contain"
                  />
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={encodeURI("/images/Component 11.svg")}
                  alt="Data Science Consultant — project collage"
                  width={687}
                  height={915}
                  className="mx-auto h-auto w-full max-w-[687px] object-contain"
                />
                <div
                  className="mx-auto w-full max-w-[565px] px-[12%] pb-[10%] pt-[11%] text-center font-sans text-[12px] font-extrabold italic leading-[1.25] text-black"
                  style={{
                    backgroundImage: "url('/images/Rectangle 80.svg')",
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="flex flex-col justify-center gap-3">
                    <p className="mx-auto max-w-[46ch]">
                      {dataScienceConsultantDescriptionFirstParagraph}
                    </p>
                    <p className="mx-auto max-w-[46ch]">
                      {dataScienceConsultantDescriptionSecondParagraph}
                    </p>
                  </div>
                </div>

                <div className="mx-auto flex w-full max-w-[452px] flex-col items-center gap-2">
                  <div
                    className="max-w-[min(100%,280px)] text-center font-sans text-xs font-extrabold italic leading-snug text-white sm:text-[14px]"
                    style={{
                      borderRadius: 999,
                      padding: "6px 14px",
                      backgroundColor: "#1e1e1e",
                    }}
                  >
                    OCT 2024 - MAY 2025
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={encodeURI("/images/Component 13.svg")}
                    alt="Infosys — role cards"
                    width={452}
                    height={462}
                    className="h-auto w-full object-contain"
                  />
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={encodeURI("/images/Component 9.svg")}
                  alt="Infosys — photo collage"
                  width={661}
                  height={896}
                  className="mx-auto h-auto w-full max-w-[661px] object-contain"
                />
                <div
                  className="mx-auto w-full max-w-[565px] px-[12%] pb-[12%] pt-[13%] text-center font-sans text-[12px] font-extrabold italic leading-snug text-black"
                  style={{
                    backgroundImage: "url('/images/Rectangle 81.svg')",
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="flex flex-col justify-center gap-4">
                    <p className="mx-auto max-w-[46ch]">
                      {infosysDescriptionFirstParagraph}
                    </p>
                    <p className="mx-auto max-w-[46ch]">
                      {infosysDescriptionSecondParagraph}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section
            id="personal-projects"
            className="relative mb-0 scroll-mt-28 bg-[#db5e5e] px-4 pb-12 pt-[40px] md:px-8 md:pb-16 lg:pb-10 lg:pt-[300px]"
            aria-label="Personal projects"
          >
            <div className="relative z-[1] mx-auto w-full min-w-0 max-w-[1440px]">
              <div className="mx-auto w-fit max-w-full text-center lg:-rotate-[0.5deg]">
                <h2
                  className="inline-block max-w-full text-balance whitespace-normal lg:whitespace-nowrap"
                  style={{
                    fontFamily:
                      "var(--font-nunito), 'Nunito Sans', system-ui, sans-serif",
                    fontSize: "clamp(1.35rem, 4vw, 2.5rem)",
                    fontWeight: 800,
                    fontStyle: "italic",
                    color: "#FAF0DC",
                    lineHeight: 1.1,
                    background: "#400909",
                    padding: "8px 14px",
                    display: "inline-block",
                  }}
                >
                  personal projects
                </h2>
                <div
                  style={{
                    height: 4,
                    background: "#FAF0DC",
                    marginTop: 6,
                    width: "100%",
                  }}
                />
                <p
                  className="mt-2 text-center font-mono text-[18px]"
                  style={{ color: "#ffffff", opacity: 0.8 }}
                >
                  things i built because i wanted to
                </p>
              </div>
            </div>

            <ProjectCarousel />
          </section>

          <section
            id="certifications-preview"
            className="relative -mt-6 scroll-mt-28 bg-[#db5e5e] px-4 pb-20 pt-0 md:px-8 md:pb-24 lg:mt-10 lg:pb-28"
            aria-label="Certifications and skills preview"
          >
            <div className="relative mx-auto w-full max-w-[1440px]">
              <div className="relative mx-auto max-w-[1120px]">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="mx-auto w-fit lg:mx-0 lg:pl-32 lg:pr-[220px]"
                >
                  <div className="mx-auto w-fit max-w-full text-center lg:mx-0 lg:rotate-[0.3deg] lg:text-left">
                    <h2
                      className="inline-block max-w-full text-balance whitespace-normal lg:whitespace-nowrap"
                      style={{
                        fontFamily:
                          "var(--font-nunito), 'Nunito Sans', system-ui, sans-serif",
                        fontSize: "clamp(1.35rem, 4vw, 2.5rem)",
                        fontWeight: 800,
                        fontStyle: "italic",
                        color: "#FAF0DC",
                        lineHeight: 1.1,
                        background: "#400909",
                        padding: "8px 14px",
                        display: "inline-block",
                      }}
                    >
                      certifications &amp; skills
                    </h2>
                    <div
                      style={{
                        height: 4,
                        background: "#FAF0DC",
                        marginTop: 6,
                        width: "100%",
                      }}
                    />
                    <p
                      className="mt-2 text-center font-mono text-[18px] lg:text-left"
                      style={{ color: "#ffffff", opacity: 0.8 }}
                    >
                      Spent a lot of time getting these certifications and skills
                    </p>
                  </div>
                </motion.div>

                <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.1fr_0.7fr]">
                  <motion.div
                    className="mt-5 lg:mt-20"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: 0.05, ease: "easeOut" }}
                  >
                    <p className="mx-auto mb-2 max-w-[36ch] rotate-[-5deg] text-center font-sans text-[14px] font-extrabold italic leading-snug text-white md:text-[22px]">
                      Stickers don&apos;t lie. My laptop is basically my CV at
                      this point. The full list is on my resume. This is just the
                      fun version.
                    </p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={encodeURI("/images/Component 22.svg")}
                      alt="Laptop with skill stickers and technology logos"
                      width={778}
                      height={576}
                      className="h-auto w-full max-w-[778px] object-contain"
                    />

                    <a
                      href="/resume/Nupur-Gudigar-Resume.pdf"
                      download="Nupur-Gudigar-Resume.pdf"
                      aria-label="Download resume"
                      className="mx-auto mt-10 inline-flex w-fit translate-x-[2.25rem] items-center justify-center rounded-full border border-[#5b1111] bg-[#3d0909] px-9 py-3 font-sans text-[19px] font-extrabold italic leading-tight tracking-wide text-white shadow-[0_6px_14px_rgba(40,4,4,0.35)] transition duration-200 md:translate-x-28 lg:translate-x-40 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#db5e5e] md:text-[21px]"
                    >
                      DOWNLOAD RESUME
                    </a>
                  </motion.div>

                  <motion.div
                    className="mx-auto w-full max-w-[340px] lg:-mt-8"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: 0.12, ease: "easeOut" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={encodeURI("/images/Component 21.svg")}
                      alt="Hanging name badge listing certifications"
                      width={390}
                      height={840}
                      className="h-auto w-full object-contain"
                    />
                    <p className="mt-4 text-center font-sans text-[28px] font-extrabold italic leading-tight text-white md:text-[36px]">
                      I&apos;M CERTIFIED TOO
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          <BeyondResumeSection />

          {/* ── EXTRAS ── */}
          <div className="bg-[#db5e5e] px-4 pb-6 pt-10 text-center lg:hidden">
            <div className="mx-auto w-fit max-w-full">
              <h2
                className="inline-block max-w-full text-balance whitespace-normal"
                style={{
                  fontFamily:
                    "var(--font-nunito), 'Nunito Sans', system-ui, sans-serif",
                  fontSize: "clamp(1.35rem, 4vw, 2.5rem)",
                  fontWeight: 800,
                  fontStyle: "italic",
                  color: "#FAF0DC",
                  lineHeight: 1.1,
                  background: "#400909",
                  padding: "8px 14px",
                  display: "inline-block",
                }}
              >
                life outside the terminal
              </h2>
              <div
                className="mx-auto"
                style={{
                  height: 4,
                  background: "#FAF0DC",
                  marginTop: 6,
                  width: "100%",
                  maxWidth: "min(100%, 28rem)",
                }}
              />
              <p
                className="mt-3 font-mono text-sm italic text-[#FAF0DC]/80"
              >
                Tap a photo to flip it (desktop: hover works too).
              </p>
            </div>
          </div>
          <div ref={extrasContainerRef} style={{ width: "100%" }}>
            <div
              style={{
                width: "100%",
                height: 1024 * extrasContainerScale,
                overflow: "visible",
                backgroundColor: "#db5e5e",
                margin: 0,
                padding: 0,
              }}
            >
              <div
                id="extras"
                className="scroll-mt-28"
                style={{
                  width: 1440,
                  height: 1024,
                  position: "relative",
                  transformOrigin: "top left",
                  transform: `scale(${extrasContainerScale})`,
                }}
              >
                {/* Corkboard */}
                <img
                  src="/images/Rectangle_89.png"
                  alt=""
                  className="max-lg:-translate-x-[135px]"
                  style={{
                    position: "absolute",
                    left: 196,
                    top: 132,
                    width: 1315,
                    height: 863,
                    objectFit: "contain",
                  }}
                />
                {/* Photo container - clips to inner cork area */}
                <div
                  className="max-lg:-translate-x-[135px]"
                  style={{
                    position: "absolute",
                    left: 135,
                    top: 135,
                    width: 1250,
                    height: 800,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 157,
                      top: 76,
                      width: 411,
                      height: 211,
                      zIndex: 1,
                      transform: "rotate(-2deg)",
                      perspective: "1000px",
                    }}
                  >
                    <div
                      className="group"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        transition:
                          "transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        transformStyle: "preserve-3d",
                        transform: "rotateX(0deg)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "rotateX(180deg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "rotateX(0deg)";
                      }}
                      onClick={toggleExtrasFlipOnTouch}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                        }}
                      >
                        <img
                          src={encodeURI("/images/Component 15.svg")}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          transform: "rotateX(180deg)",
                          backgroundColor: "#f2f2f2",
                          borderRadius: 2,
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 20,
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontSize: 18,
                            color: "#333",
                            fontWeight: 700,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          Gaming Club Secretary
                        </h4>
                        <p
                          style={{
                            marginTop: 10,
                            fontSize: 13,
                            color: "#777",
                            lineHeight: 1.4,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          Leading the gaming community as secretary — organizing
                          events, tournaments, and bringing gamers together.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 613,
                      top: 68,
                      width: 209,
                      height: 325,
                      zIndex: 2,
                      transform: "rotate(1.5deg)",
                      perspective: "1000px",
                    }}
                  >
                    <div
                      className="group"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        transition:
                          "transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        transformStyle: "preserve-3d",
                        transform: "rotateX(0deg)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "rotateX(180deg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "rotateX(0deg)";
                      }}
                      onClick={toggleExtrasFlipOnTouch}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                        }}
                      >
                        <img
                          src={encodeURI("/images/Rectangle 68.svg")}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          transform: "rotateX(180deg)",
                          backgroundColor: "#f2f2f2",
                          borderRadius: 2,
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 20,
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontSize: 18,
                            color: "#333",
                            fontWeight: 700,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          PAWS Chicago Volunteer
                        </h4>
                        <p
                          style={{
                            marginTop: 10,
                            fontSize: 13,
                            color: "#777",
                            lineHeight: 1.4,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          Volunteering at PAWS Chicago, helping rescue animals find
                          their forever homes.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 157,
                      top: 324,
                      width: 394,
                      height: 266,
                      zIndex: 1,
                      transform: "rotate(-1deg)",
                      perspective: "1000px",
                    }}
                  >
                    <div
                      className="group"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        transition:
                          "transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        transformStyle: "preserve-3d",
                        transform: "rotateX(0deg)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "rotateX(180deg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "rotateX(0deg)";
                      }}
                      onClick={toggleExtrasFlipOnTouch}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                        }}
                      >
                        <img
                          src={encodeURI("/images/Rectangle 66.svg")}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          transform: "rotateX(180deg)",
                          backgroundColor: "#f2f2f2",
                          borderRadius: 2,
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 20,
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontSize: 18,
                            color: "#333",
                            fontWeight: 700,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          Illinois Esports
                        </h4>
                        <p
                          style={{
                            marginTop: 10,
                            fontSize: 13,
                            color: "#777",
                            lineHeight: 1.4,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          Competing and collaborating in the Illinois esports scene —
                          where passion meets strategy.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 632,
                      top: 417,
                      width: 242,
                      height: 185,
                      zIndex: 2,
                      transform: "rotate(2deg)",
                      perspective: "1000px",
                    }}
                  >
                    <div
                      className="group"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        transition:
                          "transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        transformStyle: "preserve-3d",
                        transform: "rotateX(0deg)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "rotateX(180deg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "rotateX(0deg)";
                      }}
                      onClick={toggleExtrasFlipOnTouch}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                        }}
                      >
                        <img
                          src={encodeURI("/images/Rectangle 67.svg")}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          transform: "rotateX(180deg)",
                          backgroundColor: "#f2f2f2",
                          borderRadius: 2,
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 20,
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontSize: 18,
                            color: "#333",
                            fontWeight: 700,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          Furry Friend
                        </h4>
                        <p
                          style={{
                            marginTop: 10,
                            fontSize: 13,
                            color: "#777",
                            lineHeight: 1.4,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          A wholesome encounter with this adorable service dog who
                          brightened everyone&apos;s day.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 1010,
                      top: 111,
                      width: 265,
                      height: 245,
                      zIndex: 1,
                      transform: "rotate(-1.5deg)",
                      perspective: "1000px",
                    }}
                  >
                    <div
                      className="group"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        transition:
                          "transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        transformStyle: "preserve-3d",
                        transform: "rotateX(0deg)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "rotateX(180deg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "rotateX(0deg)";
                      }}
                      onClick={toggleExtrasFlipOnTouch}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                        }}
                      >
                        <img
                          src={encodeURI("/images/Rectangle 65.svg")}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          transform: "rotateX(180deg)",
                          backgroundColor: "#f2f2f2",
                          borderRadius: 2,
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 20,
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontSize: 18,
                            color: "#333",
                            fontWeight: 700,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          Google Visit
                        </h4>
                        <p
                          style={{
                            marginTop: 10,
                            fontSize: 13,
                            color: "#777",
                            lineHeight: 1.4,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          Exploring Google&apos;s office and getting inspired by the
                          culture of innovation.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 916,
                      top: 256,
                      width: 209,
                      height: 322,
                      zIndex: 2,
                      transform: "rotate(1deg)",
                      perspective: "1000px",
                    }}
                  >
                    <div
                      className="group"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        transition:
                          "transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        transformStyle: "preserve-3d",
                        transform: "rotateX(0deg)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "rotateX(180deg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "rotateX(0deg)";
                      }}
                      onClick={toggleExtrasFlipOnTouch}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                        }}
                      >
                        <img
                          src={encodeURI("/images/Rectangle 64.svg")}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          transform: "rotateX(180deg)",
                          backgroundColor: "#f2f2f2",
                          borderRadius: 2,
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 20,
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontSize: 18,
                            color: "#333",
                            fontWeight: 700,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          Google Chicago
                        </h4>
                        <p
                          style={{
                            marginTop: 10,
                            fontSize: 13,
                            color: "#777",
                            lineHeight: 1.4,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          Visiting Google&apos;s Chicago office — a day full of learning
                          and inspiration.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 932,
                      top: 524,
                      width: 356,
                      height: 185,
                      zIndex: 1,
                      transform: "rotate(-0.5deg)",
                      perspective: "1000px",
                    }}
                  >
                    <div
                      className="group"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        transition:
                          "transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        transformStyle: "preserve-3d",
                        transform: "rotateX(0deg)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "rotateX(180deg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "rotateX(0deg)";
                      }}
                      onClick={toggleExtrasFlipOnTouch}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                        }}
                      >
                        <img
                          src={encodeURI("/images/Rectangle 63.svg")}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          transform: "rotateX(180deg)",
                          backgroundColor: "#f2f2f2",
                          borderRadius: 2,
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 20,
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontSize: 18,
                            color: "#333",
                            fontWeight: 700,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          Team Photo
                        </h4>
                        <p
                          style={{
                            marginTop: 10,
                            fontSize: 13,
                            color: "#777",
                            lineHeight: 1.4,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          A snapshot with an amazing group of peers and mentors who made
                          the journey memorable.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Pushpins — one per photo, positioned near top-center of each */}
                <img
                  src={encodeURI("/images/Rectangle 96.svg")}
                  alt=""
                  className="max-lg:-translate-x-[135px]"
                  style={{
                    position: "absolute",
                    left: 470,
                    top: 175,
                    width: 78,
                    height: 87,
                    zIndex: 5,
                  }}
                />
                <img
                  src={encodeURI("/images/Rectangle 96.svg")}
                  alt=""
                  className="max-lg:-translate-x-[135px]"
                  style={{
                    position: "absolute",
                    left: 810,
                    top: 165,
                    width: 78,
                    height: 87,
                    zIndex: 5,
                  }}
                />
                <img
                  src={encodeURI("/images/Rectangle 96.svg")}
                  alt=""
                  className="max-lg:-translate-x-[135px]"
                  style={{
                    position: "absolute",
                    left: 440,
                    top: 425,
                    width: 78,
                    height: 87,
                    zIndex: 5,
                  }}
                />
                <img
                  src={encodeURI("/images/Rectangle 96.svg")}
                  alt=""
                  className="max-lg:-translate-x-[135px]"
                  style={{
                    position: "absolute",
                    left: 845,
                    top: 515,
                    width: 78,
                    height: 87,
                    zIndex: 5,
                  }}
                />
                <img
                  src={encodeURI("/images/Rectangle 96.svg")}
                  alt=""
                  className="max-lg:-translate-x-[135px]"
                  style={{
                    position: "absolute",
                    left: 1230,
                    top: 210,
                    width: 78,
                    height: 87,
                    zIndex: 5,
                  }}
                />
                <img
                  src={encodeURI("/images/Rectangle 96.svg")}
                  alt=""
                  className="max-lg:-translate-x-[135px]"
                  style={{
                    position: "absolute",
                    left: 1110,
                    top: 355,
                    width: 78,
                    height: 87,
                    zIndex: 5,
                  }}
                />
                <img
                  src={encodeURI("/images/Rectangle 96.svg")}
                  alt=""
                  className="max-lg:-translate-x-[135px]"
                  style={{
                    position: "absolute",
                    left: 1210,
                    top: 625,
                    width: 78,
                    height: 87,
                    zIndex: 5,
                  }}
                />
                {/* Title — typography matches Projects section heading */}
                <div
                  className="hidden lg:block"
                  style={{
                    position: "absolute",
                    top: 40,
                    left: 300,
                    width: "fit-content",
                    transform: "rotate(0.4deg)",
                  }}
                >
                  <h2
                    style={{
                      fontFamily:
                        "var(--font-nunito), 'Nunito Sans', system-ui, sans-serif",
                      fontSize: 40,
                      fontWeight: 800,
                      fontStyle: "italic",
                      color: "#FAF0DC",
                      lineHeight: 1.1,
                      background: "#400909",
                      padding: "8px 20px",
                      display: "inline-block",
                      whiteSpace: "nowrap",
                    }}
                  >
                    life outside the terminal
                  </h2>
                  <div
                    style={{
                      height: 4,
                      background: "#FAF0DC",
                      marginTop: 6,
                      width: "100%",
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: 18,
                      color: "rgba(250, 240, 220, 0.8)",
                      fontStyle: "italic",
                      marginTop: 8,
                    }}
                  >
                    psst... hover over the photos to flip them
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── CONTACT ── */}
          <div ref={contactContainerRef} style={{ width: "100%" }}>
            <div
              style={{
                width: "100%",
                height: 1024 * contactContainerScale + 82,
                overflow: "visible",
                backgroundColor: "#db5e5e",
                margin: 0,
                padding: 0,
                position: "relative",
              }}
            >
              <div
                id="contact"
                className="scroll-mt-28 max-lg:-translate-x-[35px]"
                style={{
                  width: 1440,
                  height: 1024,
                  position: "relative",
                  transformOrigin: "top left",
                  transform: `scale(${contactContainerScale})`,
                }}
              >
                {/* Phone handset — left side, connected to cord */}
                <img
                  src={encodeURI("/images/Rectangle 151.svg")}
                  alt=""
                  className="max-lg:translate-x-[280px] max-lg:-translate-y-[40px] max-lg:scale-[1.12] lg:translate-x-[300px] lg:-translate-y-[72px]"
                  style={{
                    position: "absolute",
                    left: -50,
                    top: -340,
                    width: 460,
                    height: 1220,
                    objectFit: "contain",
                    zIndex: 2,
                  }}
                />
                {/* Speech bubble (body + tail) + copy — lg+ only: scale down; mobile uses full design coords like the rest of #contact */}
                <div
                  className="origin-top-left max-lg:scale-[0.82] max-lg:translate-x-[250px] lg:origin-[48px_12px] lg:translate-x-[242px] lg:scale-[0.74]"
                  style={{
                    position: "absolute",
                    left: 540,
                    top: 128,
                    width: 600,
                    height: 250,
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: 600,
                      height: 250,
                      backgroundColor: "#400909",
                      borderRadius: 100,
                      zIndex: 1,
                    }}
                  >
                    {/* Bubble tail — large triangle pointing down-left toward phone */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 36,
                        left: -140,
                        width: 170,
                        height: 85,
                        backgroundColor: "#400909",
                        clipPath: "polygon(100% 0, 0 96%, 100% 100%)",
                      }}
                    />
                  </div>

                  <p
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 20,
                      width: 600,
                      fontSize: 88,
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontWeight: 800,
                      fontStyle: "italic",
                      color: "#ffffff",
                      lineHeight: "normal",
                      textAlign: "center",
                      zIndex: 2,
                      margin: 0,
                    }}
                  >
                    let&apos;s talk!!
                  </p>

                  <p
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 140,
                      width: 600,
                      fontSize: 24,
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontWeight: 800,
                      fontStyle: "italic",
                      color: "#ffffff",
                      lineHeight: "normal",
                      textAlign: "center",
                      zIndex: 2,
                      margin: 0,
                    }}
                  >
                    pick your platform, i don&apos;t bite!
                  </p>
                </div>

                {/* Contact cards */}
                <a
                  href="https://github.com/Nupur-Gudigar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform duration-300 hover:scale-[1.03]"
                  style={{
                    position: "absolute",
                    left: 242,
                    top: 493,
                    width: 612,
                    height: 168,
                    zIndex: 3,
                    display: "block",
                    textDecoration: "none",
                  }}
                >
                  <img
                    src={encodeURI("/images/Component 17.svg")}
                    alt="GitHub"
                    className="contact-card-float contact-card-float-delay-1"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </a>

                <a
                  href="https://discord.com/users/422368252531048469"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform duration-300 hover:scale-[1.03]"
                  style={{
                    position: "absolute",
                    left: 802,
                    top: 446,
                    width: 512,
                    height: 274,
                    zIndex: 3,
                    display: "block",
                    textDecoration: "none",
                  }}
                >
                  <img
                    src={encodeURI("/images/Component 18.svg")}
                    alt="Discord"
                    className="contact-card-float contact-card-float-delay-2"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </a>

                <a
                  href="mailto:nupurgudigar.tech@gmail.com"
                  className="transition-transform duration-300 hover:scale-[1.03]"
                  style={{
                    position: "absolute",
                    left: 235,
                    top: 691,
                    width: 693,
                    height: 167,
                    zIndex: 3,
                    display: "block",
                    textDecoration: "none",
                  }}
                >
                  <img
                    src={encodeURI("/images/Component 19.svg")}
                    alt="Email"
                    className="contact-card-float contact-card-float-delay-3"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </a>

                <a
                  href="https://www.linkedin.com/in/nupur-gudigar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform duration-300 hover:scale-[1.03]"
                  style={{
                    position: "absolute",
                    left: 799,
                    top: 633,
                    width: 498,
                    height: 292,
                    zIndex: 3,
                    display: "block",
                    textDecoration: "none",
                  }}
                >
                  <img
                    src={encodeURI("/images/Component 20.svg")}
                    alt="LinkedIn"
                    className="contact-card-float contact-card-float-delay-4"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </a>

                <img
                  src={encodeURI("/images/Rectangle 147.svg")}
                  alt="Achievement Made"
                  style={{
                    position: "absolute",
                    left: "54%",
                    top: 885,
                    width: 420,
                    height: 75,
                    objectFit: "contain",
                    transform: "translateX(-50%)",
                    zIndex: 3,
                  }}
                />

              </div>

              <div
                className="max-lg:!h-[130px] max-lg:!bottom-0 max-lg:translate-y-[88px]"
                style={{
                  position: "absolute",
                  bottom: -62,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "200vw",
                  height: 86,
                  backgroundColor: "rgba(255,255,255,0.14)",
                  zIndex: 1,
                }}
              />
              <p
                className="max-lg:text-[clamp(11px,3.2vw,16px)] max-lg:px-[max(12px,env(safe-area-inset-left))] max-lg:pr-[max(12px,env(safe-area-inset-right))] max-lg:!h-[130px] max-lg:pb-[30px] max-lg:!bottom-0 max-lg:translate-y-[82px]"
                style={{
                  position: "absolute",
                  bottom: -62,
                  left: 0,
                  width: "100%",
                  height: 86,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  fontSize: 18,
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontStyle: "italic",
                  fontWeight: 700,
                  color: "#f7ecec",
                  lineHeight: "normal",
                  zIndex: 2,
                  margin: 0,
                  boxSizing: "border-box",
                }}
              >
                © 2025 Nupur Gudigar · designed &amp; built with questionable sleep habits
              </p>
              <div
                className="max-lg:!right-auto max-lg:!left-1/2 max-lg:!-translate-x-[55%] max-lg:!bottom-0 max-lg:translate-y-[90px]"
                style={{
                  position: "absolute",
                  bottom: -62,
                  right: 24,
                  height: 86,
                  display: "flex",
                  alignItems: "center",
                  zIndex: 200,
                  pointerEvents: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    backgroundColor: "rgba(38, 35, 35, 0.84)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    borderRadius: 12,
                    padding: "9px 17px",
                    boxShadow: "0 2px 14px rgba(0,0,0,0.3)",
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <svg
                    width={22}
                    height={22}
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                    style={{
                      color: "#E8A4A4",
                      flexShrink: 0,
                      display: "block",
                    }}
                  >
                    <path
                      d="M3.5 12.5 Q12 6.25 20.5 12.5"
                      stroke="currentColor"
                      strokeWidth={2.25}
                      strokeLinecap="round"
                    />
                    <circle cx={12} cy={15.25} r={3.25} fill="currentColor" />
                  </svg>
                  <span
                    style={{
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontSize: 17,
                      fontWeight: 600,
                      color: "#E8A4A4",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {viewCount === "loading"
                      ? "…"
                      : viewCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}