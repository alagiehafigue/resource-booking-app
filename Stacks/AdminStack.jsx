import {Routes, Route} from 'react-router-dom'
import Homepage from '../src/Admin/Homepage'


const AdminStack=()=>{
    return (<Routes>
        <Route path='/' element={<Homepage />} />
    </Routes>)
}

export default AdminStack