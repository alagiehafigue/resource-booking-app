// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Intropage from './Pages/Intropage'
import UserHomepage from './Pages/userHomepage'
import AuthStack from '../Stacks/AuthStack'
import AdminStack from '../Stacks/AdminStack'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intropage />} />
        <Route path="/login" element={<AuthStack />} />
        <Route path="/signup" element={<AuthStack />} />
        <Route path="/home" element={<UserHomepage />} />
        <Route path="/admin" element={<AdminStack />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;