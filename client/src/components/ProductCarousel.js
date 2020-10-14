import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { Carousel, Image } from "react-bootstrap"
import Loader from "./Loader"
import ErrorMessage from "./ErrorMessage"
import { listTopProducts } from "../action/productAction"
import { useDispatch, useSelector } from "react-redux"

const ProductCarousel = () => {
  const dispatch = useDispatch()

  const productTopRated = useSelector((state) => state.productTopRated)
  const { products, error, loading } = productTopRated

  useEffect(() => {
    dispatch(listTopProducts())
  }, [dispatch])

  console.log(products)
  return loading ? (
    <Loader />
  ) : error ? (
    <ErrorMessage variant='danger'>{error}</ErrorMessage>
  ) : (
    <Carousel pause='hover' className='bg-dark'>
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image
              src={product.image}
              className='rounded mx-auto d-block'
              alt={product.name}
              fluid
            />
            <Carousel.Caption className='carousel-caption'>
              <h3>
                {product.name} - ${product.price}
              </h3>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default ProductCarousel
