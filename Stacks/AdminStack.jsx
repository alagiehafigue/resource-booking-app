import {Routes, Route} from 'react-router-dom'
import Homepage from '../src/Admin/Homepage'
import ResourceAvailable from '../src/Admin/resourceavailable'
import AdminProfile from '../src/Admin/AdminProfile'
import AdminSettings from '../src/Admin/AdminSettings'


const AdminStack=()=>{
    return (<Routes>
        <Route path='/' element={<Homepage />} />
        <Route path = '/resources' element = {<ResourceAvailable />} />
        <Route path = '/profile' element = {<AdminProfile />} />
        <Route path = '/settings' element = {<AdminSettings />} />
    </Routes>)
}

export default AdminStack
