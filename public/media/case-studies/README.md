# Case study media (planned)

Hero videos, posters, and scroll stills for the homepage work section and case study pages.

## Layout per slug

```
public/media/case-studies/{slug}/
  hero.mp4            # primary walkthrough (~1–2.5 MB)
  01-home.png         # optional still
  02-mid-scroll.png   # optional still
  hero.png            # cover image when no video
```

Register each file in `lib/case-media.ts` under `CASE_MEDIA_BY_SLUG`. The homepage modal gallery reads that list; missing files show placeholders per slide.

Slugs match flagship rows (e.g. `everest-finance`, `odoo-testing-toolkit`).

Do not commit raw `.mov` screen recordings. Compress with ffmpeg before adding here.
