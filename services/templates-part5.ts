import { ManualResumeInput } from '../types/resume';
import { escape, A4_STYLES } from './templates-helpers';

// 41. Holographic Neon
const holographicNeon = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escape(r.fullName)} - Resume</title>
<style>
  ${A4_STYLES}
  :root {
    --bg: #0b0f1a;
    --neon1: #00e6ff;
    --neon2: #ff00e6;
    --neon3: #8aff00;
  }
  body {
    margin: 0;
    padding: 0;
    background: radial-gradient(100% 100% at 50% 0%, rgba(0,230,255,0.08), transparent 40%),
                radial-gradient(100% 100% at 100% 100%, rgba(255,0,230,0.06), transparent 40%),
                var(--bg);
    color: #e6f1ff;
    font-family: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  }
  .glow-ring {
    position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(350mm 350mm at 50% -50mm, rgba(0,230,255,0.18), transparent 50%),
                radial-gradient(350mm 350mm at 50% 347mm, rgba(255,0,230,0.14), transparent 45%);
    filter: blur(0.4mm);
  }
  .container {
    width: 190mm; height: 277mm; margin: 10mm; position: relative;
    border: 0.6mm solid rgba(255,255,255,0.12);
    background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
    backdrop-filter: blur(1mm);
  }
  .header { display: grid; grid-template-columns: 1fr auto; gap: 6mm; padding: 14mm 14mm 8mm; border-bottom: 0.6mm solid rgba(255,255,255,0.12); }
  h1 { margin: 0; font-size: 28pt; letter-spacing: 0.5mm; background: linear-gradient(90deg, var(--neon1), var(--neon2), var(--neon3)); -webkit-background-clip: text; color: transparent; }
  h2 { margin: 1mm 0 0; font-size: 12pt; color: #99a7c0; font-weight: 500; }
  .contact { text-align: right; font-size: 9pt; color: #9fb3d0; }
  .badge { display: inline-block; border: 0.5mm solid rgba(255,255,255,0.2); padding: 1mm 2.5mm; border-radius: 3mm; margin-left: 2mm; }
  .main { display: grid; grid-template-columns: 70mm 1fr; gap: 12mm; padding: 12mm 14mm; }
  .section-title { font-size: 11pt; letter-spacing: 0.6mm; text-transform: uppercase; color: #b8c7e6; margin: 0 0 4mm; position: relative; }
  .section-title::after { content: ''; position: absolute; left: 0; bottom: -1.5mm; width: 24mm; height: 0.6mm; background: linear-gradient(90deg, var(--neon1), transparent); }
  .chip { display: inline-block; background: rgba(0,230,255,0.08); color: #b8f6ff; border: 0.4mm solid rgba(0,230,255,0.3); padding: 1.2mm 2.8mm; border-radius: 3mm; margin: 0 2mm 2mm 0; font-size: 8.5pt; }
  .experience { margin-bottom: 8mm; }
  .job { font-weight: 700; color: #e6f1ff; }
  .meta { color: #8aa0c0; font-size: 9pt; margin: 0.5mm 0 2mm; }
  .desc { color: #c8d6f0; font-size: 9pt; line-height: 1.6; }
</style>
</head>
<body>
  <div class="glow-ring"></div>
  <div class="container">
    <div class="header">
      <div>
        <h1>${escape(r.fullName)}</h1>
        ${r.title ? `<h2>${escape(r.title)}</h2>` : ''}
      </div>
      <div class="contact">
        ${r.email ? `<span class="badge">✉ ${escape(r.email)}</span>` : ''}
        ${r.phone ? `<span class="badge">☎ ${escape(r.phone)}</span>` : ''}
        ${r.linkedIn ? `<span class="badge">in ${escape(r.linkedIn)}</span>` : ''}
      </div>
    </div>
    <div class="main">
      <aside>
        ${r.summary ? `<div><h3 class="section-title">Profile</h3><div class="desc">${escape(r.summary)}</div></div>` : ''}
        ${r.skills?.length ? `<div style="margin-top:6mm"><h3 class="section-title">Skills</h3>${r.skills.map((s) => `<span class="chip">${escape(s.name)}</span>`).join('')}</div>` : ''}
      </aside>
      <section>
        <div><h3 class="section-title">Experience</h3>${r.experience
          .slice(0, 3)
          .map(
            (e) => `
          <div class="experience">
            <div class="job">${escape(e.jobTitle)}</div>
            <div class="meta">${escape(e.company)} · ${escape(e.startDate)} — ${escape(e.endDate || 'Present')}</div>
            <div class="desc">${(e.description || [])
              .slice(0, 3)
              .map((d) => `• ${escape(d)}`)
              .join('<br>')}</div>
          </div>`
          )
          .join('')}</div>
        ${
          r.education?.length
            ? `<div style="margin-top:8mm"><h3 class="section-title">Education</h3>${r.education
                .map(
                  (edu) => `
          <div class="experience">
            <div class="job">${escape(edu.degree)}</div>
            <div class="meta">${escape(edu.institution)} · ${escape(edu.startDate)} — ${escape(edu.endDate || 'Graduated')}</div>
          </div>`
                )
                .join('')}</div>`
            : ''
        }
      </section>
    </div>
  </div>
</body>
</html>`;

// 42. Magazine Cover
const magazineCover = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escape(r.fullName)} - Resume</title>
<style>
  ${A4_STYLES}
  body { margin: 0; padding: 0; font-family: 'Montserrat', Arial, sans-serif; background: #111; color: #111; }
  .cover { height: 287mm; margin: 5mm; background: white; position: relative; overflow: hidden; }
  .stripe { position: absolute; top:0; left: -20mm; width: 120mm; height: 100%; background: linear-gradient(180deg, #ff3d00, #ffb300); transform: skewX(-18deg); }
  .masthead { position: absolute; top: 12mm; left: 18mm; color: white; text-transform: uppercase; letter-spacing: 2mm; font-weight: 800; font-size: 16pt; }
  h1 { position: absolute; top: 35mm; left: 20mm; right: 20mm; font-size: 40pt; line-height: 1.05; margin: 0; color: white; }
  .subtitle { position: absolute; top: 85mm; left: 20mm; color: #fffde7; font-weight: 600; }
  .box { position: absolute; right: 12mm; top: 18mm; background: rgba(0,0,0,0.75); color: white; padding: 6mm; border-radius: 2mm; }
  .box div { margin-bottom: 2mm; font-size: 9pt; }
  .content { position: absolute; bottom: 10mm; left: 20mm; right: 20mm; display: grid; grid-template-columns: 1fr 1fr; gap: 12mm; }
  .section-title { font-weight: 800; text-transform: uppercase; letter-spacing: 0.8mm; color: #ff3d00; }
  .card { border-top: 2mm solid #ff3d00; padding-top: 3mm; }
  .job { font-weight: 700; }
  .meta { color: #666; font-size: 9pt; margin: 1mm 0 2mm; }
  .desc { font-size: 9pt; line-height: 1.6; }
</style>
</head>
<body>
  <div class="cover">
    <div class="stripe"></div>
    <div class="masthead">Profile</div>
    <h1>${escape(r.fullName)}</h1>
    ${r.title ? `<div class="subtitle">${escape(r.title)}</div>` : ''}
    <div class="box">
      ${r.email ? `<div>✉ ${escape(r.email)}</div>` : ''}
      ${r.phone ? `<div>☎ ${escape(r.phone)}</div>` : ''}
      ${r.linkedIn ? `<div>in ${escape(r.linkedIn)}</div>` : ''}
    </div>
    <div class="content">
      ${r.summary ? `<div><div class="section-title">Cover Story</div><div class="desc">${escape(r.summary)}</div></div>` : ''}
      <div>
        <div class="section-title">Experience</div>
        ${r.experience
          .slice(0, 3)
          .map(
            (e) => `<div class="card">
          <div class="job">${escape(e.jobTitle)}</div>
          <div class="meta">${escape(e.company)} · ${escape(e.startDate)} — ${escape(e.endDate || 'Present')}</div>
          <div class="desc">${(e.description || [])
            .slice(0, 2)
            .map((d) => `• ${escape(d)}`)
            .join('<br>')}</div>
        </div>`
          )
          .join('')}
      </div>
    </div>
  </div>
</body>
</html>`;

// 43. Blueprint Engineer
const blueprintEngineer = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escape(r.fullName)} - Resume</title>
<style>
  ${A4_STYLES}
  body { margin:0; padding:0; background: #0a2342; color: #e8f1ff; font-family: 'IBM Plex Sans', sans-serif; }
  .paper { width: 190mm; height: 277mm; margin: 10mm; background: repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 0.6mm, transparent 0.6mm, transparent 5mm), #0a2342; border: 0.6mm solid #4db6ff; position: relative; padding: 14mm; }
  .title { font-size: 26pt; margin: 0; }
  .subtitle { color: #8ccfff; margin: 1mm 0 0; }
  .grid-cross { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; background: linear-gradient(90deg, rgba(77,182,255,0.15) 1px, transparent 1px), linear-gradient(rgba(77,182,255,0.15) 1px, transparent 1px); background-size: 10mm 10mm; }
  .row { display: grid; grid-template-columns: 70mm 1fr; gap: 10mm; margin-top: 10mm; }
  .box { border: 0.6mm solid #4db6ff; padding: 6mm; border-radius: 1mm; box-shadow: 0 0 0 1mm rgba(77,182,255,0.06) inset; }
  .section { margin-bottom: 8mm; }
  .section h3 { margin: 0 0 3mm; letter-spacing: 1mm; text-transform: uppercase; font-size: 10pt; color: #8ccfff; }
  .chip { display:inline-block; border:0.4mm solid #4db6ff; padding:1mm 2.8mm; border-radius:2mm; margin:0 2mm 2mm 0; font-size: 8.5pt; }
  .meta { color: #a8cfff; font-size: 9pt; margin: 1mm 0 2mm; }
  .desc { font-size: 9pt; line-height: 1.6; }
</style>
</head>
<body>
  <div class="paper">
    <div class="grid-cross"></div>
    <h1 class="title">${escape(r.fullName)}</h1>
    ${r.title ? `<div class="subtitle">${escape(r.title)}</div>` : ''}
    <div class="row">
      <div>
        ${r.summary ? `<div class="box section"><h3>Specification</h3><div class="desc">${escape(r.summary)}</div></div>` : ''}
        ${r.skills?.length ? `<div class="box section"><h3>Tooling</h3>${r.skills.map((s) => `<span class="chip">${escape(s.name)}</span>`).join('')}</div>` : ''}
        <div class="box section"><h3>Contact</h3>
          <div class="desc">${[r.email && `✉ ${escape(r.email)}`, r.phone && `☎ ${escape(r.phone)}`, r.linkedIn && `in ${escape(r.linkedIn)}`].filter(Boolean).join('<br>')}</div>
        </div>
      </div>
      <div>
        <div class="box section"><h3>Experience</h3>
          ${r.experience
            .slice(0, 3)
            .map(
              (e) => `<div style="margin-bottom:5mm">
            <div><strong>${escape(e.jobTitle)}</strong></div>
            <div class="meta">${escape(e.company)} · ${escape(e.startDate)} — ${escape(e.endDate || 'Present')}</div>
            <div class="desc">${(e.description || [])
              .slice(0, 3)
              .map((d) => `• ${escape(d)}`)
              .join('<br>')}</div>
          </div>`
            )
            .join('')}
        </div>
        ${
          r.education?.length
            ? `<div class="box section"><h3>Education</h3>${r.education
                .map(
                  (edu) => `<div>
          <div><strong>${escape(edu.degree)}</strong></div>
          <div class="meta">${escape(edu.institution)} · ${escape(edu.startDate)} — ${escape(edu.endDate || 'Graduated')}</div>
        </div>`
                )
                .join('')}</div>`
            : ''
        }
      </div>
    </div>
  </div>
</body>
</html>`;

// 44. Botanical Frame
const botanicalFrame = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escape(r.fullName)} - Resume</title>
<style>
  ${A4_STYLES}
  body { margin:0; padding:0; background:#fbfff7; color:#2b3a2f; font-family:'Merriweather', Georgia, serif; }
  .frame { width: 190mm; height: 277mm; margin: 10mm; padding: 14mm; position: relative; background:white; }
  .frame:before, .frame:after { content:''; position:absolute; inset: 8mm; border: 1mm solid #7cb342; border-radius: 6mm; pointer-events:none; }
  .leaves { position:absolute; inset:0; background: 
    radial-gradient(circle at 10% 10%, rgba(124,179,66,0.08), transparent 30%),
    radial-gradient(circle at 90% 20%, rgba(76,175,80,0.08), transparent 30%),
    radial-gradient(circle at 20% 90%, rgba(56,142,60,0.08), transparent 30%);
    pointer-events:none; }
  h1 { margin:0; font-size: 30pt; color:#33691e; }
  h2 { margin:2mm 0 6mm; color:#5d6d5f; font-weight: normal; }
  .grid { display:grid; grid-template-columns: 70mm 1fr; gap: 10mm; margin-top: 8mm; }
  .section-title { color:#558b2f; text-transform: uppercase; letter-spacing: 0.5mm; font-size: 10pt; margin: 0 0 3mm; }
  .chip { display:inline-block; background:#f1f8e9; border: 0.4mm solid #a5d6a7; color:#2e7d32; padding:1mm 3mm; border-radius: 3mm; margin:0 2mm 2mm 0; font-size: 9pt; }
  .meta { color:#6b7d6d; font-size: 9pt; margin:1mm 0 2mm; }
  .desc { font-size: 9.5pt; line-height: 1.7; }
</style>
</head>
<body>
  <div class="frame">
    <div class="leaves"></div>
    <h1>${escape(r.fullName)}</h1>
    ${r.title ? `<h2>${escape(r.title)}</h2>` : ''}
    <div class="grid">
      <aside>
        ${r.summary ? `<div><div class="section-title">About</div><div class="desc">${escape(r.summary)}</div></div>` : ''}
        ${r.skills?.length ? `<div style="margin-top:6mm"><div class="section-title">Skills</div>${r.skills.map((s) => `<span class=\"chip\">${escape(s.name)}</span>`).join('')}</div>` : ''}
        <div style="margin-top:6mm"><div class="section-title">Contact</div><div class="desc">${[
          r.email,
          r.phone,
          r.linkedIn,
        ]
          .filter(Boolean)
          .map((v) => escape(v as string))
          .join('<br>')}</div></div>
      </aside>
      <section>
        <div><div class="section-title">Experience</div>${r.experience
          .slice(0, 3)
          .map(
            (e) => `
          <div style="margin-bottom:6mm">
            <div><strong>${escape(e.jobTitle)}</strong></div>
            <div class="meta">${escape(e.company)} · ${escape(e.startDate)} — ${escape(e.endDate || 'Present')}</div>
            <div class="desc">${(e.description || [])
              .slice(0, 3)
              .map((d) => `• ${escape(d)}`)
              .join('<br>')}</div>
          </div>`
          )
          .join('')}</div>
        ${
          r.education?.length
            ? `<div style="margin-top:8mm"><div class="section-title">Education</div>${r.education
                .map(
                  (edu) => `
          <div class="desc"><strong>${escape(edu.degree)}</strong> — ${escape(edu.institution)} (${escape(edu.startDate)} — ${escape(edu.endDate || 'Graduated')})</div>
        `
                )
                .join('')}</div>`
            : ''
        }
      </section>
    </div>
  </div>
</body>
</html>`;

// 45. Retro Terminal
const retroTerminal = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escape(r.fullName)} - Resume</title>
<style>
  ${A4_STYLES}
  body { margin:0; padding:0; background:#0d0f0c; color:#d4f8c4; font-family: 'Fira Code', monospace; }
  .crt { width:190mm; height:277mm; margin:10mm; padding:12mm; border: 1mm solid #3faa3f; position: relative; box-shadow: 0 0 8mm rgba(63,170,63,0.25) inset; }
  .scan { position:absolute; inset:0; background: repeating-linear-gradient(0deg, rgba(212,248,196,0.06) 0, rgba(212,248,196,0.06) 1mm, transparent 1mm, transparent 2mm); pointer-events:none; }
  .blink { animation: blink 1.2s steps(2, start) infinite; }
  @keyframes blink { to { visibility: hidden; } }
  h1 { margin:0; font-size: 20pt; }
  h2 { margin:2mm 0 6mm; color:#a3e9a4; font-weight:400; }
  .prompt { color:#88e188; }
  .grid { display:grid; grid-template-columns: 70mm 1fr; gap: 10mm; }
  .list { margin: 0; padding-left: 0; list-style: none; }
  .list li::before { content: '> '; color:#80e27e; }
  .mono { font-size: 9.5pt; line-height: 1.7; white-space: pre-wrap; }
  .tag { display:inline-block; border: 0.4mm solid #80e27e; padding: 0.6mm 2.2mm; margin: 0 2mm 2mm 0; border-radius: 1mm; }
</style>
</head>
<body>
  <div class="crt">
    <div class="scan"></div>
    <div class="mono">$ whoami</div>
    <h1 class="prompt">${escape(r.fullName)}<span class="blink">_</span></h1>
    ${r.title ? `<h2>${escape(r.title)}</h2>` : ''}
    <div class="grid">
      <aside>
        ${r.summary ? `<div class="mono">$ cat profile.txt\n${escape(r.summary)}</div>` : ''}
        ${r.skills?.length ? `<div style="margin-top:6mm" class="mono">$ ls skills\n${r.skills.map((s) => `[${escape(s.name)}]`).join(' ')}</div>` : ''}
        <div style="margin-top:6mm" class="mono">$ grep -R contact .\n${[r.email && `email: ${escape(r.email)}`, r.phone && `phone: ${escape(r.phone)}`, r.linkedIn && `linkedin: ${escape(r.linkedIn)}`].filter(Boolean).join('\n')}</div>
      </aside>
      <section>
        <div class="mono">$ tail -n 3 experience.log</div>
        ${r.experience
          .slice(0, 3)
          .map(
            (e) =>
              `<div style="margin:3mm 0 6mm"><strong>${escape(e.jobTitle)}</strong> @ ${escape(e.company)}\n${escape(e.startDate)} — ${escape(e.endDate || 'Present')}\n${(
                e.description || []
              )
                .slice(0, 3)
                .map((d) => `- ${escape(d)}`)
                .join('\n')}</div>`
          )
          .join('')}
        ${r.education?.length ? `<div class="mono">$ cat education.yaml\n${r.education.map((edu) => `- degree: ${escape(edu.degree)}\n  school: ${escape(edu.institution)}\n  period: ${escape(edu.startDate)} — ${escape(edu.endDate || 'Graduated')}`).join('\n')}</div>` : ''}
      </section>
    </div>
  </div>
</body>
</html>`;

// 46. Origami Fold
const origamiFold = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escape(r.fullName)} - Resume</title>
<style>
  ${A4_STYLES}
  body { margin:0; padding:0; background:#f7fbff; color:#1d3557; font-family:'Poppins', Arial, sans-serif; }
  .sheet { width:190mm; height:277mm; margin:10mm; background:white; position:relative; padding:16mm; }
  .corner { position:absolute; width:0; height:0; border-top: 18mm solid #457b9d; border-left: 18mm solid transparent; right:0; top:0; }
  .corner:after { content:''; position:absolute; top:-18mm; right:-18mm; border-top: 16mm solid #a8dadc; border-left: 16mm solid transparent; }
  h1 { margin:0; font-size:28pt; }
  h2 { margin:2mm 0 6mm; color:#457b9d; font-weight:500; }
  .grid { display:grid; grid-template-columns: 65mm 1fr; gap: 12mm; }
  .pill { display:inline-block; background:#eaf6ff; border:0.5mm solid #a8dadc; color:#1d3557; padding:1mm 3mm; border-radius: 4mm; margin:0 2mm 2mm 0; font-size:9pt; }
  .section-title { color:#457b9d; letter-spacing:0.6mm; text-transform:uppercase; font-size:10pt; margin: 0 0 3mm; }
  .meta { color:#5f738a; font-size:9pt; margin:1mm 0 2mm; }
  .desc { font-size:9.5pt; line-height:1.7; }
</style>
</head>
<body>
  <div class="sheet">
    <div class="corner"></div>
    <h1>${escape(r.fullName)}</h1>
    ${r.title ? `<h2>${escape(r.title)}</h2>` : ''}
    <div class="grid">
      <aside>
        ${r.summary ? `<div><div class="section-title">Overview</div><div class="desc">${escape(r.summary)}</div></div>` : ''}
        ${r.skills?.length ? `<div style="margin-top:6mm"><div class="section-title">Skills</div>${r.skills.map((s) => `<span class=\"pill\">${escape(s.name)}</span>`).join('')}</div>` : ''}
        <div style="margin-top:6mm"><div class="section-title">Contact</div><div class="desc">${[
          r.email,
          r.phone,
          r.linkedIn,
        ]
          .filter(Boolean)
          .map((v) => escape(v as string))
          .join('<br>')}</div></div>
      </aside>
      <section>
        <div><div class="section-title">Experience</div>${r.experience
          .slice(0, 3)
          .map(
            (e) => `
          <div style="margin-bottom:6mm">
            <div><strong>${escape(e.jobTitle)}</strong></div>
            <div class="meta">${escape(e.company)} · ${escape(e.startDate)} — ${escape(e.endDate || 'Present')}</div>
            <div class="desc">${(e.description || [])
              .slice(0, 3)
              .map((d) => `• ${escape(d)}`)
              .join('<br>')}</div>
          </div>`
          )
          .join('')}</div>
        ${
          r.education?.length
            ? `<div style="margin-top:8mm"><div class="section-title">Education</div>${r.education
                .map(
                  (edu) => `
          <div class="desc"><strong>${escape(edu.degree)}</strong> — ${escape(edu.institution)} (${escape(edu.startDate)} — ${escape(edu.endDate || 'Graduated')})</div>
        `
                )
                .join('')}</div>`
            : ''
        }
      </section>
    </div>
  </div>
</body>
</html>`;

// 47. Timeline Rail
const timelineRail = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escape(r.fullName)} - Resume</title>
<style>
  ${A4_STYLES}
  body { margin:0; padding:0; background:#0f1217; color:#e8ecf1; font-family: 'Nunito Sans', system-ui, sans-serif; }
  .wrap { width: 190mm; height: 277mm; margin: 10mm; position: relative; background: linear-gradient(180deg, #11151c, #0f1217); padding: 14mm; }
  .rail { position:absolute; left: 40%; top: 0; bottom: 0; width: 1mm; background: linear-gradient(#00d1ff, transparent 40%, #8a2be2 70%, transparent); opacity: 0.6; }
  h1 { margin: 0; font-size: 28pt; }
  h2 { margin: 2mm 0 8mm; color:#9fb3c8; font-weight: 500; }
  .grid { display:grid; grid-template-columns: 1fr 1fr; gap: 10mm; }
  .dot { width: 4mm; height: 4mm; border-radius: 50%; background: #00d1ff; position: absolute; left: calc(40% - 2mm); transform: translateY(-50%); box-shadow: 0 0 3mm rgba(0,209,255,0.5); }
  .item { position: relative; padding-left: 10mm; margin: 8mm 0; }
  .meta { color:#9fb3c8; font-size: 9pt; margin: 1mm 0; }
  .desc { font-size: 9pt; line-height: 1.6; }
  .section-title { color:#91a4bd; text-transform: uppercase; letter-spacing: 0.5mm; margin: 0 0 4mm; font-size: 10pt; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="rail"></div>
    <h1>${escape(r.fullName)}</h1>
    ${r.title ? `<h2>${escape(r.title)}</h2>` : ''}
    <div class="grid">
      <div>
        ${r.summary ? `<div><div class="section-title">Profile</div><div class="desc">${escape(r.summary)}</div></div>` : ''}
        ${r.skills?.length ? `<div style="margin-top:6mm"><div class="section-title">Skills</div>${r.skills.map((s) => `<span style='display:inline-block;margin:0 2mm 2mm 0;padding:1mm 3mm;border:0.4mm solid #91a4bd;border-radius:3mm;'>${escape(s.name)}</span>`).join('')}</div>` : ''}
        <div style="margin-top:6mm"><div class="section-title">Contact</div><div class="desc">${[
          r.email,
          r.phone,
          r.linkedIn,
        ]
          .filter(Boolean)
          .map((v) => escape(v as string))
          .join('<br>')}</div></div>
      </div>
      <div>
        <div class="section-title">Experience</div>
        ${r.experience
          .slice(0, 3)
          .map((e, i) => {
            const top = 10 + i * 32; // mm rough placement
            return `<div class='item' style='margin-top: 12mm;'>
            <div class='dot' style='top: ${top}mm'></div>
            <div><strong>${escape(e.jobTitle)}</strong></div>
            <div class='meta'>${escape(e.company)} · ${escape(e.startDate)} — ${escape(e.endDate || 'Present')}</div>
            <div class='desc'>${(e.description || [])
              .slice(0, 2)
              .map((d) => `• ${escape(d)}`)
              .join('<br>')}</div>
          </div>`;
          })
          .join('')}
        ${r.education?.length ? `<div style='margin-top:8mm'><div class='section-title'>Education</div>${r.education.map((edu) => `<div class='desc'><strong>${escape(edu.degree)}</strong> — ${escape(edu.institution)} (${escape(edu.startDate)} — ${escape(edu.endDate || 'Graduated')})</div>`).join('')}</div>` : ''}
      </div>
    </div>
  </div>
</body>
</html>`;

// 48. Data Dashboard
const dataDashboard = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escape(r.fullName)} - Resume</title>
<style>
  ${A4_STYLES}
  body { margin:0; padding:0; background:#0c0f14; color:#e9eef5; font-family:'Inter', system-ui, sans-serif; }
  .panel { width:190mm; height:277mm; margin:10mm; background:#0f141b; border: 0.6mm solid #263241; padding: 12mm; }
  .grid { display:grid; grid-template-columns: 1fr 1fr; gap: 10mm; }
  .widget { background:#121923; border: 0.6mm solid #223044; border-radius: 2mm; padding: 6mm; }
  .title { font-size: 26pt; margin:0; }
  .subtitle { color:#9fb3c8; margin:2mm 0 6mm; }
  .kpi { display:flex; gap: 6mm; margin: 0 0 6mm; }
  .kpi .box { flex:1; background:#0e1420; border: 0.6mm solid #1a2838; padding: 4mm; border-radius: 2mm; text-align:center; }
  .chip { display:inline-block; margin: 1mm 1.5mm 0 0; padding: 1mm 2.5mm; background:#1a2533; border: 0.4mm solid #2b3d53; border-radius: 3mm; font-size: 8.5pt; }
  .list-item { margin-bottom: 5mm; }
  .meta { color:#9fb3c8; font-size: 9pt; margin: 1mm 0 2mm; }
  .desc { font-size: 9pt; line-height: 1.6; }
</style>
</head>
<body>
  <div class="panel">
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom: 8mm;">
      <div>
        <h1 class="title">${escape(r.fullName)}</h1>
        ${r.title ? `<div class="subtitle">${escape(r.title)}</div>` : ''}
      </div>
      <div style="text-align:right; font-size:9pt; color:#9fb3c8;">
        ${r.email ? `<div>✉ ${escape(r.email)}</div>` : ''}
        ${r.phone ? `<div>☎ ${escape(r.phone)}</div>` : ''}
        ${r.linkedIn ? `<div>in ${escape(r.linkedIn)}</div>` : ''}
      </div>
    </div>

    <div class="kpi">
      <div class="box"><div style="font-size:10pt;color:#9fb3c8">Experience Roles</div><div style="font-size:18pt;font-weight:700;">${r.experience.length}</div></div>
      <div class="box"><div style="font-size:10pt;color:#9fb3c8">Skill Count</div><div style="font-size:18pt;font-weight:700;">${r.skills?.length || 0}</div></div>
      <div class="box"><div style="font-size:10pt;color:#9fb3c8">Education</div><div style="font-size:18pt;font-weight:700;">${r.education?.length || 0}</div></div>
    </div>

    <div class="grid">
      <div class="widget">
        <div style="font-weight:700; margin-bottom:3mm">Profile</div>
        <div class="desc">${r.summary ? escape(r.summary) : '—'}</div>
      </div>
      <div class="widget">
        <div style="font-weight:700; margin-bottom:3mm">Skills</div>
        ${r.skills?.length ? r.skills.map((s) => `<span class='chip'>${escape(s.name)}</span>`).join('') : '<div class="desc">—</div>'}
      </div>
      <div class="widget" style="grid-column: 1 / -1;">
        <div style="font-weight:700; margin-bottom:3mm">Experience</div>
        ${r.experience
          .slice(0, 3)
          .map(
            (e) => `<div class='list-item'>
          <div><strong>${escape(e.jobTitle)}</strong></div>
          <div class='meta'>${escape(e.company)} · ${escape(e.startDate)} — ${escape(e.endDate || 'Present')}</div>
          <div class='desc'>${(e.description || [])
            .slice(0, 3)
            .map((d) => `• ${escape(d)}`)
            .join('<br>')}</div>
        </div>`
          )
          .join('')}
      </div>
      ${
        r.education?.length
          ? `<div class='widget' style='grid-column: 1 / -1;'>
        <div style='font-weight:700; margin-bottom:3mm'>Education</div>
        ${r.education.map((edu) => `<div class='desc'><strong>${escape(edu.degree)}</strong> — ${escape(edu.institution)} (${escape(edu.startDate)} — ${escape(edu.endDate || 'Graduated')})</div>`).join('')}
      </div>`
          : ''
      }
    </div>
  </div>
</body>
</html>`;

// 49. Handwritten Notebook
const handwrittenNotebook = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escape(r.fullName)} - Resume</title>
<style>
  ${A4_STYLES}
  body { margin:0; padding:0; background:#fefaf1; color:#26221f; font-family: 'Kalam', 'Comic Sans MS', system-ui, sans-serif; }
  .page { width: 190mm; height: 277mm; margin: 10mm; background: repeating-linear-gradient(#f3e7d3, #f3e7d3 6mm, #fefaf1 6mm, #fefaf1 12mm); position: relative; padding: 16mm; }
  .margin-line { position:absolute; top:0; bottom:0; left: 22mm; width: 1.2mm; background:#ff8a80; opacity:0.7; }
  h1 { margin:0; font-size: 28pt; font-weight: 700; }
  h2 { margin:2mm 0 6mm; color:#8d6e63; font-weight: 600; }
  .grid { display:grid; grid-template-columns: 70mm 1fr; gap: 10mm; }
  .sketch { padding: 4mm; border: 1.2mm dashed #8d6e63; border-radius: 2mm; background: rgba(255,255,255,0.65); }
  .tag { display:inline-block; background:#fff3e0; border: 0.4mm solid #ffcc80; padding: 1mm 3mm; border-radius: 3mm; margin: 0 2mm 2mm 0; font-size: 9pt; }
  .meta { color:#6d4c41; font-size: 9pt; margin: 1mm 0 2mm; }
  .desc { font-size: 9.5pt; line-height: 1.7; }
</style>
</head>
<body>
  <div class="page">
    <div class="margin-line"></div>
    <h1>${escape(r.fullName)}</h1>
    ${r.title ? `<h2>${escape(r.title)}</h2>` : ''}
    <div class="grid">
      <aside>
        ${r.summary ? `<div class='sketch'><div style='font-weight:700'>About Me</div><div class='desc'>${escape(r.summary)}</div></div>` : ''}
        ${r.skills?.length ? `<div class='sketch' style='margin-top:6mm'><div style='font-weight:700'>Skills</div>${r.skills.map((s) => `<span class='tag'>${escape(s.name)}</span>`).join('')}</div>` : ''}
        <div class='sketch' style='margin-top:6mm'><div style='font-weight:700'>Contact</div><div class='desc'>${[
          r.email,
          r.phone,
          r.linkedIn,
        ]
          .filter(Boolean)
          .map((v) => escape(v as string))
          .join('<br>')}</div></div>
      </aside>
      <section>
        <div class='sketch'>
          <div style='font-weight:700; margin-bottom:3mm'>Experience</div>
          ${r.experience
            .slice(0, 3)
            .map(
              (e) => `<div style='margin-bottom:6mm'>
            <div><strong>${escape(e.jobTitle)}</strong></div>
            <div class='meta'>${escape(e.company)} · ${escape(e.startDate)} — ${escape(e.endDate || 'Present')}</div>
            <div class='desc'>${(e.description || [])
              .slice(0, 3)
              .map((d) => `• ${escape(d)}`)
              .join('<br>')}</div>
          </div>`
            )
            .join('')}
        </div>
        ${r.education?.length ? `<div class='sketch' style='margin-top:6mm'><div style='font-weight:700'>Education</div>${r.education.map((edu) => `<div class='desc'><strong>${escape(edu.degree)}</strong> — ${escape(edu.institution)} (${escape(edu.startDate)} — ${escape(edu.endDate || 'Graduated')})</div>`).join('')}</div>` : ''}
      </section>
    </div>
  </div>
</body>
</html>`;

// 50. Glass Morphism
const glassMorphism = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escape(r.fullName)} - Resume</title>
<style>
  ${A4_STYLES}
  body { margin:0; padding:0; background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d); color:#f2f5f9; font-family:'Manrope', system-ui, sans-serif; }
  .card { width: 190mm; height: 277mm; margin: 10mm; position: relative; padding: 14mm; }
  .blur { position:absolute; inset:0; background: rgba(255,255,255,0.15); border: 0.6mm solid rgba(255,255,255,0.35); border-radius: 4mm; backdrop-filter: blur(2.2mm); -webkit-backdrop-filter: blur(2.2mm); }
  .content { position: relative; z-index: 1; padding: 10mm; }
  h1 { margin:0; font-size: 28pt; }
  h2 { margin:2mm 0 8mm; color:#e4ebf5; font-weight: 500; }
  .grid { display:grid; grid-template-columns: 70mm 1fr; gap: 10mm; }
  .pill { display:inline-block; padding: 1mm 3mm; border-radius: 3mm; background: rgba(255,255,255,0.18); border: 0.4mm solid rgba(255,255,255,0.35); margin: 0 2mm 2mm 0; font-size: 9pt; }
  .meta { color:#dbe4f1; font-size:9pt; margin:1mm 0 2mm; }
  .desc { font-size: 9.5pt; line-height: 1.7; }
</style>
</head>
<body>
  <div class="card">
    <div class="blur"></div>
    <div class="content">
      <div style="display:flex; justify-content:space-between; align-items:flex-end;">
        <div>
          <h1>${escape(r.fullName)}</h1>
          ${r.title ? `<h2>${escape(r.title)}</h2>` : ''}
        </div>
        <div style="text-align:right; font-size:9pt;">
          ${r.email ? `<div>✉ ${escape(r.email)}</div>` : ''}
          ${r.phone ? `<div>☎ ${escape(r.phone)}</div>` : ''}
          ${r.linkedIn ? `<div>in ${escape(r.linkedIn)}</div>` : ''}
        </div>
      </div>
      <div class="grid">
        <aside>
          ${r.summary ? `<div><div style='font-weight:700;margin:8mm 0 3mm'>About</div><div class='desc'>${escape(r.summary)}</div></div>` : ''}
          ${r.skills?.length ? `<div><div style='font-weight:700;margin:8mm 0 3mm'>Skills</div>${r.skills.map((s) => `<span class='pill'>${escape(s.name)}</span>`).join('')}</div>` : ''}
        </aside>
        <section>
          <div style='margin-top:2mm'><div style='font-weight:700;margin:0 0 3mm'>Experience</div>
            ${r.experience
              .slice(0, 3)
              .map(
                (e) => `<div style='margin-bottom:6mm'>
              <div><strong>${escape(e.jobTitle)}</strong></div>
              <div class='meta'>${escape(e.company)} · ${escape(e.startDate)} — ${escape(e.endDate || 'Present')}</div>
              <div class='desc'>${(e.description || [])
                .slice(0, 3)
                .map((d) => `• ${escape(d)}`)
                .join('<br>')}</div>
            </div>`
              )
              .join('')}
          </div>
          ${r.education?.length ? `<div style='margin-top:8mm'><div style='font-weight:700;margin:0 0 3mm'>Education</div>${r.education.map((edu) => `<div class='desc'><strong>${escape(edu.degree)}</strong> — ${escape(edu.institution)} (${escape(edu.startDate)} — ${escape(edu.endDate || 'Graduated')})</div>`).join('')}</div>` : ''}
        </section>
      </div>
    </div>
  </div>
</body>
</html>`;

export {
  holographicNeon,
  magazineCover,
  blueprintEngineer,
  botanicalFrame,
  retroTerminal,
  origamiFold,
  timelineRail,
  dataDashboard,
  handwrittenNotebook,
  glassMorphism,
};
