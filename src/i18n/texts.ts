import type { CheckId } from '../lib/checks'
import type { Snippet } from '../lib/types'

export type Lang = 'en' | 'es'

const en = {
  'app.tagline': 'See how your page looks when someone shares it, before anyone does.',
  'app.share': 'Copy share link',
  'app.shared': 'Link copied',
  'app.reset': 'Start again',
  'app.privacy': 'Everything stays in your browser. Nothing you type is sent anywhere.',
  'app.madeBy': 'Made by',

  'editor.heading': 'Your page',
  'field.url': 'Page URL',
  'field.title': 'Title',
  'field.titleHint': 'The <title> tag. Also used as the og:title.',
  'field.description': 'Description',
  'field.descriptionHint': 'The meta description. Google may still pick its own text.',
  'field.siteName': 'Site name',
  'field.twitterSite': 'X account',
  'field.optional': 'optional',
  'counter.chars': '{n} / {max} characters',
  'counter.px': '{n} / {max} px',

  'image.label': 'Image',
  'image.placeholder': 'https://... (or upload a file)',
  'image.upload': 'Upload',
  'image.example': 'Use example',
  'image.remove': 'Remove',
  'image.drop': 'Drop an image here',
  'image.loading': 'Loading image...',
  'image.size': '{w} × {h} px',
  'image.uploaded': 'Uploaded: {name}',

  'checks.heading': 'Checks',
  'checks.allGood': 'All good',
  'checks.errors': '{n} to fix',
  'checks.warnings': '{n} to review',

  'previews.heading': 'Previews',
  'previews.note': 'Approximate. Platforms change their layouts now and then, and they cache previews, so a page you already shared may take a while to update.',
  'preview.googleDesktop': 'Google · desktop',
  'preview.googleMobile': 'Google · mobile',
  'preview.whatsapp': 'WhatsApp',
  'preview.linkedin': 'LinkedIn',
  'preview.x': 'X',
  'preview.facebook': 'Facebook',
  'preview.postText': 'Have a look at this 👇',
  'preview.yourName': 'Your name',
  'preview.time': '1h',
  'preview.from': 'From {domain}',
  'preview.noTitle': 'Untitled page',

  'code.heading': 'Meta tags',
  'code.hint': 'Paste these inside the <head> of your page.',
  'code.copy': 'Copy',
  'code.copied': 'Copied',
  'code.uploadPlaceholder': 'https://YOUR-SITE/path-to-your-image.jpg',

  'check.url.empty': 'Add the page URL.',
  'check.url.invalid': "That doesn't look like a web address.",
  'check.url.noProtocol': 'Add https:// at the start. Platforms need the full URL.',
  'check.url.http': "The URL isn't HTTPS. Some browsers and apps flag it as not secure.",
  'check.url.ok': 'The URL looks right.',
  'check.title.empty': 'Add a title. Without one, platforms show the bare URL.',
  'check.title.short': 'The title is short ({n} characters). Aim for 30–60 to use the space you get.',
  'check.title.long': 'Google will probably cut the title after about {kept} of its {n} characters.',
  'check.title.ok': 'The title fits on Google ({n} characters).',
  'check.description.empty': 'Add a description. Otherwise Google picks some text from the page.',
  'check.description.short': 'The description is short ({n} characters). 70–160 works best.',
  'check.description.long': 'Google will probably cut the description after about {kept} of its {n} characters.',
  'check.description.ok': 'The description fits ({n} characters).',
  'check.image.none': 'No image. Most platforms will show a small or empty card.',
  'check.image.error': "The image couldn't be loaded. Check the URL is public and correct.",
  'check.image.tiny': 'The image is too small ({w}×{h}). Platforms ignore images under 200×200.',
  'check.image.small': 'Small image ({w}×{h}): shown as a thumbnail, not a big card. Use at least 1200×630.',
  'check.image.ratio': 'The image is {ratio}:1. Big cards use 1.91:1 (1200×630), so it will be cropped.',
  'check.image.heavy': 'The file is {mb} MB. X rejects images over 5 MB; under 1 MB is safest.',
  'check.image.upload': 'Uploaded images only work here. Put the file on your site and use its URL in the tags.',
  'check.image.ok': 'The image is {w}×{h}: a good size for big cards.',
}

export type TextKey = keyof typeof en

const es: Record<TextKey, string> = {
  'app.tagline': 'Mira cómo se verá tu página cuando alguien la comparta, antes de que nadie lo haga.',
  'app.share': 'Copiar enlace',
  'app.shared': 'Enlace copiado',
  'app.reset': 'Empezar de nuevo',
  'app.privacy': 'Todo se queda en tu navegador. Nada de lo que escribes se envía a ningún sitio.',
  'app.madeBy': 'Hecho por',

  'editor.heading': 'Tu página',
  'field.url': 'URL de la página',
  'field.title': 'Título',
  'field.titleHint': 'La etiqueta <title>. También se usa como og:title.',
  'field.description': 'Descripción',
  'field.descriptionHint': 'La meta description. Google puede elegir otro texto igualmente.',
  'field.siteName': 'Nombre del sitio',
  'field.twitterSite': 'Cuenta de X',
  'field.optional': 'opcional',
  'counter.chars': '{n} / {max} caracteres',
  'counter.px': '{n} / {max} px',

  'image.label': 'Imagen',
  'image.placeholder': 'https://... (o sube un archivo)',
  'image.upload': 'Subir',
  'image.example': 'Usar ejemplo',
  'image.remove': 'Quitar',
  'image.drop': 'Suelta una imagen aquí',
  'image.loading': 'Cargando imagen...',
  'image.size': '{w} × {h} px',
  'image.uploaded': 'Subida: {name}',

  'checks.heading': 'Comprobaciones',
  'checks.allGood': 'Todo bien',
  'checks.errors': '{n} por corregir',
  'checks.warnings': '{n} por revisar',

  'previews.heading': 'Vistas previas',
  'previews.note': 'Aproximadas. Las plataformas cambian su diseño de vez en cuando y guardan las vistas previas en caché, así que una página ya compartida puede tardar en actualizarse.',
  'preview.googleDesktop': 'Google · ordenador',
  'preview.googleMobile': 'Google · móvil',
  'preview.whatsapp': 'WhatsApp',
  'preview.linkedin': 'LinkedIn',
  'preview.x': 'X',
  'preview.facebook': 'Facebook',
  'preview.postText': 'Echadle un vistazo a esto 👇',
  'preview.yourName': 'Tu nombre',
  'preview.time': '1 h',
  'preview.from': 'De {domain}',
  'preview.noTitle': 'Página sin título',

  'code.heading': 'Etiquetas meta',
  'code.hint': 'Pégalas dentro del <head> de tu página.',
  'code.copy': 'Copiar',
  'code.copied': 'Copiado',
  'code.uploadPlaceholder': 'https://TU-SITIO/ruta-de-tu-imagen.jpg',

  'check.url.empty': 'Añade la URL de la página.',
  'check.url.invalid': 'Eso no parece una dirección web.',
  'check.url.noProtocol': 'Añade https:// al principio. Las plataformas necesitan la URL completa.',
  'check.url.http': 'La URL no es HTTPS. Algunos navegadores y apps la marcan como no segura.',
  'check.url.ok': 'La URL está bien.',
  'check.title.empty': 'Añade un título. Sin él, las plataformas muestran la URL tal cual.',
  'check.title.short': 'El título es corto ({n} caracteres). Entre 30 y 60 aprovecha el espacio.',
  'check.title.long': 'Google probablemente cortará el título hacia el carácter {kept} de {n}.',
  'check.title.ok': 'El título cabe en Google ({n} caracteres).',
  'check.description.empty': 'Añade una descripción. Si no, Google elegirá un texto de la página.',
  'check.description.short': 'La descripción es corta ({n} caracteres). Lo ideal es entre 70 y 160.',
  'check.description.long': 'Google probablemente cortará la descripción hacia el carácter {kept} de {n}.',
  'check.description.ok': 'La descripción cabe ({n} caracteres).',
  'check.image.none': 'Sin imagen. La mayoría de plataformas mostrarán una tarjeta pequeña o vacía.',
  'check.image.error': 'No se pudo cargar la imagen. Comprueba que la URL es pública y correcta.',
  'check.image.tiny': 'La imagen es demasiado pequeña ({w}×{h}). Las plataformas ignoran las de menos de 200×200.',
  'check.image.small': 'Imagen pequeña ({w}×{h}): se verá en miniatura, no en tarjeta grande. Usa al menos 1200×630.',
  'check.image.ratio': 'La imagen es {ratio}:1. Las tarjetas grandes usan 1,91:1 (1200×630), así que se recortará.',
  'check.image.heavy': 'El archivo pesa {mb} MB. X rechaza imágenes de más de 5 MB; por debajo de 1 MB es lo más seguro.',
  'check.image.upload': 'Las imágenes subidas solo funcionan aquí. Sube el archivo a tu web y usa su URL en las etiquetas.',
  'check.image.ok': 'La imagen mide {w}×{h}: buen tamaño para tarjetas grandes.',
}

export const TEXTS: Record<Lang, Record<TextKey, string>> = { en, es }

export const checkKey = (id: CheckId) => `check.${id}` as TextKey

/** The demo page shown on first load, in each language. */
export function demoSnippet(lang: Lang, origin: string): Snippet {
  const imageUrl = `${origin}/example.jpg`
  return lang === 'es'
    ? {
        url: 'https://www.example.com/blog/masa-madre-para-principiantes',
        title: 'Masa madre para principiantes: tu primer pan en 24 horas | Example Bakery',
        description:
          'Una guía paso a paso para hornear tu primer pan de masa madre en casa: cómo alimentar la masa, darle forma y conseguir una corteza crujiente y dorada.',
        siteName: 'Example Bakery',
        imageUrl,
        twitterSite: '@examplebakery',
      }
    : {
        url: 'https://www.example.com/blog/sourdough-for-beginners',
        title: 'Sourdough for Beginners: Bake Your First Loaf in 24 Hours | Example Bakery',
        description:
          'A friendly, step-by-step guide to your first sourdough loaf at home: feeding the starter, shaping the dough and baking it with a crisp, golden crust.',
        siteName: 'Example Bakery',
        imageUrl,
        twitterSite: '@examplebakery',
      }
}
