import React, { useState, useEffect } from "react"
import { Form, Button, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import ErrorMessage from "../components/ErrorMessage"
import Loader from "../components/Loader"
import FormContainer from "../components/FormContainer"
import { getUserDetails, updateUsers } from "../action/userAction"
import { LinkContainer } from "react-router-bootstrap"
import { USER_UPDATE_RESET } from "../constants/userConstants"

const UserEditScreen = ({ match, history }) => {
  const UserId = match.params.id
  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { error, loading } = userDetails

  const userUpdate = useSelector((state) => state.userUpdate)
  const {
    error: errorUpdate,
    loading: loadingUpdate,
    success: successUpdate,
  } = userUpdate

  let user = userDetails.user

  const [email, setEmail] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [name, setName] = useState("")

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET })
      history.push("/admin/userlist")
    } else {
      if (typeof user === "undefined" || Object.keys(user).length === 0) {
        console.log("dispatch called")
        dispatch(getUserDetails(UserId))
      } else if (!loading) {
        console.log("set all called")
        setEmail(user.email)
        setIsAdmin(user.isAdmin)
        setName(user.name)
      }
    }
  }, [dispatch, loading, successUpdate])

  console.log(user)

  const submitHandler = (e) => {
    e.preventDefault()

    dispatch(updateUsers({ _id: UserId, email, isAdmin, name }))
  }

  return (
    <div>
      <FormContainer>
        <Link to='/admin/userlist' className='btn btn-light my-3'>
          Go Back
        </Link>
        <h2>Edit User</h2>
        {loadingUpdate && <Loader />}
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

            <Form.Group controlId='isAdmin'>
              <Form.Check
                type='checkbox'
                label='Is Admin'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
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

export default UserEditScreen
