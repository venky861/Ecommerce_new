import React, { useState, useEffect } from "react"
import { getUserDetails, updateUserProfile } from "../action/userAction"
import { listMyOrders } from "../action/orderAction"
import { Form, Button, Row, Col, Table } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import ErrorMessage from "../components/ErrorMessage"
import Loader from "../components/Loader"

const ProfileScreen = ({ history }) => {
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userDetails = useSelector((state) => state.userDetails)
  const { user, error, loading } = userDetails

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const { success } = userUpdateProfile

  const orderListMy = useSelector((state) => state.orderListMy)
  const { orders, loading: loadingOrders, error: errorOrders } = orderListMy

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState(null)
  const [name, setName] = useState("")

  useEffect(() => {
    if (!userInfo) {
      history.push("/login")
    } else {
      dispatch(getUserDetails("profile"))
      dispatch(listMyOrders())
      if (userInfo) {
        setName(userInfo.name)
        setEmail(userInfo.email)
      }
    }
  }, [dispatch, userInfo, history])

  const submitHandler = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage("Password does not match")
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }))
    }
  }

  console.log(orders && orders)

  return (
    <>
      <Row>
        <Col md={3}>
          <h2>User Profile</h2>
          {error && <ErrorMessage variant='danger'>{error}</ErrorMessage>}
          {message && <ErrorMessage variant='danger'>{message}</ErrorMessage>}
          {success && (
            <ErrorMessage variant='success'>Profile Updated</ErrorMessage>
          )}

          {loading && <Loader />}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter your name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter your email ID'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='password'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirm your password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button type='submit' variant='primary'>
              Update
            </Button>
          </Form>
        </Col>
        <Col md={9}>
          <h2>My orders</h2>
          {loadingOrders ? (
            <Loader />
          ) : errorOrders ? (
            <ErrorMessage variant='danger'>{errorOrders}</ErrorMessage>
          ) : (
            <Table striped bordered hover responsive className='table-sm'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {typeof orders !== "undefined" &&
                  orders[0]._id &&
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>{order.totalPrice}</td>
                      <td>
                        {order.isPaid ? (
                          order.paidAt.substring(0, 10)
                        ) : (
                          <i
                            className='fas fa-times'
                            style={{ color: "red" }}
                          ></i>
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          order.deliveredAt.substring(0, 10)
                        ) : (
                          <i
                            className='fas fa-times'
                            style={{ color: "red" }}
                          ></i>
                        )}
                      </td>
                      <td>
                        <LinkContainer to={`/order/${order._id}`}>
                          <Button
                            className='btn-sm'
                            type='button'
                            variant='light'
                          >
                            Details
                          </Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </>
  )
}

export default ProfileScreen
