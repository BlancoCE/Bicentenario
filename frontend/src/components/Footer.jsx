import React from "react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaTiktok, FaYoutube } from "react-icons/fa6";
import "../styles/footer.css";
import logo from '../assets/EPB2.png';

export const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-column">
                    <div className="footer-image">
                        <img src={logo} alt="Pie de página Bolivia" />
                    </div>
                </div>
                
                <div className="footer-column">
                    <div className="social-icons">
                        <h2>SÍGUENOS</h2>
                        <div className="social-icons-container">
                            <a href="https://facebook.com/" aria-label="Facebook"><FaFacebookF /></a>
                            <a href="https://instagram.com/" aria-label="Instagram"><FaInstagram /></a>
                            <a href="https://facebook.com/" aria-label="Twitter"><FaXTwitter /></a>
                            <a href="https://tiktok.com/" aria-label="TikTok"><FaTiktok /></a>
                            <a href="https://youtube.com/" aria-label="YouTube"><FaYoutube /></a>
                        </div>
                    </div>
                </div>
                
                <div className="footer-column">
                    <div className="contact-info">
                        <p>Teléfonos: 21599309 y/o 22159310</p>
                        <p>Dirección: Zona Central, calle Ayacucho esquina Potosí</p>
                        <p>Casa Grande del Pueblo, piso 16 y 17</p>
                    </div>
                </div>
            </div>
            
            <div className="footer2">
                <small>&copy; 2025 <b>Bicentenario</b> - Todos los Derechos Reservados.</small>
            </div>
        </footer>
    );
};