const fonts = ['Azeret Mono'];
const encodedFonts = fonts.map(font => 'family=' + font.replaceAll(' ', '+')).join('&');

export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          href: `https://fonts.googleapis.com/css2?${encodedFonts}&display=swap`,
          rel: 'stylesheet'
        }
      ]
    }
  },
  css: [
    '@/assets/css/global.css'
  ]
});
