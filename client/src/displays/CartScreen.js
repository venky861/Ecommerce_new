import React, { useEffect } from "react"
import { addToCart, removeFromCart } from "../action/cartActions"
import { useDispatch, useSelector } from "react-redux"
import ErrorMessage from "../components/ErrorMessage"
import { Row, Col, ListGroup, Form, Card, Button, Image } from "react-bootstrap"
import { Link } from "react-router-dom"
import Meta from "../components/Meta"

const CartScreen = ({ match, history, location }) => {
  const productId = match.params.id
  const qty = location.search ? Number(location.search.split("=")[1]) : 1

  // const { qty } = queryString.parse(location.search)
  //import queryString from "query-string"
  // console.log(qty)
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty))
    }
  }, [productId, qty, dispatch])

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  const checkOutHandler = () => {
    history.push("/login?redirect=shipping")
  }

  return (
    <>
      <Meta title='Cart' />
      <Row>
        <Col md={8}>
          <h1>Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <ErrorMessage>
              Your Cart is empty <Link to='/'>Go Back</Link>
            </ErrorMessage>
          ) : (
            <ListGroup variant='flush'>
              {cartItems.map((item) => (
                <ListGroup.Item key={item.product}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${productId}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>${item.price}</Col>
                    <Col md={2}>
                      <Form.Control
                        as='select'
                        value={item.qty}
                        onChange={(e) =>
                          dispatch(
                            addToCart(item.product, Number(e.target.value))
                          )
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((val) => (
                          <option key={val + 1} value={val + 1}>
                            {val + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={2}>
                      <Button
                        type='button'
                        variant='light'
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
              <h4 className='p-2'>
                Subtotal items (
                {cartItems.reduce((acc, item) => acc + item.qty, 0)})
              </h4>
              <span className='p-2'>
                $
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </span>
            </ListGroup>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn btn-block '
                disabled={cartItems.length === 0}
                onClick={checkOutHandler}
              >
                Proceed to Check out
              </Button>
            </ListGroup.Item>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default CartScreen
