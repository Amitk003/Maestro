#!/usr/bin/env python3
"""
Maestro Hackathon PPT - Professional Redesign
Clean typography, strict grid, high contrast, node-based diagrams.
No emojis, no em dashes, no AI aesthetics.
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.dml.color import RGBColor
import os

# ── Design System ────────────────────────────────────────────────────────────
# Backgrounds
BG_PRIMARY   = RGBColor(0x0A, 0x0A, 0x0A)  # Pure dark
BG_CARD      = RGBColor(0x14, 0x14, 0x14)  # Card surface
BG_ELEVATED  = RGBColor(0x1A, 0x1A, 0x1A)  # Elevated surface

# Accent Colors (single strong accent)
ACCENT       = RGBColor(0x3B, 0x82, 0xF6)  # Blue-500
ACCENT_LIGHT = RGBColor(0x60, 0xA5, 0xFA)  # Blue-400
ACCENT_DIM   = RGBColor(0x1E, 0x3A, 0x5F)  # Blue-900

# Semantic
SUCCESS      = RGBColor(0x22, 0xC5, 0x5E)  # Green
WARNING      = RGBColor(0xF5, 0x9E, 0x0B)  # Amber
DANGER       = RGBColor(0xEF, 0x44, 0x44)  # Red
PURPLE       = RGBColor(0xA7, 0x8B, 0xFA)  # Violet
CYAN         = RGBColor(0x06, 0xB6, 0xD4)  # Cyan
ORANGE       = RGBColor(0xF9, 0x73, 0x16)  # Orange
PINK         = RGBColor(0xEC, 0x48, 0x99)  # Pink

# Text
TEXT_PRIMARY   = RGBColor(0xFF, 0xFF, 0xFF)
TEXT_SECONDARY = RGBColor(0xA1, 0xA1, 0xAA)  # Zinc-400
TEXT_MUTED     = RGBColor(0x52, 0x52, 0x5B)  # Zinc-600

# Borders
BORDER       = RGBColor(0x27, 0x27, 0x2A)  # Zinc-800
BORDER_LIGHT = RGBColor(0x3F, 0x3F, 0x46)  # Zinc-700

# Typography
FONT = 'Calibri'

# Slide dimensions
W = Inches(13.333)
H = Inches(7.5)

PPTX_PATH = '../Vibeathon_6.0_Vibecoding_Hackathon_July_2026_Idea_Submission_Template.pptx'
OUTPUT_PATH = '../Maestro_Hackathon_Final.pptx'


# ── Helper Functions ─────────────────────────────────────────────────────────

def set_bg(slide, color=BG_PRIMARY):
    bg = slide.background
    fill = bg.fill
    fill.solid()
    fill.fore_color.rgb = color


def clear_slide(slide):
    """Remove all shapes except the 3 logo images (top-left, top-right, center background)."""
    logos = []
    for shape in slide.shapes:
        if shape.shape_type != 13:
            continue
        l = shape.left / 914400
        t = shape.top / 914400
        w = shape.width / 914400
        # Top-left logo
        if l < 0.3 and t < 0.3 and w > 1.0:
            logos.append(shape)
        # Top-right logo
        elif l > 11.0 and t < 0.3 and w > 0.5:
            logos.append(shape)
        # Center background
        elif 3.5 < l < 5.0 and 1.0 < t < 3.0 and w > 3.0:
            logos.append(shape)
    for shape in list(slide.shapes):
        if shape not in logos:
            shape._element.getparent().remove(shape._element)


def rect(slide, x, y, w, h, fill=None, border=None, border_w=Pt(1)):
    s = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, w, h)
    if fill:
        s.fill.solid()
        s.fill.fore_color.rgb = fill
    else:
        s.fill.background()
    if border:
        s.line.color.rgb = border
        s.line.width = border_w
    else:
        s.line.fill.background()
    return s


def rounded(slide, x, y, w, h, fill=None, border=None, border_w=Pt(1)):
    s = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
    if fill:
        s.fill.solid()
        s.fill.fore_color.rgb = fill
    else:
        s.fill.background()
    if border:
        s.line.color.rgb = border
        s.line.width = border_w
    else:
        s.line.fill.background()
    return s


def oval(slide, x, y, w, h, fill=None, border=None):
    s = slide.shapes.add_shape(MSO_SHAPE.OVAL, x, y, w, h)
    if fill:
        s.fill.solid()
        s.fill.fore_color.rgb = fill
    else:
        s.fill.background()
    if border:
        s.line.color.rgb = border
        s.line.width = Pt(1.5)
    else:
        s.line.fill.background()
    return s


def text(slide, x, y, w, h, content, size=14, color=TEXT_PRIMARY, bold=False, align=PP_ALIGN.LEFT):
    tb = slide.shapes.add_textbox(x, y, w, h)
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = content
    p.font.size = Pt(size)
    p.font.color.rgb = color
    p.font.bold = bold
    p.font.name = FONT
    p.alignment = align
    return tb


def label(slide, x, y, w, content, size=11, color=TEXT_SECONDARY):
    return text(slide, x, y, w, Inches(0.3), content, size=size, color=color)


def heading(slide, x, y, w, content, size=28):
    return text(slide, x, y, w, Inches(0.6), content, size=size, bold=True)


def card(slide, x, y, w, h, fill=BG_CARD, border=BORDER):
    return rounded(slide, x, y, w, h, fill=fill, border=border)


def divider(slide, x, y, w, color=BORDER):
    return rect(slide, x, y, w, Pt(1), fill=color)


def arrow_right(slide, x, y, w=Inches(0.4), h=Inches(0.25), color=ACCENT):
    s = slide.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, x, y, w, h)
    s.fill.solid()
    s.fill.fore_color.rgb = color
    s.line.fill.background()
    return s


def arrow_down(slide, x, y, w=Inches(0.2), h=Inches(0.35), color=ACCENT):
    s = slide.shapes.add_shape(MSO_SHAPE.DOWN_ARROW, x, y, w, h)
    s.fill.solid()
    s.fill.fore_color.rgb = color
    s.line.fill.background()
    return s


def step_circle(slide, x, y, num, color=ACCENT):
    c = oval(slide, x, y, Inches(0.45), Inches(0.45), fill=color)
    tf = c.text_frame
    tf.paragraphs[0].text = str(num)
    tf.paragraphs[0].font.size = Pt(14)
    tf.paragraphs[0].font.color.rgb = TEXT_PRIMARY
    tf.paragraphs[0].font.bold = True
    tf.paragraphs[0].font.name = FONT
    tf.paragraphs[0].alignment = PP_ALIGN.CENTER
    return c


# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 2: Current Problem
# ══════════════════════════════════════════════════════════════════════════════
def fill_slide_2(slide):
    set_bg(slide)
    clear_slide(slide)

    # ── Left Column: Title + Problem Cards ──
    heading(slide, Inches(0.8), Inches(0.5), Inches(5.5), "Current Problem")
    label(slide, Inches(0.8), Inches(1.0), Inches(5.5),
          "Why the restaurant industry needs a fundamentally different approach")

    divider(slide, Inches(0.8), Inches(1.5), Inches(5.5))

    problems = [
        ("Reactive Operations",
         "Ticket printers, manual coordination, and verbal communication are the backbone of most restaurant operations. Problems are addressed only after they occur.",
         DANGER),
        ("Information Silos",
         "Kitchen, front-of-house, inventory, and management operate in disconnected loops. No one has complete visibility into restaurant state.",
         WARNING),
        ("Waste & Inefficiency",
         "Ingredients spoil before use. Stations become bottlenecks while others sit idle. Staff burn out from poor task distribution.",
         PINK),
        ("No Prediction",
         "Existing systems cannot anticipate demand surges from weather, events, or time patterns. Restaurants are always caught off-guard.",
         PURPLE),
    ]

    y = Inches(1.75)
    for title, desc, color in problems:
        c = card(slide, Inches(0.8), y, Inches(5.5), Inches(1.15))
        rect(slide, Inches(0.8), y, Pt(4), Inches(1.15), fill=color)
        text(slide, Inches(1.1), y + Inches(0.1), Inches(5.1), Inches(0.3),
             title, size=13, color=color, bold=True)
        text(slide, Inches(1.1), y + Inches(0.45), Inches(5.1), Inches(0.6),
             desc, size=10, color=TEXT_SECONDARY)
        y += Inches(1.3)

    # ── Right Column: Impact Metrics (Large Typography) ──
    text(slide, Inches(7.2), Inches(0.5), Inches(5), Inches(0.5),
         "Industry Impact", size=20, bold=True)

    divider(slide, Inches(7.2), Inches(1.1), Inches(5))

    metrics = [
        ("$200B+", "Annual food waste in US restaurants"),
        ("30%", "Average kitchen idle time during peak hours"),
        ("4.2x", "Higher staff turnover vs. tech industry"),
    ]

    y = Inches(1.4)
    for value, label_text in metrics:
        c = card(slide, Inches(7.2), y, Inches(5), Inches(1.3))
        text(slide, Inches(7.5), y + Inches(0.15), Inches(4.4), Inches(0.7),
             value, size=42, color=ACCENT, bold=True)
        text(slide, Inches(7.5), y + Inches(0.85), Inches(4.4), Inches(0.35),
             label_text, size=12, color=TEXT_SECONDARY)
        y += Inches(1.5)

    # ── Bottom: Affected Stakeholders ──
    text(slide, Inches(7.2), Inches(5.9), Inches(5), Inches(0.3),
         "Who Is Affected", size=12, color=TEXT_MUTED, bold=True)

    stakeholders = ["Customers", "Kitchen", "Wait Staff", "Managers", "Owners"]
    for i, name in enumerate(stakeholders):
        x = Inches(7.2) + Inches(i * 1.02)
        c = rounded(slide, x, Inches(6.25), Inches(0.9), Inches(0.45), fill=BG_ELEVATED, border=BORDER)
        tf = c.text_frame
        tf.paragraphs[0].text = name
        tf.paragraphs[0].font.size = Pt(9)
        tf.paragraphs[0].font.color.rgb = TEXT_SECONDARY
        tf.paragraphs[0].font.name = FONT
        tf.paragraphs[0].alignment = PP_ALIGN.CENTER


# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 3: Proposed Solution (Node-Based Agent Diagram)
# ══════════════════════════════════════════════════════════════════════════════
def fill_slide_3(slide):
    set_bg(slide)
    clear_slide(slide)

    heading(slide, Inches(0.8), Inches(0.4), Inches(11), "Proposed Solution")
    label(slide, Inches(0.8), Inches(0.9), Inches(11),
          "Maestro: An AI-Powered Restaurant Digital Twin with Multi-Agent Coordination")

    divider(slide, Inches(0.8), Inches(1.3), Inches(11.7))

    # ── Central Orchestrator Hub ──
    cx = Inches(5.6)
    cy = Inches(3.0)
    hub_r = Inches(1.1)
    hub = oval(slide, cx, cy, hub_r, hub_r, fill=ACCENT, border=ACCENT_LIGHT)
    tf = hub.text_frame
    tf.paragraphs[0].text = "Maestro"
    tf.paragraphs[0].font.size = Pt(11)
    tf.paragraphs[0].font.color.rgb = TEXT_PRIMARY
    tf.paragraphs[0].font.bold = True
    tf.paragraphs[0].font.name = FONT
    tf.paragraphs[0].alignment = PP_ALIGN.CENTER
    p2 = tf.add_paragraph()
    p2.text = "Orchestrator"
    p2.font.size = Pt(9)
    p2.font.color.rgb = RGBColor(0xBF, 0xDB, 0xFE)
    p2.font.name = FONT
    p2.alignment = PP_ALIGN.CENTER

    # ── 5 Agent Nodes (Positioned around the hub) ──
    agents = [
        ("Demand\nSeer", Inches(2.2), Inches(1.8), ACCENT),
        ("Kitchen\nConductor", Inches(9.0), Inches(1.8), SUCCESS),
        ("Inventory\nGuardian", Inches(2.2), Inches(4.2), WARNING),
        ("Guest\nAlchemist", Inches(9.0), Inches(4.2), PURPLE),
        ("Staff\nHarmony", Inches(5.6), Inches(5.6), PINK),
    ]

    for name, ax, ay, color in agents:
        node = rounded(slide, ax, ay, Inches(1.5), Inches(0.9), fill=BG_CARD, border=color)
        tf = node.text_frame
        tf.paragraphs[0].text = name
        tf.paragraphs[0].font.size = Pt(11)
        tf.paragraphs[0].font.color.rgb = color
        tf.paragraphs[0].font.bold = True
        tf.paragraphs[0].font.name = FONT
        tf.paragraphs[0].alignment = PP_ALIGN.CENTER

    # ── Connector lines from agents to hub (simplified visual) ──
    # Top-left to hub
    arrow_right(slide, Inches(3.8), Inches(2.1), Inches(1.6), Inches(0.2), ACCENT_DIM)
    # Top-right to hub (reversed - use left arrow concept)
    s = slide.shapes.add_shape(MSO_SHAPE.LEFT_ARROW, Inches(6.8), Inches(2.1), Inches(2.0), Inches(0.2))
    s.fill.solid()
    s.fill.fore_color.rgb = RGBColor(0x14, 0x53, 0x2D)
    s.line.fill.background()

    # Bottom-left to hub
    arrow_right(slide, Inches(3.8), Inches(4.5), Inches(1.6), Inches(0.2), RGBColor(0x71, 0x3F, 0x12))
    # Bottom-right to hub
    s = slide.shapes.add_shape(MSO_SHAPE.LEFT_ARROW, Inches(6.8), Inches(4.5), Inches(2.0), Inches(0.2))
    s.fill.solid()
    s.fill.fore_color.rgb = RGBColor(0x58, 0x1C, 0x87)
    s.line.fill.background()

    # Bottom agent to hub
    arrow_down(slide, Inches(6.25), Inches(5.2), Inches(0.2), Inches(0.3), RGBColor(0x83, 0x18, 0x43))

    # ── Key Benefits (Bottom) ──
    divider(slide, Inches(0.8), Inches(6.0), Inches(11.7))

    benefits = [
        ("Proactive", "Act before problems occur"),
        ("Always On", "Heuristic fallback if AI is down"),
        ("Real-Time", "5-second update cycle"),
    ]

    for i, (title, desc) in enumerate(benefits):
        x = Inches(0.8) + Inches(i * 4.1)
        text(slide, x, Inches(6.2), Inches(3.8), Inches(0.3),
             title, size=12, color=ACCENT, bold=True)
        text(slide, x, Inches(6.5), Inches(3.8), Inches(0.3),
             desc, size=10, color=TEXT_SECONDARY)


# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 4: Technical Approach (Horizontal Flowchart + Tech Stack)
# ══════════════════════════════════════════════════════════════════════════════
def fill_slide_4(slide):
    set_bg(slide)
    clear_slide(slide)

    heading(slide, Inches(0.8), Inches(0.4), Inches(11), "Technical Approach")

    divider(slide, Inches(0.8), Inches(1.0), Inches(11.7))

    # ── Horizontal Step Flow (Top) ──
    text(slide, Inches(0.8), Inches(1.2), Inches(5), Inches(0.3),
         "Agent Decision Flow", size=14, color=ACCENT, bold=True)

    steps = [
        ("Twin\nSnapshot", ACCENT),
        ("6 Agents\nAnalyze", SUCCESS),
        ("Propose\nActions", WARNING),
        ("Orchestrator\nResolves", PURPLE),
        ("Apply to\nTwin", PINK),
        ("Broadcast\nvia WS", CYAN),
    ]

    step_w = Inches(1.5)
    step_h = Inches(1.0)
    gap = Inches(0.35)
    start_x = Inches(0.8)
    start_y = Inches(1.7)

    for i, (label_text, color) in enumerate(steps):
        x = start_x + i * (step_w + gap)
        step_circle(slide, x + Inches(0.55), start_y - Inches(0.05), i + 1, color)
        c = rounded(slide, x, start_y + Inches(0.5), step_w, step_h, fill=BG_CARD, border=color)
        tf = c.text_frame
        tf.paragraphs[0].text = label_text
        tf.paragraphs[0].font.size = Pt(10)
        tf.paragraphs[0].font.color.rgb = TEXT_PRIMARY
        tf.paragraphs[0].font.bold = True
        tf.paragraphs[0].font.name = FONT
        tf.paragraphs[0].alignment = PP_ALIGN.CENTER

        if i < len(steps) - 1:
            arrow_right(slide, x + step_w + Inches(0.05), start_y + Inches(0.85),
                       Inches(0.25), Inches(0.15), BORDER_LIGHT)

    # ── Tech Stack (Bottom - Icon Cards) ──
    divider(slide, Inches(0.8), Inches(3.6), Inches(11.7))

    text(slide, Inches(0.8), Inches(3.8), Inches(5), Inches(0.3),
         "Technology Stack", size=14, color=TEXT_SECONDARY, bold=True)

    techs = [
        ("Next.js 15", "Frontend", ACCENT),
        ("React 19", "UI Library", CYAN),
        ("Tailwind v4", "Styling", PURPLE),
        ("Gemini", "AI Engine", SUCCESS),
        ("Supabase", "Database", WARNING),
        ("Socket.io", "Real-Time", PINK),
    ]

    tech_w = Inches(1.75)
    tech_h = Inches(1.3)
    tech_gap = Inches(0.2)
    tech_start_x = Inches(0.8)
    tech_y = Inches(4.3)

    for i, (name, category, color) in enumerate(techs):
        x = tech_start_x + i * (tech_w + tech_gap)
        c = rounded(slide, x, tech_y, tech_w, tech_h, fill=BG_CARD, border=BORDER)

        # Color accent dot
        oval(slide, x + Inches(0.6), tech_y + Inches(0.2), Inches(0.15), Inches(0.15), fill=color)

        text(slide, x, tech_y + Inches(0.45), tech_w, Inches(0.3),
             name, size=13, color=TEXT_PRIMARY, bold=True, align=PP_ALIGN.CENTER)
        text(slide, x, tech_y + Inches(0.8), tech_w, Inches(0.3),
             category, size=10, color=TEXT_MUTED, align=PP_ALIGN.CENTER)

    # ── Architecture Summary (Right Side) ──
    arch_items = [
        ("Frontend", "Next.js 15 + React 19 + Tailwind v4"),
        ("Real-Time", "Socket.io WebSocket bridge"),
        ("Agent Worker", "Node.js + Express server"),
        ("Digital Twin", "In-memory state + 5s tick cycle"),
        ("AI Layer", "Google Gemini + heuristic fallback"),
        ("Database", "PostgreSQL via Supabase"),
    ]

    arch_x = Inches(0.8)
    arch_y = Inches(5.9)

    for i, (key, val) in enumerate(arch_items):
        x = arch_x + Inches(i * 2.1)
        text(slide, x, arch_y, Inches(1.9), Inches(0.25),
             key, size=9, color=ACCENT, bold=True)
        text(slide, x, arch_y + Inches(0.25), Inches(1.9), Inches(0.4),
             val, size=8, color=TEXT_MUTED)


# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 5: Use Cases & Impact (Split Column)
# ══════════════════════════════════════════════════════════════════════════════
def fill_slide_5(slide):
    set_bg(slide)
    clear_slide(slide)

    heading(slide, Inches(0.8), Inches(0.4), Inches(11), "Use Cases & Impact")

    divider(slide, Inches(0.8), Inches(1.0), Inches(11.7))

    # ── Left: Use Cases ──
    text(slide, Inches(0.8), Inches(1.2), Inches(5), Inches(0.3),
         "Key Use Cases", size=14, color=ACCENT, bold=True)

    use_cases = [
        ("Customer Ordering",
         "Guest types: '25 min, light dinner, pre-show'. Guest Alchemist parses intent, checks kitchen load, returns personalized meal sequence.",
         ACCENT),
        ("Kitchen Optimization",
         "Grill station hits 90% load. Kitchen Conductor auto-routes items to Saute or Cold Prep. Chefs see only relevant orders.",
         SUCCESS),
        ("Crisis Response",
         "Storm + event surge. Demand Seer detects. Inventory Guardian flags spoilage. Orchestrator resolves all conflicts.",
         DANGER),
        ("Waste Prevention",
         "Salmon at 35% freshness. Inventory Guardian promotes Cold Salmon Tartare. 3.2kg waste prevented.",
         WARNING),
    ]

    y = Inches(1.6)
    for title, desc, color in use_cases:
        c = card(slide, Inches(0.8), y, Inches(5.5), Inches(1.15))
        rect(slide, Inches(0.8), y, Pt(4), Inches(1.15), fill=color)
        text(slide, Inches(1.1), y + Inches(0.1), Inches(5.1), Inches(0.3),
             title, size=13, color=color, bold=True)
        text(slide, Inches(1.1), y + Inches(0.45), Inches(5.1), Inches(0.6),
             desc, size=10, color=TEXT_SECONDARY)
        y += Inches(1.3)

    # ── Right: Impact Metrics (Large Typography) ──
    text(slide, Inches(7.2), Inches(1.2), Inches(5), Inches(0.3),
         "Expected Impact", size=14, color=SUCCESS, bold=True)

    impacts = [
        ("30-40%", "Waste Reduction",
         "Proactive spoilage alerts + dynamic menu promotion", SUCCESS),
        ("25%", "Service Speed",
         "Intelligent routing + task prioritization", ACCENT),
        ("35%", "Staff Efficiency",
         "Optimized task distribution reduces burnout", PURPLE),
        ("+2.0", "Guest Delight",
         "Personalized experiences + recovery perks", WARNING),
    ]

    y = Inches(1.6)
    for value, metric, desc, color in impacts:
        c = card(slide, Inches(7.2), y, Inches(5), Inches(1.15))

        text(slide, Inches(7.5), y + Inches(0.08), Inches(2), Inches(0.6),
             value, size=36, color=color, bold=True)

        text(slide, Inches(9.6), y + Inches(0.12), Inches(2.3), Inches(0.3),
             metric, size=14, color=TEXT_PRIMARY, bold=True)

        text(slide, Inches(9.6), y + Inches(0.5), Inches(2.3), Inches(0.55),
             desc, size=10, color=TEXT_SECONDARY)

        y += Inches(1.3)

    # ── Bottom: Target Users ──
    divider(slide, Inches(0.8), Inches(6.9), Inches(11.7))

    text(slide, Inches(0.8), Inches(7.0), Inches(2), Inches(0.25),
         "Target Users", size=10, color=TEXT_MUTED, bold=True)

    users = ["Owners", "Managers", "Kitchen", "Front-of-House", "Operations"]
    for i, name in enumerate(users):
        x = Inches(3.0) + Inches(i * 2.1)
        c = rounded(slide, x, Inches(6.95), Inches(1.8), Inches(0.35), fill=BG_ELEVATED, border=BORDER)
        tf = c.text_frame
        tf.paragraphs[0].text = name
        tf.paragraphs[0].font.size = Pt(9)
        tf.paragraphs[0].font.color.rgb = TEXT_SECONDARY
        tf.paragraphs[0].font.name = FONT
        tf.paragraphs[0].alignment = PP_ALIGN.CENTER


# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 6: Future Scope & Conclusion (Timeline + Tagline)
# ══════════════════════════════════════════════════════════════════════════════
def fill_slide_6(slide):
    set_bg(slide)
    clear_slide(slide)

    heading(slide, Inches(0.8), Inches(0.4), Inches(11), "Future Scope & Conclusion")

    divider(slide, Inches(0.8), Inches(1.0), Inches(11.7))

    # ── Left: Future Enhancements ──
    text(slide, Inches(0.8), Inches(1.2), Inches(5.5), Inches(0.3),
         "Future Enhancements", size=14, color=ACCENT, bold=True)

    enhancements = [
        ("Multi-Restaurant Federation",
         "Extend the digital twin to manage multiple locations with cross-location inventory sharing.",
         ACCENT),
        ("Advanced ML Models",
         "Replace heuristic fallback with trained models for demand prediction and preference learning.",
         SUCCESS),
        ("Voice & Chat Integration",
         "Natural language ordering via voice assistants and in-app chat.",
         PURPLE),
        ("Supply Chain Integration",
         "Direct supplier connection for automated reordering and delivery scheduling.",
         WARNING),
    ]

    y = Inches(1.6)
    for title, desc, color in enhancements:
        c = card(slide, Inches(0.8), y, Inches(5.5), Inches(1.1))
        rect(slide, Inches(0.8), y, Pt(4), Inches(1.1), fill=color)
        text(slide, Inches(1.1), y + Inches(0.1), Inches(5.1), Inches(0.3),
             title, size=13, color=color, bold=True)
        text(slide, Inches(1.1), y + Inches(0.45), Inches(5.1), Inches(0.55),
             desc, size=10, color=TEXT_SECONDARY)
        y += Inches(1.2)

    # ── Right: Conclusion ──
    text(slide, Inches(7.2), Inches(1.2), Inches(5), Inches(0.3),
         "Conclusion", size=14, color=SUCCESS, bold=True)

    conclusion = [
        "Transforms restaurant operations from reactive to proactive.",
        "Six specialized AI agents collaborate through a living digital twin.",
        "Multi-agent architecture with heuristic fallback ensures reliability.",
        "Real-time updates via WebSocket across all stakeholders.",
        "Measurable impact: less waste, faster service, happier guests.",
    ]

    y = Inches(1.6)
    for point in conclusion:
        # Bullet dot
        oval(slide, Inches(7.2), y + Inches(0.06), Inches(0.1), Inches(0.1), fill=SUCCESS)
        text(slide, Inches(7.5), y, Inches(4.5), Inches(0.35),
             point, size=10, color=TEXT_SECONDARY)
        y += Inches(0.4)

    # ── Horizontal Timeline (Bottom) ──
    text(slide, Inches(7.2), Inches(3.7), Inches(5), Inches(0.3),
         "Scalability Roadmap", size=14, color=PURPLE, bold=True)

    # Timeline line
    line_y = Inches(4.6)
    rect(slide, Inches(7.2), line_y, Inches(5), Pt(3), fill=BORDER_LIGHT)

    phases = [
        ("Phase 1", "Single restaurant", Inches(7.2)),
        ("Phase 2", "Multi-location", Inches(8.7)),
        ("Phase 3", "Supply chain", Inches(10.2)),
        ("Phase 4", "Platform", Inches(11.7)),
    ]

    for label_text, desc, x in phases:
        # Node on timeline
        oval(slide, x + Inches(0.3), line_y - Inches(0.08), Inches(0.2), Inches(0.2), fill=PURPLE)
        text(slide, x, Inches(4.85), Inches(1.2), Inches(0.3),
             label_text, size=9, color=PURPLE, bold=True)
        text(slide, x, Inches(5.1), Inches(1.2), Inches(0.3),
             desc, size=8, color=TEXT_MUTED)

    # ── Tagline (Center Bottom) ──
    divider(slide, Inches(0.8), Inches(5.8), Inches(11.7))

    text(slide, Inches(0.8), Inches(6.0), Inches(11.7), Inches(0.5),
         "Maestro: Your Restaurant Runs Itself", size=24, bold=True, align=PP_ALIGN.CENTER)
    text(slide, Inches(0.8), Inches(6.5), Inches(11.7), Inches(0.4),
         "Less waste. Faster tables. Happier guests. Staff that do not burn out.",
         size=14, color=TEXT_SECONDARY, align=PP_ALIGN.CENTER)


# ══════════════════════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════════════════════
def main():
    print(f"Loading: {PPTX_PATH}")
    prs = Presentation(PPTX_PATH)

    print("Slide 1: Original title page preserved")
    print("Slide 2: Current Problem...")
    fill_slide_2(prs.slides[1])

    print("Slide 3: Proposed Solution...")
    fill_slide_3(prs.slides[2])

    print("Slide 4: Technical Approach...")
    fill_slide_4(prs.slides[3])

    print("Slide 5: Use Cases & Impact...")
    fill_slide_5(prs.slides[4])

    print("Slide 6: Future Scope & Conclusion...")
    fill_slide_6(prs.slides[5])

    prs.save(OUTPUT_PATH)
    print(f"\nSaved: {OUTPUT_PATH}")
    print(f"Size: {os.path.getsize(OUTPUT_PATH) / 1024:.1f} KB")


if __name__ == '__main__':
    main()
