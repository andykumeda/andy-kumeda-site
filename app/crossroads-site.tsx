'use client';

import Image from 'next/image';
import { BackToTop } from './back-to-top';
import { ResumeMenu } from './resume-menu';
import { SiteMenu } from './site-menu';
import { useSiteContent } from './site-content-store';

function ExternalArrow() { return <span aria-hidden="true">↗</span>; }

function Header() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Andy Kumeda home"><Image src="/ak-logo-orange-round.png" alt="" width={34} height={34} priority /><strong>Andy Kumeda</strong></a>
      <SiteMenu />
    </header>
  );
}

function ProjectCards({ projects }: { projects: ReadonlyArray<{ title: string; type: string; description: string; link: string; linkLabel: string; status: string }> }) {
  return (
    <div className="project-grid">
      {projects.map((project, index) => (
        <article className="project-card" key={project.title}>
          <div className="project-card-top"><span>{String(index + 1).padStart(2, '0')}</span><span>{project.status}</span></div>
          <p className="project-type">{project.type}</p><h3>{project.title}</h3><p>{project.description}</p>
          {project.link ? <a href={project.link} target="_blank" rel="noreferrer">{project.linkLabel} <ExternalArrow /></a> : <span className="private-label">High-level preview only</span>}
        </article>
      ))}
    </div>
  );
}

function Interests({ interestLinks }: { interestLinks: ReadonlyArray<{ title: string; text: string; href: string; label: string }> }) {
  return (
    <div className="interest-grid">
      {interestLinks.map((interest, index) => (
        <a href={interest.href} target="_blank" rel="noreferrer" key={interest.title}>
          <span className="interest-index">0{index + 1}</span><h3>{interest.title}</h3><p>{interest.text}</p><strong>{interest.label} <ExternalArrow /></strong>
        </a>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div><strong>Andy Kumeda</strong><span>Los Angeles, California</span></div>
      <p>Built around the whole person: endurance, systems, music, images, and useful tools.</p>
      <div className="footer-links"><a href="mailto:andy@kumeda.com">Email</a><a href="https://www.linkedin.com/in/andykumeda" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://github.com/andykumeda" target="_blank" rel="noreferrer">GitHub</a></div>
    </footer>
  );
}

export function Crossroads() {
  const content = useSiteContent();
  const { projects, interests: interestLinks, stats: { running: runningFacts, work: workFacts }, work: { roles, organizations } } = content;
  return (
    <main className="crossroads" id="top">
      <Header />
      <section className="cross-hero">
        <div className="cross-portrait">
          <Image src="/andy-trail-running.jpg" alt="Andy trail running at sunset" fill priority sizes="(max-width: 800px) 100vw, 50vw" />
          <div className="cross-photo-copy"><span>{content.hero.photoLabel}</span><p>{content.hero.photoCopy}</p><a href="#running">{content.hero.photoLink}</a></div>
        </div>
        <div className="cross-work-intro">
          <p className="eyebrow">{content.hero.eyebrow}</p><h1>{content.hero.name.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</h1>
          <p className="cross-deck">{content.hero.deck}</p>
          <p className="cross-body">{content.hero.body}</p>
          <div className="cross-hero-links"><a href="#work">{content.hero.workLink}</a><ResumeMenu label={content.hero.resumeLink} /></div>
        </div>
        <span className="cross-vertical">{content.hero.vertical}</span>
      </section>
      <section className="paired-stats" aria-label="Running and career highlights">
        {runningFacts.slice(0, 2).map((fact, index) => <div className="stat-personal" key={fact.label}><span>Trail 0{index + 1}</span><strong>{fact.value}</strong><p>{fact.label}</p></div>)}
        {workFacts.slice(0, 2).map((fact, index) => <div className="stat-work" key={fact.label}><span>Work 0{index + 1}</span><strong>{fact.value}</strong><p>{fact.label}</p></div>)}
      </section>
      <section className="cross-running" id="running">
        <div className="section-number">01 / Running</div>
        <div className="cross-running-lead"><p className="eyebrow">{content.running.eyebrow}</p><h2>{content.running.heading}</h2></div>
        <div className="cross-running-copy"><p>{content.running.bodyOne}</p><p>{content.running.bodyTwo}</p><a className="text-link" href="https://andyk.run" target="_blank" rel="noreferrer">{content.running.link} <ExternalArrow /></a></div>
        <div className="cross-running-facts">{runningFacts.slice(2).map((fact) => <div key={fact.label}><strong>{fact.value}</strong><span>{fact.label}</span></div>)}</div>
      </section>
      <section className="cross-work" id="work">
        <div className="section-number">02 / Work</div>
        <div className="cross-work-heading"><p className="eyebrow">{content.work.eyebrow}</p><h2>{content.work.heading}</h2><ResumeMenu label={content.work.resumeLink} /></div>
        <div className="experience-overview">
          <p className="experience-intro">{content.work.intro}</p>
          <div className="experience-groups">
            <div><span>{content.work.rolesLabel}</span><ul>{roles.map((role) => <li key={role}>{role}</li>)}</ul></div>
            <div><span>{content.work.organizationsLabel}</span><ul>{organizations.map((organization) => <li key={organization}>{organization}</li>)}</ul></div>
          </div>
          <p className="experience-note">{content.work.note}</p>
        </div>
      </section>
      <section className="cross-projects" id="projects"><div className="section-heading-row"><div><span>{content.sections.projectsLabel}</span><h2>{content.sections.projectsHeading}</h2></div><a href="https://github.com/andykumeda" target="_blank" rel="noreferrer">{content.sections.projectsLink} <ExternalArrow /></a></div><ProjectCards projects={projects} /></section>
      <section className="cross-interests" id="interests"><div className="section-heading-row"><div><span>{content.sections.interestsLabel}</span><h2>{content.sections.interestsHeading}</h2></div></div><Interests interestLinks={interestLinks} /></section>
      <Footer />
      <BackToTop />
    </main>
  );
}
