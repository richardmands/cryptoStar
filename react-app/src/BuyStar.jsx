import React, { useEffect, useState, useContext } from "react"
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
} from "reactstrap"
import { store } from "./store"
import useAccounts from "./useAccounts"

const BuyStar = ({
  activeStar,
  isBuyModalOpen,
  toggleBuyModal,
  handleBuyStar,
  handleRequestPermissionToBuy,
}) => {
  const { state } = useContext(store)
  const { web3, stars, accounts } = state
  const { price = 0 } = stars[activeStar] || {}
  const [, , approved] = useAccounts(accounts[0], null, activeStar)

  const [disabled, setDisabled] = useState(true)
  useEffect(() => {
    if (price) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [price])

  return (
    <Modal
      isOpen={isBuyModalOpen}
      toggle={toggleBuyModal}
      className="createStarModal"
    >
      <ModalHeader toggle={toggleBuyModal}>
        Buy This Star - {activeStar}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={() => !disabled && handleBuyStar}>
          <FormGroup>
            <Label for="starPrice">
              Price in Ether:{" "}
              {web3 && price && web3.utils.fromWei(price, "ether")}
            </Label>
          </FormGroup>
          {!approved ? (
            <FormGroup>
              <Label for="starPrice">
                You can't buy yet. Please request their approval before making
                the purchase.
              </Label>
            </FormGroup>
          ) : (
            <FormGroup>
              <Label for="starPrice">Great! They've approved the sale!</Label>
            </FormGroup>
          )}
        </Form>
      </ModalBody>
      <ModalFooter>
        {!approved ? (
          <Button color="warning" onClick={handleRequestPermissionToBuy}>
            Request Star
          </Button>
        ) : (
          <Button
            color="primary"
            onClick={() => handleBuyStar(price)}
            disabled={!approved}
          >
            Buy Star
          </Button>
        )}{" "}
        <Button color="secondary" onClick={toggleBuyModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default BuyStar
