# Solar PV E-Learning Module — Technology Stack

## Core Platform
| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | **Adapt Framework 5.56.2** | SCORM-compliant responsive e-learning authoring |
| SCORM runtime | **adapt-contrib-spoor** | SCORM 1.2 tracking, completion, suspend data |
| Build pipeline | **Node.js + Grunt** | Course compilation, minification, JSON validation |
| Host / LMS deploy | **GitHub Pages** | Public preview and SCORM package distribution |

## Front-end
| Technology | Purpose |
|------------|---------|
| **React 16 (Adapt JSX templates)** | Component rendering |
| **Backbone.js** | Adapt MVC / component lifecycle |
| **LESS/CSS** | Theme customisation (`adapt-contrib-vanilla`) |
| **model-viewer 3.5.0** | 3D / AR viewer for the panel (WebXR + iOS Quick Look) |
| **three.js 0.160** | Custom interactive diagrams and WebXR fallback |
| **HTML5 Video** | Course video delivery |

## Custom Components Built
- `adapt-solar-embed` — React/Backbone component to embed external HTML interactives (AR, 3D lab, diagrams, safety lab).
- Interactive SVG diagrams with click handlers (system energy flow, panel labels, P-N junction).
- Custom LESS theme overrides for client palette (deep navy, amber, gold brackets, silhouettes).

## AR / 3D Assets
| Asset | Format | Notes |
|-------|--------|-------|
| 3D panel | `panel.glb` | GLB for model-viewer and three.js |
| iOS AR | `panel.usdz` | USDZ for Apple AR Quick Look |
| QR code | PNG | Desktop-to-mobile fallback |

## SCORM 1.2 Reporting
- `cmi.core.lesson_status`: completed / incomplete
- `cmi.core.score.raw`: assessment score
- `cmi.suspend_data`: resume bookmark
- Interactions recorded via `cmi.interactions` for MCQ / matching / custom xAPI wrappers

## xAPI (Learning Record Store ready)
- Custom `xapi.js` wrapper sends statements for:
  - AR launch / complete / lock toggles / sun-angle changes
  - Interactive diagram clicks
  - 3D lab manipulations
  - Safety-lab interactions

## Development / Build Command
