"use client"
import { categories } from '@data'
import WorkList from './WorkList'
import { useEffect, useState } from 'react'
import "@styles/Categories.scss"
import Loader from './Loader'
const Feed = () => {
const [loading, setLoading] = useState(true) 
const [selectedCategory, setSelectedCategory] = useState("All")
const [workList, setWorkList] = useState([])

console.log(workList)

const getWorkList = async () =>{
    const response = await fetch(`/api/work/list/${selectedCategory}`)
    const data = await response.json()
    setWorkList(data)
    setLoading(false)
}

useEffect (()=>{
    getWorkList()
}, [selectedCategory])
  return loading ? <Loader/> : (
    <>
    <div className='categories'>
      {categories?.map((item) =>{
        return <p key={item} onClick={() => setSelectedCategory(item)} className={`${item===selectedCategory ? "selected" : ""}`}>{item}</p>
      })}
    </div>

    <WorkList data={workList}/>
    </>
  )
}
export default Feed
