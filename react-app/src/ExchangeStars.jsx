import React, { useEffect, useState, useContext } from "react"
import Loader from "react-loader-spinner"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import { store } from "./store"
import useAccounts from "./useAccounts"

const ExchangeStars = ({
  activeStar,
  isExchangeModalOpen,
  toggleExchangeModal,
  handleExchangeStars,
  setApprovalForThem,
  checkingApproval,
}) => {
  const { state } = useContext(store)
  const { stars, accounts } = state

  const you = accounts[0]
  const them = stars[activeStar]?.owner
  const [yourApproval, theirApproval] = useAccounts(
    you,
    them,
    null,
    checkingApproval
  )

  const starsArray = Object.values(stars)
  const yourStars = you && starsArray.filter((star) => star?.owner === you)
  const theirStars =
    them && starsArray.filter((star) => star.owner && star.owner === them)

  const [disabled, setDisabled] = useState(true)
  useEffect(() => {
    if (yourApproval && theirApproval) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [yourApproval, theirApproval])
  return (
    <Modal
      isOpen={isExchangeModalOpen}
      toggle={toggleExchangeModal}
      className="createStarModal"
    >
      <ModalHeader toggle={toggleExchangeModal}>
        Exchange Your Stars
      </ModalHeader>
      {checkingApproval ? (
        <Loader
          type="Rings"
          color="#00BFFF"
          height={100}
          width={100}
          style={{ paddingTop: "20px", margin: "auto" }}
        />
      ) : (
        <ModalBody>
          Swap your stars with the other user! <br />
          You have {yourStars?.length || 0} stars. <br />
          They have {theirStars?.length || 0} stars. <br />
          Both accounts need to have approved each other: <br />
          <br />
          {!yourApproval ? (
            <Button
              color="danger"
              onClick={() => setApprovalForThem(true, them)}
            >
              Approve this user?
            </Button>
          ) : (
            <>
              "Great! You've already given your approval."
              <br />
              <Button
                color="warning"
                onClick={() => setApprovalForThem(false, them)}
              >
                Revoke Approval?
              </Button>{" "}
            </>
          )}
          <br />
          <br />
          {!theirApproval
            ? "Uh oh... They haven't approved you yet."
            : "Great! They've approved you."}
        </ModalBody>
      )}
      <ModalFooter>
        <Button
          color="primary"
          onClick={() => handleExchangeStars(you, them, yourStars, theirStars)}
          disabled={disabled}
        >
          Exchange Stars
        </Button>{" "}
        <Button color="secondary" onClick={toggleExchangeModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ExchangeStars
