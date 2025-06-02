import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Inicio } from '../pages/Inicio';
import { Contacto } from '../pages/Contacto';
import { Register } from '../pages/Register';
import { ConfirmarCuenta } from '../pages/ConfirmarCuenta';
import { Acceso } from '../pages/Acceso';
import { Recuperacion } from '../pages/Recuperacion';
import { ResetPassword } from '../pages/Reset';
import { ConfiguracionC } from '../pages/ConfiguracionC';
import { CuentaMenu } from '../pages/CuentaMenu'; // Nuevo componente
import { Agente } from '../components/Agente';
import { Gestionar } from '../components/Gestionar';
import { Eventos } from '../pages/allevents';
import { Notificacion } from '../pages/Notificaciones';

export const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<Inicio />} />
            <Route path='/register' element={<Register />} />
            <Route path='/contacto' element={<Contacto />} />
            <Route 
  path="/confirmar/:token" 
  element={<ConfirmarCuenta />} 
  loader={({ params }) => {
    // Verifica que el token llegue correctamente
    console.log("Token recibido:", params.token);
    return null;
  }}
/>
            <Route path="/login" element={<Acceso />} />
            <Route path="/recuperacion" element={<Recuperacion />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            
            {/* Ruta de configuración unificada */}
            <Route path="/cuentamenu" element={<ConfiguracionLayout />}>
                <Route index element={<ConfiguracionC />} />
                <Route path="configuracion" element={<ConfiguracionC />} />
                <Route path="notificaciones" element={<Notificacion />} />
            </Route>
            
            <Route path='/agente' element={<Agente/>}/>
            <Route path='/eventos' element={<Eventos/>}/>
            <Route path='/gestionar' element={<Gestionar />} />
            <Route path='/*' element={<Navigate to="/" />} />
            
        </Routes>
    );
};

const ConfiguracionLayout = () => {
    return (
        <div className="configuracion-layout">
            <CuentaMenu />
            <div className="configuracion-content">
                <Outlet />
            </div>
        </div>
    );
};