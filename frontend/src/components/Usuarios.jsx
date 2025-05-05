import React, { useState, useEffect } from 'react';

export const Usuarios = () => {
    const [users, setUsers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsuarios = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/usuarios`);
            if (!response.ok) {
                throw new Error('Error al obtener los usuarios');
            }
            const data = await response.json();
            setUsers(data);
            setIsEditing(true);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    return (
        <main>
            {error && <div className="alert alert-danger">{error}</div>}
            <table className="table">
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Telefono</th>
                        <th>Genero</th>
                        <th>Verificado</th>
                        <th>Rol</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id || user._id}>
                                <td>{user.usuario || 'Sin usuario'}</td>
                                <td>{user.nombre || ''} {user.apellidomaterno || ''} {user.apellidomaterno || ''} </td>
                                <td>{user.email || 'Sin correo'}</td>
                                <td>{user.telefono || 'Sin telefono'}</td>
                                <td>{user.genero || 'Sin genero'}</td>
                                <td>{user.verificado ? 'SI' : 'NO'}</td>
                                <td>{user.rol}</td>
                            </tr>
                            
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">No hay usuarios registrados</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </main>
    );
};