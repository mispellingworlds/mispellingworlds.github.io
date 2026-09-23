/**
 * A separator drawn as two bars with a gap down the middle: the halves flex
 * to fill whatever the gap leaves, so the break stays centred at any width.
 * A div with role=separator rather than an <hr>, since one rule made of two
 * pieces is still one rule.
 */
export default function Rule() {
  return (
    <div role="separator" className="flex w-full items-center gap-[8%]">
      <span className="h-0.5 flex-1 bg-ink" />
      <span className="h-0.5 flex-1 bg-ink" />
    </div>
  );
}
