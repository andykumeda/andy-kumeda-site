import Image from 'next/image';
import { experienceOverview, interestLinks, navLinks, projects, runningFacts, workFacts } from './site-data';

function ExternalArrow() { return <span aria-hidden="true">↗</span>; }

function Header() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Andy Kumeda home"><Image src="/ak-logo-orange.png" alt="" width={34} height={34} priority /><strong>Andy Kumeda</strong></a>
      <nav aria-label="Main navigation">{navLinks.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}</nav>
      <a className="resume-link" href="/andy-kumeda-resume.pdf" target="_blank">Résumé <ExternalArrow /></a>
    </header>
  );
}

function ProjectCards() {
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

function Interests() {
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
  return (
    <main className="crossroads" id="top">
      <Header />
      <section className="cross-hero">
        <div className="cross-portrait">
          <Image src="/andy-trail-running.jpg" alt="Andy trail running at sunset" fill priority sizes="(max-width: 800px) 100vw, 50vw" />
          <div className="cross-photo-copy"><span>On the trail</span><p>75 one-hundred-mile finishes and a habit of staying curious deep into the hard part.</p><a href="#running">Meet the runner ↓</a></div>
        </div>
        <div className="cross-work-intro">
          <p className="eyebrow">In the systems</p><h1>Andy<br />Kumeda</h1>
          <p className="cross-deck">Infrastructure engineer, independent builder, ultrarunner, photographer, and music instigator.</p>
          <p className="cross-body">I like ambitious problems that reward patience: a long mountain course, a complicated network, or a product that has to work for real people.</p>
          <div className="cross-hero-links"><a href="#work">Explore the work</a><a href="/andy-kumeda-resume.pdf" target="_blank">Open résumé <ExternalArrow /></a></div>
        </div>
        <span className="cross-vertical">Los Angeles · Runner / Builder / Operator</span>
      </section>
      <section className="paired-stats" aria-label="Running and career highlights">
        {runningFacts.slice(0, 2).map((fact, index) => <div className="stat-personal" key={fact.label}><span>Trail 0{index + 1}</span><strong>{fact.value}</strong><p>{fact.label}</p></div>)}
        {workFacts.slice(0, 2).map((fact, index) => <div className="stat-work" key={fact.label}><span>Work 0{index + 1}</span><strong>{fact.value}</strong><p>{fact.label}</p></div>)}
      </section>
      <section className="cross-running" id="running">
        <div className="section-number">01 / Running</div>
        <div className="cross-running-lead"><p className="eyebrow">Endurance is a practice</p><h2>The finish line is rarely the interesting part.</h2></div>
        <div className="cross-running-copy"><p>Andy’s running life started with the 1998 Los Angeles Marathon and grew into decades of trail races, 100-milers, volunteering, pacing, and route study.</p><p>The same curiosity now powers DFIU and RouteSmith—software shaped by actual race-day questions, not an abstract fitness brief.</p><a className="text-link" href="https://andyk.run" target="_blank" rel="noreferrer">Explore race history at andyk.run <ExternalArrow /></a></div>
        <div className="cross-running-facts">{runningFacts.slice(2).map((fact) => <div key={fact.label}><strong>{fact.value}</strong><span>{fact.label}</span></div>)}</div>
      </section>
      <section className="cross-work" id="work">
        <div className="section-number">02 / Work</div>
        <div className="cross-work-heading"><p className="eyebrow">Infrastructure, made operable</p><h2>Design the system. Automate the repeatable. Keep judgment in the loop.</h2><a className="primary-button" href="/andy-kumeda-resume.pdf" target="_blank">View recruiter résumé <ExternalArrow /></a></div>
        <div className="experience-overview">
          <p className="experience-intro">I’ve worked as an engineer, architect, consultant, IT director, and operations leader. The titles changed, but the work usually came back to the same thing: make complex systems easier to understand, run, and hand off.</p>
          <div className="experience-groups">
            <div><span>Roles along the way</span><ul>{experienceOverview.roles.map((role) => <li key={role}>{role}</li>)}</ul></div>
            <div><span>Places I’ve worked</span><ul>{experienceOverview.organizations.map((organization) => <li key={organization}>{organization}</li>)}</ul></div>
          </div>
          <p className="experience-note">The résumé has the full chronology, technical scope, and project details.</p>
        </div>
      </section>
      <section className="cross-projects" id="projects"><div className="section-heading-row"><div><span>03 / Selected projects</span><h2>Things made to be used.</h2></div><a href="https://github.com/andykumeda" target="_blank" rel="noreferrer">GitHub profile <ExternalArrow /></a></div><ProjectCards /></section>
      <section className="cross-interests" id="interests"><div className="section-heading-row"><div><span>04 / Away from the résumé</span><h2>More ways into the story.</h2></div></div><Interests /></section>
      <Footer />
    </main>
  );
}
