import React, { useState, useEffect } from "react"
import { Form, Button, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import ErrorMessage from "../components/ErrorMessage"
import Loader from "../components/Loader"
import FormContainer from "../components/FormContainer"
import { listProductDetail, updateProduct } from "../action/productAction"
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants"
import axios from "axios"

const ProductEditScreen = ({ match, history }) => {
  const ProductId = match.params.id
  const dispatch = useDispatch()

  const productDetail = useSelector((state) => state.productDetail)
  const { error, loading, product } = productDetail

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    error: errorUpdate,
    loading: loadingUpdate,
    success: successUpdate,
  } = productUpdate

  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState("")
  const [category, setCategory] = useState("")
  const [brand, setBrand] = useState("")
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState("")
  const [numReviews, setNumReviews] = useState(0)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      history.push("/admin/productlist")
    } else {
      if (product._id !== ProductId) {
        dispatch(listProductDetail(ProductId))
      } else if (!loading) {
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setCategory(product.category)
        setBrand(product.brand)
        setCountInStock(product.countInStock)
        setDescription(product.description)
        setNumReviews(numReviews)
      }
    }
  }, [dispatch, loading, ProductId, product, successUpdate])

  console.log(successUpdate)

  const submitHandler = (e) => {
    e.preventDefault()

    dispatch(
      updateProduct({
        _id: ProductId,
        name,
        price,
        brand,
        category,
        countInStock,
        description,
        image,
        numReviews,
      })
    )
  }

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append("image", file)
    setUploading(true)
    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      }

      const { data } = await axios.post("/api/upload", formData, config)
      setImage(data)
      setUploading(false)
    } catch (err) {
      console.log(err)
      setUploading(false)
    }
  }

  return (
    <div>
      <FormContainer>
        <Link to='/admin/productlist' className='btn btn-light my-3'>
          Go Back
        </Link>
        <h2>Edit Product</h2>
        {loading || (loadingUpdate && <Loader />)}
        {error && <ErrorMessage variant='danger'>{error}</ErrorMessage>}
        {errorUpdate && (
          <ErrorMessage variant='danger'>{errorUpdate}</ErrorMessage>
        )}
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage variant='danger'>{error}</ErrorMessage>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter your product name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='image'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Image URL'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.File
                id='image-file'
                label='Choose a file'
                custom
                onChange={(e) => uploadFileHandler(e)}
              ></Form.File>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='countInStock'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter countInStock'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='numReviews'>
              <Form.Label>numReviews</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter numReviews'
                value={numReviews}
                onChange={(e) => setNumReviews(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </div>
  )
}

export default ProductEditScreen
