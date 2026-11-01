# CodeFlow Slides Demos

Interactive demos for the CodeFlow capstone presentation, plus a PowerPoint content add-in that embeds them in slides.

- `index.html` — demo hub (Collections, Views by data type, A*, offline tracing, New project)
- `addin.html` — page loaded by the PowerPoint add-in; each add-in instance remembers its demo
- `manifest.xml` — add-in manifest (sideload on the presenting computer)

## Use on Mac
1. Quit PowerPoint.
2. In Terminal:
   mkdir -p ~/Library/Containers/com.microsoft.Powerpoint/Data/Documents/wef
   cp manifest.xml ~/Library/Containers/com.microsoft.Powerpoint/Data/Documents/wef/
3. Open PowerPoint and the deck. Insert → Add-ins → My Add-ins → CodeFlow Demos (under developer add-ins).
4. Drag the add-in frame over the dashed "LIVE" frame on the slide and pick the demo.
