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

const TransferStar = ({
  activeStar,
  isTransferModalOpen,
  toggleTransferModal,
  handleTransferStar,
  receiver,
  setReceiver,
}) => {
  const [disabled, setDisabled] = useState(true)
  useEffect(() => {
    if (receiver) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [receiver])

  const handleSetReceiver = (event) => {
    setReceiver(event.target.value)
  }

  return (
    <Modal
      isOpen={isTransferModalOpen}
      toggle={toggleTransferModal}
      className="createStarModal"
    >
      <ModalHeader toggle={toggleTransferModal}>
        Transfer This Star - {activeStar}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={() => !disabled && handleTransferStar}>
          <FormGroup>
            <Label for="starMa,e">Receiver's Address</Label>
            <Input
              type="text"
              name="starName"
              id="starName"
              placeholder="Enter your Receiver's address here"
              onChange={handleSetReceiver}
              value={receiver}
              required
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={handleTransferStar}
          disabled={disabled}
        >
          Transfer Star
        </Button>{" "}
        <Button color="secondary" onClick={toggleTransferModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default TransferStar
