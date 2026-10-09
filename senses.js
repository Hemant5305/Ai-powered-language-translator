/* ══════════════════════════════════════════════════════════════
   HawkEye AI — senses.js
   WORD-SENSE UNDERSTANDING: same word, different meaning.

   "I'm going to the bank"            → 🏦 financial institution
   "I'm sitting on the bank of river" → 🏞️ edge of a river

   How it works
   • Each ambiguous word has several senses. The FIRST sense listed is
     the most common one (used when the sentence gives no clue).
   • Every sense has "cues" — words near the target word that point to it.
       "river"     exact word (plural forms are matched too)
       "fish*"     any word starting with "fish"
       "_ of"      "_" is the target word itself  ("fan of", "kind of")
       "!sat on _" a leading "!" marks a STRONG cue (worth 3 points, not 1)
   • Cues are looked for in a ±8 word window, inside the same sentence.
   • In FREE mode the English sentence is also rewritten with an
     unambiguous word before it is sent to the translator
     (bank → riverbank) so MyMemory picks the right sense.
   • In AI mode the same result is passed to the prompt as a hint when
     the user manually changes a meaning, and Claude disambiguates the
     rest itself (see buildPrompt in script.js).
   ══════════════════════════════════════════════════════════════ */
"use strict";

/* ── DATABASE ─────────────────────────────────────────────────────
   To add a word, copy any entry. First sense = default meaning.      */
const SENSE_DB = {

    bank: {
        forms: ["bank", "banks"], senses: [
            {
                id: "finance", emoji: "🏦", label: "Financial institution", gloss: "a place that keeps, lends or exchanges money",
                cues: "money, cash, deposit*, withdraw*, account*, loan*, atm, card, cheque, transfer*, saving*, credit, debit, branch, teller, mortgage, interest, balance, salary, pay, paid, rob*, manager, ifsc, passbook, statement, cashier, queue"
            },
            {
                id: "river", emoji: "🏞️", label: "Edge of a river or lake", gloss: "the sloping land beside a river, lake or stream",
                cues: "river, lake, stream, water, shore, canal, creek, pond, fish*, grass*, mud*, flood*, steep, slope*, slippery, picnic, boat*, swim*, ganga, ganges, yamuna, sutlej, beas, nile, thames, duck*, !sitting on _, !sitting on the _, !sat on _, !sat on the _, !sit on _, !sit on the _, !along the _, !_ of the river, !_ of river, !_ of a river, !_ of the lake",
                swap: "riverbank", collapse: [/\b(?:(?:river|lake|stream|canal|pond)\s+)?riverbank(?:\s+of\s+(?:the\s+|a\s+)?(?:river|lake|stream|canal|pond))?\b/gi, "riverbank"]
            }
        ]
    },

    bat: {
        forms: ["bat", "bats"], senses: [
            {
                id: "sports", emoji: "🏏", label: "Sports bat", gloss: "a wooden club used to hit a ball (cricket, baseball)",
                cues: "cricket, baseball, ball*, hit*, swing*, wicket*, bowler, batsman, batter, match, innings, six, four, play*, player*, team, wooden, willow, strike*, stadium, practice, grip, kohli, dhoni, sachin"
            },
            {
                id: "animal", emoji: "🦇", label: "Flying animal", gloss: "a small nocturnal flying mammal",
                cues: "cave*, night*, fly*, flies, flew, wing*, vampire, blood, hang*, upside, dark, nocturnal, mammal, echolocation, dusk, fruit, attic, insect*"
            }
        ]
    },

    bark: {
        forms: ["bark", "barks", "barked", "barking"], formSense: { barked: "dog", barking: "dog" }, senses: [
            {
                id: "dog", emoji: "🐕", label: "Sound a dog makes", gloss: "the loud sharp sound of a dog",
                cues: "dog*, puppy, pup, loud*, growl*, howl*, woof, stranger*, neighbo*, night, guard*, noise, cat, bite*, wag*, !_ at"
            },
            {
                id: "tree", emoji: "🌳", label: "Outer covering of a tree", gloss: "the tough skin of a tree trunk or branch",
                cues: "tree*, trunk*, rough, peel*, wood*, oak, cinnamon, branch*, forest, cork, scrape*, thick, brown, plant*, bamboo, neem"
            }
        ]
    },

    light: {
        forms: ["light", "lights"], senses: [
            {
                id: "brightness", emoji: "💡", label: "Brightness / lamp", gloss: "illumination, or something that gives it",
                cues: "lamp*, bulb*, sun*, switch*, turn*, bright*, shin*, glow*, torch*, candle*, room, window*, ray*, darkness, power, electric*, led, tube, flash*, flicker*, dim, traffic, signal"
            },
            {
                id: "weight", emoji: "🪶", label: "Not heavy", gloss: "of little weight, or small in amount (a light bag, a light meal)",
                cues: "heavy, weigh*, bag*, luggage, carry*, lift*, feather*, kg, pound*, backpack*, load*, easy, meal*, lunch, dinner, breakfast, snack*, diet, rain, breeze, touch, sleeper, !_ as a feather, !_ weight, !_ meal, !_ rain, !_ snack, !_ food"
            },
            {
                id: "color", emoji: "🎨", label: "Pale colour", gloss: "a pale or soft shade of a colour",
                cues: "color*, colour*, shade*, pastel, pale, dark, !_ blue, !_ green, !_ red, !_ pink, !_ yellow, !_ brown, !_ grey, !_ gray, !_ purple, !_ orange"
            }
        ]
    },

    match: {
        forms: ["match", "matches", "matched", "matching"], senses: [
            {
                id: "sports", emoji: "⚽", label: "Sports game", gloss: "a contest between two players or teams",
                cues: "cricket, football, soccer, team*, play*, score*, win*, won, lose, lost, final*, tournament*, league, stadium, ticket*, watch*, tonight, ipl, goal*, world cup, referee, opponent*, series, innings, vs"
            },
            {
                id: "fire", emoji: "🔥", label: "Matchstick", gloss: "a small stick that makes fire when struck",
                cues: "fire, flame*, candle*, burn*, box*, strike, struck, stick*, cigarette*, gas, stove, diya, matchbox, spark, !_ box, !_ stick, !strike a _, !lit a _, !light a _",
                swap: "matchstick"
            },
            {
                id: "pair", emoji: "🤝", label: "Go well together / be equal", gloss: "to be the same as, or to suit, something else",
                cues: "color*, colour*, shirt*, shoes, outfit*, dress, tie, pair*, identical, similar, perfect, compatible, tally, suit*, !_ with, !_ the, !a perfect _, !_ up"
            }
        ]
    },

    spring: {
        forms: ["spring", "springs"], senses: [
            {
                id: "season", emoji: "🌸", label: "Season after winter", gloss: "the season between winter and summer",
                cues: "season*, summer, winter, autumn, fall, flower*, bloom*, blossom*, april, march, warm, weather, festival, bahar, break, vacation, !in _, !this _, !last _, !next _, !_ time"
            },
            {
                id: "water", emoji: "💧", label: "Natural water source", gloss: "water flowing naturally out of the ground",
                cues: "water, hot, drink*, fresh, mineral, mountain, flow*, geyser, source, natural, thermal, bubbl*, clear, !_ water"
            },
            {
                id: "coil", emoji: "🔩", label: "Metal coil", gloss: "a coiled piece of metal that returns to its shape",
                cues: "mattress*, coil*, metal, bounc*, stretch*, steel, clock, pen, suspension, compress*, trampoline, pressure, !_ back, !_ into, !_ loaded",
                swap: "coil spring"
            }
        ]
    },

    right: {
        forms: ["right", "rights"], formSense: { rights: "entitlement" }, senses: [
            {
                id: "correct", emoji: "✅", label: "Correct", gloss: "true, accurate, not wrong",
                cues: "wrong, correct, answer*, true, exactly, indeed, mistake*, sure, proper*, !_ answer"
            },
            {
                id: "direction", emoji: "👉", label: "Direction (opposite of left)", gloss: "on or towards the side opposite to left",
                cues: "left, turn*, side, hand*, road*, lane*, corner*, drive*, steer*, next, straight, signal, junction, crossing, !on the _, !to the _, !_ side, !_ hand, !_ turn, !turn _, !take a _, !_ of the road"
            },
            {
                id: "exact", emoji: "⏱️", label: "Exactly / immediately", gloss: "just, precisely, or without delay",
                cues: "!_ now, !_ away, !_ here, !_ there, !_ after, !_ before, !_ at, !_ in front"
            },
            {
                id: "entitlement", emoji: "⚖️", label: "Legal or moral entitlement", gloss: "something you are allowed or owed (human rights)",
                cues: "human, freedom, law*, legal*, citizen*, vote, voting, constitution, court, fundamental, civil, equal*, speech, claim*, protect*, women, children, !_ to, !have the _ to, !fight for _"
            }
        ]
    },

    left: {
        forms: ["left"], senses: [
            {
                id: "departed", emoji: "🚪", label: "Went away from", gloss: "past tense of leave — went away, or put something down and went",
                cues: "yesterday, morning, home, office, already, he, she, they, train, flight, bus, early, quickly, suddenly, school, work, just, without, !_ for, !_ my, !_ the, !_ it, !_ me, !_ him, !_ her, !_ his"
            },
            {
                id: "direction", emoji: "👈", label: "Direction (opposite of right)", gloss: "on or towards the side opposite to right",
                cues: "right, turn*, side, hand*, road*, lane*, corner*, drive*, steer*, !on the _, !to the _, !_ side, !_ hand, !_ turn, !turn _, !take a _, !_ of the road, !my _, !your _"
            },
            {
                id: "remain", emoji: "📦", label: "Remaining", gloss: "still there after the rest has gone or been used",
                cues: "nothing, only, any, much, many, none, leftover*, behind, remain*, still, few, little, over, !how many _, !how much _, !_ over, !_ behind, !nothing _, !any _, !no _"
            }
        ]
    },

    date: {
        forms: ["date", "dates"], senses: [
            {
                id: "calendar", emoji: "📅", label: "Day on the calendar", gloss: "a particular day of the month and year",
                cues: "today, tomorrow, yesterday, birth*, deadline*, month*, year*, calendar, expir*, schedule*, day, monday, tuesday, wednesday, thursday, friday, saturday, sunday, exam*, due, !_ of birth, !what _, !the _ is, !today's _, !_ and time, !_ today"
            },
            {
                id: "romantic", emoji: "💑", label: "Romantic outing", gloss: "a social meeting with someone you may love",
                cues: "dinner, girlfriend, boyfriend, romantic, movie*, ask*, first, love*, partner, restaurant*, flirt*, crush, tinder, !_ with her, !_ with him, !going on a _, !go on a _, !a _ night, !have a _ tonight, !blind _, !_ night",
                swap: "romantic date"
            },
            {
                id: "fruit", emoji: "🌴", label: "Date fruit", gloss: "a sweet brown fruit of the date palm",
                cues: "fruit*, eat*, ate, sweet*, dry, dried, palm, ramadan, iftar, tree*, snack*, juice, sugar, nutri*, fig, almond*, nuts, packet, kilo, kg, !_ palm, !_ fruit, !_ and nuts",
                swap: "date fruit"
            }
        ]
    },

    fan: {
        forms: ["fan", "fans"], senses: [
            {
                id: "cooling", emoji: "🌀", label: "Cooling fan", gloss: "a machine with blades that moves air",
                cues: "ceiling, table, electric*, air, hot, summer, switch*, speed, blade*, cooler, ac, wind, power, noise, noisy, heat, sweat*, regulator, room, turn*, pedestal, exhaust, kitchen, cooling"
            },
            {
                id: "supporter", emoji: "🤩", label: "Enthusiastic supporter", gloss: "someone who admires a person, team or band",
                cues: "cricket, football, kohli, club, favorite, favourite, concert, singer*, actor*, actress*, star*, movie*, team*, huge, big, biggest, superstar, support*, idol*, celebrity, follow*, hero, crazy, !_ of, !a big _, !huge _",
                swap: "supporter"
            }
        ]
    },

    mouse: {
        forms: ["mouse", "mice"], senses: [
            {
                id: "animal", emoji: "🐭", label: "Small rodent", gloss: "a small furry animal with a long tail",
                cues: "cat*, cheese, trap*, tail, rat, hole*, squeak*, kitchen, pest*, rodent*, chase*, catch*, caught, tiny, little, field, mice, house"
            },
            {
                id: "computer", emoji: "🖱️", label: "Computer mouse", gloss: "a hand-held device that moves the cursor",
                cues: "click*, computer*, laptop*, keyboard*, cursor, wireless, usb, screen*, pad, scroll*, double, button*, pc, gaming, optical, bluetooth, battery, !_ pad, !_ click",
                swap: "computer mouse"
            }
        ]
    },

    nail: {
        forms: ["nail", "nails"], senses: [
            {
                id: "metal", emoji: "🔩", label: "Metal nail", gloss: "a thin pointed metal pin hit with a hammer",
                cues: "hammer*, wall*, wood*, board*, screw*, hit*, fix*, picture*, hang*, iron, steel, carpenter*, tool*, rust*, bent, sharp, box"
            },
            {
                id: "body", emoji: "💅", label: "Fingernail / toenail", gloss: "the hard covering at the end of a finger or toe",
                cues: "finger*, toe*, polish*, cut*, trim*, manicure*, salon, bit*, paint*, long, broke, broken, clip*, file*, grow*, painted, color*, colour*, cuticle, my _, !her _, !his _",
                swap: "fingernail", skipNear: ["finger", "toe"]
            }
        ]
    },

    watch: {
        forms: ["watch", "watches", "watched", "watching"], senses: [
            {
                id: "look", emoji: "👀", label: "Look at / observe", gloss: "to look at something carefully or for a while",
                cues: "movie*, film*, tv, television, show*, match, cricket, series, video*, youtube, netflix, game*, careful*, out, closely, kids, children, baby, birds, sunset, stars, tonight, !_ out, !_ the, !_ my, !_ over, !_ for"
            },
            {
                id: "wrist", emoji: "⌚", label: "Wrist watch", gloss: "a small clock worn on the wrist",
                cues: "wrist*, time, strap*, hour*, brand*, buy, bought, wear*, wearing, wore, smart, gift*, battery, dial, expensive, rolex, tick*, band, apple, digital, alarm, leather, gold, silver, fitbit, titan, !my _, !a _",
                swap: "wristwatch"
            }
        ]
    },

    park: {
        forms: ["park", "parks", "parked", "parking"], formSense: { parked: "vehicle", parking: "vehicle" }, senses: [
            {
                id: "garden", emoji: "🌳", label: "Public garden", gloss: "a green open space for walking and playing",
                cues: "garden*, children, kids, walk*, jog*, bench*, picnic*, trees, play*, playground, morning, evening, grass, lawn, swing*, public, city, national, zoo, stroll*, family, dog*"
            },
            {
                id: "vehicle", emoji: "🚗", label: "Leave a vehicle somewhere", gloss: "to stop and leave a car or bike in a place",
                cues: "car*, bike*, scooter*, truck*, vehicle*, space*, gate, driveway, lot, motorcycle*, garage, street, road, tow*, illegal, double, front, outside, basement, !_ the car, !_ my, !_ here, !_ there, !where to _, !can i _, !can we _"
            }
        ]
    },

    current: {
        forms: ["current", "currents"], senses: [
            {
                id: "present", emoji: "🕒", label: "Present / happening now", gloss: "belonging to the present time",
                cues: "affairs, news, situation, status, job, address, president, minister, time, month, year, issue*, trend*, version, events, price*, weather, !_ affairs, !_ situation, !_ status, !_ account, !_ time, !_ job, !_ events"
            },
            {
                id: "electric", emoji: "⚡", label: "Electric current", gloss: "the flow of electricity through a wire",
                cues: "electric*, wire*, shock*, voltage, ampere*, amp, circuit*, battery, power, switch*, ac, dc, resistor*, meter, bill, supply, socket*, volt*, !_ flow, !_ passes, !_ through, !electric _"
            },
            {
                id: "water", emoji: "🌊", label: "Water / air flow", gloss: "the steady movement of water in a river or sea",
                cues: "river*, sea, ocean, strong*, swept, swim*, tide*, wave*, boat*, stream, drift*, against, water, rip, undercurrent, !_ carried, !_ pulled, !_ of the river, !strong _"
            }
        ]
    },

    lead: {
        forms: ["lead", "leads", "leading"], formSense: { leading: "guide" }, senses: [
            {
                id: "guide", emoji: "🚶", label: "Guide / be in front", gloss: "to go first, or to be in charge of a group",
                cues: "team*, group*, company, project*, country, race, march, army, way, follow*, manage*, captain, !_ the, !_ a, !_ to, !_ us, !_ you, !_ by"
            },
            {
                id: "metal", emoji: "⚙️", label: "Lead (heavy metal)", gloss: "a soft heavy grey metal (said “led”)",
                cues: "pipe*, poison*, heavy, toxic, metal*, paint*, pencil*, bullet*, element*, battery, batteries, ore, graphite, mercury, arsenic, !_ pipe, !_ poisoning, !_ paint"
            },
            {
                id: "clue", emoji: "🧲", label: "Clue / potential customer", gloss: "a hint in an investigation, or a possible sale",
                cues: "sales, customer*, client*, potential, generate*, follow up, detective*, police, clue*, tip*, investigat*, suspect*, new, strong, main, !a _, !the _ is, !_ generation, !_ to the"
            }
        ]
    },

    kind: {
        forms: ["kind", "kinds"], senses: [
            {
                id: "nice", emoji: "🤗", label: "Caring and gentle", gloss: "friendly, generous and considerate",
                cues: "very, so, thank*, person, people, heart*, gentle, generous, helpful, polite, friendly, words, gesture*, teacher, neighbo*, nature, soul, always, truly, thanks, !_ to, !_ of you, !so _, !very _, !be _"
            },
            {
                id: "type", emoji: "🏷️", label: "Type / sort", gloss: "a category of things (what kind of food)",
                cues: "what, which, this, that, some, all, every, different, same, another, many, various, any, !_ of, !what _ of, !a _ of, !this _ of, !that _ of, !same _ of, !all _ of, !some _ of, !many _ of"
            }
        ]
    },

    rock: {
        forms: ["rock", "rocks", "rocked", "rocking"], senses: [
            {
                id: "stone", emoji: "🪨", label: "Stone", gloss: "the hard mineral material of the earth, or a piece of it",
                cues: "stone*, hill*, mountain*, climb*, boulder*, cliff*, hard, sand, throw*, threw, big, heavy"
            },
            {
                id: "music", emoji: "🎸", label: "Rock music", gloss: "loud guitar-based popular music",
                cues: "band*, music*, concert*, guitar*, song*, metal, roll, singer*, album*, festival*, punk, pop, listen*, !_ and roll, !_ star, !_ band, !_ music, !_ concert, !_ on"
            },
            {
                id: "sway", emoji: "🛏️", label: "Sway gently", gloss: "to move slowly back and forth",
                cues: "baby, cradle*, chair*, boat*, gently, sleep*, back, forth, lullaby, ship, waves, !_ the boat, !_ the baby, !_ back and forth, !rocking _"
            }
        ]
    },

    ring: {
        forms: ["ring", "rings", "rang", "ringing"], formSense: { rang: "sound", ringing: "sound" }, senses: [
            {
                id: "jewellery", emoji: "💍", label: "Finger ring", gloss: "a circle of metal worn on a finger",
                cues: "finger*, gold, diamond*, silver, wedding, engagement, wear*, wore, jewel*, proposal, propose*, gift*, platinum, stone*, !_ on my, !_ on her, !_ on his, !put a _ on, !_ finger"
            },
            {
                id: "sound", emoji: "🔔", label: "Bell / phone sound", gloss: "to make the sound of a bell, or to phone someone",
                cues: "phone*, bell*, doorbell*, call*, alarm*, ringtone*, loud, answer*, mobile, tone, church, temple, !_ me, !_ you, !_ back, !give me a _, !_ the bell, !_ up"
            },
            {
                id: "circle", emoji: "⭕", label: "Circle / arena", gloss: "a round shape, or a fighting arena",
                cues: "boxing, circus, fight*, wrestl*, circle*, round, arena, smoke, road, saturn, onion, gang, crime, !_ road, !boxing _, !_ of smoke, !_ of fire"
            }
        ]
    },

    fall: {
        forms: ["fall", "falls", "fell", "fallen", "falling"], senses: [
            {
                id: "drop", emoji: "📉", label: "Drop down", gloss: "to move downwards, usually by accident",
                cues: "down, stair*, hurt, slip*, floor, ground, tree, trip*, broke, bone*, rain, price*, rate*, temperature, snow, drop*, off, ladder, bike, tumble*, tiles, wet, leaves, leaf, apples, !_ down, !_ off, !_ from, !_ into"
            },
            {
                id: "autumn", emoji: "🍂", label: "Autumn (US)", gloss: "the season between summer and winter",
                cues: "!in the _, !this _, !last _, !next _, !_ season, !_ colors, !_ colours, !_ semester, !_ break"
            },
            {
                id: "state", emoji: "❤️", label: "Become / get into a state", gloss: "to start being in love, asleep, ill or in trouble",
                cues: "love*, asleep, sleep, ill, sick, pregnant, trap*, victim, !_ in love, !_ asleep, !_ ill, !_ sick, !_ apart, !_ behind, !_ for"
            }
        ]
    },

    book: {
        forms: ["book", "books", "booked", "booking", "bookings"], formSense: { booked: "reserve", booking: "reserve", bookings: "reserve" }, senses: [
            {
                id: "read", emoji: "📖", label: "Book to read", gloss: "a set of pages with writing, bound together",
                cues: "read*, author*, page*, library, novel*, story, chapter*, write, wrote, shelf, shelves, bookstore, publish*, favorite, favourite, study, pdf, student, !the _, !my _, !this _, !that _, !a good _, !a _ about"
            },
            {
                id: "reserve", emoji: "🎫", label: "Reserve / buy in advance", gloss: "to arrange a ticket, room, table or seat ahead of time",
                cues: "ticket*, hotel*, flight*, room*, table*, seat*, appointment*, online, train, cab, taxi, reserv*, advance, trip, holiday, vacation, ahead, ola, uber, irctc, !_ a, !_ my, !_ our, !_ now, !_ tickets"
            }
        ]
    },

    pupil: {
        forms: ["pupil", "pupils"], senses: [
            {
                id: "student", emoji: "🎓", label: "Student", gloss: "a child who is taught at a school",
                cues: "school*, teacher*, class*, student*, study*, exam*, grade*, headmaster, lesson*, learn*, homework, college, brilliant, bright, !teacher's _"
            },
            {
                id: "eye", emoji: "👁️", label: "Part of the eye", gloss: "the black circle in the middle of the eye",
                cues: "eye*, dilat*, iris, light, dark, vision, black, doctor, ophthalm*, retina, constrict*, round, !_ of the eye, !_ dilates"
            }
        ]
    },

    interest: {
        forms: ["interest", "interests"], senses: [
            {
                id: "curiosity", emoji: "🤔", label: "Curiosity / hobby", gloss: "wanting to know or do more about something",
                cues: "hobby, hobbies, show*, lose, lost, lack*, subject*, topic*, music, sports, passion, curiosity, attention, !_ in, !take an _, !take _ in, !my _ in, !personal _, !areas of _"
            },
            {
                id: "money", emoji: "💰", label: "Money charged on a loan", gloss: "extra money paid for borrowing, or earned on savings",
                cues: "rate*, bank*, loan*, percent*, pay*, savings, deposit*, annual, compound, simple, mortgage*, credit, emi, principal, earn*, account*, fixed, fd, lender*, tax, !_ rate, !_ on, !_ payment, !rate of _, !compound _, !simple _"
            }
        ]
    },

    charge: {
        forms: ["charge", "charges", "charged", "charging"], formSense: { charging: "power" }, senses: [
            {
                id: "fee", emoji: "💵", label: "Fee / price", gloss: "money asked for a service or product",
                cues: "fee*, cost*, price*, rupee*, rs, dollar*, extra, bill*, rent, pay*, service, delivery, free, tax, cheap, expensive, much, additional, hidden, !_ for, !extra _, !no _, !free of _, !_ you, !_ me, !_ per"
            },
            {
                id: "power", emoji: "🔋", label: "Fill with electricity", gloss: "to put electric power into a battery",
                cues: "phone*, battery, batteries, mobile, laptop*, charger*, plug*, power*, usb, percent*, full, low, dead, cable*, socket*, fast, wireless, overnight, !_ my phone, !_ my, !_ the battery, !_ the phone"
            },
            {
                id: "accuse", emoji: "⚖️", label: "Accuse officially", gloss: "to say officially that someone committed a crime",
                cues: "police, court*, arrest*, crime*, guilty, murder, theft, judge, lawyer*, accused, criminal*, case, fraud, !_ with, !_ him with, !_ her with, !_ against, !criminal _, !murder _"
            },
            {
                id: "responsible", emoji: "👔", label: "Being in control / responsible", gloss: "the responsibility of looking after something (in charge)",
                cues: "responsib*, boss, manage*, incharge, supervisor, department, team*, project*, !in _, !in _ of, !take _, !take _ of, !person in _"
            }
        ]
    },

    cold: {
        forms: ["cold", "colds"], senses: [
            {
                id: "temperature", emoji: "🥶", label: "Low temperature", gloss: "having a low temperature",
                cues: "weather, winter, freez*, ice, water, wind, snow, morning, night, degree*, temperature*, jacket*, sweater*, blanket*, chilly, shiver*, drink*, beverage, coffee, tea, milk, juice, soda, room, outside, !very _, !so _, !too _, !_ outside, !_ weather, !_ water, !_ wind, !_ drink, !_ day, !_ night"
            },
            {
                id: "illness", emoji: "🤧", label: "Common cold (illness)", gloss: "a mild illness with a runny nose and cough",
                cues: "cough*, sneez*, fever, nose, runny, flu, medicine*, doctor, sick, throat, catch*, caught, symptom*, tablet*, antibiotic*, !have a _, !got a _, !caught a _, !catch a _, !common _, !a bad _, !a heavy _, !_ and cough, !_ and flu, !_ and fever, !_ symptoms"
            },
            {
                id: "unfriendly", emoji: "😶", label: "Unfriendly / unemotional", gloss: "showing no warmth or kindness",
                cues: "heart*, person, behaviour, behavior, stare, tone, voice, attitude, look, !_ hearted, !_ blooded, !_ shoulder, !_ war, !_ call"
            }
        ]
    }
};

/* ── COMPILE: word → entry index, cue strings → regexes ──────────── */
const SENSE_INDEX = {};
(function compileSenses() {
    const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    Object.entries(SENSE_DB).forEach(([key, entry]) => {
        entry.forms.forEach(f => { SENSE_INDEX[f] = key; });
        entry.senses.forEach(sense => {
            sense._cues = sense.cues.split(",").map(raw => {
                let c = raw.trim();
                if (!c) return null;
                const strong = c[0] === "!";
                c = c.replace(/^!/, "");
                const prefix = c.endsWith("*");
                c = c.replace(/\*$/, "");
                const re = new RegExp("(?:^| )" + escRe(c) + (prefix ? "" : "(?:s|es)?(?= |$)"));
                return { raw: c, w: strong ? 3 : 1, re };
            }).filter(Boolean);
        });
    });
})();

/* ── SCAN a text: which sense does each ambiguous word have? ──────
   Returns { results, rewritten }
   • results   — one item per ambiguous word found
   • rewritten — the same text, with words swapped for an unambiguous
                 synonym where that helps the free translator
                 ("sitting on the bank of the river" → "sitting on the riverbank")  */
function senseScan(text) {
    const results = [];
    const overrides = (typeof S !== "undefined" && S.senseOverrides) || {};
    const segs = String(text || "").split(/(?<=[.!?।\n])/);
    let rewritten = "";

    segs.forEach((seg, si) => {
        const toks = [...seg.matchAll(/[A-Za-z]+(?:'[A-Za-z]+)?/g)].map(m => ({ raw: m[0], w: m[0].toLowerCase(), i: m.index }));
        let out = "", last = 0, collapse = null;

        toks.forEach((t, ti) => {
            const key = SENSE_INDEX[t.w];
            if (!key) return;
            const entry = SENSE_DB[key];
            const ov = key + "@" + si;

            // words around the target (target itself becomes "_")
            const ctxArr = [];
            for (let j = Math.max(0, ti - 8); j < Math.min(toks.length, ti + 9); j++) ctxArr.push(j === ti ? "_" : toks[j].w);
            const ctx = ctxArr.join(" ");

            let best = null, forced = false;
            const forcedSense = overrides[ov] && entry.senses.find(s => s.id === overrides[ov]);
            if (forcedSense) {
                best = { s: forcedSense, sc: 99, h: [] };
                forced = true;
            } else {
                entry.senses.forEach(s => {
                    let sc = 0; const h = [];
                    s._cues.forEach(c => { if (c.re.test(ctx)) { sc += c.w; h.push({ label: c.raw.replace(/_/g, t.w), w: c.w }); } });
                    if (entry.formSense && entry.formSense[t.w] === s.id) { sc += 2; h.push({ label: t.w + " (word form)", w: 2 }); }
                    if (!best || sc > best.sc) best = { s, sc, h };   // ties keep the earlier (more common) sense
                });
            }

            const res = {
                word: t.raw, key, sense: best.s, score: best.sc, forced,
                assumed: !forced && best.sc === 0,
                hits: best.h.sort((a, b) => b.w - a.w).map(x => x.label).slice(0, 4),
                others: entry.senses.filter(s => s !== best.s),
                ov, segment: seg.trim()
            };
            results.push(res);

            // swap in an unambiguous word (free-translation helper)
            const sw = best.s.swap;
            if (sw && !res.assumed) {
                const swWords = sw.toLowerCase().split(" ");
                const near = [toks[ti - 1]?.w, toks[ti + 1]?.w];
                const blocked = (swWords.length > 1 && near.some(n => n && swWords.includes(n)))
                    || (best.s.skipNear && near.some(n => n && best.s.skipNear.includes(n)));
                if (!blocked) {
                    const plural = t.w === key + "s" || t.w === key + "es";
                    const word = plural ? (/(?:s|x|ch|sh)$/.test(sw) ? sw + "es" : sw + "s") : sw;
                    out += seg.slice(last, t.i) + keepCase(t.raw, word);
                    last = t.i + t.raw.length;
                    if (best.s.collapse) collapse = best.s.collapse;
                }
            }
        });

        out += seg.slice(last);
        if (collapse) out = out.replace(collapse[0], m => keepCase(m, collapse[1]));
        rewritten += out;
    });

    return { results, rewritten };
}

/* Group repeated hits of the same word+meaning so the UI shows one chip */
function groupSenses(results) {
    const map = new Map();
    results.forEach(r => {
        const k = r.key + "|" + r.sense.id;
        if (!map.has(k)) map.set(k, { word: r.word.toLowerCase(), key: r.key, sense: r.sense, others: r.others, score: 0, assumed: true, forced: false, hits: [], ovs: [] });
        const g = map.get(k);
        g.score = Math.max(g.score, r.score);
        g.assumed = g.assumed && r.assumed;
        g.forced = g.forced || r.forced;
        r.hits.forEach(h => { if (!g.hits.includes(h)) g.hits.push(h); });
        g.ovs.push(r.ov);
    });
    return [...map.values()];
}

const senseConf = g => g.forced ? ["forced", "chosen by you"]
    : g.assumed ? ["assumed", "most common meaning"]
        : g.score >= 3 ? ["high", "clear clue"] : ["likely", "likely"];

/* ── AI MODE helpers ────────────────────────────────────────────── */

/* Lines added to the prompt ONLY for meanings the user changed by hand */
function senseHint(text) {
    const lines = [...new Set(senseScan(text).results.filter(r => r.forced)
        .map(r => `- "${r.word}" means: ${r.sense.label} (${r.sense.gloss}).`))];
    return lines.length ? "\nThe user confirmed these word meanings — use them exactly:\n" + lines.join("\n") : "";
}

/* One-line summary for the toast shown after translating */
function senseSummary(parsed) {
    let parts;
    if (Array.isArray(parsed.ambiguous_words)) {
        parts = parsed.ambiguous_words.filter(a => a && a.word && a.chosen_meaning).slice(0, 2)
            .map(a => `“${esc(a.word)}” → ${esc(a.chosen_meaning)}`);
    } else {
        parts = groupSenses((parsed.senses || []).filter(r => !r.assumed)).slice(0, 2)
            .map(g => `“${esc(g.word)}” → ${esc(g.sense.label)}`);
    }
    return parts.length ? "🎯 Understood " + parts.join(", ") : "";
}

/* ── UI: live chips under the source box ───────────────────────── */
function renderSenseStrip() {
    const box = document.getElementById("senseStrip");
    const src = document.getElementById("sourceText");
    if (!box || !src) return;

    const { results } = senseScan(src.value);

    // forget manual choices for words that are no longer in the text
    const present = new Set(results.map(r => r.ov));
    Object.keys(S.senseOverrides).forEach(k => { if (!present.has(k)) delete S.senseOverrides[k]; });

    if (!results.length) { box.style.display = "none"; box.innerHTML = ""; return; }

    box.innerHTML = `<span class="sense-strip-label"><i class="fas fa-bullseye"></i> Word meaning</span>`
        + groupSenses(results).map(g => {
            const [cls, label] = senseConf(g);
            const why = g.hits.length ? ` Clues: ${g.hits.join(", ")}.` : "";
            return `<button type="button" class="sense-chip ${cls}" data-key="${esc(g.key)}" data-sense="${esc(g.sense.id)}" data-ovs="${esc(g.ovs.join(","))}"`
                + ` title="${esc(`${g.sense.gloss} (${label}).${why} Click to switch to another meaning.`)}">`
                + `<span class="sense-chip-emoji">${g.sense.emoji}</span> <b>${esc(g.word)}</b> <span class="sense-chip-arrow">→</span> ${esc(g.sense.label)}`
                + `${g.assumed ? " <small>?</small>" : ""}</button>`;
        }).join("");
    box.style.display = "flex";
}

/* Click a chip → cycle to the next meaning of that word */
document.addEventListener("click", e => {
    const chip = e.target.closest && e.target.closest(".sense-chip");
    if (!chip) return;
    const entry = SENSE_DB[chip.dataset.key];
    if (!entry) return;
    const idx = entry.senses.findIndex(s => s.id === chip.dataset.sense);
    const next = entry.senses[(idx + 1) % entry.senses.length];
    chip.dataset.ovs.split(",").forEach(o => { S.senseOverrides[o] = next.id; });
    renderSenseStrip();
    toast(`“${esc(chip.dataset.key)}” set to: ${esc(next.label)}`, "info");
    handleAutoTranslate();
});

/* ── UI: "🎯 Word Sense" tab in the extras panel ───────────────── */
function senseTabHTML(parsed) {
    const tip = `<p class="extras-note">Tip: click a chip under the source box to switch a word to a different meaning, then translate again.</p>`;
    const empty = `<p>No words with several meanings were found in this text.</p><p class="extras-note">Try a sentence like “I sat on the bank of the river.” or “I went to the bank to deposit money.”</p>`;
    const card = (emoji, word, label, badgeCls, badge, gloss, why, others) => `
    <div class="sense-card">
      <div class="sense-head">
        <span class="sense-emoji">${emoji}</span><b class="sense-word">${esc(word)}</b><span class="sense-arrow">→</span>
        <span class="sense-label">${esc(label)}</span><span class="sense-conf ${badgeCls}">${esc(badge)}</span>
      </div>
      ${gloss ? `<p class="sense-gloss">${esc(gloss)}</p>` : ""}
      ${why}
      ${others}
    </div>`;

    // AI mode: the model's own reading of the sentence
    if (Array.isArray(parsed.ambiguous_words)) {
        const list = parsed.ambiguous_words.filter(a => a && a.word);
        if (!list.length) return empty;
        return list.map(a => card("🎯", a.word, a.chosen_meaning || "—", "high", "AI",
            "", a.reason ? `<p class="sense-why"><span>Why:</span> ${esc(a.reason)}</p>` : "",
            Array.isArray(a.other_meanings) && a.other_meanings.length
                ? `<p class="sense-others"><span>Other meanings:</span> ${a.other_meanings.map(esc).join(" · ")}</p>` : "")).join("") + tip;
    }

    // Free mode: the built-in sense engine
    const groups = groupSenses(parsed.senses || []);
    if (!groups.length) return empty;
    return groups.map(g => {
        const [cls, label] = senseConf(g);
        const why = g.hits.length
            ? `<p class="sense-why"><span>Clues:</span> ${g.hits.map(h => `<code>${esc(h)}</code>`).join(" ")}</p>`
            : (g.forced ? "" : `<p class="sense-why"><span>No clear clue</span> in the sentence, so the most common meaning was assumed. Add a hint word (like “deposit” or “river”) or click the chip to change it.</p>`);
        const others = g.others.length
            ? `<p class="sense-others"><span>Other meanings:</span> ${g.others.map(o => `${o.emoji} ${esc(o.label)}`).join(" · ")}</p>` : "";
        return card(g.sense.emoji, g.word, g.sense.label, cls, label, g.sense.gloss, why, others);
    }).join("") + tip;
}