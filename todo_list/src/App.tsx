import './App.css'
import router from './routes'
import { RouterProvider, Route } from 'react-router-dom'

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
