"use client"

import '@styles/Register.scss'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'


const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        profileImage: null
    })

    const handleChange = (e) => {
        e.preventDefault()
        const { name, value, files } = e.target
        setFormData({ 
        ...formData, [name]: value,
         [name]: name === 'profileImage' ? files[0] : value
        })  
    }

    const router = useRouter()

    const [passwordMatch, setPasswordMatch] = useState(true)

    useEffect(() => {
        setPasswordMatch(formData.password === formData.confirmPassword)
    }, [formData.confirmPassword])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const registerForm = new FormData()   // Cria um novo objeto FormData (só precisa de "new FormData()" quando houver campos de Uploads)
            for(var key in formData) {    // Itera sobre as chaves do objeto formData
                registerForm.append(key, formData[key])   // Adiciona cada par chave-valor ao objeto FormData
            }
            const response = await fetch('/api/register/', {
                method: 'POST',
                body: registerForm
            })

            if(response.ok) {
                router.push('/')
            }
        } catch (error) {
         console.log( 'registred failled', error)   
        }
    };

    const loginWithGoogle =  () => {
        signIn('google'), { callbackUrl: '/' }
    }
  return (
    <div className='register'>
        <img src="/assets/register.jpg" alt="register photo" className='register_decor' />
        <div className='register_content'>
            <form className='register_content_form' onSubmit={handleSubmit}>
                <input placeholder='Username' name='username' value={formData.username} onChange={handleChange} required/>
                <input placeholder='Email' type='email' name='email' value={formData.email} onChange={handleChange} required/>
                <input placeholder='Password' type='password' name='password' value={formData.password} onChange={handleChange} required/>
                <input placeholder='Confirm Password' type='password' name='confirmPassword' value={formData.confirmPassword} onChange={handleChange} required/>
                {!passwordMatch && (
                    <p style={{color: 'red'}}>Passwords don't match!</p>
                )}
                <input id='image' type='file' name='profileImage' accept='image/*'  onChange={handleChange}  required style={{display: 'none'}}/>
                <label htmlFor="image">
                    <img src="/assets/addImage.png" alt="add profile" />
                    <p>Upload Profile Photo</p>
                </label>
                { formData.profileImage && (
                    <img src={URL.createObjectURL(formData.profileImage)} alt='profile' style={{maxWidth: '80px'}}/>
                )}
                <button type='submit'>Register</button>
            </form>
            <a href="/login">Already have an account? Log In Here</a>
        </div>
    </div>
  )
}

export default Register
