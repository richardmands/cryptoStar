import { useState, useEffect, useContext } from "react"
import { store } from "./store"

function useAccounts(you, them, id, checkingApproval) {
  const { state } = useContext(store)
  const { instance } = state
  const [youApprovedForThemAll, setYouApprovedForThemAll] = useState(false)
  const [themApprovedForYouAll, setThemApprovedForYouAll] = useState(false)
  const [approvedForToken, setApprovedForToken] = useState(false)

  useEffect(() => {
    async function checkIsApprovedForAll() {
      const data = await instance.methods.isApprovedForAll(you, them).call()
      setYouApprovedForThemAll(data)
      const data2 = await instance.methods.isApprovedForAll(them, you).call()
      setThemApprovedForYouAll(data2)
    }

    async function checkIsApprovedForOne() {
      const data = await instance.methods.getApproved(id).call()
      setApprovedForToken(data.toLowerCase() === you)
    }

    if (instance) {
      if (id && you) {
        checkIsApprovedForOne()
      } else if (you && them) {
        checkIsApprovedForAll()
      }
    }
  }, [instance, them, you, checkingApproval])

  return [youApprovedForThemAll, themApprovedForYouAll, approvedForToken]
}

export default useAccounts
