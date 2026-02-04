import { EVENTS } from '../utils/const.js'

function navigate(href) {
  window.history.pushState({}, '', href)
  const navEvent = new PopStateEvent(EVENTS.POPSTATE)
  window.dispatchEvent(navEvent)
}

export function Link({ target, to, ...props }) {
  const handleClick = (e) => {
    const isMainEvent = e.button === 0
    const isModifiedEvent = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
    if (!isMainEvent || isModifiedEvent) {
      return
    }
    const isManageableEvent = target === '_self' && (to.startsWith('/') || to.startsWith(window.location.origin))
    if (isManageableEvent) {
      return
    } 
    e.preventDefault()
    navigate(to)
  }
  return <a href={to} target={target} onClick={handleClick} {...props} />
}