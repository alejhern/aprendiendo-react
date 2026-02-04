import { Link } from './components/Link'
import { Router } from './components/Router'
import { Route } from './components/Route'
import { lazy, Suspense } from 'react'
import './App.css'

const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Home = lazy(() => import('./pages/Home'))
const NotFound = lazy(() => import('./pages/NotFound'))
const SearchPage = lazy(() => import('./pages/SearchPage'))

const appRoutes = [
  {
    path: '/search/:query',
    Component: SearchPage
  },
  {
    path: '/:lang/about',
    Component: About
  }
]

function App() {

  return (
    <>
      <h1>React Router</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <Suspense fallback={<div>Loading...</div>}>
        <Router routes={appRoutes} DefaultComponent={NotFound}>
          <Route path="/" Component={Home} />
          <Route path="/about" Component={About} />
          <Route path="/contact" Component={Contact} />
        </Router>
      </Suspense>
    </>
  )
}

export default App
