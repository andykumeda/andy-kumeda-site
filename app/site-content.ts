export const defaultSiteContent = {
  "nav": {
    "running": "Running",
    "work": "Work",
    "projects": "Projects",
    "interests": "Interests"
  },
  "hero": {
    "photoLabel": "On the trail",
    "photoCopy": "75 x 100-mile finishes and a habit of staying curious deep into the hard part.",
    "photoLink": "Meet the runner ↓",
    "eyebrow": "In the systems",
    "name": "Andy\nKumeda",
    "deck": "Infrastructure engineer, independent builder, ultrarunner, photographer, and music instigator.",
    "body": "I like ambitious problems that reward patience: a long mountain course, a complicated network, or a product that has to work for real people.",
    "workLink": "Explore the work",
    "resumeLink": "Résumé",
    "vertical": "Los Angeles · Runner / Builder / Operator"
  },
  "running": {
    "eyebrow": "Endurance is a practice",
    "heading": "The finish line is rarely the interesting part.",
    "bodyOne": "Andy’s running life started with the 1998 Los Angeles Marathon and grew into decades of trail races, 100-milers, volunteering, pacing, and route study.",
    "bodyTwo": "The same curiosity now powers DFIU and RouteSmith—software shaped by actual race-day questions, not an abstract fitness brief.",
    "link": "Explore race history at andyk.run"
  },
  "work": {
    "eyebrow": "Infrastructure, made operable",
    "heading": "Design the system. Automate the repeatable. Keep judgment in the loop.",
    "resumeLink": "Résumé",
    "intro": "I’ve worked as an engineer, architect, consultant, IT director, and operations leader. The titles changed, but the work usually came back to the same thing: make complex systems easier to understand, run, and hand off.",
    "rolesLabel": "Roles along the way",
    "organizationsLabel": "Places I’ve worked",
    "note": "The résumé has the full chronology, technical scope, and project details.",
    "roles": [
      "Senior Network Engineer",
      "Network Architect",
      "Principal Consultant",
      "IT Director",
      "Executive Director",
      "",
      "Network Operations Manager"
    ],
    "organizations": [
      "World Wide Technology",
      "Delta9 Tech",
      "Yellowpages.com",
      "AT&T",
      "CureSearch",
      "Yahoo, Overture, and GoTo.com"
    ]
  },
  "stats": {
    "running": [
      {
        "value": "75",
        "label": "100-mile finishes"
      },
      {
        "value": "17",
        "label": "consecutive Angeles Crest finishes"
      },
      {
        "value": "125 mi",
        "label": "longest recorded race"
      },
      {
        "value": "1998",
        "label": "first marathon"
      }
    ],
    "work": [
      {
        "value": "25+",
        "label": "years in infrastructure"
      },
      {
        "value": "CCIE #3406",
        "label": "Lifetime Emeritus"
      },
      {
        "value": "12",
        "label": "countries connected at Yahoo-era scale"
      },
      {
        "value": "≈33 hrs",
        "label": "saved per 100-device staging wave"
      }
    ]
  },
  "projects": [
    {
      "title": "DFIU",
      "type": "Running · Product",
      "description": "A planning workspace for 100-mile trail races, combining courses, pacing, training plans, live tracking, aid stations, and crew logistics.",
      "link": "https://dfiu.app",
      "linkLabel": "Visit DFIU",
      "status": "Public build"
    },
    {
      "title": "Vox",
      "type": "macOS · Voice",
      "description": "A push-to-talk Mac app that turns speech into context-aware prose or terminal-ready commands.",
      "link": "https://github.com/andykumeda/vox",
      "linkLabel": "View source",
      "status": "Public repository"
    },
    {
      "title": "Network ZTP Registry",
      "type": "Automation · Infrastructure",
      "description": "A reference workflow for moving network switches from first boot through staging, inventory, checks, and handoff.",
      "link": "https://github.com/andykumeda/network-ztp-registry",
      "linkLabel": "View source",
      "status": "Public repository"
    },
    {
      "title": "RouteSmith",
      "type": "Running · Maps",
      "description": "A route maker for drawing, importing, sharing, and studying outdoor courses with elevation and GPX tools.",
      "link": "https://routesmith.app",
      "linkLabel": "Open app",
      "status": "Independent project"
    },
    {
      "title": "WriteSafe",
      "type": "Privacy · Native app",
      "description": "A local encrypted journal for Mac, designed so entries and photos stay on the computer rather than in an account.",
      "link": "",
      "linkLabel": "",
      "status": "Private build"
    },
    {
      "title": "Song to Play",
      "type": "Music · Live events",
      "description": "A live-band karaoke songbook and request queue that connects singers, hosts, lyrics, events, and tipping.",
      "link": "https://songtoplay.app",
      "linkLabel": "Open app",
      "status": "Independent project"
    }
  ],
  "interests": [
    {
      "title": "Long-distance running",
      "text": "Race history, results, records, and upcoming events.",
      "href": "https://andyk.run",
      "label": "Visit andyk.run"
    },
    {
      "title": "Photography",
      "text": "A separate gallery for landscapes, people, travel, and the moments between.",
      "href": "https://jwgs.smugmug.com",
      "label": "Open photo gallery"
    },
    {
      "title": "Music and live events",
      "text": "Karaoke and DJ tools built from the experience of making a room work together.",
      "href": "https://songtoplay.app",
      "label": "See Song to Play"
    },
    {
      "title": "Making useful software",
      "text": "Tools for routes, writing, dictation, race planning, and infrastructure operations.",
      "href": "https://github.com/andykumeda",
      "label": "Browse GitHub"
    }
  ],
  "sections": {
    "projectsLabel": "03 / Selected projects",
    "projectsHeading": "Things made to be used.",
    "projectsLink": "GitHub profile",
    "interestsLabel": "04 / Away from the résumé",
    "interestsHeading": "More ways into the story."
  },
  "footer": {
    "location": "Los Angeles, California",
    "statement": "Built around the whole person: endurance, systems, music, images, and useful tools.",
    "email": "Email",
    "linkedin": "LinkedIn",
    "github": "GitHub"
  }
} as const;

export type SiteContent = typeof defaultSiteContent;

export const contentSections = [
  { id: 'hero', label: 'Hero' }, { id: 'running', label: 'Running' }, { id: 'work', label: 'Work' }, { id: 'stats', label: 'Stats' }, { id: 'projects', label: 'Projects' }, { id: 'interests', label: 'Interests' }, { id: 'sections', label: 'Section headings' }, { id: 'footer', label: 'Footer' },
];
