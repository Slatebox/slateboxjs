# What would a startup put on a slate?

On 18 November 2026 at 20:10 UTC we took the first 120 submissions from the Hacker News public top-stories feed in its returned order. We read 81 top-level comments across 14 selected threads about running, building and selling software. Ranks below belong to that snapshot. This selection favors teams that publish or discuss technical work. It gives us situations worth testing. Customer interviews and observations of teams using Slatebox must establish adoption. Miro customer stories supply a separate comparison. [Public API](https://github.com/HackerNews/API#new-top-and-best-stories) · [Team adoption goal](team-adoption-goal.md)

## First homepage candidate — What breaks if sign-in goes down?

During an Apple services outage, a visitor reported that a store could neither process returns nor activate a phone. In a separate Codeberg discussion, people followed the recovery of the domain as access returned for different users. A single “down” label missed what people actually experienced. [Apple discussion, rank 71](https://news.ycombinator.com/item?id=50535238) · [Store report](https://news.ycombinator.com/item?id=50535589) · [Codeberg recovery, rank 117](https://news.ycombinator.com/item?id=50545046)

Give a founder, engineer and support lead one actual dependency drawing. Connect “Sign in” to “New customer” and put “Existing session” on a separate path. Move the sign-in note aside to make room for a fallback, draw the alternate path and let a teammate name the customer action it restores. Present the before-and-after views from the same board. Every gesture should work with ordinary notes, connectors and presentation controls. Automatic impact propagation would need a separate engine capability and proof. Hosted teams can rehearse an incident together. Teams that keep internal topology private have a concrete reason to install.

**First test.** Give someone the slate with its labels visible and ask “Can an existing customer still open their work?” Watch whether they can answer from the drawing and add the missing recovery path unaided.

## First self-host example — Could we switch tools and still book a room?

On a launch about open-source replacements for team tools, one commenter named a precise migration blocker. Their customers rely on seeing free/busy time for people, rooms and resources when inviting colleagues. That is a better reason to bring colleagues to a whiteboard than a features checklist. [ExitPath, rank 11](https://news.ycombinator.com/item?id=50547980) · [Calendar example](https://news.ycombinator.com/item?id=50550336)

Put a real recurring team meeting on a sanitized example slate. Trace an organizer inviting a guest and reserving a shared room. Ask an operations teammate to mark where availability disappears and connect that step to a fallback. Save the pilot decision with the drawing. A team can use a hosted slate for a generic evaluation or install it to work with internal identity and integration details. The proposed example rehearses a switch. It requires no calendar integration.

## First sales-engineering example — Where does an uploaded customer file go?

The maker of the Voyager explainer posted deep links from the whole spacecraft down to an individual memory bit. Borrow that change of scale for a sales engineer explaining their own system to a buyer. [Voyager, rank 12](https://news.ycombinator.com/item?id=50548161) · [Maker's walkthrough](https://news.ycombinator.com/item?id=50549182)

Start at “Customer uploads a file.” Advance a native presentation into the processing boundary, then into the retained copy. Exit playback, let the engineer correct the retention note and reopen the same view. A buyer gets a walkthrough they can revisit. An operator can keep the detailed architecture on their own instance. Test whether the buyer can locate the retained copy without its author narrating.

## Founder and growth example — Where would our next ten customers come from?

The publisher of All About Berlin described the impact of changing search traffic and the uncertainty over continuing full-time. Other readers described why they personally prefer an immediate answer. Together these are a reason to test acquisition assumptions without attributing a universal loss percentage to startups. [Publisher discussion, rank 50](https://news.ycombinator.com/item?id=50542705) · [Publisher's follow-up](https://news.ycombinator.com/item?id=50543735) · [Reader perspective, rank 48](https://news.ycombinator.com/item?id=50540597)

A founder places ten sample customer notes beside the channel that brought them in. A teammate moves the search-dependent group aside and connects one direct channel to a small experiment. Present the original mix and the proposed experiment to a cofounder. Test whether the second person can explain the bet from the saved slate. Use aggregate counts for the hosted demonstration.

## Engineering workshop — Which evidence makes this change safe to ship?

A reader of an agent-assisted CI launch asked whether a faster workflow would still catch the bugs the old workflow caught. Another discussion surfaced how teams experience the review workload differently. [StarSling, rank 54](https://news.ycombinator.com/item?id=50536468) · [Reader's question](https://news.ycombinator.com/item?id=50540199) · [Code-review discussion, rank 70](https://news.ycombinator.com/item?id=50538303)

Give a reviewer two pieces of evidence on a slate, a quicker run and a known regression caught by the previous checks. Connect the regression to the test that must catch it before a change gets approved. Use the resulting picture to teach the next reviewer. Try this in the example library with sample data before giving it homepage space.

## Selection and proof

Start with the outage drawing for broad team use and the room-booking rehearsal for the install guide. Both give people a reason to disagree, rearrange an idea and leave with something another teammate can use. Keep the Voyager-inspired walkthrough as the first dynamic presentation candidate. In a fresh app session, recreate the advertised gesture through the public editor, save it, reopen it with a second participant and present the result. Record exactly which outcomes are manual and which the engine computes. Only advertise the outcomes that pass.
