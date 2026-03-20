import {Routes, Route} from 'react-router-dom'
import Homepage from '../src/Admin/Homepage'
import ResourceAvailable from '../src/Admin/resourceavailable'


const AdminStack=()=>{
    return (<Routes>
        <Route path='/' element={<Homepage />} />
        <Route path = '/resources' element = {<ResourceAvailable />} />
    </Routes>)
}

export default AdminStack