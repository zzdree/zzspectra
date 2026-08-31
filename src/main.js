import './style.css';

const STORAGE_KEY = 'zzspectra-project-v3';
const colors = ['#f4b942', '#5ce1e6', '#d9e9ff', '#e878b9', '#ffffff', '#ff735f', '#7bf59a', '#9a7bff'];
const fixtureTypes = ['WASH', 'SPOT', 'BEAM', 'PIXEL BAR'];
const qualityTiers = ['low', 'balanced', 'high'];
const goboIcons = ['○','◇','✦','⬢','▣','≋'];
const goboNames = ['Open','Dot','Star','Prism','Frost','Stripe'];
const fxTypes = [
  { id:'off', label:'Off' },
  { id:'circle', label:'Circle' },
  { id:'figure8', label:'Figure 8' },
  { id:'scan', label:'Scan' },
  { id:'pargoy', label:'Pargoy' },
  { id:'shake', label:'Shake' },
];

const initialFixtures = [
  { id: 'L-01', name: 'Front wash L', type: 'WASH', x: -3.2, y: 1.6, z: 1.2, color: '#f4b942', dimmer: 82, pan: -18, tilt: 56, zoom: 24, strobe: 0, gobo: 0 },
  { id: 'L-02', name: 'Front wash R', type: 'WASH', x: 3.2, y: 1.6, z: 1.2, color: '#f4b942', dimmer: 68, pan: 18, tilt: 56, zoom: 24, strobe: 0, gobo: 0 },
  { id: 'S-01', name: 'Spot center', type: 'SPOT', x: 0, y: 2.2, z: 3.5, color: '#d9e9ff', dimmer: 100, pan: 0, tilt: 52, zoom: 18, strobe: 0, gobo: 2 },
  { id: 'B-01', name: 'Beam downstage', type: 'BEAM', x: 0, y: 4.2, z: 1.5, color: '#5ce1e6', dimmer: 44, pan: 0, tilt: 72, zoom: 10, strobe: 0, gobo: 1 },
];

function defaultProject(){
  return {
    version: 3,
    showName: 'Untitled show',
    quality: 'balanced',
    mode: 'pro',
    fixtures: structuredClone(initialFixtures),
    selected: 'S-01', selectedIds: ['S-01'],
    blackout: false, playing: false,
    activeCue: 1, grouped: false,
    looks: [],
    cues: [
      { id: 1, name: 'House open', fade: 0, delay: 0, state: { 'L-01': { dimmer: 32, color: '#f4b942' }, 'L-02': { dimmer: 32, color: '#f4b942' } } },
      { id: 2, name: 'Blue wash', fade: 2, delay: 0, state: { 'L-01': { dimmer: 55, color: '#5ce1e6' }, 'L-02': { dimmer: 55, color: '#5ce1e6' } } },
      { id: 3, name: 'Center focus', fade: 1.5, delay: 0, state: { 'S-01': { dimmer: 100, color: '#d9e9ff' } } },
      { id: 4, name: 'Finale', fade: 3, delay: 0, state: { 'L-01': { dimmer: 100, color: '#e878b9' }, 'L-02': { dimmer: 100, color: '#e878b9' }, 'B-01': { dimmer: 90, color: '#5ce1e6' } } },
    ],
    chase: { enabled:false, bpm:128, mode:'loop', steps: [ {color:'#f4b942', dimmer:100}, {color:'#5ce1e6', dimmer:100}, {color:'#e878b9', dimmer:100}, {color:'#ffffff', dimmer:100} ] },
    fx: { type:'off', speed:1.0, size:28, mirror:false, rainbow:false, rainbowSpeed:1.0 },
    mod: { space:0, posX:0, posY:0, rot:0 },
    audio: { enabled:false, sensitivity:65, mode:'auto' },
  };
}

function isFixture(v){ return v && typeof v.id==='string' && typeof v.name==='string' && fixtureTypes.includes(v.type); }

function normalizeProject(v){
  const base=defaultProject();
  if(!v || !Array.isArray(v.fixtures) || !v.fixtures.every(isFixture)) return base;
  const valid=new Set(v.fixtures.map(f=>f.id));
  const sels=(v.selectedIds||[v.selected]).filter(id=>valid.has(id));
  const chase = v.chase && Array.isArray(v.chase.steps) ? v.chase : base.chase;
  const fx = v.fx && typeof v.fx.type==='string' ? {...base.fx, ...v.fx} : base.fx;
  const mod = v.mod ? {...base.mod, ...v.mod} : base.mod;
  const audio = v.audio ? {...base.audio, ...v.audio} : base.audio;
  return {
    ...base, ...v,
    quality: qualityTiers.includes(v.quality)?v.quality:'balanced',
    mode: ['pro','play'].includes(v.mode)?v.mode:base.mode,
    fixtures: v.fixtures.map(f=>({...f,
      dimmer: Math.max(0,Math.min(100,Number(f.dimmer)||0)),
      pan:Number(f.pan)||0, tilt:Number(f.tilt)||0, zoom:Number(f.zoom)||24, strobe:Number(f.strobe)||0,
      gobo: Math.max(0,Math.min(5, Number(f.gobo)||0)),
    })),
    selected: valid.has(v.selected)?v.selected:v.fixtures[0].id,
    selectedIds: sels.length?sels:[valid.has(v.selected)?v.selected:v.fixtures[0].id],
    cues: Array.isArray(v.cues)?v.cues.map((c,i)=>({ id:c.id||i+1, name:String(c.name||`Cue ${i+1}`), fade:Math.max(0,Number(c.fade)||0), delay:Math.max(0,Number(c.delay)||0), state:c.state||{} })):base.cues,
    looks: Array.isArray(v.looks)?v.looks:base.looks,
    chase: { enabled: !!chase.enabled, bpm: Math.max(20,Math.min(300, Number(chase.bpm)||128)), mode: ['loop','bounce','random'].includes(chase.mode)?chase.mode:'loop', steps: (chase.steps||base.chase.steps).map(s=>({ color: typeof s.color==='string'?s.color:'#ffffff', dimmer: Math.max(0,Math.min(100,Number(s.dimmer)||100)) })).slice(0,8) },
    fx, mod, audio
  };
}
function loadProject(){ try{ const raw=localStorage.getItem(STORAGE_KEY); if(raw) return normalizeProject(JSON.parse(raw)); const old=localStorage.getItem('zzspectra-project-v2'); if(old) return normalizeProject(JSON.parse(old)); return defaultProject(); }catch{ return defaultProject(); } }

let project=loadProject();
let history=[], future=[], cueTimer, cueAnimation;
let camera={ yaw:-0.18, pitch:0.72, zoom:1, panX:0, panY:0 };
let showGrid=true, dragging=false, lastPointer={x:0,y:0};

// runtime engines
let chaseTick=0, fxPhase=0, audioLevel=0, audioCtx, analyser, micStream, autoPhase=0;
let lastFrame=performance.now();

function snapshot(){ return structuredClone(project); }
function commit(mutator){ history.push(snapshot()); if(history.length>40) history.shift(); future=[]; mutator(); saveProject(false); renderAll(); }
function undo(){ if(!history.length) return toast('Nothing to undo'); future.push(snapshot()); project=history.pop(); renderAll(); toast('Undone'); }
function redo(){ if(!future.length) return toast('Nothing to redo'); history.push(snapshot()); project=future.pop(); renderAll(); toast('Redone'); }
function saveProject(notify=true){ localStorage.setItem(STORAGE_KEY, JSON.stringify(project)); if(notify) setStatus('Saved locally'); }
function setStatus(t){ const el=document.querySelector('#save-status'); if(el) el.textContent=t; }
function selectedIds(){ return project.selectedIds?.length?project.selectedIds:[project.selected]; }
function selectedFixture(){ return project.fixtures.find(f=>f.id===project.selected)||project.fixtures[0]; }
function setSelection(id, additive=false){
  const cur=additive?selectedIds():[];
  project.selected=id;
  project.selectedIds=project.grouped ? project.fixtures.filter(f=>f.type===project.fixtures.find(it=>it.id===id)?.type).map(f=>f.id) : [...new Set([...cur,id])];
}
function escapeHtml(v){ return String(v).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// ── Audio engine ──
async function toggleAudio(){
  project.audio.enabled=!project.audio.enabled;
  if(project.audio.enabled){
    try{
      audioCtx=new (window.AudioContext||window.webkitAudioContext)();
      analyser=audioCtx.createAnalyser(); analyser.fftSize=256;
      if(project.audio.mode==='mic'){
        micStream=await navigator.mediaDevices.getUserMedia({audio:true});
        const src=audioCtx.createMediaStreamSource(micStream);
        src.connect(analyser);
      }
      toast('Audio reactive ON');
    }catch{ project.audio.mode='auto'; toast('Mic blocked — auto beat'); }
  } else {
    try{ micStream?.getTracks()?.forEach(t=>t.stop()); }catch{}
    audioLevel=0;
    toast('Audio reactive OFF');
  }
  renderAll(); saveProject(false);
}
function pollAudio(){
  if(!project.audio.enabled) { audioLevel *=0.92; return; }
  if(project.audio.mode==='auto'){
    autoPhase += project.chase.bpm/60 * 0.06;
    audioLevel = 0.55 + 0.45*Math.sin(autoPhase*2);
    return;
  }
  if(!analyser) return;
  const arr=new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(arr);
  const avg=arr.reduce((a,b)=>a+b,0)/arr.length;
  const target=Math.min(1, avg/90 * (project.audio.sensitivity/65));
  audioLevel = audioLevel*0.6 + target*0.4;
}

// ── template ──
function appTemplate(){
  document.querySelector('#app').innerHTML=`
  <div class="shell">
    <header class="topbar">
      <div class="brand"><b>z</b><strong>zzspectra</strong><small>SHOW CONTROL</small><span class="mode-switch">
        <button class="${project.mode==='pro'?'active':''}" data-mode="pro">PRO</button>
        <button class="${project.mode==='play'?'active':''}" data-mode="play">PLAY</button>
      </span></div>
      <div class="show-meta"><i></i><button class="show-name" id="rename-show">${escapeHtml(project.showName)}</button><em id="save-status">Saved locally</em></div>
      <div class="top-actions">
        <button class="icon-btn" id="undo-btn" aria-label="Undo">↶</button>
        <button class="icon-btn" id="redo-btn" aria-label="Redo">↷</button>
        <button class="icon-btn" id="help-btn" aria-label="Help">?</button>
        <button class="secondary" id="import-btn">Import</button><input id="import-file" type="file" accept="application/json" hidden>
        <button class="secondary" id="export-btn">Export</button>
        <button class="primary" id="save-btn">Save</button>
      </div>
    </header>

    <main class="workspace">
      <aside class="panel fixture-panel" aria-label="Fixture library">
        <div class="panel-heading"><div><label>PATCH / LIBRARY</label><h2>Fixtures <small id="fixture-count"></small></h2></div><button class="icon-btn" id="add-fixture" aria-label="Add">+</button></div>
        <div class="search"><span>⌕</span><input id="fixture-search" type="search" placeholder="Find fixture"></div>
        <div class="section-label"><label>ALL FIXTURES</label><button id="group-toggle" class="text-btn">Group</button></div>
        <div id="fixture-list" class="fixture-list"></div>
        <button class="add-btn" id="add-fixture-bottom">＋ Add fixture</button>

        <div class="presets-block">
          <label>QUICK PRESETS</label>
          <div class="preset-grid">
            <button class="preset" data-preset="even">Even wash</button>
            <button class="preset" data-preset="center">Center</button>
            <button class="preset" data-preset="rave">Rave</button>
            <button class="preset" data-preset="black">All off</button>
          </div>
        </div>
      </aside>

      <section class="stage-panel" aria-label="Stage viewport">
        <div class="stage-heading">
          <div><label>LIVE VIEW / 3D STAGE</label><h1>Stage preview</h1></div>
          <div class="view-tools">
            <label class="quality-control">QUALITY <select id="quality-select"><option value="low">Low</option><option value="balanced">Medium</option><option value="high">High</option></select></label>
            <button class="active" id="perspective-btn">◉ <span>Persp</span></button>
            <button id="grid-btn">▦ <span>Grid</span></button>
            <button id="fit-btn">⛶ <span>Fit</span></button>
          </div>
        </div>

        <div class="viewport-wrap">
          <canvas id="stage-canvas" tabindex="0" aria-label="Stage viewport. Drag orbit, Shift-drag pan, wheel zoom"></canvas>
          <div class="viewport-hint">DRAG ORBIT · SHIFT+DRAG PAN · WHEEL ZOOM</div>
          <div class="camera-readout" id="camera-readout">ZOOM 100%</div>
          <div class="webgl-fallback" id="fallback-note"></div>
          <div class="audio-meter" id="audio-meter" title="Audio level"><i id="audio-meter-fill"></i></div>
        </div>

        <!-- CHASE BAR -->
        <div class="chase-bar" id="chase-bar">
          <div class="chase-head">
            <label>CHASE / COLOR-STEPS</label>
            <div class="chase-controls">
              <label class="toggle"><input type="checkbox" id="chase-enable" ${project.chase.enabled?'checked':''}><span></span> Chase</label>
              <label>BPM <input id="chase-bpm" type="range" min="40" max="280" value="${project.chase.bpm}"><output id="bpm-out">${project.chase.bpm}</output></label>
              <select id="chase-mode">${['loop','bounce','random'].map(m=>`<option ${project.chase.mode===m?'selected':''} value="${m}">${m}</option>`).join('')}</select>
            </div>
          </div>
          <div class="chase-steps" id="chase-steps"></div>
          <div class="chase-actions">
            <button class="mini-btn" id="chase-add">＋ Step</button>
            <button class="mini-btn" id="chase-clear">Clear</button>
            <span class="hint">Tap step to edit color · chase drives dimmer+color live</span>
          </div>
        </div>

        <!-- MOD STRIP -->
        <div class="mod-strip" id="mod-strip">
          <label>SPACE <input id="mod-space" type="range" min="-40" max="40" value="${project.mod.space}"><output>${project.mod.space}</output></label>
          <label>POS X <input id="mod-posx" type="range" min="-30" max="30" value="${project.mod.posX}"><output>${project.mod.posX}°</output></label>
          <label>POS Y <input id="mod-posy" type="range" min="-30" max="30" value="${project.mod.posY}"><output>${project.mod.posY}°</output></label>
          <label>ROT <input id="mod-rot" type="range" min="-45" max="45" value="${project.mod.rot}"><output>${project.mod.rot}°</output></label>
          <button class="mini-btn ${project.fx.rainbow?'active':''}" id="rainbow-btn">🌈 Rainbow</button>
          <button class="mini-btn ${project.audio.enabled?'active':''}" id="audio-btn">♫ Audio</button>
        </div>

        <div class="transport">
          <button id="blackout-btn" class="blackout">● <span>Blackout</span></button>
          <div class="transport-center">
            <button id="prev-cue" aria-label="Prev">◀|</button>
            <button id="play-btn" class="play" aria-label="Play">▶</button>
            <button id="next-cue" aria-label="Next">▶|</button>
          </div>
          <div class="playback-readout"><label>PLAYBACK</label><strong id="playback-cue">Cue 01</strong><span id="playback-name">—</span></div>
        </div>
      </section>

      <aside class="panel inspector-panel sheet-peek" aria-label="Inspector">
        <button class="sheet-handle" id="sheet-toggle" aria-label="Toggle">—</button>
        <div id="inspector"></div>
      </aside>
    </main>

    <footer class="cue-footer">
      <div class="cue-title"><label>CUE STACK</label><b id="cue-count">04 cues</b></div>
      <div id="cue-list" class="cue-list"></div>
      <button id="new-cue" class="new-cue">＋ New cue</button>
    </footer>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>
  </div>`;
}

function renderFixtures(){
  const q=document.querySelector('#fixture-search')?.value?.toLowerCase()||'';
  const fixtures=project.fixtures.filter(f=>`${f.id} ${f.name} ${f.type}`.toLowerCase().includes(q));
  const sel=selectedIds();
  const fc=document.querySelector('#fixture-count'); if(fc) fc.textContent=String(project.fixtures.length).padStart(2,'0');
  document.querySelector('#fixture-list').innerHTML=fixtures.map(f=>`
    <button class="fixture-row ${sel.includes(f.id)?'selected':''}" data-fixture="${escapeHtml(f.id)}">
      <code>${escapeHtml(f.id)}</code><i class="fixture-dot" style="--c:${f.color}"></i>
      <span><b>${escapeHtml(f.name)}</b><small>${f.type} · ${f.dimmer}% · ${goboNames[f.gobo]||'Open'}</small></span>
      <meter min="0" max="100" value="${f.dimmer}"></meter>
    </button>`).join('')||'<div class="empty">Tidak ada fixture.</div>';
  document.querySelectorAll('[data-fixture]').forEach(el=> el.onclick=e=> commit(()=> setSelection(el.dataset.fixture, e.ctrlKey||e.metaKey)) );
}

function renderChaseSteps(){
  const wrap=document.querySelector('#chase-steps'); if(!wrap) return;
  const idx = project.chase.enabled ? Math.floor(chaseTick) % project.chase.steps.length : -1;
  wrap.innerHTML=project.chase.steps.map((s,i)=>`
    <button class="chase-step ${i===idx?'active':''}" data-step="${i}" style="--c:${s.color}">
      <span class="step-color" style="background:${s.color}"></span>
      <small>${String(i+1).padStart(2,'0')}</small>
      <em>${s.dimmer}%</em>
    </button>`).join('');
  wrap.querySelectorAll('[data-step]').forEach(el=>{
    el.onclick=()=>{
      const pick=prompt('Warna hex (contoh #ff3366) atau kosong untuk hapus:', project.chase.steps[el.dataset.step].color);
      if(pick===null) return;
      if(pick.trim()===''){ commit(()=> project.chase.steps.splice(Number(el.dataset.step),1) ); if(!project.chase.steps.length) project.chase.steps.push({color:'#ffffff',dimmer:100}); toast('Step dihapus'); return; }
      const col=pick.trim();
      if(!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(col)) return toast('Hex tidak valid');
      commit(()=> project.chase.steps[Number(el.dataset.step)].color=col);
    };
  });
}

function renderInspector(){
  const f=selectedFixture();
  const qs=document.querySelector('#quality-select'); if(qs) qs.value=project.quality;
  const selCount=selectedIds().length;
  if(!f){ document.querySelector('#inspector').innerHTML='<div class="empty">Pilih fixture.</div>'; return; }
  document.querySelector('#inspector').innerHTML=`
  <div class="inspect-head"><div><label>SELECTED ${selCount>1?`· ${selCount} GROUPED`:''}</label><h2>${escapeHtml(f.name)}</h2><small>● ${escapeHtml(f.id)} · ${f.type}</small></div><button class="icon-btn" id="delete-fixture">×</button></div>

  <section class="parameter identity-grid"><label>Name <input id="fixture-name" value="${escapeHtml(f.name)}" maxlength="48"></label><label>Type <select id="fixture-type">${fixtureTypes.map(t=>`<option ${t===f.type?'selected':''}>${t}</option>`).join('')}</select></label></section>

  <section class="parameter"><div class="parameter-label"><span>Intensity</span><output>${f.dimmer}%</output></div><input id="dimmer-control" type="range" min="0" max="100" value="${f.dimmer}"></section>

  <section class="parameter"><div class="parameter-label"><span>Color</span><output><i class="color-preview" style="background:${f.color}"></i>${f.color.toUpperCase()}</output></div>
    <div class="colors">${colors.map(c=>`<button class="color-chip ${c===f.color?'chosen':''}" data-color="${c}" style="--c:${c}"></button>`).join('')}</div>
  </section>

  <section class="parameter"><div class="parameter-label"><span>Gobo / Pattern</span><small>${goboNames[f.gobo]}</small></div>
    <div class="gobo-grid">${goboIcons.map((ic,i)=>`<button class="gobo-btn ${i===f.gobo?'active':''}" data-gobo="${i}" title="${goboNames[i]}"><span>${ic}</span><small>${goboNames[i]}</small></button>`).join('')}</div>
  </section>

  <section class="parameter"><div class="parameter-label"><span>Position</span><small>PAN / TILT</small></div>
    <div class="range-grid"><label>Pan <input id="pan-control" type="range" min="-180" max="180" value="${f.pan}"><output>${f.pan}°</output></label><label>Tilt <input id="tilt-control" type="range" min="0" max="180" value="${f.tilt}"><output>${f.tilt}°</output></label></div>
  </section>

  <section class="parameter"><div class="parameter-label"><span>Beam / optics</span><small>LIVE</small></div>
    <div class="range-grid"><label>Zoom <input id="zoom-control" type="range" min="5" max="60" value="${f.zoom}"><output>${f.zoom}°</output></label><label>Strobe <input id="strobe-control" type="range" min="0" max="100" value="${f.strobe}"><output>${f.strobe}%</output></label></div>
  </section>

  <section class="parameter fx-panel"><div class="parameter-label"><span>Motion FX</span><small>${project.fx.type.toUpperCase()}</small></div>
    <div class="fx-row">
      <select id="fx-type">${fxTypes.map(t=>`<option value="${t.id}" ${project.fx.type===t.id?'selected':''}>${t.label}</option>`).join('')}</select>
      <label>Speed <input id="fx-speed" type="range" min="0" max="2" step="0.1" value="${project.fx.speed}"><output>${project.fx.speed.toFixed(1)}×</output></label>
      <label>Size <input id="fx-size" type="range" min="0" max="60" value="${project.fx.size}"><output>${project.fx.size}</output></label>
    </div>
    <label class="check-row"><input type="checkbox" id="fx-mirror" ${project.fx.mirror?'checked':''}> Mirror (L/R berlawanan)</label>
  </section>

  <section class="looks"><div class="parameter-label"><span>Looks</span><button class="text-btn" id="capture-look">＋ Capture</button></div>
    <div class="look-list">${project.looks.map((lk,i)=>`<button class="look-row" data-look="${i}"><span>${escapeHtml(lk.name)}</span><small>Recall ↗</small></button>`).join('')||'<div class="empty">Belum ada look.</div>'}</div>
  </section>
  <div class="inspector-help">Ctrl+K capture look · Space play · B blackout · R reset cam</div>`;

  const bind=(id,key)=>{
    const input=document.querySelector(id); if(!input) return;
    input.oninput=()=>{ const v=Number(input.value); commit(()=> selectedIds().forEach(fid=>{ const t=project.fixtures.find(x=>x.id===fid); if(t) t[key]=v; })); };
  };
  bind('#dimmer-control','dimmer'); bind('#pan-control','pan'); bind('#tilt-control','tilt'); bind('#zoom-control','zoom'); bind('#strobe-control','strobe');
  document.querySelector('#fixture-name').onchange=e=> commit(()=>{ f.name=e.target.value.trim()||f.name; });
  document.querySelector('#fixture-type').onchange=e=> commit(()=>{ f.type=e.target.value; });
  document.querySelectorAll('[data-color]').forEach(el=> el.onclick=()=> commit(()=> selectedIds().forEach(id=>{ const t=project.fixtures.find(x=>x.id===id); if(t) t.color=el.dataset.color; })) );
  document.querySelectorAll('[data-gobo]').forEach(el=> el.onclick=()=> commit(()=> selectedIds().forEach(id=>{ const t=project.fixtures.find(x=>x.id===id); if(t) t.gobo=Number(el.dataset.gobo); })) );
  document.querySelector('#capture-look').onclick=captureLook;
  document.querySelectorAll('[data-look]').forEach(el=> el.onclick=()=> recallLook(Number(el.dataset.look)) );
  document.querySelector('#delete-fixture').onclick=()=>{
    if(project.fixtures.length<=1) return toast('Minimal satu fixture');
    commit(()=>{ project.fixtures=project.fixtures.filter(x=>!selectedIds().includes(x.id)); project.selected=project.fixtures[0].id; project.selectedIds=[project.selected]; });
    toast('Fixture dihapus');
  };
  // FX bindings
  document.querySelector('#fx-type').onchange=e=> commit(()=> project.fx.type=e.target.value);
  document.querySelector('#fx-speed').oninput=e=> { project.fx.speed=Number(e.target.value); e.target.nextElementSibling.textContent=project.fx.speed.toFixed(1)+'×'; saveProject(false); };
  document.querySelector('#fx-speed').onchange=()=> saveProject(false);
  document.querySelector('#fx-size').oninput=e=> { project.fx.size=Number(e.target.value); e.target.nextElementSibling.textContent=String(project.fx.size); saveProject(false); };
  document.querySelector('#fx-size').onchange=()=> saveProject(false);
  document.querySelector('#fx-mirror').onchange=e=> commit(()=> project.fx.mirror=e.target.checked);
}

function renderCues(){
  document.querySelector('#cue-count').textContent=`${String(project.cues.length).padStart(2,'0')} cues`;
  document.querySelector('#cue-list').innerHTML=project.cues.map((c,i)=>`<button class="cue ${i===project.activeCue?'active':''}" data-cue="${i}"><b>${String(c.id).padStart(2,'0')}</b><span>${escapeHtml(c.name)}</span><small>${c.fade.toFixed(1)}s · +${(c.delay||0).toFixed(1)}s</small></button>`).join('');
  document.querySelectorAll('[data-cue]').forEach(el=> el.onclick=()=> triggerCue(Number(el.dataset.cue)) );
  const cue=project.cues[project.activeCue]; if(cue){ document.querySelector('#playback-cue').textContent=`Cue ${String(cue.id).padStart(2,'0')}`; document.querySelector('#playback-name').textContent=cue.name; }
}

function renderAll(){
  renderFixtures(); renderInspector(); renderCues(); renderChaseSteps();
  const bb=document.querySelector('#blackout-btn'); if(bb) bb.classList.toggle('engaged', project.blackout);
  const pb=document.querySelector('#play-btn'); if(pb) pb.textContent=project.playing?'Ⅱ':'▶';
  const ub=document.querySelector('#undo-btn'); if(ub) ub.disabled=!history.length;
  const rb=document.querySelector('#redo-btn'); if(rb) rb.disabled=!future.length;
  const gt=document.querySelector('#group-toggle'); if(gt) gt.classList.toggle('active', project.grouped);
  const ch=document.querySelector('#chase-enable'); if(ch) ch.checked=project.chase.enabled;
  drawStage();
}

function triggerCue(index){
  const cue=project.cues[index]; if(!cue) return;
  clearTimeout(cueTimer); cancelAnimationFrame(cueAnimation);
  const start=snapshot();
  commit(()=>{ project.activeCue=index; project.blackout=false; });
  const applyTarget=()=>{
    const started=performance.now(), duration=Math.max(0,cue.fade*1000);
    const tick=now=>{
      const p=duration?Math.min(1,(now-started)/duration):1;
      project.fixtures.forEach(f=>{
        const tgt=cue.state[f.id], from=start.fixtures.find(x=>x.id===f.id); if(!tgt||!from) return;
        if(tgt.dimmer!==undefined) f.dimmer=Math.round(from.dimmer+(Number(tgt.dimmer)-from.dimmer)*p);
        if(tgt.pan!==undefined) f.pan=from.pan+(Number(tgt.pan)-from.pan)*p;
        if(tgt.tilt!==undefined) f.tilt=from.tilt+(Number(tgt.tilt)-from.tilt)*p;
        if(tgt.zoom!==undefined) f.zoom=from.zoom+(Number(tgt.zoom)-from.zoom)*p;
        if(tgt.color && p>=1) f.color=tgt.color;
      });
      drawStage(); if(p<1) cueAnimation=requestAnimationFrame(tick); else saveProject(false);
    };
    cueAnimation=requestAnimationFrame(tick);
  };
  cueTimer=setTimeout(applyTarget, Math.max(0,cue.delay*1000));
  toast(`Cue ${String(cue.id).padStart(2,'0')} · ${cue.name}${cue.fade?` · fade ${cue.fade}s`:''}`);
}

function captureLook(){
  const name=prompt('Nama look baru:', `Look ${project.looks.length+1}`);
  if(!name?.trim()) return;
  commit(()=> project.looks.push({ name:name.trim(), state:Object.fromEntries(project.fixtures.map(f=>[f.id,{dimmer:f.dimmer,color:f.color,pan:f.pan,tilt:f.tilt,zoom:f.zoom,strobe:f.strobe,gobo:f.gobo}])) }));
  toast(`Look “${name.trim()}” disimpan`);
}
function recallLook(i){
  const lk=project.looks[i]; if(!lk) return;
  commit(()=> Object.entries(lk.state).forEach(([id,vals])=>{ const f=project.fixtures.find(x=>x.id===id); if(f) Object.assign(f,vals); }));
  toast(`Look “${lk.name}” dipanggil`);
}
function newCue(){
  const name=prompt('Nama cue baru:', `Cue ${project.cues.length+1}`);
  if(!name?.trim()) return;
  commit(()=>{ project.cues.push({ id:project.cues.length+1, name:name.trim(), fade:1, delay:0, state:Object.fromEntries(project.fixtures.map(f=>[f.id,{dimmer:f.dimmer,color:f.color}])) }); project.activeCue=project.cues.length-1; });
  toast('Cue baru ditambahkan');
}
function addFixture(){
  const n=project.fixtures.length+1, id=`F-${String(n).padStart(2,'0')}`;
  commit(()=>{ project.fixtures.push({ id, name:`New fixture ${n}`, type:'WASH', x:(n%3)-1, y:2, z:2, color:'#f4b942', dimmer:75, pan:0, tilt:55, zoom:24, strobe:0, gobo:0 }); project.selected=id; project.selectedIds=[id]; });
  toast(`${id} ditambahkan`);
}
function renameShow(){ const n=prompt('Nama show:',project.showName); if(!n?.trim()) return; commit(()=> project.showName=n.trim()); }
function importProject(file){
  const r=new FileReader(); r.onload=()=>{ try{ const imp=normalizeProject(JSON.parse(r.result)); history.push(snapshot()); project=imp; future=[]; saveProject(false); renderAll(); toast('Show diimpor'); }catch{ toast('File JSON tidak valid'); } }; r.readAsText(file);
}
function toggleSheet(){ const p=document.querySelector('.inspector-panel'); const states=['sheet-peek','sheet-half','sheet-full']; const n=states[(states.findIndex(s=>p.classList.contains(s))+1)%states.length]; p.classList.remove(...states); p.classList.add(n); }
function toast(msg){ const el=document.querySelector('#toast'); if(!el) return; el.textContent=msg; el.classList.add('visible'); clearTimeout(window.toastTimer); window.toastTimer=setTimeout(()=>el.classList.remove('visible'),2200); }
function exportProject(){ const blob=new Blob([JSON.stringify(project,null,2)],{type:'application/json'}); const a=Object.assign(document.createElement('a'),{href:URL.createObjectURL(blob),download:`${project.showName.toLowerCase().replace(/[^a-z0-9]+/g,'-')||'zzspectra-show'}.json`}); a.click(); URL.revokeObjectURL(a.href); toast('Project JSON diekspor'); }

// ── camera & draw ──
function projectPoint(x,y,z,w,h){
  const cy=Math.cos(camera.yaw), sy=Math.sin(camera.yaw);
  const rx=x*cy - z*sy + camera.panX, rz=x*sy + z*cy;
  const cp=Math.cos(camera.pitch), sp=Math.sin(camera.pitch);
  const depth=Math.max(.55, 1+(rz+5)*.055);
  const scale=58*camera.zoom/depth;
  const vertical=(y-1.8)*cp - rz*sp*.22;
  return {x:w/2+rx*scale, y:h*.55 - vertical*scale*.75 + camera.panY, scale, depth:rz};
}

function fxOffset(index, total){
  if(project.fx.type==='off' || project.fx.size===0) return {dx:0,dy:0,dPan:0,dTilt:0};
  const t=fxPhase;
  const amp=project.fx.size*0.04;
  const mirror = project.fx.mirror && (index%2===1) ? -1 : 1;
  let dx=0, dy=0, dPan=0, dTilt=0;
  if(project.fx.type==='circle'){ dx=Math.cos(t+index)*amp; dy=Math.sin(t+index)*amp; dPan=Math.cos(t+index)*project.fx.size*0.5*mirror; dTilt=Math.sin(t+index)*project.fx.size*0.35; }
  else if(project.fx.type==='figure8'){ dx=Math.sin(t+index*0.7)*amp; dy=Math.sin(t*2+index)*amp*0.6; dPan=Math.sin(t+index)*project.fx.size*0.6*mirror; dTilt=Math.sin(t*2+index)*project.fx.size*0.25; }
  else if(project.fx.type==='scan'){ const s=Math.sin(t*1.2+index*0.9); dPan=s*project.fx.size*0.7*mirror; dx=s*amp*1.2; }
  else if(project.fx.type==='pargoy'){ const s=Math.sin(t*2.2+index*0.5)*Math.abs(Math.sin(t*0.7)); dx=s*amp*1.5; dy=Math.abs(Math.sin(t*1.8+index))*amp*0.4; dPan=s*project.fx.size*0.5; dTilt=Math.abs(Math.sin(t*1.5))*project.fx.size*0.2; }
  else if(project.fx.type==='shake'){ dx=(Math.random()-0.5)*amp*0.8; dPan=(Math.random()-0.5)*project.fx.size*0.3; }
  return {dx,dy,dPan,dTilt};
}

function chaseColorFor(index, total){
  if(!project.chase.enabled || !project.chase.steps.length) return null;
  // chase drives all fixtures in sequence offset by index
  const stepCount=project.chase.steps.length;
  // bounce logic
  let t=chaseTick + index* (stepCount/total)*0.5;
  let stepIdx;
  if(project.chase.mode==='random') stepIdx=Math.floor(Math.abs(Math.sin(t*1.7+index*2.1))*999)%stepCount;
  else if(project.chase.mode==='bounce'){
    const cycle=stepCount*2-2; const pos=Math.floor(t)%cycle;
    stepIdx= pos<stepCount?pos:cycle-pos;
  } else stepIdx=Math.floor(t)%stepCount;
  return project.chase.steps[stepIdx];
}

function drawStage(){
  const canvas=document.querySelector('#stage-canvas'); if(!canvas) return;
  const rect=canvas.getBoundingClientRect(), ratio=Math.min(window.devicePixelRatio||1,2);
  const w=Math.max(1,Math.floor(rect.width)), h=Math.max(1,Math.floor(rect.height));
  const pw=Math.floor(w*ratio), ph=Math.floor(h*ratio);
  if(canvas.width!==pw||canvas.height!==ph){ canvas.width=pw; canvas.height=ph; }
  const ctx=canvas.getContext('2d'); ctx.setTransform(ratio,0,0,ratio,0,0);
  ctx.clearRect(0,0,w,h);
  // bg
  const g=ctx.createRadialGradient(w*.5,h*.12,10,w*.5,h*.75,h); g.addColorStop(0,'#2b4140'); g.addColorStop(.38,'#172526'); g.addColorStop(1,'#080d0f'); ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
  // grid
  if(showGrid){
    ctx.save(); ctx.globalAlpha=project.quality==='low'?0.08:0.16; ctx.strokeStyle='#8aa29d'; ctx.lineWidth=1;
    for(let i=-10;i<=10;i++){ const a=projectPoint(i,0,-1,w,h), b=projectPoint(i,0,10,w,h); ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); }
    for(let z=0;z<12;z++){ const a=projectPoint(-10,0,z,w,h), b=projectPoint(10,0,z,w,h); ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); }
    ctx.restore();
  }
  const floor=[projectPoint(-5,0,-1,w,h),projectPoint(5,0,-1,w,h),projectPoint(5,0,7,w,h),projectPoint(-5,0,7,w,h)];
  ctx.fillStyle='#111b1c'; ctx.beginPath(); floor.forEach((p,i)=> i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)); ctx.closePath(); ctx.fill();
  const trussL=projectPoint(-4.2,5.2,1.4,w,h), trussR=projectPoint(4.2,5.2,1.4,w,h);
  ctx.strokeStyle='#71817c'; ctx.lineWidth=8; ctx.beginPath(); ctx.moveTo(trussL.x,trussL.y); ctx.lineTo(trussR.x,trussR.y); ctx.stroke();
  ctx.strokeStyle='#273533'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(trussL.x,trussL.y-3); ctx.lineTo(trussR.x,trussR.y-3); ctx.stroke();

  // sorted fixtures with fx offsets
  const items=project.fixtures.map((f,i)=>({f,i})).sort((a,b)=> a.f.z - b.f.z);
  items.forEach(({f,i})=> drawFixture(ctx,f,w,h,i,project.fixtures.length));

  if(project.blackout){ ctx.fillStyle='rgba(0,0,0,.84)'; ctx.fillRect(0,0,w,h); ctx.fillStyle='#f4b942'; ctx.font='600 12px DM Mono'; ctx.textAlign='center'; ctx.fillText('BLACKOUT ACTIVE',w/2,h/2); }
  const ro=document.querySelector('#camera-readout'); if(ro) ro.textContent=`ZOOM ${Math.round(camera.zoom*100)}%  ↻ RESET`;
  const mf=document.querySelector('#audio-meter-fill'); if(mf) mf.style.width=`${Math.round(audioLevel*100)}%`;
}

function drawFixture(ctx, f, w, h, index, total){
  const off=fxOffset(index,total);
  const chase=chaseColorFor(index,total);
  // rainbow override
  let col=f.color;
  if(project.fx.rainbow){
    const hue=(fxPhase*20 + index*45)%360; col=`hsl(${hue} 90% 62%)`;
  } else if(chase) col=chase.color;
  const dimmerRaw = chase? chase.dimmer : f.dimmer;
  // space / pos / rot mods
  const spaceOff=(index - (total-1)/2)*project.mod.space*0.06;
  const fxX=f.x + off.dx + spaceOff + project.mod.posX*0.05;
  const fxZ=f.z + off.dy*0.4;
  const fxPan=f.pan + off.dPan + project.mod.rot;
  const fxTilt=f.tilt + off.dTilt + project.mod.posY*0.6;

  const p=projectPoint(fxX, f.y, fxZ, w, h);
  const selected=selectedIds().includes(f.id);
  const strobeDim = f.strobe && Math.floor(Date.now()/ (110 - f.strobe))%2 ? 0.18 : 1;
  const audioBoost = project.audio.enabled ? 1 + audioLevel*0.55 : 1;
  const opacity=Math.max(0,Math.min(1, (dimmerRaw/100)*strobeDim*audioBoost));
  const quality=project.quality;
  const beamLength=120 + fxTilt*1.5;
  const angle=(fxPan*Math.PI/180)*0.42;

  ctx.save();
  ctx.globalAlpha=opacity*(quality==='low'?0.18:0.30);
  ctx.translate(p.x,p.y); ctx.rotate(angle);
  const beam=ctx.createLinearGradient(0,0,0,beamLength); beam.addColorStop(0,col); beam.addColorStop(1,'transparent');
  ctx.fillStyle=beam; ctx.beginPath();
  const spread=(f.zoom*1.4 + (180-fxTilt)*0.18)*(f.type==='BEAM'?0.72:1.05);
  ctx.moveTo(-7,2); ctx.lineTo(7,2); ctx.lineTo(spread,beamLength); ctx.lineTo(-spread,beamLength); ctx.closePath(); ctx.fill();
  if(quality==='high' && f.type!=='PIXEL BAR'){
    ctx.globalAlpha=opacity*0.09; ctx.beginPath(); ctx.moveTo(-spread,beamLength); ctx.lineTo(0,0); ctx.lineTo(spread,beamLength); ctx.fill();
  }
  // gobo projection at end of beam
  if(f.gobo!==0 && opacity>0.15){
    ctx.globalAlpha=opacity*0.35; ctx.fillStyle=col; ctx.strokeStyle=col; ctx.lineWidth=1.2;
    const gx=0, gy=beamLength*0.92; const r=spread*0.42;
    ctx.save(); ctx.translate(gx,gy); ctx.rotate(-angle);
    if(f.gobo===1){ ctx.beginPath(); for(let k=0;k<6;k++){ const a=k*Math.PI/3; ctx.moveTo(Math.cos(a)*r*0.35, Math.sin(a)*r*0.35); ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r); } ctx.stroke(); ctx.beginPath(); ctx.arc(0,0,r*0.18,0,Math.PI*2); ctx.fill(); }
    else if(f.gobo===2){ ctx.font=`${Math.round(r*0.9)}px monospace`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('✦',0,1); ctx.strokeStyle=col; ctx.globalAlpha*=0.5; ctx.beginPath(); ctx.arc(0,0,r*0.75,0,Math.PI*2); ctx.stroke(); }
    else if(f.gobo===3){ ctx.strokeRect(-r*0.6,-r*0.6,r*1.2,r*1.2); ctx.strokeRect(-r*0.3,-r*0.3,r*0.6,r*0.6); ctx.beginPath(); ctx.moveTo(-r*0.6,-r*0.6); ctx.lineTo(r*0.6,r*0.6); ctx.moveTo(r*0.6,-r*0.6); ctx.lineTo(-r*0.6,r*0.6); ctx.stroke(); }
    else if(f.gobo===4){ ctx.globalAlpha*=0.45; ctx.beginPath(); ctx.arc(0,0,r*0.75,0,Math.PI*2); ctx.fill(); }
    else if(f.gobo===5){ for(let k=-2;k<=2;k++){ ctx.fillRect(-r, k*4, r*2, 1.2); } }
    ctx.restore();
  }
  ctx.restore();

  // body
  ctx.save(); ctx.translate(p.x,p.y);
  if(selected){ ctx.strokeStyle='#f4b942'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(0,0,17,0,Math.PI*2); ctx.stroke(); }
  ctx.fillStyle=col; ctx.shadowColor=col; ctx.shadowBlur= quality==='low'?0: selected?18: quality==='high'?14:9;
  if(f.type==='PIXEL BAR') ctx.fillRect(-17,-4,34,8);
  else if(f.type==='BEAM'){ ctx.beginPath(); ctx.moveTo(0,-10); ctx.lineTo(8,6); ctx.lineTo(-8,6); ctx.closePath(); ctx.fill(); }
  else if(f.type==='SPOT') ctx.fillRect(-6,-8,12,16);
  else { ctx.beginPath(); ctx.arc(0,0,8,0,Math.PI*2); ctx.fill(); }
  ctx.shadowBlur=0; ctx.fillStyle='#d6e0dc'; ctx.font='10px DM Mono'; ctx.textAlign='center'; ctx.fillText(f.id,0,-18);
  // gobo label under
  if(f.gobo!==0){ ctx.fillStyle='rgba(244,185,66,0.9)'; ctx.font='7px DM Mono'; ctx.fillText(goboNames[f.gobo].toUpperCase(),0,22); }
  ctx.restore();
}

function applyPreset(kind){
  commit(()=>{
    if(kind==='even'){ project.fixtures.forEach((f,i)=>{ f.dimmer=72; f.color=colors[i%colors.length]; f.gobo=0; f.pan=(i-1.5)*14; f.tilt=55; }); }
    if(kind==='center'){ project.fixtures.forEach(f=>{ f.pan=0; f.tilt=52; f.zoom=18; f.dimmer=92; }); }
    if(kind==='rave'){ project.chase.enabled=true; project.chase.bpm=168; project.chase.steps=[{color:'#ff2e63',dimmer:100},{color:'#08d9d6',dimmer:100},{color:'#ffde59',dimmer:100},{color:'#a259ff',dimmer:30}]; project.fx.type='pargoy'; project.fx.speed=1.4; project.fx.size=32; project.fx.rainbow=true; }
    if(kind==='black'){ project.fixtures.forEach(f=> f.dimmer=0); }
  });
  toast(`Preset ${kind}`);
}

function bindEvents(){
  document.querySelector('#fixture-search').oninput=renderFixtures;
  document.querySelector('#add-fixture').onclick=addFixture;
  document.querySelector('#add-fixture-bottom').onclick=addFixture;
  document.querySelector('#save-btn').onclick=()=>saveProject();
  document.querySelector('#export-btn').onclick=exportProject;
  document.querySelector('#new-cue').onclick=newCue;
  document.querySelector('#undo-btn').onclick=undo;
  document.querySelector('#redo-btn').onclick=redo;
  document.querySelector('#rename-show').onclick=renameShow;
  document.querySelector('#import-btn').onclick=()=>document.querySelector('#import-file').click();
  document.querySelector('#import-file').onchange=e=>{ if(e.target.files[0]) importProject(e.target.files[0]); e.target.value=''; };
  document.querySelector('#quality-select').onchange=e=> commit(()=> project.quality=e.target.value );
  document.querySelector('#sheet-toggle').onclick=toggleSheet;
  document.querySelector('#group-toggle').onclick=()=>{ commit(()=>{ project.grouped=!project.grouped; if(project.grouped) setSelection(project.selected); }); toast(project.grouped?'Grouping aktif':'Grouping mati'); };
  document.querySelector('#blackout-btn').onclick=()=> commit(()=> project.blackout=!project.blackout );
  document.querySelector('#play-btn').onclick=()=>{ project.playing=!project.playing; saveProject(false); renderAll(); };
  document.querySelector('#next-cue').onclick=()=> triggerCue(Math.min(project.activeCue+1, project.cues.length-1));
  document.querySelector('#prev-cue').onclick=()=> triggerCue(Math.max(project.activeCue-1,0));
  document.querySelectorAll('[data-mode]').forEach(b=> b.onclick=()=> commit(()=> project.mode=b.dataset.mode ));
  document.querySelectorAll('[data-preset]').forEach(b=> b.onclick=()=> applyPreset(b.dataset.preset));
  document.querySelector('#fit-btn').onclick=()=>{ camera={yaw:-0.18,pitch:0.72,zoom:1,panX:0,panY:0}; drawStage(); };
  document.querySelector('#perspective-btn').onclick=()=>{ camera={...camera,yaw:-0.18,pitch:0.72}; drawStage(); };
  document.querySelector('#grid-btn').onclick=e=>{ showGrid=!showGrid; e.currentTarget.classList.toggle('active',showGrid); drawStage(); };
  document.querySelector('#help-btn').onclick=()=> toast('Space play · B blackout · Ctrl+K capture · R reset · Klik step ganti warna');

  // chase bar
  document.querySelector('#chase-enable').onchange=e=> commit(()=> project.chase.enabled=e.target.checked);
  const bpmEl=document.querySelector('#chase-bpm'); const bpmOut=document.querySelector('#bpm-out');
  bpmEl.oninput=e=>{ project.chase.bpm=Number(e.target.value); bpmOut.textContent=String(project.chase.bpm); saveProject(false); };
  bpmEl.onchange=()=> saveProject(false);
  document.querySelector('#chase-mode').onchange=e=> commit(()=> project.chase.mode=e.target.value);
  document.querySelector('#chase-add').onclick=()=>{
    if(project.chase.steps.length>=8) return toast('Max 8 steps');
    const col=colors[project.chase.steps.length%colors.length];
    commit(()=> project.chase.steps.push({color:col,dimmer:100}));
  };
  document.querySelector('#chase-clear').onclick=()=> commit(()=> { project.chase.steps=[{color:'#ffffff',dimmer:100}]; project.chase.enabled=false; });

  // mod strip
  ['space','posx','posy','rot'].forEach(k=>{
    const el=document.querySelector(`#mod-${k}`); if(!el) return;
    el.oninput=e=>{ project.mod[k==='posx'?'posX':k==='posy'?'posY':k]=Number(e.target.value); e.target.nextElementSibling.textContent= k==='space'? String(project.mod.space) : project.mod[k==='posx'?'posX':k==='posy'?'posY':k]+'°'; drawStage(); saveProject(false); };
  });
  document.querySelector('#rainbow-btn').onclick=()=> commit(()=> project.fx.rainbow=!project.fx.rainbow);
  document.querySelector('#audio-btn').onclick=toggleAudio;

  const fallback=document.querySelector('#fallback-note');
  fallback.textContent=(document.createElement('canvas').getContext('webgl')||document.createElement('canvas').getContext('experimental-webgl'))?'Canvas preview · chase+fx+audio ready':'Canvas fallback';
  const canvas=document.querySelector('#stage-canvas');
  canvas.onpointerdown=e=>{ dragging=true; lastPointer={x:e.clientX,y:e.clientY}; canvas.setPointerCapture(e.pointerId); };
  canvas.onpointermove=e=>{
    if(!dragging) return;
    const dx=e.clientX-lastPointer.x, dy=e.clientY-lastPointer.y; lastPointer={x:e.clientX,y:e.clientY};
    if(e.shiftKey){ camera.panX+=dx*0.012/camera.zoom; camera.panY+=dy*0.5; } else { camera.yaw+=dx*0.008; camera.pitch=Math.max(0.35,Math.min(1.3,camera.pitch+dy*0.004)); }
    drawStage();
  };
  canvas.onpointerup=()=> dragging=false; canvas.onpointercancel=()=> dragging=false;
  canvas.onwheel=e=>{ e.preventDefault(); camera.zoom=Math.max(0.65,Math.min(1.7,camera.zoom - e.deltaY*0.001)); drawStage(); };
  canvas.onclick=e=>{
    const rect=canvas.getBoundingClientRect();
    const hit=project.fixtures.map(f=>({f,p:projectPoint(f.x,f.y,f.z,rect.width,rect.height)})).find(({p})=> Math.hypot(p.x-(e.clientX-rect.left), p.y-(e.clientY-rect.top))<20 );
    if(hit) commit(()=> setSelection(hit.f.id, e.ctrlKey||e.metaKey));
  };
  window.onresize=drawStage;
  window.onkeydown=e=>{
    if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) return;
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){ e.preventDefault(); (e.shiftKey?redo():undo()); return; }
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){ e.preventDefault(); redo(); return; }
    if(e.key===' '){ e.preventDefault(); document.querySelector('#play-btn').click(); }
    if(e.key.toLowerCase()==='b') document.querySelector('#blackout-btn').click();
    if(e.key.toLowerCase()==='r') document.querySelector('#fit-btn').click();
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){ e.preventDefault(); captureLook(); }
  };
}

appTemplate(); bindEvents(); renderAll();

// ── animation loop ──
function loop(now){
  const dt=Math.min(0.05,(now-lastFrame)/1000); lastFrame=now;
  pollAudio();
  // chase advances with bpm (+ audio)
  const bpmFactor = project.chase.bpm/60;
  const audioFactor = project.audio.enabled ? (0.7+audioLevel*0.9) : 1;
  chaseTick += dt * bpmFactor * audioFactor * (project.chase.enabled?1:0) * 1.6;
  // fx phase
  if(project.fx.type!=='off'){
    const fxBoost = project.audio.enabled ? (1+audioLevel*0.7) : 1;
    fxPhase += dt * project.fx.speed * 2.2 * fxBoost;
  }
  // re-render if chase/fx/audio/playing
  const needsDraw = project.chase.enabled || project.fx.type!=='off' || project.audio.enabled || project.playing;
  if(needsDraw && !project.blackout) drawStage();
  else if(project.audio.enabled) drawStage();
  // also update chase step highlight ~ 6fps
  if(Math.floor(now/160)!==Math.floor((now-dt*1000)/160) && project.chase.enabled) renderChaseSteps();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
