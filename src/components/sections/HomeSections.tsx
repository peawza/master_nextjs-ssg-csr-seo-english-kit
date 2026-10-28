import Link from 'next/link';
import { homeContent } from '@/content/home';
import { siteConfig } from '@/config/site';
import styles from '@/styles/sections.module.css';

export function HomeSections() {
  return (
    <>
      <section id="about" className={styles.section} aria-labelledby="about-title">
        <div className="container">
          <p className={styles.eyebrow}>About</p>
          <h2 id="about-title">A thoughtful approach to the web</h2>
          <p className={styles.bodyCopy}>We design for clarity and build for maintainability. This section is sample content until the business details are verified.</p>
        </div>
      </section>
      <section id="services" className={styles.sectionAlt} aria-labelledby="services-title">
        <div className="container">
          <p className={styles.eyebrow}>Services</p>
          <h2 id="services-title">What we do</h2>
          <div className={styles.cards}>
            {homeContent.services.map((service) => (
              <article className={styles.card} key={service.title}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
          <Link className={styles.textLink} href="/services/">See all services</Link>
        </div>
      </section>
      <section id="work" className={styles.section} aria-labelledby="work-title">
        <div className="container">
          <p className={styles.eyebrow}>Work</p>
          <h2 id="work-title">Selected work</h2>
          <p className={styles.bodyCopy}>Replace this placeholder with real projects, outcomes and properly licensed imagery. Do not invent case studies.</p>
        </div>
      </section>
      <section id="process" className={styles.sectionAlt} aria-labelledby="process-title">
        <div className="container">
          <p className={styles.eyebrow}>Process</p>
          <h2 id="process-title">How we work</h2>
          <ol className={styles.steps}>
            {homeContent.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </div>
      </section>
      <section id="faq" className={styles.section} aria-labelledby="faq-title">
        <div className="container">
          <p className={styles.eyebrow}>FAQ</p>
          <h2 id="faq-title">Common questions</h2>
          <div className={styles.faqs}>
            {homeContent.questions.map((item) => (
              <article key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="contact" className={styles.sectionAlt} aria-labelledby="contact-title">
        <div className="container">
          <p className={styles.eyebrow}>Contact</p>
          <h2 id="contact-title">Let’s build something useful</h2>
          <p className={styles.bodyCopy}>Reach out to discuss a project.</p>
          <a className={styles.primaryAction} href={`mailto:${siteConfig.email}`}>Contact us by email</a>
        </div>
      </section>
    </>
  );
}
