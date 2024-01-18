"use client"

import Form from '@components/Form'
import Loader from '@components/Loader'
import Navbar from '@components/Navbar'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const UpdateWork = () => {
  const [loading, setLoading] = useState(true)

  const searchParams = useSearchParams()
  const workId = searchParams.get('id')

  const [work, setWork] = useState({
    category: '',
    title: '',
    description: '',
    price: "",
    photos: [],
  })

  useEffect(() => {
    const getWorkDetails = async () => {
      const response = await fetch(`/api/work/${workId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
        const data = await response.json()
        setWork({
          category: data.category,
          title: data.title,
          description: data.description,
          price: data.price,
          photos: data.workPhotoPath,
        });
        setLoading(false)
    };
    if(workId) {
      getWorkDetails()
    }
  }, [workId])

  const router = useRouter  ()
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const updateFormWork = new FormData()

      for(var key in work) {
        updateFormWork.append(key, work[key])
      }

      work.photos.forEach((photo) => {
        updateFormWork.append('workPhotoPaths', photo)
      })

      const response = await fetch(`/api/work/${workId}`, {
        method: 'PATCH',
        body: updateFormWork
      })

      if(response.ok) {
        router.push('/shop')
      }
    } catch (error) {
      console.log("publish work failed", error)
    }
  }

  return loading  ? <Loader/> : (
    <>
      <Navbar />
      <Form
      type="Edit"
      work={work}
      setWork={setWork}
      handleSubmit={handleSubmit}
      />
    </>
  )
}

export default UpdateWork
