"use client"

import { ArrowBackIos, ArrowForwardIos, Delete, Favorite, FavoriteBorder } from "@mui/icons-material"
import "@styles/WorkCard.scss"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const WorkCard = ({ work }) => {
  //SLIDE FOR PHOTOS
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

  const router = useRouter()

  //DELETE WORK
  const handleDelete = async () => {
    const hasConfirmed = confirm("Are you sure you want to delete this work?")

    if(hasConfirmed) {
      try {
        await fetch(`/api/work/${work._id}`, {
          method: "DELETE"
        })
        window.location.reload()
      } catch (error) {
        console.log(error)
      }
    }
  }

  const {data:session, update} = useSession()
  const userId = session?.user?._id

  //ADD TO WISHLIST
  const wishlist = session?.user?.wishlist
  const isLiked = wishlist?.find((item) => item._id === work._id)

  const patchWishList = async () => {
  const response = await fetch(`api/user/${userId}/wishlist/${work._id}`, {
      method: "PATCH",
    })
    const data = await response.json();
    update({user:{wishlist: data.wishlist} })
  }


  return (
    <div className="work-card" onClick={()=> {router.push(`/work-details?id=${work._id}`)}}>
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

      <div className="info">
        <div>
          <h3>{work.title}</h3>
          <div className="creator">
            <img src={work.creator.profileImagePath} alt="creator" />
            <span>{work.creator.username}</span> in <span>{work.category}</span>
          </div>
        </div>

        <div className="price">${work.price}</div>
      </div>
        
      {userId ===work?.creator._id ? (
        <div className="icon" onClick={(e => {e.stopPropagation(); handleDelete()})}>
        <Delete sx={{borderRadius: "50%", backgroundColor: "white", padding: "5px", fontSize: "30px"}}/>
        </div>
      ) : (
        <div className="icon" onClick={(e => {e.stopPropagation(); patchWishList()})}>
         {isLiked ? (
           <Favorite sx={{fontSize: "30px", borderRadius: "50%", backgroundColor: "white", padding: "5px", color: "red" }} onClick={patchWishList}/>  
         ) : (
          <FavoriteBorder sx={{fontSize: "30px", borderRadius: "50%", backgroundColor: "white", padding: "5px" }}/>
         )}
          
        </div>
      )}
     
    </div>
  )
}

export default WorkCard
