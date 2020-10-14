import React, { useEffect } from "react"
import { deleteUsers } from "../action/userAction"
import { Table, Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import ErrorMessage from "../components/ErrorMessage"
import Loader from "../components/Loader"
import FormContainer from "../components/FormContainer"
import { LinkContainer } from "react-router-bootstrap"
import { listUsers } from "../action/userAction"

const UserListScreen = ({ history }) => {
  const dispatch = useDispatch()

  const userList = useSelector((state) => state.userList)
  const { loading, users, error } = userList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userDelete = useSelector((state) => state.userDelete)
  const { success: successDelete } = userDelete

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers())
    } else {
      history.push("/login")
    }
  }, [dispatch, successDelete])

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteUsers(id))
    }
  }

  return (
    <>
      <h2 className='my-2'>Users</h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage variant='red'>{error}</ErrorMessage>
      ) : (
        <Table striped bordered responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {typeof users !== "undefined" &&
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td>
                    {user.isAdmin ? (
                      <i
                        className='fas fa-check'
                        style={{ color: "green" }}
                      ></i>
                    ) : (
                      <i className='fas fa-times' style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                      <Button className='btn-sm' variant='light'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      onClick={() => deleteHandler(user._id)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default UserListScreen
