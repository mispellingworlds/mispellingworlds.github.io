type InscriptionProps = {
  /** Original inscription (italian/latin). Line breaks are preserved. */
  it: string;
  /** English translation, shown in the right column in grey. */
  en: string;
};

/**
 * Two-column inscription block for posts: original text on the left,
 * translation on the right. Overrides .text-content's justify/hyphens so
 * verse lines stay centered and unbroken.
 */
export default function Inscription({ it, en }: InscriptionProps) {
  return (
    <div className="my-8 grid grid-cols-1 items-center gap-x-4 gap-y-4 text-[1.4rem] [hyphens:none] max-md:text-[1.1rem] md:grid-cols-2 md:gap-y-0">
      <div className="whitespace-pre-line text-center">{it}</div>
      <div className="whitespace-pre-line text-center text-grey-link">{en}</div>
    </div>
  );
}
