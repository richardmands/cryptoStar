import { useState, useEffect } from "react"
import Web3 from "web3"

function useWeb3(gp, gl) {
  const [connectedWeb3, setConnectedWeb3] = useState(null)
  const [accounts, setAccounts] = useState(null)
  const [gasPrice, setGasPrice] = useState(0)
  const [gasLimit, setGasLimit] = useState(0)

  const getWeb3 = () =>
    new Promise((resolve, reject) => {
      // Wait for loading completion to avoid race conditions with web3 injection timing.
      window.addEventListener("load", async () => {
        // Modern dapp browsers...
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum)
          try {
            await window.ethereum.enable()
            console.log("Ethereum Enabled!")
            resolve(web3)
          } catch (error) {
            reject(error)
          }
          window.ethereum.on("accountsChanged", async (data) => {
            const newWeb3 = new Web3(window.ethereum)
            try {
              await window.ethereum.enable()
              console.log("Ethereum Enabled!")
              resolve(web3)
            } catch (error) {
              reject(error)
            }
            setAccounts(data)
            setConnectedWeb3(newWeb3)
          })

          window.ethereum.on("networkChanged", async () => {
            const newWeb3 = new Web3(window.ethereum)
            try {
              await window.ethereum.enable()
              console.log("Ethereum Enabled!")
              resolve(web3)
            } catch (error) {
              reject(error)
            }
            setConnectedWeb3(newWeb3)
          })
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          const { web3 } = window
          console.log("Injected web3 detected.")
          resolve(web3)
        }
        // Fallback to localhost; use dev console port by default...
        else {
          const provider = new Web3.providers.HttpProvider(
            "http://127.0.0.1:8545"
          )
          const web3 = new Web3(provider)
          console.log("No web3 instance injected, using Local web3.")
          resolve(web3)
        }
      })
    })

  useEffect(() => {
    async function prepareWeb3() {
      const web3 = await getWeb3()
      setConnectedWeb3(web3)

      const userAccounts = await web3.eth.getAccounts()
      setAccounts(userAccounts)
      setGasPrice(web3 && Number(web3.utils.toWei(gp.amount, gp.unit)))
      setGasLimit(web3 && Number(web3.utils.toWei(gl.amount, gl.unit)))
    }

    if (!connectedWeb3) {
      prepareWeb3()
    }
  }, [gp, gl])

  return [connectedWeb3, accounts, gasPrice, gasLimit]
}

export default useWeb3
