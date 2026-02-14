"use client";
import { useState, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// N88N SHADOW MONARCH SYSTEM v4.0 — PIXEL TRICORDER EDITION
// "Arise." — 88 Shadows. One Sovereign. Quest Engine Rebuild.
// Optimized for Pixel 10 Pro XL (1344×2992, 6.8" OLED)
// ═══════════════════════════════════════════════════════════════

const RANKS = {
  S: { color: "#FFD700", glow: "rgba(255,215,0,0.3)", label: "S-RANK", tier: 0 },
  A: { color: "#39FF14", glow: "rgba(57,255,20,0.25)", label: "A-RANK", tier: 1 },
  B: { color: "#00BFFF", glow: "rgba(0,191,255,0.25)", label: "B-RANK", tier: 2 },
  C: { color: "#FF6A00", glow: "rgba(255,106,0,0.25)", label: "C-RANK", tier: 3 },
  D: { color: "#FF00FF", glow: "rgba(255,0,255,0.2)", label: "D-RANK", tier: 4 },
  F: { color: "#FF2222", glow: "rgba(255,34,34,0.2)", label: "F-RANK", tier: 5 },
  "—": { color: "#2A3040", glow: "rgba(42,48,64,0.2)", label: "UNRANKED", tier: 6 },
};

const DOMAINS = [
  { id: "recon", name: "RECON", icon: "👁", color: "#FFFFFF" },
  { id: "commerce", name: "COMMERCE", icon: "⚡", color: "#FF4500" },
  { id: "signal", name: "SIGNAL", icon: "📡", color: "#FF00FF" },
  { id: "ops", name: "OPS", icon: "⚙", color: "#00FFFF" },
  { id: "forge", name: "FORGE", icon: "🔨", color: "#7F00FF" },
  { id: "scale", name: "SCALE", icon: "🚀", color: "#39FF14" },
  { id: "sovereign", name: "SOVEREIGN", icon: "👑", color: "#FFD700" },
  { id: "classified", name: "CLASSIFIED", icon: "◼", color: "#888" },
];

const RINGS = [
  { id: 0, cls: "Faculty", designation: "The Council", color: "#E5E4E2", prefix: "0" },
  { id: 1, cls: "G-Class", designation: "The Surveyor", color: "#FFFFFF", prefix: "G" },
  { id: 2, cls: "F-Class", designation: "The Pilot", color: "#FF4500", prefix: "F" },
  { id: 3, cls: "E-Class", designation: "The Chief", color: "#FF00FF", prefix: "E" },
  { id: 4, cls: "D-Class", designation: "The Operator", color: "#00FFFF", prefix: "D" },
  { id: 5, cls: "C-Class", designation: "The Commander", color: "#7F00FF", prefix: "C" },
  { id: 6, cls: "B-Class", designation: "The Captain", color: "#39FF14", prefix: "B" },
  { id: 7, cls: "A-Class", designation: "The Admiral", color: "#FFD700", prefix: "A" },
  { id: 8, cls: "S-Class", designation: "The Entity", color: "#888888", prefix: "S" },
];

const STATUSES = ["ACTIVE", "TESTING", "SCOUTED", "PROBATION", "EXTRACTED", "VACANT"];
const STATUS_META = {
  ACTIVE: { color: "#39FF14", icon: "●" },
  TESTING: { color: "#00BFFF", icon: "◎" },
  SCOUTED: { color: "#FFD700", icon: "◇" },
  PROBATION: { color: "#FF6A00", icon: "⚠" },
  EXTRACTED: { color: "#FF2222", icon: "✕" },
  VACANT: { color: "#1E2433", icon: "○" },
};

const VIAB_COLOR = { HIGH: "#39FF14", MEDIUM: "#FFD700", LOW: "#FF6A00", NONE: "#FF2222", "": "#2A3040" };

const ESSENTIAL_TOOLS = new Set(["Cursor", "Framer", "GitHub", "Python", "Claude Projects", "v0.dev"]);

const makeShadow = (num: number, data: Record<string, any> = {}) => ({
  num,
  id: `SH-${String(num).padStart(2, "0")}`,
  name: data.name || "[VACANT]",
  tool: data.tool || "—",
  domain: data.domain || "recon",
  ring: data.ring ?? null,
  ringId: data.ringId || "",
  rank: data.rank || "—",
  status: data.status || "VACANT",
  body: data.body || "",
  url: data.url || "",
  level: data.level || 0,
  xp: data.xp || 0,
  essential: ESSENTIAL_TOOLS.has(data.tool),
  buildKill: {
    buildNotes: "", killSwitch: "", buildTime: "",
    freeViability: "", verdict: "", tested: false, testDate: "",
    ...(data.buildKill || {}),
  },
});

// ═══ SEED DATA — Fleet Manifest v4.1 (81 Shadows + 7 Vacant) ═══
const SEED = [
  // Ring 0 — Faculty
  { num: 1, name: "THE COUNCIL", tool: "The Bridge", domain: "classified", ring: 0, ringId: "0-00", rank: "—", status: "ACTIVE", body: "/// ARCHIVE: SEALED.", level: 0 },
  // Ring 1 — G-Class (Recon)
  { num: 2, name: "THE SCOUT", tool: "Smartphone", domain: "recon", ring: 1, ringId: "G-01", rank: "A", status: "ACTIVE", body: '"The Eyes." Weaponize your environment.', level: 4 },
  { num: 3, name: "THE ORACLE", tool: "Gemini", domain: "recon", ring: 1, ringId: "G-02", rank: "A", status: "ACTIVE", body: '"The Brain." AI Strategist.', url: "https://gemini.google.com", level: 5, buildKill: { tested: true, testDate: "2026-01-15", freeViability: "HIGH", buildTime: "Instant", killSwitch: "Rate limits after 30 queries/min", verdict: "Essential for strategy." } },
  { num: 4, name: "THE RELAY", tool: "Gmail", domain: "recon", ring: 1, ringId: "G-03", rank: "A", status: "ACTIVE", body: '"The Uplink." Command line.', url: "https://mail.google.com", level: 4 },
  { num: 5, name: "THE TRAP", tool: "Google Forms", domain: "recon", ring: 1, ringId: "G-04", rank: "B", status: "ACTIVE", body: '"The Hook." Capture attention.', url: "https://forms.google.com", level: 3 },
  { num: 6, name: "THE OUTPOST", tool: "Google Voice", domain: "recon", ring: 1, ringId: "G-05", rank: "B", status: "ACTIVE", body: "The Captain's Red Phone.", url: "https://voice.google.com", level: 3 },
  { num: 7, name: "THE ANALYST", tool: "NotebookLM", domain: "recon", ring: 1, ringId: "G-06", rank: "A", status: "ACTIVE", body: '"The Filter." Signal from noise.', url: "https://notebooklm.google.com", level: 5, buildKill: { tested: true, testDate: "2026-01-20", freeViability: "HIGH", buildTime: "5 mins", verdict: "Mandatory for deep research." } },
  { num: 8, name: "THE ARCHIVE", tool: "Google Drive", domain: "recon", ring: 1, ringId: "G-07", rank: "S", status: "ACTIVE", body: '"The Memory." Critical intel.', url: "https://drive.google.com", level: 8 },
  { num: 9, name: "THE TELESCOPE", tool: "YouTube", domain: "recon", ring: 1, ringId: "G-08", rank: "A", status: "ACTIVE", body: '"The Horizon." Long-range recon.', url: "https://youtube.com", level: 5 },
  { num: 10, name: "THE SPARK", tool: "Google Keep", domain: "recon", ring: 1, ringId: "G-09", rank: "B", status: "ACTIVE", body: '"The Ignition." Raw energy.', url: "https://keep.google.com", level: 3 },
  { num: 11, name: "THE BEACON", tool: "Google Calendar", domain: "recon", ring: 1, ringId: "G-10", rank: "B", status: "ACTIVE", body: '"The Clock." Time is the weapon.', url: "https://calendar.google.com", level: 3 },
  { num: 12, name: "[VACANT]", tool: "—", domain: "recon", ring: 1, ringId: "G-11", rank: "—", status: "VACANT", level: 0 },
  // Ring 2 — F-Class (Commerce)
  { num: 13, name: "THE SIGNAL", tool: "Shopify", domain: "commerce", ring: 2, ringId: "F-01", rank: "A", status: "ACTIVE", body: "Core transaction engine.", url: "https://shopify.com", level: 5, buildKill: { tested: true, testDate: "2025-12-10", freeViability: "LOW", buildTime: "2 hours", killSwitch: "Free trial only. Must pay $29/mo.", verdict: "Essential. Budget allocated." } },
  { num: 14, name: "THE FOUNDRY", tool: "Printful", domain: "commerce", ring: 2, ringId: "F-02", rank: "B", status: "ACTIVE", body: "On-demand manufacturing.", url: "https://printful.com", level: 3 },
  { num: 15, name: "THE VAULT", tool: "Stripe", domain: "commerce", ring: 2, ringId: "F-03", rank: "A", status: "ACTIVE", body: "Capital bridge.", url: "https://stripe.com", level: 5 },
  { num: 16, name: "THE PULSE", tool: "Klaviyo", domain: "commerce", ring: 2, ringId: "F-04", rank: "B", status: "ACTIVE", body: "Retention comms.", url: "https://klaviyo.com", level: 3 },
  { num: 17, name: "THE PROOF", tool: "Loox", domain: "commerce", ring: 2, ringId: "F-05", rank: "C", status: "TESTING", body: "Social proof.", url: "https://loox.io", level: 2 },
  { num: 18, name: "THE SMS", tool: "PostScript", domain: "commerce", ring: 2, ringId: "F-06", rank: "C", status: "TESTING", body: "Mobile frequency.", url: "https://postscript.io", level: 2 },
  { num: 19, name: "THE MARKET", tool: "TikTok Shop", domain: "commerce", ring: 2, ringId: "F-07", rank: "B", status: "TESTING", body: "Social bazaar.", url: "https://shop.tiktok.com", level: 2 },
  { num: 20, name: "THE CARGO", tool: "Kanban", domain: "commerce", ring: 2, ringId: "F-08", rank: "B", status: "ACTIVE", body: "Visual flow.", level: 3 },
  { num: 21, name: "[VACANT]", tool: "—", domain: "commerce", ring: 2, ringId: "F-09", rank: "—", status: "VACANT", level: 0 },
  { num: 22, name: "[VACANT]", tool: "—", domain: "commerce", ring: 2, ringId: "F-10", rank: "—", status: "VACANT", level: 0 },
  { num: 23, name: "[VACANT]", tool: "—", domain: "commerce", ring: 2, ringId: "F-11", rank: "—", status: "VACANT", level: 0 },
  // Ring 3 — E-Class (Signal)
  { num: 24, name: "THE SCRIBE", tool: "Ghostwriter", domain: "signal", ring: 3, ringId: "E-01", rank: "A", status: "ACTIVE", body: '"Nuance & Tone."', level: 4 },
  { num: 25, name: "THE RADAR", tool: "Perplexity", domain: "signal", ring: 3, ringId: "E-02", rank: "A", status: "ACTIVE", body: '"The Source."', url: "https://perplexity.ai", level: 5, buildKill: { tested: true, testDate: "2026-01-18", freeViability: "HIGH", buildTime: "Instant", verdict: "Replaces Google." } },
  { num: 26, name: "THE MIC", tool: "Oasis", domain: "signal", ring: 3, ringId: "E-03", rank: "B", status: "ACTIVE", body: '"The Input." Voice.', url: "https://oasis.ai", level: 3 },
  { num: 27, name: "THE ALCHEMY", tool: "Castmagic", domain: "signal", ring: 3, ringId: "E-04", rank: "B", status: "TESTING", body: '"The Multiplier."', url: "https://castmagic.io", level: 2 },
  { num: 28, name: "THE PRESS", tool: "Beehiiv", domain: "signal", ring: 3, ringId: "E-05", rank: "A", status: "ACTIVE", body: '"The Platform."', url: "https://beehiiv.com", level: 4 },
  { num: 29, name: "THE CUTTER", tool: "Opus Clip", domain: "signal", ring: 3, ringId: "E-06", rank: "B", status: "TESTING", body: '"Viral Engine."', url: "https://opus.pro", level: 3 },
  { num: 30, name: "THE LENS", tool: "Midjourney", domain: "signal", ring: 3, ringId: "E-07", rank: "S", status: "ACTIVE", body: '"The Illustrator."', url: "https://midjourney.com", level: 9, buildKill: { tested: true, testDate: "2025-11-05", freeViability: "NONE", buildTime: "30 mins", killSwitch: "No free tier. $10/mo minimum.", verdict: "Worth every cent. Core asset." } },
  { num: 31, name: "THE ASSET", tool: "IP Portfolio", domain: "signal", ring: 3, ringId: "E-08", rank: "A", status: "ACTIVE", body: '"The Copyright."', level: 4 },
  { num: 32, name: "[VACANT]", tool: "—", domain: "signal", ring: 3, ringId: "E-09", rank: "—", status: "VACANT", level: 0 },
  { num: 33, name: "[VACANT]", tool: "—", domain: "signal", ring: 3, ringId: "E-10", rank: "—", status: "VACANT", level: 0 },
  { num: 34, name: "[VACANT]", tool: "—", domain: "signal", ring: 3, ringId: "E-11", rank: "—", status: "VACANT", level: 0 },
  // Ring 4 — D-Class (Ops)
  { num: 35, name: "THE SYNAPSE", tool: "Make.com", domain: "ops", ring: 4, ringId: "D-01", rank: "A", status: "ACTIVE", body: "Nervous system.", url: "https://make.com", level: 5 },
  { num: 36, name: "THE BRIDGE", tool: "Zapier", domain: "ops", ring: 4, ringId: "D-02", rank: "B", status: "ACTIVE", body: "Universal integration.", url: "https://zapier.com", level: 3 },
  { num: 37, name: "THE MATRIX", tool: "Airtable", domain: "ops", ring: 4, ringId: "D-03", rank: "A", status: "ACTIVE", body: "Relational database.", url: "https://airtable.com", level: 5 },
  { num: 38, name: "THE RECORDER", tool: "Fireflies.AI", domain: "ops", ring: 4, ringId: "D-04", rank: "B", status: "ACTIVE", body: "Meeting recall.", url: "https://fireflies.ai", level: 3 },
  { num: 39, name: "THE FOCUS", tool: "Flow Desktop", domain: "ops", ring: 4, ringId: "D-05", rank: "C", status: "ACTIVE", body: "Signal management.", url: "https://flowapp.info", level: 2 },
  { num: 40, name: "THE COMMS", tool: "Slack", domain: "ops", ring: 4, ringId: "D-06", rank: "A", status: "ACTIVE", body: "Crew coordination.", url: "https://slack.com", level: 5 },
  { num: 41, name: "THE INTAKE", tool: "Tally", domain: "ops", ring: 4, ringId: "D-07", rank: "B", status: "ACTIVE", body: "Data collection.", url: "https://tally.so", level: 3 },
  { num: 42, name: "THE CHRONOS", tool: "Clockify", domain: "ops", ring: 4, ringId: "D-08", rank: "C", status: "ACTIVE", body: "Time auditing.", url: "https://clockify.me", level: 2 },
  { num: 43, name: "[VACANT]", tool: "—", domain: "ops", ring: 4, ringId: "D-09", rank: "—", status: "VACANT", level: 0 },
  { num: 44, name: "[VACANT]", tool: "—", domain: "ops", ring: 4, ringId: "D-10", rank: "—", status: "VACANT", level: 0 },
  { num: 45, name: "[VACANT]", tool: "—", domain: "ops", ring: 4, ringId: "D-11", rank: "—", status: "VACANT", level: 0 },
  // Ring 5 — C-Class (Forge)
  { num: 46, name: "THE ARCHITECT", tool: "Cursor", domain: "forge", ring: 5, ringId: "C-01", rank: "A", status: "ACTIVE", body: "AI-native code.", url: "https://cursor.com", level: 5, buildKill: { tested: true, testDate: "2026-01-22", freeViability: "LOW", buildTime: "Instant", killSwitch: "2-week trial. $20/mo after.", verdict: "Non-negotiable. Core build tool." } },
  { num: 47, name: "THE CLOUD LAB", tool: "Replit", domain: "forge", ring: 5, ringId: "C-02", rank: "B", status: "TESTING", body: "Instant infra.", url: "https://replit.com", level: 3 },
  { num: 48, name: "THE INTERFACE", tool: "v0.dev", domain: "forge", ring: 5, ringId: "C-03", rank: "A", status: "ACTIVE", body: "Generative UI.", url: "https://v0.dev", level: 4 },
  { num: 49, name: "THE CANVAS", tool: "Framer", domain: "forge", ring: 5, ringId: "C-04", rank: "A", status: "ACTIVE", body: "Web construction.", url: "https://framer.com", level: 5, buildKill: { tested: true, testDate: "2025-12-15", freeViability: "MEDIUM", buildTime: "1 hour", killSwitch: "1 free site. Custom domains require Pro.", verdict: "Essential for deployment." } },
  { num: 50, name: "THE LEDGER", tool: "GitHub", domain: "forge", ring: 5, ringId: "C-05", rank: "S", status: "ACTIVE", body: "Version control.", url: "https://github.com", level: 8 },
  { num: 51, name: "THE MEMORY", tool: "Pinecone", domain: "forge", ring: 5, ringId: "C-06", rank: "B", status: "TESTING", body: "Vector storage.", url: "https://pinecone.io", level: 2 },
  { num: 52, name: "THE STEEL", tool: "Python", domain: "forge", ring: 5, ringId: "C-07", rank: "S", status: "ACTIVE", body: "Core material.", url: "https://python.org", level: 9 },
  { num: 53, name: "THE CONNECTION", tool: "API Uplink", domain: "forge", ring: 5, ringId: "C-08", rank: "A", status: "ACTIVE", body: "System handshakes.", level: 4 },
  { num: 54, name: "[VACANT]", tool: "—", domain: "forge", ring: 5, ringId: "C-09", rank: "—", status: "VACANT", level: 0 },
  { num: 55, name: "[VACANT]", tool: "—", domain: "forge", ring: 5, ringId: "C-10", rank: "—", status: "VACANT", level: 0 },
  { num: 56, name: "[VACANT]", tool: "—", domain: "forge", ring: 5, ringId: "C-11", rank: "—", status: "VACANT", level: 0 },
  // Ring 6 — B-Class (Scale)
  { num: 57, name: "THE NETWORK", tool: "Meta Ads", domain: "scale", ring: 6, ringId: "B-01", rank: "B", status: "TESTING", body: "Social targeting.", url: "https://business.facebook.com", level: 3 },
  { num: 58, name: "THE SEARCH", tool: "Google Ads", domain: "scale", ring: 6, ringId: "B-02", rank: "B", status: "TESTING", body: "Intent capture.", url: "https://ads.google.com", level: 3 },
  { num: 59, name: "THE VIRAL", tool: "TikTok Ads", domain: "scale", ring: 6, ringId: "B-03", rank: "C", status: "TESTING", body: "Discovery engine.", url: "https://ads.tiktok.com", level: 2 },
  { num: 60, name: "THE TRUTH", tool: "Triple Whale", domain: "scale", ring: 6, ringId: "B-04", rank: "B", status: "TESTING", body: "Attribution.", url: "https://triplewhale.com", level: 2 },
  { num: 61, name: "THE STUDIO", tool: "Creative OS", domain: "scale", ring: 6, ringId: "B-05", rank: "C", status: "ACTIVE", body: "Design mgmt.", url: "https://creativeos.io", level: 2 },
  { num: 62, name: "THE HOOK", tool: "The Offer", domain: "scale", ring: 6, ringId: "B-06", rank: "A", status: "ACTIVE", body: "Value engineering.", level: 5 },
  { num: 63, name: "THE FUNNEL", tool: "Landing Page", domain: "scale", ring: 6, ringId: "B-07", rank: "B", status: "ACTIVE", body: "Conversion arch.", level: 3 },
  { num: 64, name: "THE FUEL", tool: "The Budget", domain: "scale", ring: 6, ringId: "B-08", rank: "A", status: "ACTIVE", body: "Financial strategy.", level: 5 },
  { num: 65, name: "[VACANT]", tool: "—", domain: "scale", ring: 6, ringId: "B-09", rank: "—", status: "VACANT", level: 0 },
  { num: 66, name: "[VACANT]", tool: "—", domain: "scale", ring: 6, ringId: "B-10", rank: "—", status: "VACANT", level: 0 },
  { num: 67, name: "[VACANT]", tool: "—", domain: "scale", ring: 6, ringId: "B-11", rank: "—", status: "VACANT", level: 0 },
  // Ring 7 — A-Class (Sovereign)
  { num: 68, name: "THE GPT", tool: "Custom GPTs", domain: "sovereign", ring: 7, ringId: "A-01", rank: "A", status: "ACTIVE", body: "Specialized agents.", url: "https://chatgpt.com", level: 5 },
  { num: 69, name: "THE PROJECT", tool: "Claude Projects", domain: "sovereign", ring: 7, ringId: "A-02", rank: "S", status: "ACTIVE", body: "Deep context engine.", url: "https://claude.ai", level: 9, buildKill: { tested: true, testDate: "2026-01-25", freeViability: "HIGH", buildTime: "Instant", verdict: "Command center. Irreplaceable." } },
  { num: 70, name: "THE WORLD BUILDER", tool: "Midjourney", domain: "sovereign", ring: 7, ringId: "A-03", rank: "S", status: "ACTIVE", body: "Visual world-building.", url: "https://midjourney.com", level: 8 },
  { num: 71, name: "THE DIRECTOR", tool: "Runway", domain: "sovereign", ring: 7, ringId: "A-04", rank: "B", status: "TESTING", body: "AI video gen.", url: "https://runwayml.com", level: 2 },
  { num: 72, name: "THE WEAVER", tool: "n8n", domain: "sovereign", ring: 7, ringId: "A-05", rank: "A", status: "ACTIVE", body: "Self-hosted automation.", url: "https://n8n.io", level: 5 },
  { num: 73, name: "THE VESSEL", tool: "Docker + Portainer", domain: "sovereign", ring: 7, ringId: "A-06", rank: "A", status: "ACTIVE", body: "Container command.", url: "https://docker.com", level: 5 },
  { num: 74, name: "THE LOCAL BRAIN", tool: "Ollama", domain: "sovereign", ring: 7, ringId: "A-07", rank: "A", status: "ACTIVE", body: "Private intelligence.", url: "https://ollama.com", level: 5 },
  { num: 75, name: "THE MESSENGER", tool: "Twilio", domain: "sovereign", ring: 7, ringId: "A-08", rank: "B", status: "ACTIVE", body: "SMS/Voice API.", url: "https://twilio.com", level: 3 },
  { num: 76, name: "[VACANT]", tool: "—", domain: "sovereign", ring: 7, ringId: "A-09", rank: "—", status: "VACANT", level: 0 },
  { num: 77, name: "[VACANT]", tool: "—", domain: "sovereign", ring: 7, ringId: "A-10", rank: "—", status: "VACANT", level: 0 },
  { num: 78, name: "[VACANT]", tool: "—", domain: "sovereign", ring: 7, ringId: "A-11", rank: "—", status: "VACANT", level: 0 },
  // Ring 8 — S-Class (Classified)
  { num: 79, name: "THE BLACK BOX", tool: "[CLASSIFIED]", domain: "classified", ring: 8, ringId: "S-01", rank: "—", status: "ACTIVE", body: "Final integration.", level: 0 },
  { num: 80, name: "THE ENTITY", tool: "[CLASSIFIED]", domain: "classified", ring: 8, ringId: "S-02", rank: "—", status: "ACTIVE", body: "/// BEYOND THE EVENT HORIZON.", level: 0 },
  { num: 81, name: "[VACANT]", tool: "—", domain: "classified", ring: 8, ringId: "S-03", rank: "—", status: "VACANT", level: 0 },
  // Expansion slots 82-88
  { num: 82, name: "[VACANT]", tool: "—", domain: "classified", ring: 8, ringId: "S-04", rank: "—", status: "VACANT", level: 0 },
  { num: 83, name: "[VACANT]", tool: "—", domain: "classified", ring: 8, ringId: "S-05", rank: "—", status: "VACANT", level: 0 },
  { num: 84, name: "[VACANT]", tool: "—", domain: "classified", ring: 8, ringId: "S-06", rank: "—", status: "VACANT", level: 0 },
  { num: 85, name: "[VACANT]", tool: "—", domain: "classified", ring: 8, ringId: "S-07", rank: "—", status: "VACANT", level: 0 },
  { num: 86, name: "[VACANT]", tool: "—", domain: "classified", ring: 8, ringId: "S-08", rank: "—", status: "VACANT", level: 0 },
  { num: 87, name: "[VACANT]", tool: "—", domain: "classified", ring: 8, ringId: "S-09", rank: "—", status: "VACANT", level: 0 },
  { num: 88, name: "[VACANT]", tool: "—", domain: "classified", ring: 8, ringId: "S-10", rank: "—", status: "VACANT", level: 0 },
];

const buildDefaultArmy = () => SEED.map(s => makeShadow(s.num, s));

const DEFAULT_SCOUTS = [
  { tool: "Recraft V3", domain: "signal", killSwitch: "No Commercial License on Free", rank: "—" },
  { tool: "Relume", domain: "forge", killSwitch: "1-Page Limit", rank: "—" },
  { tool: "Napkin.ai", domain: "signal", killSwitch: "No SVG / Watermark", rank: "—" },
  { tool: "Bolt.new", domain: "forge", killSwitch: "Token/Rate Limits", rank: "—" },
  { tool: "Suno", domain: "signal", killSwitch: "Audio Upload Lock", rank: "—" },
  { tool: "Kling 3.0", domain: "signal", killSwitch: "5-Second Duration Cap", rank: "—" },
  { tool: "Firecrawl", domain: "sovereign", killSwitch: "Rate Limits on Free", rank: "—" },
  { tool: "Ngrok", domain: "sovereign", killSwitch: "Ephemeral URLs", rank: "—" },
  { tool: "Open WebUI", domain: "sovereign", killSwitch: "Requires Ollama", rank: "—" },
  { tool: "ChromaDB", domain: "sovereign", killSwitch: "Memory-bound", rank: "—" },
  { tool: "Whisper", domain: "sovereign", killSwitch: "GPU Required", rank: "—" },
];

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function ShadowMonarchSystem() {
  const [army, setArmy] = useState(buildDefaultArmy());
  const [scouts, setScouts] = useState(DEFAULT_SCOUTS);
  const [view, setView] = useState("quests");
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [filterDomain, setFilterDomain] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState(null);
  const [exchangeMode, setExchangeMode] = useState(false);
  const [exchangeSource, setExchangeSource] = useState(null);
  const [showScoutForm, setShowScoutForm] = useState(false);
  const [newScout, setNewScout] = useState({ tool: "", domain: "recon", killSwitch: "" });
  const [systemLog, setSystemLog] = useState([]);
  const [booted, setBooted] = useState(false);
  const [adminMode, setAdminMode] = useState(true);
  const [expandedRing, setExpandedRing] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 540px)");
    setIsMobile(mq.matches);
    const listener = (e) => setIsMobile(e.matches);
    mq.addListener?.(listener);
    return () => mq.removeListener?.(listener);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const a = await window.storage.get("n88n-shadows-v2");
        if (a && a.value) setArmy(JSON.parse(a.value));
      } catch {}
      try {
        const s = await window.storage.get("n88n-scouts-v2");
        if (s && s.value) setScouts(JSON.parse(s.value));
      } catch {}
      try {
        const l = await window.storage.get("n88n-syslog-v2");
        if (l && l.value) setSystemLog(JSON.parse(l.value));
      } catch {}
      setLoaded(true);
      setTimeout(() => setBooted(true), 1800);
    })();
  }, []);

  const save = useCallback(async (a, s, l) => {
    try { await window.storage.set("n88n-shadows-v2", JSON.stringify(a)); } catch {}
    try { await window.storage.set("n88n-scouts-v2", JSON.stringify(s)); } catch {}
    try { await window.storage.set("n88n-syslog-v2", JSON.stringify(l)); } catch {}
  }, []);

  const log = (msg) => {
    const entry = { ts: new Date().toISOString(), msg };
    const newLog = [entry, ...systemLog].slice(0, 50);
    setSystemLog(newLog);
    save(army, scouts, newLog);
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  const updateShadow = (num, updates) => {
    const na = army.map(s => s.num === num ? { ...s, ...updates } : s);
    setArmy(na);
    save(na, scouts, systemLog);
    if (selected && selected.num === num) setSelected({ ...selected, ...updates });
  };

  const updateBuildKill = (num, updates) => {
    const na = army.map(s => s.num === num ? { ...s, buildKill: { ...s.buildKill, ...updates } } : s);
    setArmy(na);
    save(na, scouts, systemLog);
    if (selected && selected.num === num) setSelected({ ...selected, buildKill: { ...selected.buildKill, ...updates } });
  };

  const onboardScout = (scout, targetNum) => {
    const slot = army.find(s => s.num === targetNum);
    if (!slot) return;
    const na = army.map(s => s.num === targetNum ? {
      ...s, name: scout.tool.toUpperCase().replace(/[^A-Z0-9 ]/g, ""), tool: scout.tool,
      domain: scout.domain, status: "TESTING", rank: "—",
      buildKill: { ...s.buildKill, killSwitch: scout.killSwitch }
    } : s);
    const ns = scouts.filter(sc => sc.tool !== scout.tool);
    setArmy(na);
    setScouts(ns);
    save(na, ns, systemLog);
    log(`Onboarded ${scout.tool} to SH-${String(targetNum).padStart(2, "0")}`);
    showToast(`${scout.tool} → SHADOW ARMY`);
  };

  const extractShadow = (num) => {
    const shadow = army.find(s => s.num === num);
    if (!shadow || shadow.status === "VACANT" || shadow.essential) return;
    const ns = [...scouts, { tool: shadow.tool, domain: shadow.domain, killSwitch: shadow.buildKill?.killSwitch || "", rank: shadow.rank }];
    const na = army.map(s => s.num === num ? {
      ...s, name: "[VACANT]", tool: "—", domain: s.domain, rank: "—", status: "VACANT", url: "",
      buildKill: { buildNotes: "", killSwitch: "", buildTime: "", freeViability: "", verdict: "", tested: false, testDate: "" }
    } : s);
    setArmy(na);
    setScouts(ns);
    save(na, ns, systemLog);
    log(`Extracted ${shadow.tool} from SH-${String(num).padStart(2, "0")}`);
    setSelected(null);
    showToast(`${shadow.tool} → SCOUT BENCH`);
  };

  const exchangeShadows = (num1, num2) => {
    const s1 = army.find(s => s.num === num1);
    const s2 = army.find(s => s.num === num2);
    if (!s1 || !s2) return;
    const na = army.map(s => {
      if (s.num === num1) return { ...s, name: s2.name, tool: s2.tool, domain: s2.domain, rank: s2.rank, status: s2.status, url: s2.url, buildKill: s2.buildKill };
      if (s.num === num2) return { ...s, name: s1.name, tool: s1.tool, domain: s1.domain, rank: s1.rank, status: s1.status, url: s1.url, buildKill: s1.buildKill };
      return s;
    });
    setArmy(na);
    save(na, scouts, systemLog);
    log(`Exchanged SH-${String(num1).padStart(2, "0")} ↔ SH-${String(num2).padStart(2, "0")}`);
    setExchangeMode(false);
    setExchangeSource(null);
    showToast(`EXCHANGE COMPLETE`);
  };

  const addScout = () => {
    if (!newScout.tool.trim()) return;
    const ns = [...scouts, { ...newScout }];
    setScouts(ns);
    save(army, ns, systemLog);
    log(`Scouted new tool: ${newScout.tool}`);
    setNewScout({ tool: "", domain: "recon", killSwitch: "" });
    setShowScoutForm(false);
    showToast(`${newScout.tool} → BENCH`);
  };

  const removeScout = (tool) => {
    const ns = scouts.filter(s => s.tool !== tool);
    setScouts(ns);
    save(army, ns, systemLog);
    log(`Removed scout: ${tool}`);
    showToast(`${tool} REMOVED`);
  };

  const resetSystem = () => {
    const defaults = buildDefaultArmy();
    setArmy(defaults);
    setScouts(DEFAULT_SCOUTS);
    setSystemLog([]);
    save(defaults, DEFAULT_SCOUTS, []);
    setSelected(null);
    showToast("SYSTEM RESET");
  };

  const stats = {
    active: army.filter(s => s.status === "ACTIVE").length,
    testing: army.filter(s => s.status === "TESTING").length,
    vacant: army.filter(s => s.status === "VACANT").length,
    tested: army.filter(s => s.buildKill?.tested).length,
    sRank: army.filter(s => s.rank === "S").length,
    aRank: army.filter(s => s.rank === "A").length,
    bench: scouts.length,
  };

  const getFleetReadiness = () => {
    const total = army.filter(s => s.status !== "VACANT").length;
    const ready = army.filter(s => s.status === "ACTIVE" && s.buildKill?.tested).length;
    return total > 0 ? Math.round((ready / total) * 100) : 0;
  };

  const getPriorityQueue = () => {
    const testing = army.filter(s => s.status === "TESTING");
    const partial = army.filter(s => s.status === "ACTIVE" && !s.buildKill?.tested);
    const fresh = army.filter(s => s.status === "SCOUTED");
    return { testing, partial, fresh };
  };

  const getClearedShadows = () => army.filter(s => s.status === "ACTIVE" && s.buildKill?.tested);

  // ═══ BOOT SCREEN ═══
  if (!booted) {
    return (
      <div style={{ background: "#030509", color: "#39FF14", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: isMobile ? 12 : 14 }}>
        <div style={{ fontSize: isMobile ? 24 : 32, fontWeight: 900, marginBottom: 12, textShadow: "0 0 12px #39FF14", animation: "pulse 1.5s ease infinite" }}>ARISE.</div>
        <div style={{ fontSize: isMobile ? 10 : 11, color: "#2A3555" }}>N88N SHADOW MONARCH SYSTEM v4.0</div>
        <div style={{ fontSize: isMobile ? 9 : 10, color: "#1E2433", marginTop: 4 }}>PIXEL TRICORDER EDITION</div>
      </div>
    );
  }

  const readiness = getFleetReadiness();
  const { testing, partial, fresh } = getPriorityQueue();
  const cleared = getClearedShadows();

  return (
    <div style={{ background: "#030509", color: "#B8C4D8", minHeight: "100vh", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", position: "relative", fontSize: isMobile ? 11 : 12 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #030509; }
        ::-webkit-scrollbar-thumb { background: #1E2433; border-radius: 2px; }
        input, textarea, select { font-family: 'JetBrains Mono', monospace; }
        button { -webkit-appearance: none; user-select: none; }
        button:active { transform: scale(0.98); opacity: 0.8; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
      `}</style>

      {toast && (
        <div style={{ position: "fixed", top: isMobile ? 12 : 16, right: isMobile ? 12 : 16, background: "#0E1220", border: "1px solid #39FF14", color: "#39FF14", padding: isMobile ? "8px 12px" : "10px 16px", borderRadius: 2, zIndex: 9999, fontSize: isMobile ? 9 : 10, animation: "fadeIn 0.2s ease", boxShadow: "0 0 16px rgba(57,255,20,0.1)" }}>
          /// {toast}
        </div>
      )}

      {/* ═══ HEADER ═══ */}
      <div style={{ background: "#0A0D16", borderBottom: "1px solid #141928", padding: isMobile ? "12px 14px" : "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: isMobile ? 8 : 10 }}>
        <div style={{ flex: isMobile ? "1 1 100%" : "auto" }}>
          <div style={{ fontSize: isMobile ? 8 : 9, color: "#2A3555", letterSpacing: 2, marginBottom: 2 }}>N88N COMMAND</div>
          <div style={{ fontSize: isMobile ? 14 : 16, fontWeight: 800, color: "#D8E2F0", letterSpacing: 0.5 }}>SHADOW MONARCH v4.0</div>
          <div style={{ fontSize: isMobile ? 8 : 9, color: "#2A3555", marginTop: 2 }}>88 SHADOWS | {stats.active} ACTIVE | {stats.testing} TESTING</div>
        </div>
        <div style={{ display: "flex", gap: isMobile ? 6 : 8, flexWrap: "wrap" }}>
          {[["quests", "FIELD ORDERS"], ["army", "ARMY"], ["scouts", "SCOUTS"], ["protocol", "BUILD & KILL"]].map(([v, label]) => (
            <button key={v} onClick={() => { setView(v); setSelected(null); }} style={{
              background: view === v ? "#1E2433" : "transparent", border: `1px solid ${view === v ? "#4169E1" : "#1E2433"}`,
              color: view === v ? "#4169E1" : "#4A5575", padding: isMobile ? "5px 10px" : "6px 12px", borderRadius: 2, cursor: "pointer",
              fontSize: isMobile ? 8 : 9, letterSpacing: 0.8, fontFamily: "inherit", fontWeight: view === v ? 700 : 500, minHeight: 44
            }}>{label}</button>
          ))}
          {!isMobile && <button onClick={() => setAdminMode(!adminMode)} style={{ background: "transparent", border: "1px solid #1E2433", color: adminMode ? "#39FF14" : "#2A3555", padding: "6px 12px", borderRadius: 2, cursor: "pointer", fontSize: 9, letterSpacing: 0.8, fontFamily: "inherit" }}>{adminMode ? "ADMIN" : "VIEW"}</button>}
        </div>
      </div>

      {/* ═══ STATS BAR ═══ */}
      <div style={{ background: "#0A0D16", borderBottom: "1px solid #141928", padding: isMobile ? "8px 14px" : "10px 18px", display: "flex", gap: isMobile ? 12 : 16, flexWrap: "wrap", fontSize: isMobile ? 9 : 10 }}>
        {[
          ["ACTIVE", stats.active, "#39FF14"], ["TESTING", stats.testing, "#00BFFF"], ["VACANT", stats.vacant, "#2A3555"],
          ["TESTED", stats.tested, "#FFD700"], ["S-RANK", stats.sRank, "#FFD700"], ["A-RANK", stats.aRank, "#39FF14"], ["BENCH", stats.bench, "#4169E1"]
        ].map(([label, val, color]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, opacity: 0.8 }} />
            <span style={{ fontSize: isMobile ? 8 : 9, color: "#4A5575" }}>{label}</span>
            <span style={{ fontSize: isMobile ? 10 : 11, fontWeight: 700, color }}>{val}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: isMobile ? 14 : 18, overflowY: "auto", maxHeight: "calc(100vh - 140px)" }}>

        {/* ═══ FIELD ORDERS (QUEST ENGINE) ═══ */}
        {view === "quests" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 800, color: "#FFD700", marginBottom: 3 }}>/// FIELD ORDERS</div>
            <div style={{ fontSize: isMobile ? 8 : 9, color: "#2A3555", marginBottom: 18 }}>Mission progress and priority queue.</div>

            {/* Fleet Readiness Ring */}
            <div style={{ background: "#0E1220", border: "1px solid #141928", borderRadius: 3, padding: isMobile ? 14 : 16, marginBottom: 14, display: "flex", flexDirection: isMobile ? "column" : "row", gap: 14, alignItems: "center" }}>
              <div style={{ position: "relative", width: isMobile ? 100 : 120, height: isMobile ? 100 : 120, flexShrink: 0 }}>
                <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#1E2433" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#39FF14" strokeWidth="8" strokeDasharray={`${readiness * 2.513} 251.3`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.5s ease" }} />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 900, color: "#39FF14" }}>{readiness}%</div>
                  <div style={{ fontSize: isMobile ? 7 : 8, color: "#2A3555", letterSpacing: 1 }}>READY</div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: isMobile ? 10 : 11, fontWeight: 700, color: "#D8E2F0", marginBottom: 6 }}>FLEET READINESS</div>
                <div style={{ fontSize: isMobile ? 8 : 9, color: "#4A5575", lineHeight: 1.5 }}>
                  Measures active shadows with completed Build & Kill protocols. {readiness < 50 ? "Critical." : readiness < 80 ? "Operational." : "Combat ready."}
                </div>
              </div>
            </div>

            {/* Mission Progress Bars */}
            <div style={{ background: "#0E1220", border: "1px solid #141928", borderRadius: 3, padding: isMobile ? 14 : 16, marginBottom: 14 }}>
              <div style={{ fontSize: isMobile ? 10 : 11, fontWeight: 700, color: "#D8E2F0", marginBottom: 10 }}>MISSION PROGRESS</div>
              {[
                { label: "G-Class (Recon)", ring: 1, color: "#FFFFFF" },
                { label: "F-Class (Commerce)", ring: 2, color: "#FF4500" },
                { label: "E-Class (Signal)", ring: 3, color: "#FF00FF" },
                { label: "D-Class (Ops)", ring: 4, color: "#00FFFF" },
                { label: "C-Class (Forge)", ring: 5, color: "#7F00FF" },
                { label: "B-Class (Scale)", ring: 6, color: "#39FF14" },
                { label: "A-Class (Sovereign)", ring: 7, color: "#FFD700" },
              ].map(({ label, ring, color }) => {
                const ringShadows = army.filter(s => s.ring === ring && s.status !== "VACANT");
                const ringTested = army.filter(s => s.ring === ring && s.buildKill?.tested);
                const progress = ringShadows.length > 0 ? Math.round((ringTested.length / ringShadows.length) * 100) : 0;
                return (
                  <div key={ring} style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, fontSize: isMobile ? 8 : 9 }}>
                      <span style={{ color: "#4A5575" }}>{label}</span>
                      <span style={{ color }}>{ringTested.length}/{ringShadows.length}</span>
                    </div>
                    <div style={{ background: "#0A0D16", height: isMobile ? 6 : 8, borderRadius: 1, overflow: "hidden" }}>
                      <div style={{ width: `${progress}%`, height: "100%", background: color, transition: "width 0.3s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Priority Queue */}
            <div style={{ background: "#0E1220", border: "1px solid #141928", borderRadius: 3, padding: isMobile ? 14 : 16, marginBottom: 14 }}>
              <div style={{ fontSize: isMobile ? 10 : 11, fontWeight: 700, color: "#FF6A00", marginBottom: 10 }}>PRIORITY QUEUE</div>
              {testing.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: isMobile ? 9 : 10, color: "#00BFFF", marginBottom: 6, fontWeight: 600 }}>▶ TESTING ({testing.length})</div>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill, minmax(160px, 1fr))", gap: 6 }}>
                    {testing.map(s => {
                      const dom = DOMAINS.find(d => d.id === s.domain);
                      const fields = [s.buildKill?.buildNotes, s.buildKill?.killSwitch, s.buildKill?.buildTime, s.buildKill?.freeViability, s.buildKill?.verdict];
                      const complete = fields.filter(f => f && f.length > 0).length;
                      return (
                        <div key={s.num} onClick={() => { setSelected(s); setView("army"); }} style={{
                          background: "#0A0D16", border: "1px solid #1E2433", borderRadius: 2, padding: isMobile ? "8px 10px" : "9px 11px", cursor: "pointer", minHeight: 44
                        }}>
                          <div style={{ fontSize: isMobile ? 9 : 10, fontWeight: 700, color: "#D8E2F0", marginBottom: 3 }}>{s.tool}</div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: isMobile ? 8 : 9 }}>
                            <span style={{ color: dom?.color, opacity: 0.6 }}>{dom?.icon} {s.ringId}</span>
                            <div style={{ display: "flex", gap: 2 }}>
                              {[0, 1, 2, 3, 4].map(i => (
                                <div key={i} style={{ width: isMobile ? 4 : 5, height: isMobile ? 4 : 5, borderRadius: "50%", background: i < complete ? "#00BFFF" : "#1E2433" }} />
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {partial.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: isMobile ? 9 : 10, color: "#FFD700", marginBottom: 6, fontWeight: 600 }}>▶ PARTIAL PROTOCOLS ({partial.length})</div>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill, minmax(160px, 1fr))", gap: 6 }}>
                    {partial.slice(0, 10).map(s => {
                      const dom = DOMAINS.find(d => d.id === s.domain);
                      return (
                        <div key={s.num} onClick={() => { setSelected(s); setView("army"); }} style={{
                          background: "#0A0D16", border: "1px solid #1E2433", borderRadius: 2, padding: isMobile ? "8px 10px" : "9px 11px", cursor: "pointer", minHeight: 44
                        }}>
                          <div style={{ fontSize: isMobile ? 9 : 10, fontWeight: 700, color: "#D8E2F0", marginBottom: 3 }}>{s.tool}</div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: isMobile ? 8 : 9 }}>
                            <span style={{ color: dom?.color, opacity: 0.6 }}>{dom?.icon} {s.ringId}</span>
                            <span style={{ color: "#2A3555" }}>NOT TESTED</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {partial.length > 10 && <div style={{ fontSize: isMobile ? 8 : 9, color: "#2A3555", marginTop: 6, textAlign: "center" }}>+{partial.length - 10} more</div>}
                </div>
              )}
              {fresh.length > 0 && (
                <div>
                  <div style={{ fontSize: isMobile ? 9 : 10, color: "#4169E1", marginBottom: 6, fontWeight: 600 }}>▶ FRESH SCOUTS ({fresh.length})</div>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill, minmax(160px, 1fr))", gap: 6 }}>
                    {fresh.map(s => {
                      const dom = DOMAINS.find(d => d.id === s.domain);
                      return (
                        <div key={s.num} onClick={() => { setSelected(s); setView("army"); }} style={{
                          background: "#0A0D16", border: "1px solid #1E2433", borderRadius: 2, padding: isMobile ? "8px 10px" : "9px 11px", cursor: "pointer", minHeight: 44
                        }}>
                          <div style={{ fontSize: isMobile ? 9 : 10, fontWeight: 700, color: "#D8E2F0", marginBottom: 3 }}>{s.tool}</div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: isMobile ? 8 : 9 }}>
                            <span style={{ color: dom?.color, opacity: 0.6 }}>{dom?.icon} {s.ringId}</span>
                            <span style={{ color: "#4169E1" }}>SCOUTED</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {testing.length === 0 && partial.length === 0 && fresh.length === 0 && (
                <div style={{ textAlign: "center", padding: isMobile ? 24 : 32, color: "#1E2433", fontSize: isMobile ? 9 : 10 }}>/// QUEUE EMPTY</div>
              )}
            </div>

            {/* Cleared Shadows */}
            {cleared.length > 0 && (
              <div style={{ background: "#0E1220", border: "1px solid #39FF1440", borderRadius: 3, padding: isMobile ? 14 : 16 }}>
                <div style={{ fontSize: isMobile ? 10 : 11, fontWeight: 700, color: "#39FF14", marginBottom: 10 }}>✓ CLEARED ({cleared.length})</div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill, minmax(160px, 1fr))", gap: 6 }}>
                  {cleared.map(s => {
                    const dom = DOMAINS.find(d => d.id === s.domain);
                    return (
                      <div key={s.num} onClick={() => { setSelected(s); setView("army"); }} style={{
                        background: "#39FF1408", border: "1px solid #39FF1420", borderRadius: 2, padding: isMobile ? "8px 10px" : "9px 11px", cursor: "pointer", minHeight: 44
                      }}>
                        <div style={{ fontSize: isMobile ? 9 : 10, fontWeight: 700, color: "#D8E2F0", marginBottom: 3 }}>{s.tool}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: isMobile ? 8 : 9 }}>
                          <span style={{ color: dom?.color, opacity: 0.6 }}>{dom?.icon} {s.ringId}</span>
                          <span style={{ color: VIAB_COLOR[s.buildKill?.freeViability], fontSize: isMobile ? 7 : 8, fontWeight: 700 }}>{s.buildKill?.freeViability || "—"}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ SHADOW ARMY VIEW ═══ */}
        {view === "army" && !selected && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            {exchangeMode && <div style={{ background: "#1C1200", border: "1px solid #FFD700", borderRadius: 2, padding: "8px 12px", marginBottom: 12, fontSize: isMobile ? 9 : 10, color: "#FFD700", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>/// EXCHANGE MODE: Select target for SH-{String(exchangeSource).padStart(2, "0")}</span>
              <button onClick={() => { setExchangeMode(false); setExchangeSource(null); }} style={{ background: "#1E2433", border: "none", color: "#B8C4D8", padding: "4px 8px", borderRadius: 2, cursor: "pointer", fontSize: isMobile ? 8 : 9, fontFamily: "inherit", minHeight: 44 }}>CANCEL</button>
            </div>}
            {adminMode && (
              <div style={{ marginBottom: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button onClick={() => setFilterDomain(null)} style={{ background: filterDomain === null ? "#1E2433" : "transparent", border: "1px solid #1E2433", color: filterDomain === null ? "#4169E1" : "#4A5575", padding: isMobile ? "5px 10px" : "6px 12px", borderRadius: 2, cursor: "pointer", fontSize: isMobile ? 8 : 9, fontFamily: "inherit", minHeight: 44 }}>ALL</button>
                {DOMAINS.map(d => (
                  <button key={d.id} onClick={() => setFilterDomain(d.id)} style={{
                    background: filterDomain === d.id ? "#1E2433" : "transparent", border: `1px solid ${filterDomain === d.id ? d.color + "80" : "#1E2433"}`,
                    color: filterDomain === d.id ? d.color : "#4A5575", padding: isMobile ? "5px 10px" : "6px 12px", borderRadius: 2, cursor: "pointer",
                    fontSize: isMobile ? 8 : 9, fontFamily: "inherit", minHeight: 44
                  }}>{d.icon} {d.name}</button>
                ))}
              </div>
            )}
            {!adminMode && (
              <div style={{ marginBottom: 12 }}>
                {RINGS.filter(r => army.some(s => s.ring === r.id)).map(ring => (
                  <div key={ring.id} style={{ marginBottom: 10 }}>
                    <div onClick={() => setExpandedRing(expandedRing === ring.id ? null : ring.id)}
                      style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: isMobile ? "8px 10px" : "9px 11px", background: "#0E1220", borderRadius: 2, border: `1px solid ${expandedRing === ring.id ? ring.color + "80" : "#141928"}`, marginBottom: 6, minHeight: 44 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: ring.color, opacity: 0.8 }} />
                      <span style={{ fontSize: isMobile ? 9 : 10, color: "#4A5575", width: 40 }}>RING {ring.id}</span>
                      <span style={{ fontSize: isMobile ? 10 : 11, fontWeight: 700, color: ring.color }}>{ring.cls}</span>
                      <span style={{ fontSize: isMobile ? 8 : 9, color: "#4A5575" }}>{ring.designation}</span>
                      <span style={{ fontSize: isMobile ? 8 : 9, color: "#4A5575", marginLeft: "auto" }}>{army.filter(s => s.ring === ring.id && s.status !== "VACANT").length}/{army.filter(s => s.ring === ring.id).length}</span>
                    </div>
                    {(expandedRing === ring.id || expandedRing === null) && (
                      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill, minmax(160px, 1fr))", gap: 6, paddingLeft: isMobile ? 2 : 4 }}>
                        {army.filter(s => s.ring === ring.id && (!filterDomain || s.domain === filterDomain)).map(shadow => {
                          const dom = DOMAINS.find(d => d.id === shadow.domain);
                          return (
                            <div key={shadow.num}
                              onClick={() => {
                                if (exchangeMode && exchangeSource !== shadow.num) { exchangeShadows(exchangeSource, shadow.num); return; }
                                setSelected(shadow); setEditMode(false);
                              }}
                              style={{
                                background: "#0E1220", border: `1px solid ${shadow.status === "VACANT" ? "#141928" : ring.color + "30"}`,
                                borderRadius: 2, padding: isMobile ? "8px 10px" : "9px 11px", cursor: "pointer",
                                opacity: shadow.status === "VACANT" ? 0.4 : shadow.status === "EXTRACTED" ? 0.3 : 1, minHeight: 44
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = "#0A0D16"}
                              onMouseLeave={e => e.currentTarget.style.background = "#0E1220"}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                                <span style={{ fontSize: isMobile ? 8 : 9, color: "#2A3555", fontWeight: 600 }}>SH-{String(shadow.num).padStart(2, "0")}</span>
                                <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                                  {shadow.buildKill?.tested && <span style={{ fontSize: isMobile ? 7 : 8, color: "#00BFFF", background: "#00BFFF10", padding: "1px 3px", borderRadius: 1 }}>✓</span>}
                                  <span style={{ fontSize: isMobile ? 9 : 10, fontWeight: 700, color: RANKS[shadow.rank].color }}>{shadow.rank}</span>
                                </div>
                              </div>
                              <div style={{ fontSize: isMobile ? 9 : 10, fontWeight: 700, color: "#D8E2F0", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{shadow.name}</div>
                              <div style={{ fontSize: isMobile ? 8 : 9, color: dom?.color, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", opacity: 0.7 }}>{shadow.tool}</div>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: isMobile ? 7 : 8, color: "#4A5575" }}>{dom?.icon} {dom?.name}</span>
                                <span style={{ fontSize: isMobile ? 7 : 8, color: STATUS_META[shadow.status].color, fontWeight: 600 }}>{STATUS_META[shadow.status].icon}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {adminMode && (
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill, minmax(160px, 1fr))", gap: 6 }}>
                {army.filter(s => !filterDomain || s.domain === filterDomain).map(shadow => {
                  const ring = RINGS.find(r => r.id === shadow.ring) || RINGS[0];
                  const dom = DOMAINS.find(d => d.id === shadow.domain);
                  return (
                    <div key={shadow.num}
                      onClick={() => {
                        if (exchangeMode && exchangeSource !== shadow.num) { exchangeShadows(exchangeSource, shadow.num); return; }
                        setSelected(shadow); setEditMode(false);
                      }}
                      style={{
                        background: "#0E1220", border: `1px solid ${shadow.status === "VACANT" ? "#141928" : ring.color + "30"}`,
                        borderRadius: 2, padding: isMobile ? "8px 10px" : "9px 11px", cursor: "pointer",
                        opacity: shadow.status === "VACANT" ? 0.4 : shadow.status === "EXTRACTED" ? 0.3 : 1, minHeight: 44
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#0A0D16"}
                      onMouseLeave={e => e.currentTarget.style.background = "#0E1220"}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                        <span style={{ fontSize: isMobile ? 8 : 9, color: "#2A3555", fontWeight: 600 }}>SH-{String(shadow.num).padStart(2, "0")}</span>
                        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                          {shadow.buildKill?.tested && <span style={{ fontSize: isMobile ? 7 : 8, color: "#00BFFF", background: "#00BFFF10", padding: "1px 3px", borderRadius: 1 }}>✓</span>}
                          <span style={{ fontSize: isMobile ? 9 : 10, fontWeight: 700, color: RANKS[shadow.rank].color }}>{shadow.rank}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: isMobile ? 9 : 10, fontWeight: 700, color: "#D8E2F0", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{shadow.name}</div>
                      <div style={{ fontSize: isMobile ? 8 : 9, color: dom?.color, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", opacity: 0.7 }}>{shadow.tool}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: isMobile ? 7 : 8, color: "#4A5575" }}>{dom?.icon} {shadow.ringId || `R${shadow.ring}`}</span>
                        <span style={{ fontSize: isMobile ? 7 : 8, color: STATUS_META[shadow.status].color, fontWeight: 600 }}>{STATUS_META[shadow.status].icon}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══ SHADOW DETAIL VIEW ═══ */}
        {selected && view === "army" && (() => {
          const shadow = army.find(s => s.num === selected.num) || selected;
          const ring = RINGS.find(r => r.id === shadow.ring) || RINGS[0];
          const dom = DOMAINS.find(d => d.id === shadow.domain) || DOMAINS[0];
          return (
            <div style={{ animation: "fadeIn 0.2s ease" }}>
              <button onClick={() => { setSelected(null); setEditMode(false); }} style={{ background: "transparent", border: "1px solid #1E2433", color: "#4A5575", padding: isMobile ? "5px 10px" : "6px 12px", borderRadius: 2, cursor: "pointer", fontSize: isMobile ? 8 : 9, letterSpacing: 0.8, fontFamily: "inherit", marginBottom: 12, minHeight: 44 }}>← BACK</button>

              <div style={{ background: "#0E1220", border: `1px solid ${ring.color}40`, borderRadius: 3, overflow: "hidden" }}>
                {/* Header */}
                <div style={{ borderBottom: `2px solid ${ring.color}30`, padding: isMobile ? "14px 16px" : "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: isMobile ? 8 : 9, color: "#2A3555", letterSpacing: 1.5, marginBottom: 3 }}>RING {shadow.ring} / {ring.cls} / {ring.designation}</div>
                    <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 800, color: "#D8E2F0" }}>SH-{String(shadow.num).padStart(2, "0")}: {shadow.name}</div>
                    <div style={{ fontSize: isMobile ? 10 : 11, color: dom.color, marginTop: 3 }}>{shadow.tool} — {dom.icon} {dom.name}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: isMobile ? 24 : 28, fontWeight: 800, color: RANKS[shadow.rank].color, lineHeight: 1 }}>{shadow.rank}</div>
                    <div style={{ fontSize: isMobile ? 8 : 9, color: STATUS_META[shadow.status].color, marginTop: 3, fontWeight: 700 }}>{STATUS_META[shadow.status].icon} {shadow.status}</div>
                  </div>
                </div>

                <div style={{ padding: isMobile ? "14px 16px" : "16px 18px" }}>
                  <div style={{ fontSize: isMobile ? 9 : 10, color: "#4A5575", marginBottom: 14, fontStyle: "italic" }}>{shadow.body}</div>

                  {/* Trinity Links */}
                  <div style={{ background: "#0A0D16", borderRadius: 2, padding: isMobile ? 10 : 12, marginBottom: 14, border: "1px solid #141928" }}>
                    <div style={{ fontSize: isMobile ? 8 : 9, color: "#2A3555", letterSpacing: 1.5, marginBottom: 8 }}>/// THE TRINITY</div>
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 8 }}>
                      <a href="https://n88n.store" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#FFFFFF08", border: "1px solid #FFFFFF30", borderRadius: 2, padding: "8px 12px", cursor: "pointer", minHeight: 44 }}>
                        <span style={{ fontSize: isMobile ? 12 : 14 }}>⚡</span>
                        <span style={{ fontSize: isMobile ? 8 : 9, fontWeight: 700, color: "#FFFFFF", letterSpacing: 1.2, fontFamily: "inherit" }}>ACQUIRE</span>
                      </a>
                      {shadow.url ? (
                        <a href={shadow.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#FF450008", border: "1px solid #FF450030", borderRadius: 2, padding: "8px 12px", cursor: "pointer", minHeight: 44 }}>
                          <span style={{ fontSize: isMobile ? 12 : 14 }}>🔧</span>
                          <span style={{ fontSize: isMobile ? 8 : 9, fontWeight: 700, color: "#FF4500", letterSpacing: 1.2, fontFamily: "inherit" }}>DEPLOY</span>
                        </a>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#FF450004", border: "1px solid #FF450018", borderRadius: 2, padding: "8px 12px", opacity: 0.25, minHeight: 44 }}>
                          <span style={{ fontSize: isMobile ? 12 : 14 }}>🔧</span>
                          <span style={{ fontSize: isMobile ? 8 : 9, fontWeight: 700, color: "#FF4500", letterSpacing: 1.2, fontFamily: "inherit" }}>DEPLOY</span>
                        </div>
                      )}
                      <a href="https://n88n.world" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#FF00FF08", border: "1px solid #FF00FF30", borderRadius: 2, padding: "8px 12px", cursor: "pointer", minHeight: 44 }}>
                        <span style={{ fontSize: isMobile ? 12 : 14 }}>🎯</span>
                        <span style={{ fontSize: isMobile ? 8 : 9, fontWeight: 700, color: "#FF00FF", letterSpacing: 1.2, fontFamily: "inherit" }}>LIVE FIRE</span>
                      </a>
                    </div>
                  </div>

                  {/* Actions */}
                  {adminMode && (
                    <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
                      <button onClick={() => setEditMode(!editMode)} style={{ background: "#1E2433", border: "1px solid #1E2433", color: "#4169E1", padding: isMobile ? "5px 10px" : "6px 12px", borderRadius: 2, cursor: "pointer", fontSize: isMobile ? 8 : 9, fontFamily: "inherit", minHeight: 44 }}>{editMode ? "CLOSE" : "EDIT"}</button>
                      <button onClick={() => { setExchangeMode(true); setExchangeSource(shadow.num); setSelected(null); }} style={{ background: "#1E2433", border: "1px solid #1E2433", color: "#FFD700", padding: isMobile ? "5px 10px" : "6px 12px", borderRadius: 2, cursor: "pointer", fontSize: isMobile ? 8 : 9, fontFamily: "inherit", minHeight: 44 }}>EXCHANGE</button>
                      {shadow.status !== "VACANT" && !shadow.essential && <button onClick={() => extractShadow(shadow.num)} style={{ background: "#1E2433", border: "1px solid #FF222230", color: "#FF2222", padding: isMobile ? "5px 10px" : "6px 12px", borderRadius: 2, cursor: "pointer", fontSize: isMobile ? 8 : 9, fontFamily: "inherit", minHeight: 44 }}>EXTRACT</button>}
                      {shadow.essential && <span style={{ fontSize: isMobile ? 8 : 9, color: "#FFD700", alignSelf: "center" }}>🔒 ESSENTIAL</span>}
                    </div>
                  )}

                  {/* Edit Panel */}
                  {editMode && adminMode && (
                    <div style={{ background: "#0A0D16", borderRadius: 2, padding: isMobile ? 12 : 14, marginBottom: 14, border: "1px solid #141928" }}>
                      <div style={{ fontSize: isMobile ? 8 : 9, color: "#2A3555", letterSpacing: 1.5, marginBottom: 10 }}>/// EDIT SHADOW</div>
                      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
                        {[["name", "NAME"], ["tool", "TOOL"]].map(([key, label]) => (
                          <label key={key} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <span style={{ fontSize: isMobile ? 7 : 8, color: "#4A5575" }}>{label}</span>
                            <input value={shadow[key]} onChange={e => updateShadow(shadow.num, { [key]: e.target.value })}
                              style={{ background: "#0E1220", border: "1px solid #1E2433", borderRadius: 2, padding: isMobile ? "6px 8px" : "7px 9px", color: "#B8C4D8", fontSize: isMobile ? 9 : 10, fontFamily: "inherit", outline: "none" }} />
                          </label>
                        ))}
                        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <span style={{ fontSize: isMobile ? 7 : 8, color: "#4A5575" }}>DOMAIN</span>
                          <select value={shadow.domain} onChange={e => updateShadow(shadow.num, { domain: e.target.value })}
                            style={{ background: "#0E1220", border: "1px solid #1E2433", borderRadius: 2, padding: isMobile ? "6px 8px" : "7px 9px", color: dom.color, fontSize: isMobile ? 9 : 10, fontFamily: "inherit", outline: "none" }}>
                            {DOMAINS.map(d => <option key={d.id} value={d.id} style={{ color: d.color }}>{d.icon} {d.name}</option>)}
                          </select>
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <span style={{ fontSize: isMobile ? 7 : 8, color: "#4A5575" }}>RANK</span>
                          <select value={shadow.rank} onChange={e => updateShadow(shadow.num, { rank: e.target.value })}
                            style={{ background: "#0E1220", border: "1px solid #1E2433", borderRadius: 2, padding: isMobile ? "6px 8px" : "7px 9px", color: RANKS[shadow.rank].color, fontSize: isMobile ? 9 : 10, fontFamily: "inherit", outline: "none" }}>
                            {Object.keys(RANKS).map(r => <option key={r} value={r} style={{ color: RANKS[r].color }}>{r}</option>)}
                          </select>
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <span style={{ fontSize: isMobile ? 7 : 8, color: "#4A5575" }}>STATUS</span>
                          <select value={shadow.status} onChange={e => updateShadow(shadow.num, { status: e.target.value })}
                            style={{ background: "#0E1220", border: "1px solid #1E2433", borderRadius: 2, padding: isMobile ? "6px 8px" : "7px 9px", color: STATUS_META[shadow.status].color, fontSize: isMobile ? 9 : 10, fontFamily: "inherit", outline: "none" }}>
                            {STATUSES.map(s => <option key={s} value={s} style={{ color: STATUS_META[s].color }}>{s}</option>)}
                          </select>
                        </label>
                      </div>
                      <label style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 10 }}>
                        <span style={{ fontSize: isMobile ? 7 : 8, color: "#4A5575" }}>BODY</span>
                        <textarea value={shadow.body} onChange={e => updateShadow(shadow.num, { body: e.target.value })} rows={2}
                          style={{ background: "#0E1220", border: "1px solid #1E2433", borderRadius: 2, padding: isMobile ? "6px 8px" : "7px 9px", color: "#B8C4D8", fontSize: isMobile ? 9 : 10, fontFamily: "inherit", outline: "none", resize: "vertical" }} />
                      </label>
                      <label style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 10 }}>
                        <span style={{ fontSize: isMobile ? 7 : 8, color: "#FF6A00" }}>DEPLOY URL <span style={{ color: "#2A3555" }}>(affiliate/partner link)</span></span>
                        <input value={shadow.url || ""} onChange={e => updateShadow(shadow.num, { url: e.target.value })} placeholder="https://tool.com?ref=n88n"
                          style={{ background: "#0E1220", border: "1px solid #1E2433", borderRadius: 2, padding: isMobile ? "6px 8px" : "7px 9px", color: "#FF6A00", fontSize: isMobile ? 9 : 10, fontFamily: "inherit", outline: "none" }} />
                      </label>
                    </div>
                  )}

                  {/* Build & Kill Protocol */}
                  <div style={{ background: "#0A0D16", borderRadius: 2, padding: isMobile ? 12 : 14, border: "1px solid #141928" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div style={{ fontSize: isMobile ? 9 : 10, color: "#FF6A00", letterSpacing: 1.5, fontWeight: 700 }}>/// BUILD & KILL</div>
                      {adminMode && <button onClick={() => updateBuildKill(shadow.num, { tested: !shadow.buildKill?.tested, testDate: new Date().toISOString().slice(0, 10) })}
                        style={{ background: shadow.buildKill?.tested ? "#39FF1410" : "#1E2433", border: `1px solid ${shadow.buildKill?.tested ? "#39FF14" : "#1E2433"}`,
                          color: shadow.buildKill?.tested ? "#39FF14" : "#4A5575", padding: isMobile ? "4px 8px" : "5px 10px", borderRadius: 2, cursor: "pointer", fontSize: isMobile ? 7 : 8, fontFamily: "inherit", minHeight: 44 }}>
                        {shadow.buildKill?.tested ? `✓ ${shadow.buildKill.testDate}` : "MARK TESTED"}
                      </button>}
                    </div>
                    {adminMode ? (
                      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
                        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <span style={{ fontSize: isMobile ? 7 : 8, color: "#4A5575" }}>BUILD NOTES</span>
                          <textarea value={shadow.buildKill?.buildNotes || ""} onChange={e => updateBuildKill(shadow.num, { buildNotes: e.target.value })} rows={2} placeholder="What was built? How long?"
                            style={{ background: "#0E1220", border: "1px solid #1E2433", borderRadius: 2, padding: isMobile ? "6px 8px" : "7px 9px", color: "#B8C4D8", fontSize: isMobile ? 8 : 9, fontFamily: "inherit", outline: "none", resize: "vertical" }} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <span style={{ fontSize: isMobile ? 7 : 8, color: "#FF2222" }}>KILL SWITCH</span>
                          <textarea value={shadow.buildKill?.killSwitch || ""} onChange={e => updateBuildKill(shadow.num, { killSwitch: e.target.value })} rows={2} placeholder="Where did free tier break?"
                            style={{ background: "#0E1220", border: "1px solid #1E2433", borderRadius: 2, padding: isMobile ? "6px 8px" : "7px 9px", color: "#B8C4D8", fontSize: isMobile ? 8 : 9, fontFamily: "inherit", outline: "none", resize: "vertical" }} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <span style={{ fontSize: isMobile ? 7 : 8, color: "#FFD700" }}>FREE VIABILITY</span>
                          <select value={shadow.buildKill?.freeViability || ""} onChange={e => updateBuildKill(shadow.num, { freeViability: e.target.value })}
                            style={{ background: "#0E1220", border: "1px solid #1E2433", borderRadius: 2, padding: isMobile ? "6px 8px" : "7px 9px", color: "#B8C4D8", fontSize: isMobile ? 8 : 9, fontFamily: "inherit", outline: "none" }}>
                            <option value="">Select...</option>
                            <option value="HIGH">HIGH — Fully usable free</option>
                            <option value="MEDIUM">MEDIUM — Demo/limited</option>
                            <option value="LOW">LOW — Must upgrade</option>
                            <option value="NONE">NONE — Unusable free</option>
                          </select>
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <span style={{ fontSize: isMobile ? 7 : 8, color: "#4A5575" }}>BUILD TIME</span>
                          <input value={shadow.buildKill?.buildTime || ""} onChange={e => updateBuildKill(shadow.num, { buildTime: e.target.value })} placeholder="e.g. 15 mins"
                            style={{ background: "#0E1220", border: "1px solid #1E2433", borderRadius: 2, padding: isMobile ? "6px 8px" : "7px 9px", color: "#B8C4D8", fontSize: isMobile ? 8 : 9, fontFamily: "inherit", outline: "none" }} />
                        </label>
                      </div>
                    ) : (
                      <div style={{ fontSize: isMobile ? 9 : 10, color: "#4A5575" }}>
                        {shadow.buildKill?.tested ? (
                          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 8 }}>
                            <div><span style={{ fontSize: isMobile ? 7 : 8, color: "#2A3555" }}>VIABILITY: </span><span style={{ color: VIAB_COLOR[shadow.buildKill?.freeViability] }}>{shadow.buildKill?.freeViability || "—"}</span></div>
                            <div><span style={{ fontSize: isMobile ? 7 : 8, color: "#2A3555" }}>BUILD TIME: </span>{shadow.buildKill?.buildTime || "—"}</div>
                            {shadow.buildKill?.killSwitch && <div style={{ gridColumn: "span 2" }}><span style={{ fontSize: isMobile ? 7 : 8, color: "#FF2222" }}>KILL SWITCH: </span>{shadow.buildKill.killSwitch}</div>}
                            {shadow.buildKill?.verdict && <div style={{ gridColumn: "span 2" }}><span style={{ fontSize: isMobile ? 7 : 8, color: "#2A3555" }}>VERDICT: </span>{shadow.buildKill.verdict}</div>}
                          </div>
                        ) : <span style={{ color: "#1E2433" }}>/// NOT YET TESTED</span>}
                      </div>
                    )}
                    {adminMode && (
                      <label style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 10 }}>
                        <span style={{ fontSize: isMobile ? 7 : 8, color: "#4A5575" }}>VERDICT</span>
                        <textarea value={shadow.buildKill?.verdict || ""} onChange={e => updateBuildKill(shadow.num, { verdict: e.target.value })} rows={2} placeholder="Keep, upgrade, or kill?"
                          style={{ background: "#0E1220", border: "1px solid #1E2433", borderRadius: 2, padding: isMobile ? "6px 8px" : "7px 9px", color: "#B8C4D8", fontSize: isMobile ? 8 : 9, fontFamily: "inherit", outline: "none", resize: "vertical" }} />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ═══ SCOUTS VIEW (trimmed for brevity) ═══ */}
        {view === "scouts" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 800, color: "#D8E2F0" }}>SCOUT BENCH</div>
                <div style={{ fontSize: isMobile ? 8 : 9, color: "#2A3555", marginTop: 2 }}>{scouts.length} solutions awaiting deployment</div>
              </div>
              {adminMode && <button onClick={() => setShowScoutForm(!showScoutForm)} style={{ background: "#4169E110", border: "1px solid #4169E140", color: "#4169E1", padding: isMobile ? "6px 12px" : "7px 14px", borderRadius: 2, cursor: "pointer", fontSize: isMobile ? 8 : 9, fontFamily: "inherit", letterSpacing: 0.8, fontWeight: 600, minHeight: 44 }}>+ SCOUT</button>}
            </div>

            {showScoutForm && adminMode && (
              <div style={{ background: "#0E1220", border: "1px solid #141928", borderRadius: 2, padding: isMobile ? 12 : 14, marginBottom: 14 }}>
                <div style={{ fontSize: isMobile ? 8 : 9, color: "#2A3555", letterSpacing: 1.5, marginBottom: 10 }}>/// NEW SCOUT</div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr auto", gap: 8, alignItems: "end" }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ fontSize: isMobile ? 7 : 8, color: "#4A5575" }}>TOOL</span>
                    <input value={newScout.tool} onChange={e => setNewScout({ ...newScout, tool: e.target.value })} placeholder="e.g. Figma"
                      style={{ background: "#0A0D16", border: "1px solid #1E2433", borderRadius: 2, padding: isMobile ? "6px 8px" : "7px 9px", color: "#B8C4D8", fontSize: isMobile ? 9 : 10, fontFamily: "inherit", outline: "none" }} />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ fontSize: isMobile ? 7 : 8, color: "#4A5575" }}>DOMAIN</span>
                    <select value={newScout.domain} onChange={e => setNewScout({ ...newScout, domain: e.target.value })}
                      style={{ background: "#0A0D16", border: "1px solid #1E2433", borderRadius: 2, padding: isMobile ? "6px 8px" : "7px 9px", color: "#B8C4D8", fontSize: isMobile ? 9 : 10, fontFamily: "inherit", outline: "none" }}>
                      {DOMAINS.map(d => <option key={d.id} value={d.id}>{d.icon} {d.name}</option>)}
                    </select>
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ fontSize: isMobile ? 7 : 8, color: "#4A5575" }}>KILL SWITCH</span>
                    <input value={newScout.killSwitch} onChange={e => setNewScout({ ...newScout, killSwitch: e.target.value })} placeholder="Known limit"
                      style={{ background: "#0A0D16", border: "1px solid #1E2433", borderRadius: 2, padding: isMobile ? "6px 8px" : "7px 9px", color: "#B8C4D8", fontSize: isMobile ? 9 : 10, fontFamily: "inherit", outline: "none" }} />
                  </label>
                  <button onClick={addScout} style={{ background: "#39FF1410", border: "1px solid #39FF1440", color: "#39FF14", padding: isMobile ? "6px 10px" : "7px 12px", borderRadius: 2, cursor: "pointer", fontSize: isMobile ? 8 : 9, fontFamily: "inherit", height: isMobile ? 30 : 32, minHeight: 44 }}>ADD</button>
                </div>
              </div>
            )}

            <div style={{ display: "grid", gap: 6 }}>
              {scouts.map((sc, i) => {
                const domInfo = DOMAINS.find(d => d.id === sc.domain) || DOMAINS[0];
                const vacantSlots = army.filter(s => s.status === "VACANT");
                return (
                  <div key={i} style={{ background: "#0E1220", border: "1px solid #141928", borderRadius: 2, padding: isMobile ? "10px 12px" : "11px 14px", display: "flex", alignItems: "center", gap: isMobile ? 10 : 12, minHeight: 44 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 1, background: domInfo.color, opacity: 0.6 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: isMobile ? 10 : 11, fontWeight: 700, color: "#D8E2F0" }}>{sc.tool}</div>
                      <div style={{ fontSize: isMobile ? 7 : 8, color: "#2A3555" }}>{domInfo.icon} {domInfo.name}</div>
                    </div>
                    <div style={{ fontSize: isMobile ? 7 : 8, color: "#FF6A00", maxWidth: 140, textAlign: "right" }}>{sc.killSwitch}</div>
                    {adminMode && (
                      <div style={{ display: "flex", gap: 4 }}>
                        {vacantSlots.length > 0 ? (
                          <select onChange={e => { if (e.target.value) onboardScout(sc, parseInt(e.target.value)); }}
                            style={{ background: "#0A0D16", border: "1px solid #4169E140", borderRadius: 2, padding: isMobile ? "4px 6px" : "5px 7px", color: "#4169E1", fontSize: isMobile ? 7 : 8, fontFamily: "inherit", outline: "none" }}>
                            <option value="">ARISE →</option>
                            {vacantSlots.map(s => <option key={s.num} value={s.num}>#{String(s.num).padStart(2, "0")}</option>)}
                          </select>
                        ) : (
                          <span style={{ fontSize: isMobile ? 7 : 8, color: "#FF6A00" }}>FULL</span>
                        )}
                        <button onClick={() => removeScout(sc.tool)} style={{ background: "transparent", border: "1px solid #FF222220", color: "#FF2222", padding: isMobile ? "3px 6px" : "4px 7px", borderRadius: 2, cursor: "pointer", fontSize: isMobile ? 7 : 8, fontFamily: "inherit", minHeight: 44 }}>×</button>
                      </div>
                    )}
                  </div>
                );
              })}
              {scouts.length === 0 && <div style={{ textAlign: "center", padding: isMobile ? 24 : 32, color: "#1E2433", fontSize: isMobile ? 9 : 10 }}>/// BENCH EMPTY</div>}
            </div>
          </div>
        )}

        {/* ═══ BUILD & KILL PROTOCOL VIEW (trimmed for brevity) ═══ */}
        {view === "protocol" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 800, color: "#FF6A00", marginBottom: 3 }}>BUILD & KILL PROTOCOL</div>
            <div style={{ fontSize: isMobile ? 8 : 9, color: "#2A3555", marginBottom: 16 }}>Push until the system breaks. Do not pay. Find the Kill Switch.</div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill, minmax(140px, 1fr))", gap: 8, marginBottom: 18 }}>
              {[
                { label: "TOTAL TESTED", value: stats.tested, color: "#00BFFF", total: army.length },
                { label: "HIGH VIABILITY", value: army.filter(s => s.buildKill?.freeViability === "HIGH").length, color: "#39FF14" },
                { label: "MUST UPGRADE", value: army.filter(s => s.buildKill?.freeViability === "LOW" || s.buildKill?.freeViability === "NONE").length, color: "#FF2222" },
                { label: "NEEDS TESTING", value: army.filter(s => !s.buildKill?.tested && s.status !== "VACANT").length, color: "#FFD700" },
              ].map((s, i) => (
                <div key={i} style={{ background: "#0E1220", border: "1px solid #141928", borderRadius: 2, padding: isMobile ? "10px 12px" : "12px 14px" }}>
                  <div style={{ fontSize: isMobile ? 7 : 8, color: "#2A3555", letterSpacing: 1.5, marginBottom: 3 }}>{s.label}</div>
                  <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: s.color }}>{s.value}{s.total ? <span style={{ fontSize: isMobile ? 10 : 11, color: "#2A3555" }}>/{s.total}</span> : null}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: isMobile ? 11 : 12, fontWeight: 700, color: "#D8E2F0", marginBottom: 10 }}>UNTESTED FLEET</div>
            <div style={{ display: "grid", gap: 5 }}>
              {army.filter(s => !s.buildKill?.tested && s.status !== "VACANT" && s.tool !== "Identity" && s.tool !== "—").map(shadow => {
                const ring = RINGS.find(r => r.id === shadow.ring) || RINGS[0];
                const dom = DOMAINS.find(d => d.id === shadow.domain);
                return (
                  <div key={shadow.num} onClick={() => { setView("army"); setSelected(shadow); }}
                    style={{ background: "#0E1220", border: "1px solid #141928", borderRadius: 2, padding: isMobile ? "7px 10px" : "8px 12px", display: "flex", alignItems: "center", gap: isMobile ? 10 : 12, cursor: "pointer", minHeight: 44 }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = ring.color + "40"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#141928"}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: ring.color }} />
                    <span style={{ fontSize: isMobile ? 8 : 9, color: "#2A3555", width: 36 }}>SH-{String(shadow.num).padStart(2, "0")}</span>
                    <span style={{ fontSize: isMobile ? 10 : 11, color: "#D8E2F0", fontWeight: 600, flex: 1 }}>{shadow.tool}</span>
                    <span style={{ fontSize: isMobile ? 8 : 9, color: "#4A5575" }}>{dom?.icon} {shadow.ringId}</span>
                    <span style={{ fontSize: isMobile ? 9 : 10, fontWeight: 700, color: RANKS[shadow.rank].color }}>{shadow.rank}</span>
                  </div>
                );
              })}
            </div>

            {cleared.length > 0 && (
              <>
                <div style={{ fontSize: isMobile ? 11 : 12, fontWeight: 700, color: "#39FF14", marginTop: 20, marginBottom: 10 }}>✓ TESTED & CLEARED</div>
                <div style={{ display: "grid", gap: 5 }}>
                  {cleared.map(shadow => {
                    const ring = RINGS.find(r => r.id === shadow.ring) || RINGS[0];
                    const dom = DOMAINS.find(d => d.id === shadow.domain);
                    return (
                      <div key={shadow.num} onClick={() => { setView("army"); setSelected(shadow); }}
                        style={{ background: "#0E1220", border: "1px solid #39FF1420", borderRadius: 2, padding: isMobile ? "7px 10px" : "8px 12px", display: "flex", alignItems: "center", gap: isMobile ? 10 : 12, cursor: "pointer", minHeight: 44 }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "#39FF1440"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "#39FF1420"}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: ring.color }} />
                        <span style={{ fontSize: isMobile ? 8 : 9, color: "#2A3555", width: 36 }}>SH-{String(shadow.num).padStart(2, "0")}</span>
                        <span style={{ fontSize: isMobile ? 10 : 11, color: "#D8E2F0", fontWeight: 600, flex: 1 }}>{shadow.tool}</span>
                        <span style={{ fontSize: isMobile ? 8 : 9, color: VIAB_COLOR[shadow.buildKill?.freeViability], fontWeight: 700 }}>{shadow.buildKill?.freeViability || "—"}</span>
                        <span style={{ fontSize: isMobile ? 8 : 9, color: "#2A3555" }}>{shadow.buildKill?.testDate}</span>
                        <span style={{ fontSize: isMobile ? 9 : 10, fontWeight: 700, color: RANKS[shadow.rank].color }}>{shadow.rank}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
