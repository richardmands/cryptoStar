import { useState, useEffect } from "react"

function useContract({
  web3,
  smartContract,
  gasPrice,
  gasLimit,
  onSuccess,
  onFailure,
}) {
  const [contract, setContract] = useState(null)
  const [name, setName] = useState(null)
  const [symbol, setSymbol] = useState(null)
  const [contractURI, setContractURI] = useState(null)

  useEffect(() => {
    async function getName(instance) {
      const data = await instance.methods.name().call()
      setName(data)
    }

    async function getSymbol(instance) {
      const data = await instance.methods.symbol().call()
      setSymbol(data)
    }

    async function prepareContract() {
      try {
        setContract(null)
        const networkId = await web3.eth.net.getId()
        const deployedContract = smartContract.networks[networkId]
        if (!deployedContract) {
          onFailure()
        } else {
          const instance = new web3.eth.Contract(
            smartContract.abi,
            deployedContract && deployedContract.address,
            { gasPrice, gasLimit }
          )
          setContract(instance)
          const { _address: uri } = instance
          setContractURI(uri)
          await getName(instance)
          await getSymbol(instance)
          onSuccess()
        }
      } catch (error) {
        onFailure()
        console.error(error)
      }
    }

    if (web3 && gasPrice && gasLimit) {
      prepareContract()
    }
  }, [web3, gasPrice, gasLimit])

  return [contract, name, symbol, contractURI]
}

export default useContract
