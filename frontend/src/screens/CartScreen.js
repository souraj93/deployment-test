import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'
import { createOrder } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'

const CartScreen = ({ match, location, history }) => {
  const [contactNumber, changeContactNumber] = useState("");
  const [openModal, toggleModal] = useState(false);
  const [isContactNumberEmptyError, toggleError] = useState(false);

  const productId = match.params.id

  const qty = location.search ? Number(location.search.split('=')[1]) : 1

  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  const orderCreate = useSelector((state) => state.orderCreate)
  const { success, error } = orderCreate

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty))
    }
  }, [dispatch, productId, qty])

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        history.push(`/page/1`);
        dispatch({ type: ORDER_CREATE_RESET })
      }, 2000);
    }
    // eslint-disable-next-line
  }, [history, success])

  const notify = () => {
    toggleModal(true);
  }

  const sendToSeller = () => {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2)
    }
    console.log("cartItems ", cartItems)
    const itemsPrice = addDecimals(
      cartItems.reduce((acc, item) => acc + item.price, 0)
    )
    const totalPrice = (
      Number(itemsPrice)
    ).toFixed(2)

    cartItems.forEach(each => {
      each.image = each.images[0].url;
    });

    if (contactNumber.trim().length && contactNumber.trim().length === 10) {
      dispatch(
        createOrder({
          orderItems: cartItems,
          itemsPrice: itemsPrice,
          totalPrice: totalPrice,
          deliveryPhoneNumber: contactNumber
        })
      )
    } else {
      toggleError(true);
    }
  }

  return (
    <Row>
      <div className={`modal fade ${openModal ? 'show modal-display-class' : ''}`} id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Contact Number</h5>
              <button type="button" onClick={() => { toggleModal(false); changeContactNumber(""); }} className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                {isContactNumberEmptyError ?
                <Message>
                  {!contactNumber.trim().length ?
                  "Please enter your contact number" : "Please enter a valid 10 digit number" }
                </Message> : null}
                {success ?
                <Message>
                  Request Sent Successfully!
                </Message> : null}
                {error ? 
                <Message variant='danger'>{error}</Message> : null}
                <div className="form-group">
                  <label for="recipient-name" className="col-form-label">Enter contact number</label>
                  <input type="text" className="form-control" id="recipient-name" value={contactNumber} onChange={e => {changeContactNumber(e.target.value.replace(/\D/, '')); toggleError(false); }} required maxLength={10} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { toggleModal(false); changeContactNumber(""); }}>Close</button>
              <button type="button" className="btn btn-primary" onClick={sendToSeller}>Send</button>
            </div>
          </div>
        </div>
      </div>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to='/page/1'>Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    {item.images && item.images.length ?
                      <Image src={item.images[0].url} alt={item.name} fluid rounded /> : null}
                  </Col>
                  <Col md={5}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>Rs. {item.price}</Col>

                  <Col md={2}>
                    <Button
                      type='button'
                      variant='light'
                      className="pt-0"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>
                Subtotal ({cartItems.length})
                items
              </h2>
              Rs.
              {cartItems
                .reduce((acc, item) => acc + item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block'
                disabled={cartItems.length === 0}
                onClick={notify}
              >
                Notify Seller
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  )
}

export default CartScreen
