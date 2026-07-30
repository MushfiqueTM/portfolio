# Project Images

Every image, logo, and PDF the site serves lives in this folder. Anything here is
copied to the site root as-is, so a file at `public/projects/foo.webp` is requested
as `/projects/foo.webp`.

## Adding images to an entry

1. **Drop the file in this folder.** Any bitmap format works as a source
   (`.jpg`, `.jpeg`, `.png`, `.JPG`, `.PNG`). Around 1200px on the long edge is
   plenty. Name it after the entry it belongs to, e.g. `motorbike-dolly-1.jpg`.

2. **Convert it to WebP** from the project root:

   ```bash
   npm run convert:webp:dry   # report what would be written
   npm run convert:webp       # write the .webp siblings
   ```

   This writes `foo.webp` next to `foo.jpg` and never modifies or deletes the
   original. Check the output looks right before referencing it.

3. **Reference the `.webp` in the data file** for the section you're adding to:

   | Section | File |
   | --- | --- |
   | Projects | `src/data/allProjects.json` |
   | Work Experience | `src/data/workExperience.json` |
   | CAD view (SOLIDWORKS) | `src/data/projects3D.json` |
   | Leadership and Design view | `src/data/leadership.json` |

   Paths start with `/projects/`:

   ```json
   {
     "title": "TGGS - Motorbike Dolly for Crash Testing",
     "date": "2023",
     "description": "...",
     "highlights": ["..."],
     "images": [
       "/projects/motorbike-dolly-1.webp",
       "/projects/motorbike-dolly-2.webp",
       "/projects/motorbike-dolly-3.webp"
     ]
   }
   ```

   In `workExperience.json`, images can sit on the company or on an individual
   entry in its `teams[]` array. Spaces in filenames must be percent-encoded as
   `%20` — prefer hyphens in new filenames to avoid this.

## Layout

By default images render in a grid: one column for a single image, two columns
otherwise. Clicking any image opens the lightbox.

For an entry with **exactly four** images, you can opt into a 3+1 layout — three
thumbnails in a row above one large hero image — by adding `imageLayout` to that
entry:

```json
{
  "title": "Redesigned a Table Fan",
  "date": "November 2022",
  "imageLayout": "3+1",
  "images": ["...", "...", "...", "..."]
}
```

The fourth image is the hero, so order the array accordingly and put your widest
shot last. With any other number of images the field is ignored and the grid is
used. Omit it (or set `"grid"`) for the default.

Both layouts are rendered by
[`src/components/ui/ProjectImageGrid.tsx`](../../src/components/ui/ProjectImageGrid.tsx),
which each section calls with its own sizing, placeholder, and animation settings.

## PDFs and certificates

Certificates are linked directly rather than being listed in a data file — see the
`categories` array at the top of
[`src/components/sections/Certifications.tsx`](../../src/components/sections/Certifications.tsx).
Drop the PDF or image here and add an entry with its `/projects/...` path.
