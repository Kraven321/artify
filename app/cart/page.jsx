"use client"
import Navbar from "@components/Navbar"
import { AddCircle, ArrowCircleLeft, Delete, RemoveCircle } from "@mui/icons-material"
import "@styles/Cart.scss"
import { useSession } from "next-auth/react"


const Cart = () => {
    const {data: session, update} = useSession()
    const cart = session?.user?.cart
    const userId = session?.user?._id

    const updateCart = async (cart) => {
        const response = await fetch(`api/user/${userId}/cart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ cart }),
        })
        const data = await response.json()
        update({user: {cart: data}})
    };

    const calcSubtotal = (cart) => {
       return cart?.reduce((total, item)=>{
        return total + item.quantity * item.price
       }, 0)
    }
    
    const increaseQty = (cartItem) =>{
        const newCart = cart?.map((item)=>{
            if(item === cartItem) {
                item.quantity += 1
                return item
            } else return item
        })
        updateCart(newCart)
    }

    const decreaseQty = (cartItem) =>{
        const newCart = cart?.map((item)=>{
            if(item === cartItem && item.quantity > 1) {
                item.quantity -= 1
                return item
            } else return item
        })
        updateCart(newCart)
    }

    const removeFromCart = (cartItem) =>{
        const newCart = cart?.filter((item)=> item.workId !== cartItem.workId)
        updateCart(newCart)
    }

    const subtotal = calcSubtotal(cart)
  return (
    <>
      <Navbar />
      <div className="cart">
        <div className="details">
            <div className="top">
                <h1>Your Cart</h1>
                <h2>Subtotal: <span>${subtotal}</span></h2>
            </div>

            {cart?.length === 0 && (
                <h3>Your cart is empty</h3>
            )}

            {cart?.length > 0 && (
                <div className="all-items">
                    {cart?.map((item, index)=>(
                        <div className="item" key={index}>
                            <div className="item_info">
                                <img src={item.image} alt="item-image" />
                                <div className="text">
                                    <h3>{item.title}</h3>
                                    <p> Category:{item.category}</p>
                                    <p>Seller: {item.creator.username} </p>
                                </div>
                            </div>
                            <div className="quantity">
                                <AddCircle sx={{fontSize: "18px", cursor: "pointer", color: "grey"}} onClick={() => increaseQty(item)}/>
                                <h3>{item.quantity}</h3>
                                <RemoveCircle sx={{fontSize: "18px", cursor: "pointer", color: "grey"}} onClick={() => decreaseQty(item)}/>
                            </div>

                            <div className="price">
                                <h2>{item.price * item.quantity}</h2>
                                <p>${item.price}/each</p>
                            </div>

                            <div className="remove">
                                <Delete sx={{cursor: "pointer"}} onClick={() => removeFromCart(item)}/>
                            </div>
                        </div>
                    ))}

                    <div className="bottom">
                        <a href="/">
                            <ArrowCircleLeft/>
                            Continue Shopping
                        </a>
                        <button>Checkout Now</button>
                    </div>
                </div>
            )}
        </div>

      </div>
    </>
  )
}

export default Cart
