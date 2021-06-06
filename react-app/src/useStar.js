import { useState, useEffect, useContext } from "react"
import { store } from "./store"

function useStar(id) {
  const { state, dispatch } = useContext(store)
  const { instance, accounts } = state
  const [exists, setExists] = useState(false)
  const [name, setName] = useState(null)
  const [owner, setOwner] = useState(null)
  const [price, setPrice] = useState(null)
  const [requestAddress, setRequestAddress] = useState(null)
  const [approvedAddress, setApprovedAddress] = useState(null)

  useEffect(() => {
    async function getStarInfo() {
      const data = await instance.methods.idToStar(id).call()
      setName(data)
      if (data) {
        setExists(true)
        const data2 = await instance.methods.ownerOf(id).call()
        setOwner(data2.toLowerCase())
        const data3 = await instance.methods.idToPrice(id).call()
        setPrice(data3)
        const data4 = await instance.methods.idToRequest(id).call()
        setRequestAddress(data4.toLowerCase())
        const data5 = await instance.methods.getApproved(id).call()
        setApprovedAddress(data5.toLowerCase())
        dispatch({
          type: "setStars",
          id,
          star: {
            id,
            name: data,
            owner: data2,
            price: data3,
            requestAddress: data4,
            approvedAddress: data5,
          },
        })
      } else {
        dispatch({ type: "setStars", id, star: { id, name: data } })
      }
    }

    if (id && instance) {
      getStarInfo()
    }
  }, [instance, accounts[0], id, name])

  return [
    exists,
    name,
    owner,
    price,
    requestAddress,
    approvedAddress,
    accounts[0],
  ]
}

export default useStar
