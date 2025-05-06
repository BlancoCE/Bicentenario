import { Routes, Route, Navigate } from 'react-router-dom'
import { Inicio } from '../pages/Inicio'
import { Contacto } from '../pages/Contacto'
import { Register } from '../pages/Register'
import { ConfirmarCuenta } from '../pages/ConfirmarCuenta'
import { Acceso } from '../pages/Acceso'
import { Recuperacion } from '../pages/Recuperacion'
import { ResetPassword } from '../pages/Reset'
import { Configuracion } from '../pages/Configuracion'
import { Notificaciones } from '../pages/Notificaciones'
import { MenuCuenta } from '../pages/MenuCuenta'
//import { Dashboard } from '../components/Pruebas'
import { Agente } from '../components/Agente'
import { Eventos } from '../components/eventos'

export const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<Inicio />} />
            <Route path='/register' element={<Register />} />
            <Route path='/contacto' element={<Contacto />} />
            {/*<Route path='/*' element={<Navigate to='/'/>}/>*/}
            <Route path='/*' element={<h1>Error 404</h1>} />
            <Route path="/confirmar/:token" element={<ConfirmarCuenta />} />
            <Route path="/login" element={<Acceso />} />
            <Route path="/recuperacion" element={<Recuperacion />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path='/menucuenta' element={<MenuCuenta/>}/>
            <Route path="/configuracion" element={<Configuracion/>}/>
            <Route path='/notificaciones' element={<Notificaciones/>}/>
            <Route path='/eventos' element={<Eventos/>}/>
            <Route path='/agente' element={<Agente/>}/>
            <Route path='/*' element={<h1>Error 404</h1>} />
        </Routes>
    )
}