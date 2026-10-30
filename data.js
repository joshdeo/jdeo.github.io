/* Joshua Deosaran, tape catalog. One entry per tape on the shelf.
   All images live in resources/web (upright, web sized copies of the originals). */
(function () {
  var W = 'resources/web/';
  var V = 'resources/videos/';
  var T = V + 'SERIES TRAILERS/';

  var projects = [
    {
      slug: 'how-did-they-fix-that-506',
      no: 1,
      title: ['How Did', 'They Fix', 'That?'],
      shortTitle: 'How Did They Fix That?',
      label: 'HOW DID THEY FIX THAT?',
      kicker: 'FIELD PRODUCER',
      sub: 'Episode 506 · Smithsonian',
      color: 'teal',
      year: '2026',
      role: 'Field Producer & Story Editor',
      network: 'Smithsonian Channel / Paramount+',
      dates: 'Jun 2026 to Present',
      format: 'Series episode',
      location: 'On location and in post',
      photo: { src: W + 'oysters-master.jpg', pos: '50% 38%' },
      band: { src: W + 'norfolk.jpg', pos: '50% 60%' },
      tagline: ['From location', 'through post,', 'to final delivery.'],
      body: [
        'My most recent credit. I field produced this episode from location through post, managing contributor relationships, directing scenes, and conducting on-camera interviews. I also shaped the editorial direction through detailed director’s notes and hands-on story editing in Adobe Premiere.',
        'Working closely with the executive producer and editor, I helped refine structure, pacing, and character arcs through to final delivery. It’s the most complete version of the field-to-post role I’ve built toward.'
      ],
      photos: [
        { src: W + 'oysters-master.jpg', alt: 'Joshua standing beside a camera and lighting setup on location', pos: '50% 40%' },
        { src: W + 'norfolk.jpg', alt: 'Joshua standing in front of a large tugboat in dry dock', pos: '50% 55%' }
      ],
      video: null,
      links: []
    },
    {
      slug: 'west-harbour-heroes-s1',
      no: 2,
      title: ['West', 'Harbour', 'Heroes'],
      shortTitle: 'West Harbour Heroes',
      label: 'WEST HARBOUR HEROES',
      kicker: 'STORY PRODUCER',
      sub: 'Season 1 · Bell Media',
      color: 'red',
      year: '2025',
      role: 'Story Producer',
      network: 'Bell Media',
      dates: 'Nov 2025 to Jun 2026',
      format: 'Series, ten episodes',
      location: 'Vancouver Island',
      photo: { src: W + 'corm-comox.jpg', pos: '47% 58%' },
      band: { src: W + 'corm-comox.jpg', pos: '50% 60%' },
      tagline: ['Helicopters.', 'Parachutes.', 'Search and Rescue.'],
      body: [
        'West Harbour Heroes took everything we did in Newfoundland’s East Harbour Heroes and brought it to the West Coast. For our first shoot, it allowed me to travel to Vancouver Island to shoot with the 442 Search and Rescue team. We filmed in helicopters, parachuted from Twin Otter aircraft, and explored the new Airbus Kingfisher 295 aircraft.',
        'This first adrenaline-filled episode set the tone for the rest of the season and its ten episodes. I remotely produced most of the series, researching, building relationships with cast, and working closely with Story Editors and post to shape clear, engaging episodes.'
      ],
      photos: [
        { src: W + 'me-corm-comox.jpg', alt: 'Joshua in a flight suit in front of a yellow rescue helicopter', pos: '50% 40%' },
        { src: W + 'kingfisher.jpg', alt: 'Joshua with a colleague in front of a Twin Otter aircraft', pos: '50% 40%' },
        { src: W + 'glacier.jpg', alt: 'Joshua standing on a rocky ridge above a glacier', pos: '50% 40%' }
      ],
      poster: W + 'p-whh.jpg',
      video: T + 'WHH1 TRAILER.mp4',
      links: [{ label: '@westharbourheroes', href: 'https://www.instagram.com/westharbourheroes/' }]
    },
    {
      slug: 'oyster-island',
      no: 3,
      title: ['Oyster', 'Island'],
      shortTitle: 'Oyster Island',
      label: 'OYSTER ISLAND',
      kicker: 'PRODUCER',
      sub: 'Feature documentary · 2026',
      color: 'mustard',
      year: '2026',
      role: 'Producer',
      network: 'Feature documentary',
      dates: 'Apr 2025 to Jun 2026',
      format: 'Feature documentary',
      location: 'Prince Edward Island',
      photo: { src: W + 'carl-cafe.jpg', pos: '50% 62%' },
      band: { src: W + 'carl-cafe.jpg', pos: '50% 66%' },
      tagline: ['Community.', 'Resilience.', 'Loss.'],
      body: [
        'My first Feature Documentary Producer credit, this feature took me to Prince Edward Island, Canada, where life revolves around agriculture and oysters. Balancing this with West Harbour Heroes pushed me to shift between fast-paced storytelling and a more patient, observational style of filmmaking.',
        'As filming unfolded, the story turned to a disease devastating the oyster population, affecting livelihoods and families. What began as a local issue grew into something much bigger, a story of community, resilience, and loss. Filmed over a year and a half, it is set to premiere at festivals in 2026.'
      ],
      photos: [
        { src: W + 'carl-cafe.jpg', alt: 'A wood beamed room set up for an interview with a camera case in the foreground', pos: '50% 60%' },
        { src: W + 'niall-pei.jpg', alt: 'Joshua and a colleague in a green field on Prince Edward Island', pos: '50% 35%' },
        { src: W + 'pei-souris.jpg', alt: 'Joshua standing on a boat with a local fisherman', pos: '50% 40%' },
        { src: W + 'pei-wood.jpg', alt: 'Joshua standing in front of a tall stack of logs', pos: '50% 50%' }
      ],
      video: null,
      links: []
    },
    {
      slug: 'east-harbour-heroes-s3',
      no: 4,
      title: ['East', 'Harbour', 'Heroes'],
      shortTitle: 'East Harbour Heroes, Season 3',
      label: 'EAST HARBOUR HEROES',
      kicker: 'STORY PRODUCER',
      sub: 'Season 3 · Apple TV+',
      color: 'blue',
      year: '2024',
      role: 'Story Producer',
      network: 'Apple TV+',
      dates: 'Jul 2024 to Nov 2025',
      format: 'Series, Season 3',
      location: 'Newfoundland and Labrador',
      photo: { src: W + 'ehh3-selfie.jpg', pos: '50% 34%' },
      band: { src: W + 'ehh3-selfie-wide.jpg', pos: '50% 40%' },
      tagline: ['A coral garden.', 'A wartime relic.', 'One deep lake.'],
      body: [
        'Season three took me across Newfoundland and Labrador, where I worked closely with cast while traversing both Field Director and Producer roles. The series followed people in Maritime industries, from Fishing to Scientific Research and Marine Stewardship, revealing the communities behind the work.',
        'Highlights included filming advanced fishing tech at the Marine Institute, documenting a newly discovered Coral Garden aboard a former Coast Guard icebreaker, and capturing a dive team recovering a World War II relic from deep within Gander Lake.'
      ],
      photos: [
        { src: W + 'ehh3-me-corm.jpg', alt: 'Joshua standing on a helicopter pad in front of a yellow helicopter', pos: '50% 40%' },
        { src: W + 'ehh3-wreck.jpg', alt: 'A crew in dry suits and life jackets giving thumbs up on a boat', pos: '50% 45%' },
        { src: W + 'funk-deep.jpg', alt: 'A sunset over open ocean', pos: '50% 50%' }
      ],
      poster: W + 'p-ehh3.jpg',
      video: T + 'EHH3 Trailer.mp4',
      links: [{ label: 'Watch on Apple TV+', href: 'https://tv.apple.com/ca/show/east-harbour-heroes/umc.cmc.alrl9su22yf8c20on5soy1ua' }]
    },
    {
      slug: 'claw-hunters-s1',
      no: 5,
      title: ['Claw', 'Hunters'],
      shortTitle: 'Claw Hunters',
      label: 'CLAW HUNTERS',
      kicker: 'STORY PRODUCER',
      sub: 'Season 1 · The Weather Channel',
      color: 'pink',
      year: '2023',
      role: 'Story Producer',
      network: 'The Weather Channel',
      dates: 'Sep 2023 to Jun 2024',
      format: 'Series, Season 1',
      location: 'Nova Scotia to Maine',
      photo: { src: W + 'lex-boat.jpg', pos: '50% 32%' },
      band: { src: W + 'me-lex.jpg', pos: '50% 40%' },
      tagline: ['Days at sea.', 'Tough conditions.', 'Nova Scotia to Maine.'],
      body: [
        'Claw Hunters was my first real jump into Story Producing. As the sole Producer, I took on the series from the ground up and learned fast. We followed lobster harvesters between Nova Scotia and Maine, between the Bay of Fundy and the Gulf of Maine. I spent days at sea, producing and directing in tough, unpredictable conditions.',
        'It was a true trial by fire, but it shaped how I tell stories. The series aired on The Weather Channel in 2025 and set the tone for everything that came after.'
      ],
      photos: [
        { src: W + 'lex-boat.jpg', alt: 'Joshua on the deck of a lobster boat surrounded by traps', pos: '50% 35%' },
        { src: W + 'greg-boat-me.jpg', alt: 'Joshua standing on the stern of a boat with a wake behind him', pos: '50% 35%' },
        { src: W + 'driving-boat.jpg', alt: 'Joshua at the helm inside a boat cabin', pos: '50% 40%' },
        { src: W + 'ns-boats.jpg', alt: 'Fishing boats docked in a harbour at night', pos: '50% 50%' }
      ],
      poster: W + 'p-ch.jpg',
      video: T + 'CH-trailer.mp4',
      links: [{ label: 'Watch on Apple TV+', href: 'https://tv.apple.com/ru/show/claw-hunters/umc.cmc.3vkcglcf0ujv1v0z78gjpz7nq?l=en' }]
    },
    {
      slug: 'east-harbour-heroes-s1',
      no: 6,
      title: ['East', 'Harbour', 'Heroes'],
      shortTitle: 'East Harbour Heroes, Season 1',
      label: 'EAST HARBOUR HEROES',
      kicker: 'RESEARCHER',
      sub: 'Season 1 · Prime Video',
      color: 'sage',
      year: '2022',
      role: 'Researcher',
      network: 'Prime Video',
      dates: 'Jul 2022 to Apr 2023',
      format: 'Series, Season 1',
      location: 'St John’s, Newfoundland',
      photo: { src: W + 'blake-master.jpg', pos: '24% 50%' },
      band: { src: W + 'blake-master.jpg', pos: '50% 50%' },
      tagline: ['One small harbour.', 'Big stories.', 'Dig deeper.'],
      body: [
        'Season One was set entirely in St John’s Harbour, Newfoundland and Labrador. This is where I worked closely with the Series Producer to find stories within a very limited world. With restricted access and major players opting out, we had to get creative and dig deeper.',
        'We found strong, character-driven stories with local fishermen, the Coast Guard, and a dive crew that quickly became standout cast. It taught me how to find great stories within constraints and adapt quickly, skills that carried through as the series grew into three seasons.'
      ],
      photos: [
        { src: W + 'blake-master.jpg', alt: 'Joshua looking through a camera on a shoreline with a reflector set up nearby', pos: '40% 50%' }
      ],
      poster: W + 'p-ehh1.jpg',
      video: T + 'EHH1-trailer.mp4',
      links: [{ label: 'Watch on Prime Video', href: 'https://www.primevideo.com/detail/East-Harbour-Heroes/0II5RS6NN11CZ9XYZ37WQ2ZA4R' }]
    },
    {
      slug: 'how-did-they-fix-that-s2',
      no: 7,
      title: ['How Did', 'They Fix', 'That?'],
      shortTitle: 'How Did They Fix That?, Season 2',
      label: 'HOW DID THEY FIX THAT?',
      kicker: 'RESEARCHER',
      sub: 'Season 2 · Apple TV+',
      color: 'brown',
      year: '2022',
      role: 'Researcher',
      network: 'Apple TV+',
      dates: 'May 2022 to Jun 2022',
      format: 'Series, Season 2',
      location: 'Around the world',
      photo: { src: W + 'p-hdtft.jpg', pos: '20% 50%' },
      band: { src: W + 'p-hdtft.jpg', pos: '50% 50%' },
      tagline: ['The Atacama Desert.', 'An underwater lab.', 'Strong stories, fast.'],
      body: [
        'Initially titled “Impossible Repairs,” this project marked my real return to the industry, jumping straight into fast-paced, global storytelling. I researched stories around the world, from the Atacama Desert in Chile to an underwater lab in Florida inspired by Jacques Cousteau, quickly getting back into the rhythm of finding strong, compelling stories.'
      ],
      photos: [],
      poster: W + 'p-hdtft.jpg',
      video: T + 'HDTFT - trailer.mp4',
      links: [{ label: 'Watch on Apple TV+', href: 'https://tv.apple.com/au/show/impossible-repairs/umc.cmc.3dml15jwu2221d3lnzct03dcf' }]
    },
    {
      slug: 'daily-planet',
      no: 8,
      title: ['Daily', 'Planet'],
      shortTitle: 'Daily Planet',
      label: 'DAILY PLANET',
      kicker: 'CHASE PRODUCER',
      sub: 'Discovery Canada',
      color: 'cream',
      year: '2016',
      role: 'Chase Producer',
      network: 'Discovery Canada',
      dates: 'Oct 2016 to May 2018',
      format: 'Daily live to air show',
      location: 'Toronto',
      photo: { src: W + 'dp-terminator.jpg', pos: '50% 32%' },
      band: { src: W + 'p-twilight.jpg', pos: '50% 50%' },
      tagline: ['Live to air.', 'Always topical.', 'Never late.'],
      body: [
        'Daily Planet was my entry into the industry in 2016. I started as an intern, moved into research, and eventually became a Chase Producer. Early on, I spent hours transcribing interviews for Story Producers, spending time with their stories and characters gave me a clear goal: I wanted to be the one at the forefront, both producing and shaping these stories.',
        'As I grew with the team, I learned every part of the process in a fast-paced, live-to-air environment where stories had to turn around quickly and stay topical. I was proudly part of the team when we earned the show its first Canadian Screen Award for Best News or Information Series since its inception in 1996.'
      ],
      photos: [
        { src: W + 'dp-terminator.jpg', alt: 'Joshua standing next to a metal Terminator figure', pos: '50% 35%' }
      ],
      reel: true,
      video: null,
      links: [{ label: 'View on IMDb', href: 'https://www.imdb.com/title/tt1405800/' }]
    }
  ];

  /* Loose clips from the Daily Planet years. */
  var clips = [
    { id: 'dyson', group: 'dp', title: 'Dyson Orchestra', poster: W + 'p-dyson.jpg', src: V + 'Dyson Orchestra - Daily Planet.mp4' },
    { id: 'esa', group: 'dp', title: 'ESA Cluster, UFO?', poster: W + 'p-esa.jpg', src: V + 'ESA CLUSTER UFO - Daily Planet.mp4' },
    { id: 'globetrotters', group: 'dp', title: 'Harlem Globetrotters, Rube Goldberg Machine', poster: W + 'p-globetrotters.jpg', src: V + 'Harlem Globetrotters - Rube Goldberg Daily Planet.mp4' },
    { id: 'everest', group: 'dp', title: 'Mt. Everest, World Record Attempt', poster: W + 'p-everest.jpg', src: V + 'John Farnworth - Mt. Everest - Daily Planet.mp4' },
    { id: 'littletikes', group: 'dp', title: 'Little Tikes Car, Flight Test', poster: W + 'p-littletikes.jpg', src: V + 'Little Tikes - Flite Test - Daily Planet.mp4' },
    { id: 'mantis', group: 'dp', title: 'Praying Mantis Wears 3D Glasses', poster: W + 'p-mantis.jpg', src: V + 'Praying Mantis Stereovision - Daily Planet.mp4' },
    { id: 'twilight', group: 'dp', title: 'Twilight Zone Discovered', poster: W + 'p-twilight.jpg', src: V + 'Rariphotic Zone Discovery Smithsonian - Daily Planet.mp4' },
    { id: 'hawking', group: 'dp', title: 'Stephen Hawking, Life in Numbers', poster: W + 'p-hawking.jpg', src: V + 'Stephen Hawking Life in Numbers - Daily Planet.mp4' },
    { id: 'astronauts', group: 'top10', title: 'Things Astronauts Do in Space', poster: W + 'p-astronauts.jpg', src: V + 'Top 10 - Things astronauts do in space.mp4' },
    { id: 'displays', group: 'top10', title: 'World’s Biggest Displays', poster: W + 'p-displays.jpg', src: V + 'Top 10 - World\'s Biggest Displays - Daily Planet.mp4' },
    { id: 'extreme', group: 'top10', title: 'Most Extreme Adventures', poster: W + 'p-extreme.jpg', src: V + 'Top 10 - Extreme Adventures - Daily Planet.mp4' },
    { id: 'holograms', group: 'top10', title: 'Coolest Holograms', poster: W + 'p-holo.jpg', src: V + 'Top 10 - Holograms - Daily Planet.mp4' },
    { id: 'sneakers', group: 'top10', title: 'High Tech Sneakers', poster: W + 'p-sneakers.jpg', src: V + 'Top 10 - High Tech Sneakers - Daily Planet.mp4' },
    { id: 'robots', group: 'top10', title: 'Robots That Play Sports', poster: W + 'p-robots.jpg', src: V + 'Top 10 - Robots that play sports - Daily Planet.mp4' }
  ];

  /* The full career list for the About page. Entries with a slug open a tape. */
  var credits = [
    { slug: 'how-did-they-fix-that-506' },
    { slug: 'west-harbour-heroes-s1' },
    { slug: 'oyster-island' },
    { slug: 'east-harbour-heroes-s3' },
    {
      title: 'Development Producer', org: 'Attraction Images', dates: 'Jun 2024 to Jul 2024',
      body: [
        'As a Development Producer, I worked on building original ideas from the ground up, shaping concepts into pitches ready for network presentations. I developed game show formats, fashion-driven series and more, handling casting, writing, and editing pitch material along the way.',
        'It gave me a strong sense of what makes an idea not just creative, but sellable.'
      ]
    },
    { slug: 'claw-hunters-s1' },
    {
      title: 'Development Researcher', org: 'Attraction Images', dates: 'May 2023 to Aug 2023',
      photo: { src: W + 'me-spike.jpg', alt: 'Joshua with two people on a New York street', pos: '50% 40%' },
      body: [
        'As a Development Researcher, I focused on building ideas that matched what audiences and broadcasters were actually looking for. I developed pitches rooted in current events, finding angles that felt fresh but still viable.',
        'It also gave me a clear understanding of the financial side of commissioning in Canada and the United States, and what it takes to get a project off the ground. This taught me how to balance creativity with strategy from inception.'
      ]
    },
    { slug: 'east-harbour-heroes-s1' },
    { slug: 'how-did-they-fix-that-s2' },
    { slug: 'daily-planet' },
    {
      title: 'Mac Technician', org: 'Apple Inc.', dates: 'Aug 2018 to May 2022', other: true,
      body: [
        'At Apple, I started in sales but was always drawn to the technical side. I worked my way to the Genius Bar and eventually into a Mac Technician role. I spent my days diagnosing issues, fixing devices, and helping people through moments that were often stressful and unexpected.',
        'It also reinforced something that carries into my work today, a genuine enjoyment of solving problems and helping people navigate challenges.'
      ]
    }
  ];

  window.JD = {
    projects: projects,
    clips: clips,
    credits: credits,
    email: 'joshua.deosaran@gmail.com',
    social: {
      linkedin: 'https://www.linkedin.com/in/jdeo/',
      instagram: 'https://www.instagram.com/nycjosh/',
      facebook: 'https://www.facebook.com/joshua.deosaran'
    }
  };
})();
