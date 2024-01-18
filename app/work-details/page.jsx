"use client"

import '@styles/WorkDetails.scss'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Loader from '@components/Loader'
import Navbar from '@components/Navbar'
import { ArrowBackIos, ArrowForwardIos, Edit, FavoriteBorder, ShoppingCart } from '@mui/icons-material'
import { useSession } from 'next-auth/react'

const WorkDetails = () => {
    const [loading, setLoading] = useState(true)
    const [work, setWork] = useState({})

    const searchParams = useSearchParams()
    const workId = searchParams.get('id')

    useEffect(() => {
        const getWorkDetails = async () => {
            const response = await fetch(`/api/work/${workId}`, {
                method: 'GET',
            })
            const data = await response.json()
            setWork(data)
            setLoading(false)
        }
        if(workId) {
        getWorkDetails()
        }
    }, [workId])

    const {data:session} = useSession()

    const userId = session?.user?._id

    const [currentIndex, setCurrentIndex] = useState(0)

  const goToNextSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % work.workPhotoPaths.length
    );
  };

  const goToPreviousSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + work.workPhotoPaths.length) %
        work.workPhotoPaths.length
    );
  };

  //show more photos
  const [visiblePhotos, setVisiblePhotos] = useState(5)

  const loadMorePhotos = () => {
    setVisiblePhotos(work.workPhotoPaths.length)
  }

  //Select photo to Show
  const [selectedPhoto, setSelectedPhoto] = useState(0)

  const handleSelectedPhoto = (index) => {
    setSelectedPhoto(index)
    setCurrentIndex(index)
  }

  const router = useRouter()

  return loading ? <Loader/> : (
    <>
      <Navbar/>
      <div className='work-details'>
        <div className='title'>
            <h1>{work.title}</h1>
            {work?.creator?._id === userId ? (
                <div className='save' onClick={() => {router.push(`/update-work?id=${workId}`)}}>
                <Edit/>
                <p>Edit</p>
                </div>
            ) :<div className='save'>
            <FavoriteBorder/>
            <p>Save</p>
            </div> }
        </div>

        <div className="slider-container">
        <div className="slider" style={{transform: `translateX(-${currentIndex * 100}%)`}}>
        {work.workPhotoPaths?.map((photo, index) =>(
          <div className="slide" key={index}>
            <img src={photo} alt="photo" />
            <div className="prev-button" onClick={(e)=> goToPreviousSlide(e)}>
              <ArrowBackIos sx={{fontSize: "15px"}}/>
            </div>
            <div className="next-button" onClick={(e)=> goToNextSlide(e)}>
              <ArrowForwardIos sx={{fontSize: "15px"}}/>
            </div>
          </div>
        ))}
        </div>
      </div>

      <div className='photos'>
        {work.workPhotoPaths.slice(0, visiblePhotos).map((photo, index) => (
          <img src={photo} alt="work-demo" key={index} onClick={ () => handleSelectedPhoto(index)} className={index === selectedPhoto ? 'selected' : ''} />
        ))}
        {visiblePhotos < work.workPhotoPaths.length && (
          <div className='show-more' onClick={loadMorePhotos}>
            <ArrowForwardIos sx={{fontSize: "40px"}}/>
            <p>Show more</p>
          </div>
        )}
      </div>

      <hr />

      <div className='profile'>
        <img src={work?.creator?.profileImagePath} alt="profile" />
        <h3>Created by: {work?.creator?.username}</h3>
      </div>

      <hr />

      <h3>About this product</h3>
      <p>{work.description}</p>

      <h1>${work.price}</h1>
      <button type='submit'>
        <ShoppingCart/>
        Add to cart
      </button>
      </div>
    </>
  )
}

export default WorkDetails