import { Routes, Route, Navigate } from 'react-router-dom'
import { Inicio } from '../pages/Inicio'
import { Contacto } from '../pages/Contacto'
import { Button } from '../components/Button'
import { Register } from '../pages/Register'
import { ConfirmarCuenta } from '../pages/ConfirmarCuenta'
import { Acceso } from '../pages/Acceso'

export const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<Inicio/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/contacto' element={<Contacto/>}/>
            {/*<Route path='/*' element={<Navigate to='/'/>}/>*/}
            <Route path='/*' element={<h1>Error 404</h1>}/>
            <Route path='/button' element={<Button/>} />
            <Route path="/confirmar/:token" element={<ConfirmarCuenta />} />
            <Route path="/login" element={<Acceso/>}/>
        </Routes>
    )
}