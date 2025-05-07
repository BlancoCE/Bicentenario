import React, { useState, useEffect } from 'react';
import { MenuCuenta } from './MenuCuenta';
import '../styles/configuracion.css';
import userLogo from '../assets/user-logo.png'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { fetchWithAuth } from '../utils/api';


export const Configuracion = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [editField, setEditField] = useState(null);
    const [editedValue, setEditedValue] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({
        nombre: '',
        correo: '',
        contraseña: '**********',
        telefono: '',
        paisCiudad: '',
    });

    // En tu componente Configuracion.js
    useEffect(() => {
        const obtenerPerfil = async () => {
            try {
                setLoading(true);
                const data = await fetchWithAuth('http://localhost:5000/api/usuario/perfil');
                setUserData({
                    nombre: data.nombre || 'NOMBRE DE USUARIO',
                    correo: data.correo || 'ejemplo@gmail.com',
                    telefono: data.telefono || 'Sin teléfono',
                    pais: data.pais || 'Sin ubicación',
                    ciudad: data.ciudad || 'Sin ciudad',
                });
            } catch (err) {
                setError(err.message);
                if (err.message.includes('401')) {
                    // Redirigir a login si el token es inválido
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            } finally {
                setLoading(false);
            }
        };

        obtenerPerfil();
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const openModal = (type) => {
        setModalType(type);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalType(null);
    };

    const handleEdit = (field) => {
        setEditField(field);
        setEditedValue(userData[field]);
    };

    const handleSave = (field) => {
        setUserData({ ...userData, [field]: editedValue });
        setEditField(null);
    };

    const handleCancel = () => {
        setEditField(null);
    };

    const handleChange = (e) => {
        setEditedValue(e.target.value);
    };

    const handleRemovePhoto = () => {
        setProfilePhoto(null);
    };

    const handleUploadPhoto = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePhoto(URL.createObjectURL(file));
        }
    };

    const handleContinue = () => {
        // Aquí deberías validar el código ingresado por el usuario
        // Si el código es válido, cierra el modal y establece editField
        closeModal();
        setEditField(modalType);
    };



    return (
        <div className="profile-container">
            <MenuCuenta />
            <div className="profile-cont">
                <h1>Tu perfil</h1>
                <div className="profile-section">
                    <div className="section-title">Foto de perfil</div>
                    <div className="profile-photo">
                        {profilePhoto ? (
                            <img src={profilePhoto} alt="Foto de perfil" className="profile-image" />
                        ) : (
                            <img src={userLogo} alt="Logo de usuario" className="profile-image" />
                        )}
                        <div className="photo-actions">
                            <button className="action-button" onClick={handleRemovePhoto}>Eliminar foto</button>
                            <input type="file" id="upload-photo" accept="image/*" onChange={handleUploadPhoto} style={{ display: 'none' }} />
                            <label htmlFor="upload-photo" className="action-button">Cambiar foto</label>
                        </div>
                    </div>
                </div>
                <div className="profile-section">
                    <div className="section-title">Nombre</div>
                    <div className="section-content">
                        {editField === 'nombre' ? (
                            <>
                                <input type="text" value={editedValue} onChange={handleChange} />
                                <button onClick={() => handleSave('nombre')}>Guardar</button>
                                <button onClick={handleCancel}>Cancelar</button>
                            </>
                        ) : (
                            <>
                                <div className="field-value">{userData.nombre}</div>
                                <button className="edit-button" onClick={() => handleEdit('nombre')}>Editar</button>
                            </>
                        )}
                    </div>
                </div>
                <div className="profile-section">
                    <div className="section-title">Correo electrónico</div>
                    <div className="section-content">
                        {editField === 'email' ? (
                            <>
                                <input type="text" value={editedValue} onChange={handleChange} />
                                <button onClick={() => handleSave('email')}>Guardar</button>
                                <button onClick={handleCancel}>Cancelar</button>
                            </>
                        ) : (
                            <>
                                <div className="field-value">{userData.correo}</div>
                                <button className="edit-button" onClick={() => openModal('email')}>Editar</button>
                            </>
                        )}
                    </div>
                </div>
                <div className="profile-section">
                    <div className="section-title">Contraseña</div>
                    <div className="section-content">
                        {editField === 'password' ? (
                            <div>
                                <input type={showPassword ? 'text' : 'password'} value={editedValue} onChange={handleChange} />
                                <button type="button" onClick={togglePasswordVisibility}>
                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </button>
                                <button onClick={() => handleSave('password')}>Guardar</button>
                                <button onClick={handleCancel}>Cancelar</button>
                            </div>
                        ) : (
                            <>
                                <div className="field-value">**********</div>
                                <button className="edit-button" onClick={() => openModal('password')}>Cambiar contraseña</button>
                            </>
                        )}
                    </div>
                </div>
                <div className="profile-section">
                    <div className="section-title">Teléfono</div>
                    <div className="section-content">
                        {editField === 'telefono' ? (
                            <>
                                <input type="text" value={editedValue} onChange={handleChange} />
                                <button onClick={() => handleSave('telefono')}>Guardar</button>
                                <button onClick={handleCancel}>Cancelar</button>
                            </>
                        ) : (
                            <>
                                <div className="field-value">{userData.telefono}</div>
                                <button className="edit-button" onClick={() => handleEdit('telefono')}>Editar</button>
                            </>
                        )}
                    </div>
                </div>
                <div className="profile-section">
                    <div className="section-title">País y ciudad</div>
                    <div className="section-content">
                        {editField === 'paisCiudad' ? (
                            <>
                                <input type="text" value={editedValue} onChange={handleChange} />
                                <button onClick={() => handleSave('paisCiudad')}>Guardar</button>
                                <button onClick={handleCancel}>Cancelar</button>
                            </>
                        ) : (
                            <>
                                <div className="field-value">{userData.ciudad}, {userData.pais}</div>
                                <button className="edit-button" onClick={() => handleEdit('paisCiudad')}>Editar</button>
                            </>
                        )}
                    </div>
                </div>
                <div className="profile-section">
                    <div className="section-title">Idioma</div>
                    <div className="section-content">
                        <select className="type-use">
                            <option value="estudiante">Español</option>
                        </select>
                    </div>
                </div>
                <div className="use-message">
                    Estamos personalizando tu experiencia para que se adapte mejor a tus necesidades. Puedes cambiar esta configuración en cualquier momento.
                </div>
            </div>
            {/* Modal */}
            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <button className="modal-close" onClick={closeModal}>X</button>
                        <h2>{modalType === 'email' ? 'Editar correo electrónico' : 'Editar contraseña'}</h2>
                        <p>{modalType === 'email' ? 'Para realizar cambios en tu cuenta, deberás introducir el código que te hemos enviado a ejemplo@gmail.com.'
                            : 'Para realizar el cambio de contraseña, deberás introducir el código que te hemos enviado a ejemplo@gmail.com.'}</p>
                        <h3 className="modal-resend">Código</h3>
                        <input type="text" id="code" placeholder="Escribe el código" />
                        <button className="modal-confirm" onClick={handleContinue}>Continuar</button>
                        <p className="modal-resend">¿No has recibido código? vuelve a enviarlo en 30 segundos</p>
                    </div>
                </div>
            )}
        </div>

    );
};
