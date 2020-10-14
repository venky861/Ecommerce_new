import React, { useEffect } from "react"
import { Row, Col } from "react-bootstrap"
import Product from "../components/Product"
import { listProducts } from "../action/productAction"
import { useDispatch, useSelector } from "react-redux"
import Loader from "../components/Loader"
import ErrorMessage from "../components/ErrorMessage"
import Paginate from "../components/Paginate"
import ProductCarousel from "../components/ProductCarousel"
import { Link } from "react-router-dom"

const Homepage = ({ match }) => {
  const keyword = match.params.keyword

  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()
  const { loading, products, error, pages, page } = useSelector(
    (state) => state.productList
  )

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber))
  }, [dispatch, keyword, pageNumber])

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to='/' className='btn btn-light'>
          Go Back
        </Link>
      )}
      <h2>Latest Products</h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage variant='danger'>{error}</ErrorMessage>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  )
}

export default Homepage
