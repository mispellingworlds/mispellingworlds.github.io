type VimeoProps = {
  id: string;
};

/**
 * Lightweight Vimeo embed (replaces astro-embed's <Vimeo>). A simple
 * responsive 16:9 iframe with a black outline, matching the old lite-vimeo
 * styling in MarkdownPostLayout.astro.
 */
export default function Vimeo({ id }: VimeoProps) {
  return (
    <div className="relative my-10 aspect-video w-full outline outline-[5px] outline-ink first:mt-0">
      <iframe
        src={`https://player.vimeo.com/video/${id}`}
        title="Vimeo video"
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
