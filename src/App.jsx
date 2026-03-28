// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Intropage from "./Pages/Intropage.jsx";
import UserHomepage from "./Pages/userHomepage.jsx";
import AuthStack from "../Stacks/AuthStack.jsx";
import AdminStack from "../Stacks/AdminStack.jx";
import Booking from "./Pages/Booking.jsx";
import MyBookings from "./Pages/MyBookings.jsx";
import UserNotifications from "./Pages/UserNotifications.jsx";
import ResourceAvailable from "./Admin/resourceavailable.jsx";
import UserProfile from "./Pages/UserProfile.jsx";
import UserSettings from "./Pages/UserSettings.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import ProtectedRoute from "./Auth/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Intropage />} />
        <Route path='/login' element={<AuthStack />} />
        <Route path='/signup' element={<AuthStack />} />
        <Route path='/about' element={<About />} />
        <Route path='/services' element={<Services />} />

        <Route
          element={
            <ProtectedRoute allowedRoles={["student", "faculty", "admin"]} />
          }
        >
          <Route path='/home' element={<UserHomepage />} />
          <Route path='/resource/:id' element={<Booking />} />
          <Route path='/bookings' element={<MyBookings />} />
          <Route path='/notifications' element={<UserNotifications />} />
          <Route path='/profile' element={<UserProfile />} />
          <Route path='/settings' element={<UserSettings />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path='/admin/*' element={<AdminStack />} />
          <Route path='/resources' element={<ResourceAvailable />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
