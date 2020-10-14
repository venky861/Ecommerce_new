import {
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_REQUEST,
  PRODUCT_DETAIL_REQUEST,
  PRODUCT_DETAIL_SUCCESS,
  PRODUCT_DETAIL_FAIL,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_RESET,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_RESET,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_CREATE_REVIEW_RESET,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_REVIEW_FAIL,
  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRODUCT_TOP_FAIL,
} from "../constants/productConstants"
export const productListReducer = (state = { products: [] }, action) => {
  const { type, payload } = action
  console.log(payload)
  switch (type) {
    case PRODUCT_LIST_REQUEST:
      return { loading: true, products: [] }

    case PRODUCT_LIST_SUCCESS:
      return {
        loading: false,
        products: payload.products,
        pages: payload.pages,
        page: payload.page,
      }

    case PRODUCT_LIST_FAIL:
      return { loading: false, error: payload }

    default:
      return state
  }
}

export const productDetailReducer = (
  state = { product: { reviews: [] } },
  action
) => {
  const { type, payload } = action
  console.log(payload)
  switch (type) {
    case PRODUCT_DETAIL_REQUEST:
      return { loading: true, ...state }

    case PRODUCT_DETAIL_SUCCESS:
      return { loading: false, product: payload }

    case PRODUCT_DETAIL_FAIL:
      return { loading: false, error: payload }

    default:
      return state
  }
}

export const productDeleteReducer = (state = {}, action) => {
  const { type, payload } = action
  console.log(payload)
  switch (type) {
    case PRODUCT_DELETE_REQUEST:
      return { loading: true }

    case PRODUCT_DELETE_SUCCESS:
      return { loading: false, success: true }

    case PRODUCT_DELETE_FAIL:
      return { loading: false, error: payload }

    default:
      return state
  }
}

export const productCreateReducer = (state = { success: false }, action) => {
  const { type, payload } = action
  console.log(payload)
  switch (type) {
    case PRODUCT_CREATE_REQUEST:
      return { loading: true, success: false }

    case PRODUCT_CREATE_SUCCESS:
      return { loading: false, success: true, product: payload }

    case PRODUCT_CREATE_FAIL:
      return { loading: false, error: payload }

    case PRODUCT_CREATE_RESET:
      return {}

    default:
      return state
  }
}

export const productUpdateReducer = (state = { product: {} }, action) => {
  const { type, payload } = action
  console.log(payload)
  switch (type) {
    case PRODUCT_UPDATE_REQUEST:
      return { loading: true, success: false }

    case PRODUCT_UPDATE_SUCCESS:
      return { loading: false, success: true, product: payload }

    case PRODUCT_UPDATE_FAIL:
      return { loading: false, error: payload }

    case PRODUCT_UPDATE_RESET:
      return {}

    default:
      return state
  }
}
export const productReviewCreateReducer = (state = {}, action) => {
  const { type, payload } = action
  console.log(payload)
  switch (type) {
    case PRODUCT_CREATE_REVIEW_REQUEST:
      return { loading: true, success: false }

    case PRODUCT_CREATE_REVIEW_SUCCESS:
      return { loading: false, success: true }

    case PRODUCT_CREATE_REVIEW_FAIL:
      return { loading: false, error: payload }

    case PRODUCT_CREATE_REVIEW_RESET:
      return {}

    default:
      return state
  }
}

export const productTopRatedReducer = (state = { products: [] }, action) => {
  const { type, payload } = action
  console.log(payload)
  switch (type) {
    case PRODUCT_TOP_REQUEST:
      return { loading: true, success: false }

    case PRODUCT_TOP_SUCCESS:
      return { loading: false, products: payload }

    case PRODUCT_TOP_FAIL:
      return { loading: false, error: payload }

    default:
      return state
  }
}
