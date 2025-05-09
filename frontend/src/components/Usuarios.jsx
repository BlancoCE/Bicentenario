import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/api';
import '../styles/usuarios.css'; // Importando el nuevo archivo CSS

export const Usuarios = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [currentUserRole, setCurrentUserRole] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Obtener usuarios y datos del usuario actual
    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Obtener usuarios
            const usersResponse = await fetch('http://localhost:5000/api/usuarios');
            if (!usersResponse.ok) throw new Error('Error al obtener usuarios');
            const usersData = await usersResponse.json();
            
            // Obtener roles
            const rolesResponse = await fetch('http://localhost:5000/api/roles');
            if (!rolesResponse.ok) throw new Error('Error al obtener roles');
            const rolesData = await rolesResponse.json();
            
            // Obtener rol del usuario actual
            const currentUserResponse = await fetchWithAuth('http://localhost:5000/api/rol');

            setUsers(usersData);
            setRoles(rolesData);
            setCurrentUserRole(currentUserResponse.rol || '');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Cambiar rol de usuario
    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await fetch(`http://localhost:5000/api/usuarios/${userId}/rol`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rol: newRole })
            });
            
            if (!response.ok) throw new Error('Error al actualizar el rol');
            
            // Actualizar estado local
            setUsers(users.map(user => 
                user.id === userId ? { ...user, rol: newRole } : user
            ));
        } catch (err) {
            setError(err.message);
        }
    };

    // Verificar permisos para cambiar roles
    const canChangeRole = (targetUser) => {
        // Solo SUPERADMINISTRADOR puede cambiar cualquier rol
        if (currentUserRole === 'SUPERADMINISTRADOR') return true;
        
        // ADMINISTRADOR no puede cambiar:
        // - A otros ADMINISTRADORES
        // - A SUPERADMINISTRADOR
        // - Convertir usuarios en SUPERADMINISTRADOR
        if (currentUserRole === 'ADMINISTRADOR') {
            return targetUser.rol !== 'ADMINISTRADOR' && 
                   targetUser.rol !== 'SUPERADMINISTRADOR';
        }
        
        return false;
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div className="loading">Cargando...</div>;

    return (
        <main className="usuarios-container">
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Género</th>
                            <th>Verificado</th>
                            <th>Rol</th>
                            {['SUPERADMINISTRADOR', 'ADMINISTRADOR'].includes(currentUserRole) && (
                                <th>Acciones</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id || user._id}>
                                    <td>{user.usuario || 'Sin usuario'}</td>
                                    <td>{user.nombre || ''} {user.apellidopaterno || ''} {user.apellidomaterno || ''}</td>
                                    <td>{user.email || 'Sin correo'}</td>
                                    <td>{user.telefono || 'Sin teléfono'}</td>
                                    <td>{user.genero || 'Sin género'}</td>
                                    <td>{user.verificado ? 'SI' : 'NO'}</td>
                                    <td>{user.rol}</td>
                                    {['SUPERADMINISTRADOR', 'ADMINISTRADOR'].includes(currentUserRole) && (
                                        <td>
                                            {canChangeRole(user) ? (
                                                <select 
                                                    value={user.rol}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    disabled={!canChangeRole(user)}
                                                >
                                                    {roles.filter(role => {
                                                        if (currentUserRole === 'ADMINISTRADOR') {
                                                            return role.nombre !== 'SUPERADMINISTRADOR';
                                                        }
                                                        return true;
                                                    }).map(role => (
                                                        <option key={role.id_rol} value={role.nombre}>
                                                            {role.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span>Administrador</span>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center">No hay usuarios registrados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
};