import { useEffect, useState, Children } from 'react'
import { EVENTS } from '../utils/const.js'
import { getCurrentPath } from '../utils/getCurrentPath.js'
import { match } from 'path-to-regexp'

export function Router ({ children, routes = [], DefaultComponent = null }) {
  const [currentPage, setCurrentPage] = useState(getCurrentPath())

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPage(window.location.pathname || '/')
    }

    window.addEventListener(EVENTS.POPSTATE, onLocationChange)
    return () => {
      window.removeEventListener(EVENTS.POPSTATE, onLocationChange)
    }
  }, [])

  let routerParams = {}

  const childRoutes = Children.map(children, ({ props, type }) => {
    const { name } = type
    const isRoute = name === 'Route'
    return isRoute ? props : null
  })

  routes = routes.concat(childRoutes).filter(Boolean)

  const Page = routes.find(({ path }) => {
    if (path === currentPage) return true
    const routeMatcher = match(path, { decode: decodeURIComponent })
    const matched = routeMatcher(currentPage)
    if (!matched) return false
    Object.assign(routerParams, matched.params)
    return true
  })?.Component

  return Page ? <Page params={routerParams} /> : DefaultComponent ? <DefaultComponent /> : null
}
