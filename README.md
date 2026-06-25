# Solar PV — Adapt Framework e-Learning Module

A SCORM 1.2 course built with [Adapt Framework](https://www.adaptlearning.org/) 5.56.2 for a Level 2+ vocational Solar PV curriculum.

## Live preview

- Course entry point: [`index.html`](https://nikhilsaini-iitj.github.io/Solar_PV_Adapt_SCORM12/)
- LMS entry point: [`index_lms.html`](https://nikhilsaini-iitj.github.io/Solar_PV_Adapt_SCORM12/index_lms.html)

## What’s included

- 3D virtual lab, AR panel viewer, and interactive tools embedded as custom components
- Exploded 3D solar panel view with labeled layers (glass, EVA, cells, back-sheet, frame, junction box)
- **Electrical safety lab** with PPE selector, LOTO sequence, and multimeter CAT rating simulations
- HTML5 video lessons with `.vtt` captions
- Native Adapt MCQ / matching assessment (60% pass threshold)
- Page-level progress drawer
- Full keyboard / screen-reader accessibility
- SCORM 1.2 completion + score reporting via `adapt-contrib-spoor`
- **xAPI sidecar** for immersive activity tracking (AR, 3D lab, safety simulations)
- Markerless AR experience using [Google model-viewer](https://modelviewer.dev/) + direct AR Quick Look on iOS
- WebXR auto-tracking AR mode on Android Chrome (panel follows the floor as you move)
- **AR enhancements**: sun-angle shadow simulator, human scale silhouette, floor/wall placement
- **Badge pathway**: PV Anatomy, Spec Master, Safety Ready, AR Explorer, Module Pass

## SCORM package

Download the ready-to-upload LMS zip: **[Solar_PV_Adapt_SCORM12.zip](https://github.com/nikhilsaini-iitj/Solar_PV_Adapt_SCORM12/releases/download/v1.0.0/Solar_PV_Adapt_SCORM12.zip)**

Or zip the contents of this branch and import it into your LMS.

## License

Built on Adapt Framework (GPL-3.0). Custom component `adapt-solar-embed` is MIT.
