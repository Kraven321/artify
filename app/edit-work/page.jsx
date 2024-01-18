"use client"

import { useState } from 'react'
import Navbar from '@components/Navbar'
import Form from '@components/Form'

const EditWork = () => {
    
    const [work, setWork] = useState({
        creator: '',
        category: '',
        title: '',
        description: '',
        price: '',
        photos: []
    })

  return (
    <>
    <Navbar />
    <Form
    type="Edit"
    work={work}
    setWork={setWork}
    />
    </>
  )
}

export default EditWork
