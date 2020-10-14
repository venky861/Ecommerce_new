import React, { useState } from "react"
import { Form, Button, Col, Row } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { savePaymentMethod } from "../action/cartActions"
import CheckOut from "../components/CheckOut"

import FormContainer from "../components/FormContainer"

const PaymentScreen = ({ history }) => {
  const dispatch = useDispatch()
  const { shippingAdress } = useSelector((state) => state.cart)

  if (!shippingAdress) {
    history.push("/shipping")
  }

  const [paymentMethod, setPaymentMethod] = useState("PayPal")

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    history.push("/placeorder")
  }

  return (
    <FormContainer>
      <CheckOut step1 step2 step3 />
      <h2>Payment Method</h2>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label>Select Method</Form.Label>
          <Col>
            <Form.Check
              type='radio'
              label='Paypal or credit Card'
              id='paypal'
              name='paymentMethod'
              value='PayPal'
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
            <Form.Check
              type='radio'
              label='Stripe'
              id='Stripe'
              name='paymentMethod'
              value='Stripe'
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button variant='primary' type='submit'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default PaymentScreen
