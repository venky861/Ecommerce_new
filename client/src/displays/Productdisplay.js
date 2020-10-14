import React, { useEffect, useState } from "react"
import { Row, Col, Card, Image, ListGroup, Button, Form } from "react-bootstrap"
import { Link } from "react-router-dom"
import Rating from "../components/Rating"
import { useDispatch, useSelector } from "react-redux"
import { listProductDetail, createProductReview } from "../action/productAction"
import Loader from "../components/Loader"
import ErrorMessage from "../components/ErrorMessage"
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants"
import Meta from "../components/Meta"

const Productdisplay = ({ history, match }) => {
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")

  const dispatch = useDispatch()
  const { loading, product, error } = useSelector(
    (state) => state.productDetail
  )
  const {
    error: errorReview,
    loading: loadingReview,
    success: successReview,
  } = useSelector((state) => state.productReviewCreate)

  const { userInfo } = useSelector((state) => state.userLogin)

  useEffect(() => {
    if (successReview) {
      alert("Review submitted")
      setRating(0)
      setComment("")
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    }
    dispatch(listProductDetail(match.params.id))
  }, [dispatch, match.params.id, successReview])

  const submitHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`)
  }

  const customerReviewHandler = (e) => {
    e.preventDefault()
    dispatch(createProductReview(match.params.id, { rating, comment }))
  }
  console.log(product)
  console.log(userInfo)

  console.log({ rating, comment })

  return (
    <>
      <Link to='/' className='btn btn-secondary my-2'>
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage variant='danger'>{error}</ErrorMessage>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h4>{product.name}</h4>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    rating={product.rating}
                    reviews={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item> Price: ${product.price} </ListGroup.Item>
                <ListGroup.Item>
                  {" "}
                  Description: {product.description}{" "}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card className='py-3'>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col> Price:</Col>
                      <Col>
                        {" "}
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                    <Row>
                      <Col> Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col className='mt-1'>Qty</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (val) => (
                                <option key={val + 1} value={val + 1}>
                                  {val + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      className='btn btn-block'
                      type='button'
                      disabled={product.countInStock === 0}
                      onClick={submitHandler}
                    >
                      Add to Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h2 className='my-2'>Reviews</h2>
              {product.review && product.review.length === 0 && (
                <ErrorMessage>No Reviews</ErrorMessage>
              )}
              <ListGroup variant='flush'>
                {product.review &&
                  product.review.map((review) => (
                    <ListGroup.Item key={review._id}>
                      <strong>{review.name}</strong>
                      <Rating rating={review.rating} />
                      <p>{review.createdAt}</p>
                      <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))}
                <ListGroup.Item>
                  <h3>Write a customer Review</h3>
                  {errorReview && (
                    <ErrorMessage variant='danger'>{errorReview}</ErrorMessage>
                  )}
                  {userInfo ? (
                    <Form onSubmit={customerReviewHandler}>
                      <Form.Group controlId='rating'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value=''>Select...</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good...</option>
                          <option value='4'>4 - Very good...</option>
                          <option value='5'>5 - Perfect...</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId='comment'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          row='3'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button type='submit' variant='primary'>
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <ErrorMessage>
                      Please <Link to='/login'>Login In</Link> to write a review
                    </ErrorMessage>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default Productdisplay
