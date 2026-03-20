// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Intropage from './Pages/Intropage'
import UserHomepage from './Pages/userHomepage'
import AuthStack from '../Stacks/AuthStack'
import AdminStack from '../Stacks/AdminStack'
import Booking from './Pages/Booking.jsx'
import ResourceAvailable from './Admin/resourceavailable.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intropage />} />
        <Route path="/login" element={<AuthStack />} />
        <Route path="/signup" element={<AuthStack />} />
        <Route path="/home" element={<UserHomepage />} />
        <Route path="/resource/:id" element={<Booking />} />  
        <Route path="/admin/*" element={<AdminStack />} />
        <Route path="/resources" element={<ResourceAvailable />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App;