export const navLinks = [
  { href: '#running', label: 'Running' }, { href: '#work', label: 'Work' },
  { href: '#projects', label: 'Projects' }, { href: '#interests', label: 'Interests' },
];

export const projects = [
  { title: 'DFIU', type: 'Running · Product', description: 'A planning workspace for 100-mile trail races, combining courses, pacing, weather, aid stations, and crew logistics.', link: 'https://dfiu.app', linkLabel: 'Visit DFIU', status: 'Public build' },
  { title: 'Vox', type: 'macOS · Voice', description: 'A push-to-talk Mac app that turns speech into context-aware prose or terminal-ready commands.', link: 'https://github.com/andykumeda/vox', linkLabel: 'View source', status: 'Public repository' },
  { title: 'Network ZTP Registry', type: 'Automation · Infrastructure', description: 'A reference workflow for moving network switches from first boot through staging, inventory, checks, and handoff.', link: 'https://github.com/andykumeda/network-ztp-registry', linkLabel: 'View source', status: 'Public repository' },
  { title: 'RouteSmith', type: 'Running · Maps', description: 'A route maker for drawing, importing, sharing, and studying outdoor courses with elevation and GPX tools.', link: 'https://routesmith.app', linkLabel: 'Open app', status: 'Independent project' },
  { title: 'WriteSafe', type: 'Privacy · Native app', description: 'A local encrypted journal for Mac, designed so entries and photos stay on the computer rather than in an account.', status: 'Private build' },
  { title: 'Song to Play', type: 'Music · Live events', description: 'A live-band karaoke songbook and request queue that connects singers, hosts, lyrics, events, and tipping.', link: 'https://songtoplay.app', linkLabel: 'Open app', status: 'Independent project' },
];

export const runningFacts = [
  { value: '75', label: '100-mile finishes' }, { value: '17', label: 'consecutive Angeles Crest finishes' },
  { value: '125 mi', label: 'longest recorded race' }, { value: '1998', label: 'first marathon' },
];

export const workFacts = [
  { value: '25+', label: 'years in infrastructure' }, { value: 'CCIE 3406', label: 'Lifetime Emeritus' },
  { value: '12', label: 'countries connected at Yahoo-era scale' }, { value: '≈33 hrs', label: 'saved per 100-device staging wave' },
];

export const experienceOverview = {
  roles: [
    'Senior Network Engineer',
    'Network Architect',
    'Principal Consultant',
    'IT Director',
    'Executive Director',
    'Associate Director',
    'Network Operations Manager',
  ],
  organizations: [
    'World Wide Technology',
    'Delta9 Technology',
    'DexYP',
    'YP and AT&T Interactive',
    'CureSearch',
    'Yahoo, Overture, and GoTo.com',
  ],
};

export const interestLinks = [
  { title: 'Long-distance running', text: 'Race history, results, records, and upcoming events.', href: 'https://andyk.run', label: 'Visit andyk.run' },
  { title: 'Photography', text: 'A separate gallery for landscapes, people, travel, and the moments between.', href: 'https://jwgs.smugmug.com', label: 'Open photo gallery' },
  { title: 'Music and live events', text: 'Karaoke and DJ tools built from the experience of making a room work together.', href: 'https://songtoplay.app', label: 'See Song to Play' },
  { title: 'Making useful software', text: 'Tools for routes, writing, dictation, race planning, and infrastructure operations.', href: 'https://github.com/andykumeda', label: 'Browse GitHub' },
];
