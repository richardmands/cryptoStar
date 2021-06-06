import React from "react"
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

import useStar from "./useStar"

const ApproveRequest = ({
  activeStar,
  isApprovalModalOpen,
  toggleApprovalModal,
  handleApproveSaleRequest,
}) => {
  const [, , , , requestAddress] = useStar(activeStar)
  return (
    <Modal
      isOpen={isApprovalModalOpen}
      toggle={toggleApprovalModal}
      className="createStarModal"
    >
      <ModalHeader toggle={toggleApprovalModal}>
        Sell This Star - {activeStar}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={() => handleApproveSaleRequest}>
          <FormGroup>
            <Label for="starPrice">
              {requestAddress} wants to buy your star.
            </Label>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="success"
          onClick={() => handleApproveSaleRequest(requestAddress, true)}
        >
          Approve
        </Button>{" "}
        <Button
          color="danger"
          onClick={() => handleApproveSaleRequest(requestAddress, false)}
        >
          Decline
        </Button>{" "}
        <Button color="secondary" onClick={toggleApprovalModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ApproveRequest
