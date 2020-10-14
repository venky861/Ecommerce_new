import React from "react"
import "./App.css"
import Meta from "./components/Meta"
import { Container } from "react-bootstrap"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Homepage from "./displays/Homepage"
import ProductDisplay from "./displays/Productdisplay"
import CartScreen from "./displays/CartScreen"
import LoginScreen from "./displays/LoginScreen"
import ShippingScreen from "./displays/ShippingScreen"
import PaymentScreen from "./displays/PaymentScreen"

import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import RegisterScreen from "./displays/RegisterScreen"
import ProfileScreen from "./displays/ProfileScreen"
import PlaceOrderScreen from "./displays/PlaceOrderScreen"
import OrderScreen from "./displays/OrderScreen"
import UserListScreen from "./displays/UserListScreen"
import UserEditScreen from "./displays/UserEditScreen"
import ProductListScreen from "./displays/ProductListScreen"
import ProductEditScreen from "./displays/ProductEditScreen"
import OrderListScreen from "./displays/OrderListScreen"

function App() {
  return (
    <>
      <Meta />
      <Router>
        <Header />
        <main className='py-3'>
          <Container>
            <Switch>
              <Route path='/' exact component={Homepage} />
              <Route path='/page/:pageNumber' exact component={Homepage} />
              <Route path='/search/:keyword' exact component={Homepage} />
              <Route
                path='/search/:keyword/page/:pageNumber'
                component={Homepage}
              />
              <Route path='/product/:id' component={ProductDisplay} />
              <Route path='/cart/:id?' component={CartScreen} />
              <Route path='/login' component={LoginScreen} />
              <Route path='/register' component={RegisterScreen} />
              <Route path='/profile' component={ProfileScreen} />
              <Route path='/shipping' component={ShippingScreen} />
              <Route path='/payment' component={PaymentScreen} />
              <Route path='/placeorder' component={PlaceOrderScreen} />
              <Route path='/order/:id' component={OrderScreen} />
              <Route path='/admin/userlist' component={UserListScreen} />
              <Route path='/admin/user/:id/edit' component={UserEditScreen} />

              <Route
                path='/admin/product/:id/edit'
                component={ProductEditScreen}
              />
              <Route
                path='/admin/productlist'
                component={ProductListScreen}
                exact
              />
              <Route
                path='/admin/productlist/:pageNumber'
                component={ProductListScreen}
                exact
              />

              <Route path='/admin/orderlist' component={OrderListScreen} />
            </Switch>
          </Container>
        </main>
        <Footer />
      </Router>
    </>
  )
}

export default App

/*
const [arr, setArr] = useState(null)

  setTimeout(() => {
    setArr([])
  }, 3000)

  return <div>{arr && arr.map((items) => <div>{items}</div>)}</div>


*/
