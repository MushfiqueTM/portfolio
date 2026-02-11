# Project Images

Place your project images in this folder.

## How to add images:

1. **Add your image files** to this `public/projects/` folder
   - Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`
   - Recommended size: 1200x800px or similar aspect ratio
   - Name them descriptively, e.g.:
     - `motorbike-dolly-1.jpg`
     - `motorbike-dolly-2.jpg`
     - `wextech-product-1.jpg`
     - etc.

2. **Update the project data** in `app/page.tsx`:
   - Find the project you want to add images to
   - Uncomment and update the `images` array
   - Use paths starting with `/projects/` (e.g., `/projects/motorbike-dolly-1.jpg`)

## Example:

```javascript
{
  title: "TGGS - Motorbike Dolly for Crash Testing",
  date: "2023",
  description: "...",
  highlights: [...],
  images: [
    "/projects/motorbike-dolly-1.jpg",
    "/projects/motorbike-dolly-2.jpg",
    "/projects/motorbike-dolly-3.jpg",
  ]
}
```

Images will automatically display in a responsive grid layout (1 column on mobile, 2 on tablet, 3 on desktop).
