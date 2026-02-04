import { Link } from '../components/Link'

const i18n = {
  en: {
    title: "About Page",
    description:
      "This is the about page of our simple React Router implementation.",
    explore: "Feel free to explore the other pages using the navigation links.",
    homeLink: "Go to Home",
  },
  es: {
    title: "Página Acerca de",
    description:
      "Esta es la página acerca de nuestra simple implementación de React Router.",
    explore:
      "Siéntete libre de explorar las otras páginas usando los enlaces de navegación.",
    homeLink: "Ir a Inicio",
  },
}

const useLanguage = (lang) => {
  return i18n[lang] || i18n.en
}

export default function About({ params }) {
  const about = useLanguage(params.lang || 'es')
  return (
    <>
      <h2>{about.title}</h2>
      <p>{about.description}</p>
      <p>{about.explore}</p>
      <Link to="/">{about.homeLink}</Link>
    </>
  )
}