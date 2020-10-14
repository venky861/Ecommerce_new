import React, { useEffect } from "react"
import { Table, Button, Row, Col } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import ErrorMessage from "../components/ErrorMessage"
import Paginate from "../components/Paginate"

import Loader from "../components/Loader"
import { LinkContainer } from "react-router-bootstrap"
import {
  listProducts,
  deleteProducts,
  createProduct,
} from "../action/productAction"
import { PRODUCT_CREATE_RESET } from "../constants/productConstants"

const ProductListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1
  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, users, products, error, page, pages } = productList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productDelete = useSelector((state) => state.productDelete)
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: deleteSuccess,
  } = productDelete

  const productCreate = useSelector((state) => state.productCreate)
  const {
    loading: loadingCreate,
    product: createdProduct,
    error: errorCreate,
    success: successCreate,
  } = productCreate

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET })

    if (userInfo && !userInfo.isAdmin) {
      history.push("/login")
    }

    if (successCreate && !loading) {
      history.push(`/admin/product/${createdProduct._id}/edit`)
      // console.log("product created")
    }
    dispatch(listProducts("", pageNumber))
  }, [dispatch, history, deleteSuccess, successCreate, pageNumber, userInfo])

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteProducts(id))
    }
  }

  const createProductHandler = () => {
    dispatch(createProduct())
  }

  console.log(createdProduct)

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h2 className='my-4'>Products</h2>
        </Col>
        <Col className='text-right'>
          <Button className='my-3' onClick={createProductHandler}>
            <i className='fas fa-plus'></i> Create Product
          </Button>
        </Col>
      </Row>

      {(loadingDelete || loadingCreate) && <Loader />}
      {errorDelete && <ErrorMessage variant='red'>{errorDelete}</ErrorMessage>}
      {errorCreate && <ErrorMessage variant='red'>{errorCreate}</ErrorMessage>}

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage variant='red'>{error}</ErrorMessage>
      ) : (
        <>
          <Table striped bordered responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {typeof products !== "undefined" &&
                products.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>${product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>

                    <td>
                      <LinkContainer to={`/admin/product/${product._id}/edit`}>
                        <Button className='btn-sm' variant='light'>
                          <i className='fas fa-edit'></i>
                        </Button>
                      </LinkContainer>
                      <Button
                        variant='danger'
                        onClick={() => deleteHandler(product._id)}
                      >
                        <i className='fas fa-trash'></i>
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <Paginate page={page} pages={pages} isAdmin={userInfo.isAdmin} />
        </>
      )}
    </>
  )
}

export default ProductListScreen
