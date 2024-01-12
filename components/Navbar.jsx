"use client"

import { Menu, Person, Search } from '@mui/icons-material'
import { IconButton} from '@mui/material'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import '@styles/Navbar.scss'

const Navbar = () => {

  const {data: session} = useSession()
  const user = session?.user

  const [dropdownMenu, setDropdownMenu] = useState(false)
  return (
    <div className='navbar'>
      <a href="/">
      <img src="assets/logo.png" alt="nav-logo" />
      </a>

      <div className='navbar_search'>
        <input type='text' placeholder='Search...'/>
        <IconButton>
          <Search sx={{color: "red"}}/>
        </IconButton>
      </div>

      <div className='navbar_right'>
        <button className='navbar_right_account' onClick={() => setDropdownMenu(!dropdownMenu)}>
          <Menu sx={{color: "gray"}}/>
           {!user ? (
            <Person sx={{color: "gray"}}/>
           ) : (
            <img src={user.profileImagePath} alt="perfil" style={{objectFit: "cover", borderRadius: "50%"}} />
           )}
        </button>

         {dropdownMenu && !user &&(
          <div className='navbar_right_accountmenu'>
            <Link href="/login">Login</Link>
            <Link href="/register">Sign Up</Link>
          </div>
         )}

      </div>
        
    </div>
  )
}

export default Navbar
