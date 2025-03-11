
import "../styles/register.css"

export const Contacto = () => {
    return (
        <main>
        <form class="form">
        <p class="form-title">Contáctenos</p>
            <div class="input-container">
            <input placeholder="Nombre de Usuario" type="text"/>
            <span>
                <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
                </svg>
            </span>
        </div>
        <div class="input-container">
            <input placeholder="Correo electrónico" type="email"/>
            <span>
                <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
                </svg>
            </span>
        </div>
        <p class="signup-link">Mensaje</p>
        <textarea className="texts"></textarea>
        <button class="submit" type="submit">
        Enviar
        </button>
        </form>
    </main>
    )
}