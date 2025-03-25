import React from "react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaTiktok, FaYoutube } from "react-icons/fa6";
import "../styles/footer.css"
import logo from '../assets/EPB2.png'
0
export const Footer = () => {
    return (
        
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-image">
                    <img src={logo} alt="Pie de página Bolivia" className="footer-image" />
                </div>
                <div className="social-icons">
                    <h2>SIGUENOS</h2>
                    <a href="https://www.facebook.com/"> <FaFacebookF /></a>
                    <a href="https://www.instagram.com/"><FaInstagram /></a>
                    <a href="https://www.xtwitter.com/"><FaXTwitter /></a>
                    <a href="https://www.tiktok.com/"><FaTiktok /></a>
                    <a href="https://www.youtube.com/"><FaYoutube /></a>                       
                </div>
                <div className="contact-info">
                    <p>Teléfonos: 21599309 y/o 22159310</p>
                    <p>Dirección: Zona Central, calle Ayacucho esquina Potosí</p>
                    <p>Casa Grande del Pueblo, piso 16 y 17</p>
                </div>
            </div>
            <div className="footer2">
                <small>&copy; 2025 <b>Bicentenario</b> -Todos los Derechos Reservados.</small>
            </div>
        </footer>
    )
}