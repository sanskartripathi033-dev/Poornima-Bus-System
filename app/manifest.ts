import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PU-BusLink Smart System',
    short_name: 'PU-BusLink',
    description: 'Poornima University Smart Bus System for live tracking and digital passes.',
    start_url: '/login',
    display: 'standalone',
    background_color: '#FAFAFA',
    theme_color: '#004892',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
