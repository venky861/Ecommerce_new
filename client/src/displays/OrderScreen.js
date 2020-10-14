import React, { useState, useEffect } from "react"
import axios from "axios"
import { Form, Button, Row, Col, Card, ListGroup, Image } from "react-bootstrap"
import { PayPalButton } from "react-paypal-button-v2"
import { useDispatch, useSelector } from "react-redux"
import Loader from "../components/Loader"
import FormContainer from "../components/FormContainer"
import ErrorMessage from "../components/ErrorMessage"
import { Link } from "react-router-dom"
import { getOrderDetails, payOrder, deliverOrder } from "../action/orderAction"
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants"
import Moment from "react-moment"

const OrderScreen = ({ match, history }) => {
  const [sdkReady, setSdkReady] = useState(false)
  const orderId = match.params.id
  const dispatch = useDispatch()

  const orderDetails = useSelector((state) => state.orderDetails)
  const { error, loading, order } = orderDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderPay = useSelector((state) => state.orderPay)
  const { error: errorPay, loading: loadingPay, success: successPay } = orderPay

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const {
    error: errorDeliver,
    loading: loadingDeliver,
    success: successDeliver,
  } = orderDeliver

  if (!loading) {
    order.itemsPrice =
      order.orderItems.length > 0 &&
      order.orderItems
        .reduce((total, item) => total + item.price * item.qty, 0)
        .toFixed(2)
  }

  useEffect(() => {
    if (!userInfo) {
      history.push("/login")
    }
    const paypalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal")
      // console.log(clientId)
      const script = document.createElement("script")
      script.type = "text/javascript"
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }

    if (!order || order._id !== orderId || successPay || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
      if (!window.paypal) {
        paypalScript()
      }
    }
  }, [orderId, dispatch, successPay, order, loadingDeliver, userInfo])

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult)
    dispatch(payOrder(orderId, paymentResult))
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }

  console.log("order", order)
  return loading ? (
    <Loader />
  ) : error ? (
    <ErrorMessage variant='danger'>{error}</ErrorMessage>
  ) : (
    <>
      <h2>Order {order._id}</h2>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                {" "}
                <strong>
                  <label>Name: </label>
                  {order.user.name}
                </strong>
              </p>

              <p>
                <strong>
                  <label>Email: </label>
                  <a href={`/mailto:${order.user.email}`}>
                    {" "}
                    {order.user.email}
                  </a>
                </strong>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <ErrorMessage variant='success'>
                  Delivered on {order.deliveredAt}
                </ErrorMessage>
              ) : (
                <ErrorMessage variant='danger'>Not Delivered</ErrorMessage>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment method</h2>
              <p>
                <strong>Method:</strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <ErrorMessage variant='success'>
                  Paid on{" "}
                  <Moment format='YYYY/MM/DD' className='date mx-1'>
                    {order.paidAt}
                  </Moment>
                </ErrorMessage>
              ) : (
                <ErrorMessage variant='danger'>Not Paid</ErrorMessage>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <ErrorMessage>Your Order is empty</ErrorMessage>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item) => (
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
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <ErrorMessage variant='danger'>{error}</ErrorMessage>}
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}

              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
