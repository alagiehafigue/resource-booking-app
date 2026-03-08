import { Route, Routes } from "react-router-dom"
import Index from "../src/Auth/Index"

const AuthStack =()=>{
    return (<Routes>
        <Route path='/' element={<Index />} />
    </Routes>)
}

export default AuthStack