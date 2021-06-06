import React, { useContext } from "react"
import { Button } from "reactstrap"
import useStar from "./useStar"
import { store } from "./store"
import { ZERO } from "./constants"

import "./StarCard.scss"

const StarCard = ({
  id,
  setActiveStar,
  toggleCreateModal,
  toggleExchangeModal,
  toggleSellModal,
  toggleBuyModal,
  toggleApprovalModal,
  toggleTransferModal,
}) => {
  const { state } = useContext(store)
  const { web3 } = state
  const [
    exists,
    name,
    owner,
    price,
    requestAddress,
    approvedAddress,
    yourAccount,
  ] = useStar(id)
  const isOwner = yourAccount?.toLowerCase() === owner?.toLowerCase()

  return (
    <div className="StarCard">
      <p className="cardRow">
        <span className="text">{`Star Id: ${id}`}</span>
      </p>

      {!exists ? (
        <p className="cardRow">
          <span className="action">
            <Button
              color="primary"
              onClick={() => {
                setActiveStar(id)
                toggleCreateModal()
              }}
            >
              Create Star?
            </Button>
          </span>
        </p>
      ) : (
        <div>
          <p className="cardRow">
            <span className="text">{`Name: ${name}`}</span>
          </p>

          <p className="cardRow">
            {owner ? (
              <span className="text">{`Owner: ${
                isOwner ? "You" : `...${owner.substr(-4)}`
              }`}</span>
            ) : null}
          </p>

          {price > 0 ? (
            <>
              <p className="cardRow">
                <span className="text">{`Price in Ether: 
                  ${web3.utils.fromWei(price, "ether")}`}</span>
              </p>
            </>
          ) : null}

          {(() => {
            if (owner && !isOwner && requestAddress === ZERO) {
              return (
                <>
                  {price > 0 ? (
                    <p className="cardRow">
                      <span className="action">
                        <Button
                          color="success"
                          onClick={() => {
                            setActiveStar(id)
                            toggleBuyModal()
                          }}
                        >
                          Buy Star
                        </Button>
                      </span>
                    </p>
                  ) : null}
                  <p className="cardRow">
                    <span className="action">
                      <Button
                        color="danger"
                        onClick={() => {
                          setActiveStar(id)
                          toggleExchangeModal()
                        }}
                      >
                        Swap Stars?
                      </Button>
                    </span>
                  </p>
                </>
              )
            }

            if (
              owner &&
              !isOwner &&
              requestAddress &&
              requestAddress !== yourAccount
            ) {
              return (
                <>
                  <p className="cardRow">
                    <span className="action">
                      Someone has already bid for this star
                    </span>
                  </p>
                </>
              )
            }

            if (
              owner &&
              !isOwner &&
              requestAddress &&
              approvedAddress === yourAccount
            ) {
              return (
                <>
                  <p className="cardRow">
                    <span className="action">
                      <Button
                        color="success"
                        onClick={() => {
                          setActiveStar(id)
                          toggleBuyModal()
                        }}
                      >
                        Complete Purchase
                      </Button>
                    </span>
                  </p>
                </>
              )
            }

            if (
              owner &&
              !isOwner &&
              requestAddress &&
              requestAddress === yourAccount
            ) {
              return (
                <>
                  <p className="cardRow">
                    <span className="action">
                      You've already bid for this star
                    </span>
                  </p>
                </>
              )
            }

            if (owner && isOwner && approvedAddress !== ZERO) {
              return (
                <>
                  <p className="cardRow">
                    <span className="text">
                      You've approved the sale of this star!
                    </span>
                  </p>
                </>
              )
            }

            if (owner && isOwner && requestAddress !== ZERO) {
              return (
                <>
                  <p className="cardRow">
                    <span className="text">Someone wants your star!</span>
                  </p>
                  <p className="cardRow">
                    <span className="action">
                      <Button
                        color="success"
                        onClick={() => {
                          setActiveStar(id)
                          toggleApprovalModal()
                        }}
                      >
                        Approve Request?
                      </Button>
                    </span>
                  </p>
                </>
              )
            }

            if (owner && isOwner) {
              return (
                <>
                  <p className="cardRow">
                    <span className="action">
                      <Button
                        color="info"
                        onClick={() => {
                          setActiveStar(id)
                          toggleTransferModal()
                        }}
                      >
                        Transfer Star?
                      </Button>
                    </span>
                  </p>

                  <p className="cardRow">
                    <span className="action">
                      <Button
                        color="warning"
                        onClick={() => {
                          setActiveStar(id)
                          toggleSellModal()
                        }}
                      >
                        {price > 0 ? "Change Price" : "Put Up For Sale?"}
                      </Button>
                    </span>
                  </p>
                </>
              )
            }

            return null
          })()}
        </div>
      )}
    </div>
  )
}

export default StarCard
