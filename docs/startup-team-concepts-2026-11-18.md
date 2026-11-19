# What would a startup put on a slate?

On 18 November 2026 at 20:10 UTC we took the first 120 submissions from the Hacker News public top-stories feed in its returned order. We read 81 top-level comments across 14 selected threads about running, building and selling software. Ranks below belong to that snapshot. This selection favors teams that publish or discuss technical work. It gives us situations worth testing. Customer interviews and observations of teams using Slatebox must establish adoption. Miro customer stories supply a separate comparison. [Public API](https://github.com/HackerNews/API#new-top-and-best-stories) · [Team adoption goal](team-adoption-goal.md)

## First homepage candidate — What breaks if sign-in goes down?

During an Apple services outage, a visitor reported that a store could neither process returns nor activate a phone. In a separate Codeberg discussion, people followed the recovery of the domain as access returned for different users. A single “down” label missed what people actually experienced. [Apple discussion, rank 71](https://news.ycombinator.com/item?id=50535238) · [Store report](https://news.ycombinator.com/item?id=50535589) · [Codeberg recovery, rank 117](https://news.ycombinator.com/item?id=50545046)

Give a founder, engineer and support lead one actual dependency drawing. Connect “Sign in” to “New customer” and put “Existing session” on a separate path. Move the sign-in note aside to make room for a fallback, draw the alternate path and let a teammate name the customer action it restores. Present the before-and-after views from the same board. Every gesture should work with ordinary notes, connectors and presentation controls. Automatic impact propagation would need a separate engine capability and proof. Hosted teams can rehearse an incident together. Teams that keep internal topology private have a concrete reason to install.

The implemented example has six editable notes and four directed connectors. The visitor can move either customer path and write the support response. Opening it in Slatebox preserves the drawing. A second editor changed the fallback and the owner reopened it during staging verification. [Use the example](https://slatebox.com/assets/product/sign-in-outage.html) · [Follow the guide](https://docs.slatebox.com/examples/sign-in-outage/)

**First test with a prospective team.** Give someone the slate with its labels visible and ask “Can an existing customer still open their work?” Watch whether they can answer from the drawing and add the missing recovery path unaided.

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

A second look at the first 120 top stories at 20:53 UTC surfaced a question worth taking into a buyer walkthrough. A developer considering Mastra Factory could not tell from the docs whether an agent acts as itself or under the engineer’s GitHub identity. In the Maritime launch, a prospective user asked which credentials their own customers would supply. These are two distinct questions about whose account is involved at a particular step. [Mastra identity question](https://news.ycombinator.com/item?id=50551956) · [Maritime customer question](https://news.ycombinator.com/item?id=50549551)

The team handoff applies that question to a fictional refund. Someone can replace the opening question, carry it into a private slate and ask Slatebox to add two possible decisions. A teammate can trace the paths on the reopened map. The resulting artifact records who the team says can approve a refund. [Start a team handoff](https://slatebox.com/use-cases/creative-handoffs/)

**Candidate for a second buyer walkthrough.** Put a teammate, an agent and a customer workspace on an ordinary slate. Ask the buyer to place “Whose account approves this?” on the connection they want explained. The engineer adds the actual answer and walks the buyer through it. The drawing records the team’s explanation. The visitor gets to ask a question the team did not script. Test whether a second engineer can answer it from the reopened drawing before putting this on the product page.

Start with the outage drawing for broad team use and the room-booking rehearsal for the install guide. Both give people a reason to disagree, rearrange an idea and leave with something another teammate can use. Keep the Voyager-inspired walkthrough as the first dynamic presentation candidate. In a fresh app session, recreate the advertised gesture through the public editor, save it, reopen it with a second participant and present the result. Record exactly which outcomes are manual and which the engine computes. Only advertise the outcomes that pass.

## Who reviews a backfill when counts differ?

At 22:15 UTC we reread the first 100 stories from the public top-stories API and sampled seven top-level comments from each of three threads. In the code-review discussion, one reviewer described spending time explaining overcomplicated changes to teammates. Another distinguished finding issues from understanding the change. In the Maritime launch, a reader asked when the agent should bring a decision back to a person. Those comments suggest a handoff worth trying. They do not establish demand for Slatebox. [Reviewer's account](https://news.ycombinator.com/item?id=50544119) · [Review for understanding](https://news.ycombinator.com/item?id=50543695) · [Agent-to-person handoff](https://news.ycombinator.com/item?id=50550813)

The [backfill review example](https://docs.slatebox.com/examples/review-a-backfill/) gives an engineer an explicit three-station route. A second engineer can add the repair path and record what to check if a record is missing. The database supplies the counts. The agent creates the private slate under its operator's account, and the reviewer decides what the map says. Ask an engineer who missed the discussion to find the repair instruction in the saved slate.

## Can a second teammate finish the evaluation?

In a fresh sample of 75 top stories shortly after 00:00 UTC on November 19, ExitPath ranked 14th. We read the first 15 top-level comments returned by the public API. One operator described the time it took to get open-source alternatives running and then learn their interfaces. Another described the work of withdrawing a departing employee’s access across multiple tools. These are observations from a migration discussion. [Operator experience](https://news.ycombinator.com/item?id=50552690) · [Account lifecycle](https://news.ycombinator.com/item?id=50552281)

For the next startup trial, give one engineer the Docker guide and another the backfill decision. Ask the first to identify the kit for their host from its agent prompt. Ask the second to find and follow the repair path on the resulting slate, then reopen the saved decision. Record elapsed time and where each person asked for help. Verify withdrawal of a shared review link separately from offboarding a team member. Each has a different effect on access.
