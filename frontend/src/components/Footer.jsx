import React from "react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaTiktok, FaYoutube } from "react-icons/fa6";
import "../styles/footer.css"
import logo from '../assets/EPB2.png'
0
export const Footer = () => {
    return (
        
        <footer className="footer-container">
            <div className="footer-content">
                <img src={logo} alt="Pie de página Bolivia" className="footer-image" />
                <div className="footer-overlay">
                    <div className="social-icons">
                       <a href="https://www.facebook.com/"> <FaFacebookF /></a>
                       <a href="https://www.facebook.com/"><FaInstagram /></a>
                       <a href="https://www.facebook.com/"><FaXTwitter /></a>
                       <a href="https://www.facebook.com/"><FaTiktok /></a>
                       <a href="https://www.facebook.com/"><FaYoutube /></a>
                    </div>
                    <p>Comunicación del Estado Plurinacional de Bolivia</p>
                    <div className="contact-info">
                        <p>📞 Teléfonos: 21599309 y/o 22159310</p>
                        <p>📍 Dirección: Zona Central, calle Ayacucho esquina Potosí</p>
                        <p>🏛️ Casa Grande del Pueblo, piso 16 y 17</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}