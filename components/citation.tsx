import type { ReactNode } from 'react';

type CiteProps = {
  /** Reference number(s), matching the 1-based order of <References items>. */
  n: number | number[];
};

/**
 * Inline academic-style citation marker: renders [1] (or [1][2]) as a
 * superscript link down to the matching entry in <References>. The marker also
 * carries an id so the reference list can link back up to it.
 */
export function Cite({ n }: CiteProps) {
  const numbers = Array.isArray(n) ? n : [n];

  return (
    // align-super instead of <sup>'s default vertical-align so the smaller
    // text sits on the cap line without stretching the paragraph's leading.
    <sup className="ml-[0.1em] whitespace-nowrap align-super text-[0.6em] leading-none [hyphens:none]">
      {numbers.map((num) => (
        <a
          key={num}
          id={`cite-${num}`}
          href={`#ref-${num}`}
          className="text-grey-link no-underline"
          aria-label={`reference ${num}`}
        >
          [{num}]
        </a>
      ))}
    </sup>
  );
}

type Reference = {
  /** Destination of the citation. */
  url: string;
  /** Human-readable name; falls back to the bare url when omitted. */
  title?: string;
  /** Optional trailing note (author, publication, date…). */
  note?: ReactNode;
};

type ReferencesProps = {
  items: Reference[];
  /** Optional small grey heading above the list; omitted by default. */
  label?: string;
};

/**
 * The numbered reference list that closes a post. Entry i gets id ref-{i+1},
 * which is what <Cite n={i + 1}> points at; the ↑ at the end of each entry
 * jumps back to the marker in the text.
 */
export function References({ items, label }: ReferencesProps) {
  return (
    // .text-content justifies and hyphenates its children — references are a
    // list, so unset both and keep them left-aligned.
    <section className="mt-16 text-left text-[1.05rem] leading-[1.4] [hyphens:none] md:text-[1.15rem]">
      {label ? (
        <div className="mb-3 border-t border-grey-meta pt-3 font-google text-grey-nav">
          {label}
        </div>
      ) : null}

      <ol className="m-0 list-none p-0">
        {items.map((item, i) => {
          const num = i + 1;
          return (
            <li
              key={item.url}
              id={`ref-${num}`}
              // scroll-mt keeps the entry off the very top edge when jumped to;
              // :target styling lives in globals.css.
              className="reference-item mb-3 scroll-mt-24 break-words"
            >
              <span className="mr-2 text-grey-nav">[{num}]</span>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-grey-link underline decoration-grey-meta underline-offset-2"
              >
                {item.title ?? item.url}
              </a>
              {item.note ? <span className="text-grey-nav"> — {item.note}</span> : null}
              <a
                href={`#cite-${num}`}
                className="ml-2 text-grey-meta no-underline"
                aria-label={`back to citation ${num}`}
              >
                ↑
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
