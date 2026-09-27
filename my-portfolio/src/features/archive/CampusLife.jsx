import { CAMPUS_BUILDS, CAMPUS_MOMENTS, CAMPUS_STAGE, COURSE_LEVELS, SUBJECTS } from "../../data/campus";

/* Campus Life: the university tile's overlay. A record, not a résumé — the
   coursework and grades stay quiet (plain text, small stats) while the
   people, builds and small moments carry the section. */
export default function CampusLife() {
  return (
    <div className="campus">
      <section className="campus__block">
        <p className="campus__eyebrow mono">{CAMPUS_STAGE.eyebrow}</p>
        <h3 className="campus__stage-heading">{CAMPUS_STAGE.heading}</h3>
        {CAMPUS_STAGE.paragraphs.map((paragraph) => (
          <p key={paragraph} className="body-p campus__p">{paragraph}</p>
        ))}
        <dl className="campus__stats">
          <div>
            <dt>Credits completed</dt>
            <dd>{CAMPUS_STAGE.credits}</dd>
          </div>
          <div>
            <dt>CGPA</dt>
            <dd>{CAMPUS_STAGE.cgpa}</dd>
          </div>
        </dl>
      </section>

      <section className="campus__block">
        <h3 className="campus__heading">The coursework</h3>
        <p className="body-p campus__p">A record of what I&rsquo;ve been learning.</p>
        <div className="campus__levels">
          {COURSE_LEVELS.map(({ label, courses }) => (
            <div key={label} className="campus__level">
              <span className="campus__level-label">{label}</span>
              <p className="campus__courses">{courses.join(" · ")}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="campus__block">
        <h3 className="campus__heading">The subjects that stayed</h3>
        <ul className="campus__subjects">
          {SUBJECTS.map(({ code, name, note }) => (
            <li key={code} className="campus__subject">
              <span className="campus__subject-name">{code} — {name}</span>
              <p className="campus__subject-note">{note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="campus__block">
        <h3 className="campus__heading">The builds</h3>
        <p className="body-p campus__p">University projects became some of the most useful things I&rsquo;ve worked on.</p>
        <ul className="campus__builds">
          {CAMPUS_BUILDS.map(({ name, note }) => (
            <li key={name} className="campus__build">
              <span className="campus__build-name">{name}</span>
              <span className="campus__build-note">{note}</span>
            </li>
          ))}
        </ul>
        <p className="campus__aside">
          Not everything started as a passion project. Sometimes the brief came first. The interesting part was
          figuring out what to do with it.
        </p>
      </section>

      <section className="campus__block">
        <h3 className="campus__heading">The people</h3>
        <p className="body-p campus__p">Some of the best lessons came from building with other people.</p>
        <p className="body-p campus__p">Different ideas, different working styles, one codebase.</p>
        <p className="body-p campus__p">
          Learning when to lead, when to listen, and when to stop arguing about the implementation and just ship it.
        </p>
      </section>

      <section className="campus__block">
        <h3 className="campus__heading">Outside the classroom</h3>
        <p className="body-p campus__p">University has also been a place to try things that weren&rsquo;t in the syllabus.</p>
        <p className="campus__staccato">Hackathons. Presentations. Events. Logistics. Leadership.</p>
        <p className="body-p campus__p">
          From organising people and inventory to presenting software projects, the work outside the classroom has
          shaped how I approach the work inside it.
        </p>
      </section>

      <section className="campus__block">
        <h3 className="campus__heading">The campus archive</h3>
        <p className="body-p campus__p">A few things that don&rsquo;t belong in a résumé.</p>
        <ul className="campus__log">
          {CAMPUS_MOMENTS.map(({ time, label }) => (
            <li key={time} className="campus__moment">
              <span className="campus__moment-time mono">{time}</span>
              <span className="campus__moment-node" aria-hidden="true" />
              <span className="campus__moment-label">{label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="campus__block campus__block--closing">
        <h3 className="campus__heading">What I&rsquo;m taking with me</h3>
        <p className="body-p campus__p">Software engineering has taught me more than how to write software.</p>
        <p className="body-p campus__p">
          It has taught me how to work with people, deal with incomplete information, make decisions with limited
          time, and keep building when the first version isn&rsquo;t very good.
        </p>
        <p className="campus__coda">There is still a lot I don&rsquo;t know.</p>
        <p className="campus__coda">That&rsquo;s probably the point.</p>
        <p className="campus__colophon mono">Universiti Malaya · Software Engineering · 2024—</p>
      </section>
    </div>
  );
}
