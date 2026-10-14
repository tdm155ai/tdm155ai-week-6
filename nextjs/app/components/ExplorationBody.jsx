import { splitOptionalExercises } from "../../lib/explorations.mjs";
import Markdown from "./Markdown.jsx";

export default function ExplorationBody({ entry, print = false }) {
  const { body, exercises } = splitOptionalExercises(entry.content);
  return <>
    <article className="prose"><Markdown doc={{ ...entry, content: body }} print={print} /></article>
    {exercises && (print ? <section className="optional-exercises prose"><h2>Optional exercises</h2><p>Suggestions to try if useful for your project.</p><Markdown doc={{ ...entry, content: exercises }} print /></section> : <details className="optional-exercises"><summary>Optional exercises</summary><p>Suggestions to try if useful for your project.</p><div className="prose"><Markdown doc={{ ...entry, content: exercises }} /></div></details>)}
  </>;
}
