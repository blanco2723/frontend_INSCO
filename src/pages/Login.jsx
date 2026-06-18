import {useState} from 'react'
import api from '../services/api'
import Swal from "sweetalert2";

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const iniciarSesion = async (e) => {
        e.preventDefault()
        try {
            const res = await api.post('/auth/login', { email, password })
            localStorage.setItem('token', res.data.token)
            Swal.fire(
                            'Bienvenido',
                            'Inicio de sesión exitoso',
                            'success'
                        );
            window.location.href = '/dashboard'
        } catch (error) {
            alert('Error al iniciar sesión')
        }
    }

    return (    
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="text-center" >INSCO</h3>
                            <form onSubmit={iniciarSesion}>
                                <input className="form-control mb-3" 
                                type="email" 
                                placeholder="Correo" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} required 
                                />
                                <input className="form-control mb-3" 
                                type="password" 
                                placeholder="Contraseña"    
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} required
                                />
                                <button className="btn btn-primary w-100" type="submit">Iniciar Sesión</button>
                            </form> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login  