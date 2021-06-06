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

const CreateStar = ({
  activeStar,
  isCreateModalOpen,
  toggleCreateModal,
  handleCreateStar,
  newName,
  setNewName,
}) => {
  const [disabled, setDisabled] = useState(true)
  useEffect(() => {
    if (newName) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [newName])

  const handleSetNewName = (event) => {
    setNewName(event.target.value)
  }

  return (
    <Modal
      isOpen={isCreateModalOpen}
      toggle={toggleCreateModal}
      className="createStarModal"
    >
      <ModalHeader toggle={toggleCreateModal}>
        Create This Star - {activeStar}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={() => !disabled && handleCreateStar}>
          <FormGroup>
            <Label for="starMa,e">Name</Label>
            <Input
              type="text"
              name="starName"
              id="starName"
              placeholder="Enter your Star's name here"
              onChange={handleSetNewName}
              value={newName}
              required
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleCreateStar} disabled={disabled}>
          Create Star
        </Button>{" "}
        <Button color="secondary" onClick={toggleCreateModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default CreateStar
