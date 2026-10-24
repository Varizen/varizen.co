"use client";
import { useState } from "react";
import { ArrowDown, ArrowRight, Check, ChevronRight, Circle, Fingerprint, Layers3, ShieldCheck } from "lucide-react";

const phases = [
  { name: "Discover", title: "See the whole picture.", copy: "Map external surfaces, identities and dependencies into one understandable view.", record: ["External surface mapped", "Dependencies connected", "Ownership identified"] },
  { name: "Understand", title: "Give every signal context.", copy: "Connect technical findings to the systems, people and obligations they affect.", record: ["Business context linked", "Priority reason recorded", "Decision made reviewable"] },
  { name: "Govern", title: "Turn intent into control.", copy: "Apply policy, ownership and approval without erasing system boundaries.", record: ["Policy boundary applied", "Human approval required", "Action owner assigned"] },
  { name: "Prove", title: "Make trust reviewable.", copy: "Connect changes, tests and observations to a traceable evidence record.", record: ["Evidence linked", "Freshness visible", "Outcome available to review"] },
  { name: "Improve", title: "Move forward with confidence.", copy: "Feed verified outcomes back into the next decision and the next control.", record: ["Learning captured", "Control refined", "Next action prioritized"] },
];

export function TrustMap() {
  const [active, setActive] = useState(0);
  const phase = phases[active];
  return <div className="trust-map" aria-label="Illustrative exposure to evidence workflow">
    <div className="trust-map-top"><div><span className="mini-symbol"><Layers3 size={15} /></span><span>Operational confidence</span></div><span className="illustration-label"><span />ILLUSTRATIVE MODEL</span></div>
    <div className="phase-tabs" role="tablist" aria-label="Operating workflow">{phases.map((item, i) => <button key={item.name} role="tab" aria-selected={active === i} aria-controls="workflow-panel" className={active === i ? "active" : ""} onClick={() => setActive(i)}><span>0{i + 1}</span>{item.name}{i < 4 && <ChevronRight className="phase-arrow" size={12} aria-hidden="true" />}</button>)}</div>
    <div className="map-canvas" id="workflow-panel" role="tabpanel">
      <div className="map-grid" aria-hidden="true" />
      <div className="map-main">
        <div className="map-node-title"><span className="orange-dot" /><span>0{active + 1} / {phase.name.toUpperCase()}</span><Fingerprint size={21} /></div>
        <h3>{phase.title}</h3><p>{phase.copy}</p>
        <div className="map-record"><div className="record-head"><span>CONTROL RECORD</span><span>VZ / 0{active + 1}</span></div>{phase.record.map((item) => <div className="record-row" key={item}><span><Check size={12} />{item}</span><span className="record-state">Mapped</span></div>)}</div>
      </div>
      <div className="map-side"><div className="evidence-orbit"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit-center"><ShieldCheck size={28} strokeWidth={1.25} /></div><span className="orbit-point p1" /><span className="orbit-point p2" /><span className="orbit-point p3" /></div><span className="map-side-label">EVIDENCE CONNECTION</span><strong>Signal <ArrowRight size={13} /> Decision <ArrowRight size={13} /> Proof</strong><div className="map-side-foot"><Circle size={7} fill="currentColor" />No live telemetry connected</div></div>
    </div>
    <div className="trust-map-bottom"><span><span className="status-dot" /> One governed experience</span><button onClick={() => setActive((active + 1) % phases.length)}>Explore next phase <ArrowRight size={14} /></button></div>
  </div>;
}

export function OperatingDiagram() {
  return <div className="operating-diagram"><div className="diagram-providers"><span>AWS</span><span>AZURE</span><span>GCP</span><span>ON-PREM</span></div><div className="connector-lines" aria-hidden="true"><i /><i /><i /><i /></div><div className="governance-plane"><span className="mini-symbol"><Layers3 size={17} /></span><div><strong>ENOS control plane</strong><span>POLICY · IDENTITY · EVIDENCE · RECOVERY</span></div><span className="plane-status"><span />COMMON GOVERNANCE</span></div><div className="runtime-arrow"><ArrowDown size={16} /><span>DISTRIBUTED EXECUTION</span><ArrowDown size={16} /></div><div className="runtime-grid">{["Project A", "Project B", "Project C"].map((name, i) => <div className="runtime" key={name}><div><span className="runtime-icon"><Layers3 size={17} /></span><span className="stage">ISOLATED</span></div><strong>{name}</strong><span>Independent runtime boundary</span><div className="runtime-tags"><span>Compute</span><span>Data</span><span>Identity</span></div><small>0{i + 1} / OWN FAILURE DOMAIN</small></div>)}</div></div>;
}

export function EvidenceChain() {
  return <ol className="evidence-chain">{["Policy", "Change", "Test", "Approval", "Deployment", "Observation", "Result", "Evidence"].map((item, i) => <li key={item}><span className={i === 7 ? "evidence-last" : ""}>{i === 7 ? <ShieldCheck size={17} /> : `0${i + 1}`}</span><strong>{item}</strong>{i < 7 && <ArrowRight size={13} aria-hidden="true" />}</li>)}</ol>;
}
