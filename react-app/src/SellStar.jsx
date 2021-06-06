import React, { useEffect, useState } from "react"
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap"

const SellStar = ({
  activeStar,
  isSellModalOpen,
  toggleSellModal,
  handleSellStar,
  price,
  setPrice,
}) => {
  const [disabled, setDisabled] = useState(true)
  useEffect(() => {
    if (price) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [price])

  const handleSetPrice = (event) => {
    setPrice(event.target.value)
  }

  return (
    <Modal
      isOpen={isSellModalOpen}
      toggle={toggleSellModal}
      className="createStarModal"
    >
      <ModalHeader toggle={toggleSellModal}>
        Sell This Star - {activeStar}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={() => !disabled && handleSellStar}>
          <FormGroup>
            <Label for="starPrice">Price in Ether</Label>
            <Input
              type="text"
              name="starPrice"
              id="starPrice"
              placeholder="Enter your Star's price here"
              onChange={handleSetPrice}
              value={price}
              required
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSellStar} disabled={disabled}>
          Sell Star
        </Button>{" "}
        <Button color="secondary" onClick={toggleSellModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default SellStar
