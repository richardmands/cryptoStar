import React, { useContext, useEffect, useState } from "react"
import Loader from "react-loader-spinner"
import { ToastContainer, toast } from "react-toastify"
import CryptoStarContract from "./contracts/CryptoStar.json"

import "bootstrap/dist/css/bootstrap.min.css"
import "react-toastify/dist/ReactToastify.css"
import "./App.scss"

import { store } from "./store"
import useWeb3 from "./useWeb3"
import useContract from "./useContract"
import StarCard from "./StarCard"
import Stars from "./Stars"
import CreateStar from "./CreateStar"
import SellStar from "./SellStar"
import BuyStar from "./BuyStar"
import ApproveRequest from "./ApproveRequest"
import ExchangeStars from "./ExchangeStars"
import TransferStar from "./TransferStar"

const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const makeToast = (text, happy) => {
  const options = {
    position: "top-right",
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  }

  return happy ? toast.success(text, options) : toast.error(text, options)
}
const App = () => {
  const [web3, accounts, gasPrice, gasLimit] = useWeb3(
    { amount: "5", unit: "shannon" },
    { amount: "5", unit: "lovelace" }
  )

  const [instance, tokenName, tokenSymbol, contractURI] = useContract({
    web3,
    smartContract: CryptoStarContract,
    gasPrice,
    gasLimit,
    onSuccess: () =>
      makeToast(
        `Crypto Star Smart Contract Connected to ...${accounts[0].substr(-4)}`,
        ":)"
      ),
    onFailure: () => makeToast("Failed to connect to Crypto Star :("),
  })

  const globalState = useContext(store)
  const { dispatch } = globalState
  useEffect(() => {
    if (web3) {
      dispatch({ type: "setWeb3", web3 })
    }
  }, [instance, dispatch])
  useEffect(() => {
    if (instance) {
      dispatch({ type: "setInstance", instance })
    }
  }, [instance, dispatch])

  useEffect(() => {
    if (accounts) {
      dispatch({ type: "setAccounts", accounts })
    }
  }, [accounts, dispatch])

  const [loading, setLoading] = useState(false)
  const [activeStar, setActiveStar] = useState(null)

  // Create Star and become owner
  const [newName, setNewName] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const toggleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen)
  }

  const handleCreateStar = async () => {
    setLoading(true)
    toggleCreateModal()
    try {
      await instance.methods
        .createStar(newName, activeStar)
        .send({ from: accounts[0], value: 0 })

      makeToast("You named it!", true)
    } catch (error) {
      console.error("Something went wrong claiming the star...", error)
      makeToast("Something went wrong... Check the console for details")
    }
    setLoading(false)
  }

  const createModal = isCreateModalOpen ? (
    <CreateStar
      activeStar={activeStar}
      isCreateModalOpen={isCreateModalOpen}
      toggleCreateModal={toggleCreateModal}
      handleCreateStar={handleCreateStar}
      setNewName={setNewName}
      newName={newName}
    />
  ) : null

  // Transfer Star
  const [receiver, setReceiver] = useState("")
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const toggleTransferModal = () => {
    setIsTransferModalOpen(!isTransferModalOpen)
  }

  const handleTransferStar = async () => {
    setLoading(true)
    toggleTransferModal()
    try {
      await instance.methods
        .transferStar(receiver, activeStar)
        .send({ from: accounts[0], value: 0 })

      makeToast("You transferred it!", true)
    } catch (error) {
      console.error("Something went wrong transferring the star...", error)
      makeToast("Something went wrong... Check the console for details")
    }
    setLoading(false)
  }

  const transferModal = isTransferModalOpen ? (
    <TransferStar
      activeStar={activeStar}
      isTransferModalOpen={isTransferModalOpen}
      toggleTransferModal={toggleTransferModal}
      handleTransferStar={handleTransferStar}
      setReceiver={setReceiver}
      receiver={receiver}
    />
  ) : null

  // Put Star Up For Sale
  const [price, setPrice] = useState("")
  const [isSellModalOpen, setIsSellModalOpen] = useState(false)
  const toggleSellModal = () => {
    setIsSellModalOpen(!isSellModalOpen)
  }

  const handleSellStar = async () => {
    setLoading(true)
    toggleSellModal()
    try {
      await instance.methods
        .putStarUpForSale(activeStar, web3.utils.toWei(price, "ether"))
        .send({ from: accounts[0], value: 0 })

      makeToast("You put a price on it!", true)
    } catch (error) {
      console.error(
        "Something went wrong putting a price on the star...",
        error
      )
      makeToast("Something went wrong... Check the console for details")
    }
    setLoading(false)
  }

  const sellModal = isSellModalOpen ? (
    <SellStar
      activeStar={activeStar}
      isSellModalOpen={isSellModalOpen}
      toggleSellModal={toggleSellModal}
      handleSellStar={handleSellStar}
      setPrice={setPrice}
      price={price}
    />
  ) : null

  // Approve or decline purchase request
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false)
  const toggleApprovalModal = () => {
    setIsApprovalModalOpen(!isApprovalModalOpen)
  }

  const handleApproveSaleRequest = async (to, approve) => {
    setLoading(true)
    toggleApprovalModal()
    try {
      if (approve) {
        await instance.methods
          .approve(to, activeStar)
          .send({ from: accounts[0], value: 0 })

        makeToast("You approved the sale!", true)
      } else {
        await instance.methods
          .declineRequest(activeStar)
          .send({ from: accounts[0], value: 0 })
        makeToast("You declined the sale!", true)
      }
    } catch (error) {
      console.error(
        "Something went wrong putting a price on the star...",
        error
      )
      makeToast("Something went wrong... Check the console for details")
    }
    setLoading(false)
  }

  const approvalModal = isApprovalModalOpen ? (
    <ApproveRequest
      activeStar={activeStar}
      isApprovalModalOpen={isApprovalModalOpen}
      toggleApprovalModal={toggleApprovalModal}
      handleApproveSaleRequest={handleApproveSaleRequest}
      setPrice={setPrice}
      price={price}
    />
  ) : null

  // Buy Star
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)
  const toggleBuyModal = () => {
    setIsBuyModalOpen(!isBuyModalOpen)
  }

  const handleRequestPermissionToBuy = async () => {
    setLoading(true)
    toggleBuyModal()
    try {
      await instance.methods
        .requestPurchasePermission(activeStar)
        .send({ from: accounts[0], value: 0 })

      makeToast("You Requested it!", true)
    } catch (error) {
      console.error("Something went wrong requesting the star...", error)
      makeToast("Something went wrong... Check the console for details")
    }
    setLoading(false)
  }

  const handleBuyStar = async (value) => {
    const total = Number(value) + Number(gasPrice) + Number(gasLimit)
    setLoading(true)
    toggleBuyModal()
    try {
      await instance.methods
        .buyStar(activeStar)
        .send({ from: accounts[0], value: total })

      makeToast("You bought it!", true)
    } catch (error) {
      console.error("Something went wrong buying the star...", error)
      makeToast("Something went wrong... Check the console for details")
    }
    setLoading(false)
  }

  const buyModal = isBuyModalOpen ? (
    <BuyStar
      activeStar={activeStar}
      isBuyModalOpen={isBuyModalOpen}
      toggleBuyModal={toggleBuyModal}
      handleBuyStar={handleBuyStar}
      handleRequestPermissionToBuy={handleRequestPermissionToBuy}
    />
  ) : null

  // Exchange stars with another user
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false)
  const [checkingApproval, setCheckingApproval] = useState(false)
  const toggleExchangeModal = () => {
    setIsExchangeModalOpen(!isExchangeModalOpen)
  }

  const setApprovalForThem = async (bool, them) => {
    setCheckingApproval(true)
    try {
      await instance.methods
        .setApprovalForAll(them, bool)
        .send({ from: accounts[0], value: 0 })
      setCheckingApproval(false)
      makeToast("You've granted your approval!", ":)")
    } catch (error) {
      setCheckingApproval(false)
      makeToast("Something went wrong... Check the console for details")
    }
  }

  const handleExchangeStars = async (you, them, yourStars, theirStars) => {
    setLoading(true)
    toggleExchangeModal()
    const stars = [
      ...yourStars.map((star) => {
        const swapStar = {
          from: you,
          to: them,
          id: star.id,
        }
        return swapStar
      }),
      ...theirStars.map((star) => {
        const swapStar = {
          from: them,
          to: you,
          id: star.id,
        }
        return swapStar
      }),
    ]
    try {
      await instance.methods
        .exchangeStars(stars)
        .send({ from: accounts[0], value: 0 })

      makeToast("You swapped it!", true)
    } catch (error) {
      console.error("Something went wrong exchanging stars...", error)
      makeToast("Something went wrong... Check the console for details")
    }
    setLoading(false)
  }

  const exchangeModal = isExchangeModalOpen ? (
    <ExchangeStars
      activeStar={activeStar}
      isExchangeModalOpen={isExchangeModalOpen}
      toggleExchangeModal={toggleExchangeModal}
      handleExchangeStars={handleExchangeStars}
      setApprovalForThem={setApprovalForThem}
      checkingApproval={checkingApproval}
    />
  ) : null

  // Close modals on web3 change
  useEffect(() => {
    setIsCreateModalOpen(false)
    setIsExchangeModalOpen(false)
    setIsApprovalModalOpen(false)
    setIsSellModalOpen(false)
    setIsBuyModalOpen(false)
    setIsTransferModalOpen(false)
  }, [web3])

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>
  }

  return (
    <div className="App">
      {createModal}
      {sellModal}
      {buyModal}
      {approvalModal}
      {exchangeModal}
      {transferModal}
      <Stars />
      <ToastContainer />

      <h1>{tokenName || "CryptoStar"}</h1>
      <h2>{tokenSymbol ? `(${tokenSymbol}) ERC721 Token` : "ERC721 Token"}</h2>
      {contractURI ? (
        <>
          <h3>Deployed on Rinkeby</h3>
          <h3>
            <a
              href={`https://rinkeby.etherscan.io/address/${contractURI}`}
              target="_blank"
              rel="noreferrer"
            >
              {contractURI}
            </a>
          </h3>
        </>
      ) : null}

      {loading ? (
        <Loader
          type="BallTriangle"
          color="#00BFFF"
          height={100}
          width={100}
          style={{ paddingTop: "20px", margin: "auto" }}
        />
      ) : (
        <div className="starCardsContainer">
          {ids.map((id) => (
            <StarCard
              key={id}
              id={id}
              setActiveStar={setActiveStar}
              toggleCreateModal={toggleCreateModal}
              toggleSellModal={toggleSellModal}
              toggleBuyModal={toggleBuyModal}
              toggleExchangeModal={toggleExchangeModal}
              toggleApprovalModal={toggleApprovalModal}
              toggleTransferModal={toggleTransferModal}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
