import React, { useState } from "react"
import { Form, Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { saveShippingAddress } from "../action/cartActions"
import CheckOut from "../components/CheckOut"
import FormContainer from "../components/FormContainer"

const ShippingScreen = ({ history }) => {
  const dispatch = useDispatch()
  const { shippingAdress } = useSelector((state) => state.cart)

  const [address, setAddress] = useState(shippingAdress.address || "")
  const [city, setCity] = useState(shippingAdress.city || "")
  const [postalCode, setPostalCode] = useState(shippingAdress.postalCode || "")
  const [country, setCountry] = useState(shippingAdress.country || "")
  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(saveShippingAddress({ address, city, postalCode, country }))
    history.push("/payment")
  }

  return (
    <FormContainer>
      <CheckOut step1 step2 />
      <h2>Shipping</h2>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='address'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter your address'
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='city'>
          <Form.Label>City</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter your city'
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='postalcode'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter your postal code'
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='country'>
          <Form.Label>Country</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter your country'
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button variant='primary' type='submit'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default ShippingScreen
