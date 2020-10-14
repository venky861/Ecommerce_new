import React, { useState, useEffect } from "react"
import { Form, Button, Row, Col, Card, ListGroup, Image } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import CheckOut from "../components/CheckOut"
import FormContainer from "../components/FormContainer"
import ErrorMessage from "../components/ErrorMessage"
import { Link } from "react-router-dom"
import { createOrder } from "../action/orderAction"

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)
  const orderCreate = useSelector((state) => state.orderCreate)
  console.log(orderCreate)
  const { order, success, error } = orderCreate

  // calculate price

  cart.itemsPrice =
    cart.cartItems.length > 0 &&
    cart.cartItems
      .reduce((total, item) => total + item.price * item.qty, 0)
      .toFixed(2)

  cart.shippingPrice = cart.itemsPrce < 100 ? 10 : 40

  cart.taxPrice = Number(cart.itemsPrice * 0.18).toFixed(2)
  console.log(cart.itemsPrice, cart.shippingPrice, cart.taxPrice)
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2)

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`)
    }
  }, [success])

  const placeOrderHandler = () => {
    console.log("clicked")
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        taxPrice: cart.taxPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
      })
    )
  }
  return (
    <>
      <CheckOut step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong>
                {cart.shippingAdress.address}, {cart.shippingAdress.city},{" "}
                {cart.shippingAdress.postalCode}, {cart.shippingAdress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment method</h2>
              <strong>Method:</strong> {cart.paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <ErrorMessage>Your Cart is empty</ErrorMessage>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item) => (
                    <ListGroup.Item key={item.product}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} × {item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <ErrorMessage variant='danger'>{error}</ErrorMessage>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  onClick={placeOrderHandler}
                  className='btn btn-block'
                  disabled={cart.cartItems === 0}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen
