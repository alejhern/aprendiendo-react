import { useMouse } from './hooks/useMouse'
import './App.css'

function App() {
  const { enable, toggleEnable, followerRef } = useMouse()
  return (
    <>
      <h3>Proyecto Mouse Follower</h3>
      <button onClick={toggleEnable}>
        {enable ? 'Desactivar' : 'Activar'} seguidor
      </button>

      {enable && <div ref={followerRef} className="follower" />}
    </>
  )
}

export default App
