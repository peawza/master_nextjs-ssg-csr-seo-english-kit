import { StudyImage } from '@/components/ui/StudyImage';
import { Icon } from '@/components/ui/Icon';
import { media, suites } from '@/content/villa';
import styles from '@/styles/villa.module.css';

export function VillaSections() {
  return (
    <>
      <section id="about" tabIndex={-1} className={styles.introduction}>
        <p className={styles.label}>The art of simply being</p>
        <h2>Some places ask you to do more.<br />This one invites you to <em>just be.</em></h2>
        <p>Imagine a house by the water. Shutters open to the morning, a garden that takes the long way home, a table with room for one more. Welcome to Villa Luma, a daydream of lakeside living.</p>
        <span className={styles.ornament}><Icon name="ornament" /></span>
      </section>
      <section id="seasons" tabIndex={-1} className={styles.section}>
        <div className={styles.editorial} data-reveal>
          <StudyImage image={media.lake} className={styles.landscape} />
          <div className={styles.prose}><p className={styles.label}>01 / Through the seasons</p><h2>A different light.<br /><em>The same magic.</em></h2><p>Spring arrives in a thousand shades of green. Summer lingers over the water. Autumn brings gold to the hills, and winter makes room for quiet. There is no perfect season for a daydream. There is only yours.</p><a className={styles.textLink} href="#seasonal-notes">Follow the seasons <span><Icon name="arrowUpRight" /></span></a></div>
        </div>
        <div id="seasonal-notes" tabIndex={-1} className={styles.seasonal}>
          <article data-reveal><StudyImage image={media.dining} className={styles.portrait} /><p className={styles.label}>At the table</p><h3>A taste of the unhurried</h3><p>Fresh bread, the scent of herbs, something delicious passed from hand to hand. Our imagined table celebrates the pleasure of taking your time.</p></article>
          <article data-reveal><StudyImage image={media.garden} className={styles.landscape} /><p className={styles.label}>Out in the green</p><h3>Let the afternoon find you</h3><p>Follow a winding path beneath the trees. Find a patch of sunlight. Let the best part of the day be the part you never planned.</p></article>
        </div>
      </section>
      <section id="suites" tabIndex={-1} className={`${styles.section} ${styles.suites}`}>
        <div className={styles.sectionTitle}><p className={styles.label}>02 / A place to stay</p><h2>Find your own<br /><em>little world.</em></h2><p>Three imagined ways to settle in.<br />One beautiful reason to stay a while.</p></div>
        <div className={styles.suiteGrid}>{suites.map((suite, index) => <article key={suite.title} data-reveal><StudyImage image={suite.image} className={styles.suiteImage} sizes="(max-width: 767px) 100vw, 33vw" /><div className={styles.suiteHeading}><h3>{suite.title}</h3><span className={styles.label}>0{index + 1}</span></div><p className={styles.suiteNote}>{suite.note}</p><p>{suite.description}</p></article>)}</div>
      </section>
      <section id="stories" tabIndex={-1} className={styles.story}>
        <StudyImage image={media.lake} sizes="100vw" />
        <div className={styles.storyText}><p className={styles.label}>03 / Little stories</p><h2>The lake keeps<br /><em>its own time.</em></h2><p>A boat slips out of view. Light moves across the hillside. In this imagined moment, nothing needs to happen for everything to feel different.</p><a className={styles.lightLink} href="#journal">A page from our journal <Icon name="arrowUpRight" /></a></div>
      </section>
      <section id="journal" tabIndex={-1} className={styles.section}>
        <div className={`${styles.editorial} ${styles.journal}`} data-reveal><div className={styles.prose}><p className={styles.label}>04 / The journal</p><h2>Collected moments.<br /><em>Kept close.</em></h2><p>A room filled with afternoon light. A conversation that wanders past midnight. The first cool swim of the summer. This is a journal of small things, and the space they leave in our lives.</p><p>Turn the imaginary page. Leave a little room for a memory of your own.</p></div><div className={styles.journalFrame}><StudyImage image={media.terrace} className={styles.portrait} /><span className={styles.journalCaption}>Notes on a slower life — Volume 01</span></div></div>
      </section>
      <section id="places" tabIndex={-1} className={`${styles.section} ${styles.places}`}>
        <div className={styles.sectionTitle}><p className={styles.label}>05 / Beyond the garden</p><h2>A world of<br /><em>quiet discoveries.</em></h2></div>
        <article className={styles.editorial} data-reveal><StudyImage image={media.garden} className={styles.landscape} /><div className={styles.prose}><p className={styles.label}>An imagined woodland retreat</p><h3>The Green House</h3><p>A companion to our lakeside daydream: a house tucked beneath the trees, where the only appointment is with the afternoon sun.</p></div></article>
        <article className={`${styles.editorial} ${styles.reverse}`} data-reveal><StudyImage image={media.dining} className={styles.landscape} /><div className={styles.prose}><p className={styles.label}>An imagined gathering place</p><h3>Casa della Luce</h3><p>A place for shared tables and bright ideas. A fictional collection of spaces made for art, good food and the pleasure of being together.</p></div></article>
      </section>
    </>
  );
}
