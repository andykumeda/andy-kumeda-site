import { Crossroads } from './crossroads-site';

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://andykumeda.com/#website",
      "name": "Andy Kumeda",
      "url": "https://andykumeda.com/",
      "description": "The personal website of Andy Kumeda: endurance running, independent software, infrastructure automation, photography, and music.",
      "about": {
        "@id": "https://andykumeda.com/#person"
      }
    },
    {
      "@type": "Person",
      "@id": "https://andykumeda.com/#person",
      "name": "Andy Kumeda",
      "url": "https://andykumeda.com/",
      "sameAs": [
        "https://www.linkedin.com/in/andykumeda",
        "https://github.com/andykumeda"
      ]
    }
  ]
};

export default function Home() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} /><Crossroads /></>;
}
