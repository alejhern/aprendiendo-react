import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { Router } from './components/Router'
import { Route } from './components/Route'
import { Link } from './components/Link'

// Páginas de prueba
const Home = () => <h2>Home Page</h2>
const About = () => <h2>About Page</h2>
const Contact = () => <h2>Contact Page</h2>
const NotFound = () => <h2>404 - Not Found</h2>
const SearchPage = ({ params }) => <h2>Search Results for: {params.query}</h2>

describe('Router', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders Home page by default', () => {
    window.history.pushState({}, '', '/')
    render(
      <Router
        routes={[
          { path: '/', Component: Home },
          { path: '/about', Component: About },
          { path: '/contact', Component: Contact },
          { path: '/search/:query', Component: SearchPage },
        ]}
        DefaultComponent={NotFound}
      />
    )
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Home Page')
  })

  it('renders About page', () => {
    window.history.pushState({}, '', '/about')
    render(
      <Router
        routes={[
          { path: '/', Component: Home },
          { path: '/about', Component: About },
          { path: '/contact', Component: Contact },
        ]}
        DefaultComponent={NotFound}
      />
    )
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('About Page')
  })

  it('renders Contact page', () => {
    window.history.pushState({}, '', '/contact')
    render(
      <Router
        routes={[
          { path: '/', Component: Home },
          { path: '/about', Component: About },
          { path: '/contact', Component: Contact },
        ]}
        DefaultComponent={NotFound}
      />
    )
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Contact Page')
  })

  it('renders NotFound for unknown routes', () => {
    window.history.pushState({}, '', '/unknown')
    render(
      <Router
        routes={[
          { path: '/', Component: Home },
          { path: '/about', Component: About },
          { path: '/contact', Component: Contact },
        ]}
        DefaultComponent={NotFound}
      />
    )
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('404 - Not Found')
  })

  it('renders SearchPage with params', () => {
    window.history.pushState({}, '', '/search/react')
    render(
      <Router
        routes={[
          { path: '/search/:query', Component: SearchPage },
        ]}
        DefaultComponent={NotFound}
      />
    )
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Search Results for: react')
  })

  it('navigates using Links', async () => {
    window.history.pushState({}, '', '/')
    render(
      <Router>
        <Route path='/' Component={() => (
          <>
            <h2>Home Page</h2>
            <Link to='/about'>Go to About</Link>
          </>
        )} />
        <Route path='/about' Component={() => <h2>About Page</h2>} />
      </Router>
    )

    fireEvent.click(screen.getByText(/Go to About/))
    const aboutTitle = await screen.findByText('About Page')
    expect(aboutTitle).toBeTruthy()
  })
})
