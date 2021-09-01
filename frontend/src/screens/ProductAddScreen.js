import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { createProduct } from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

const ProductAddScreen = ({ match, history }) => {

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [images, setImages] = useState([{url: ''}])
  const [category, setCategory] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
//   const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error } = productDetails

  const productCreate = useSelector((state) => state.productCreate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productCreate

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      createProduct({
        name,
        price,
        images,
        category,
        description,
        videoUrl
      })
    )
  }

  const updateImage = (imgUrl, index) => {
    const localImages = [...images];
    localImages[index].url = imgUrl;
    setImages([...localImages]);
  };

  const addMoreImage = () => {
    const localImages = [...images];
    localImages.push({url: ""});
    setImages([...localImages]);
  };

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_CREATE_RESET })
      history.push('/admin/productlist')
    }
  }, [dispatch, history, successUpdate])

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Add Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
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
              <Form.Label>Images</Form.Label>
              {images.map((img, ind) => {
                  return <Form.Control
                    key={ind}
                    type='text'
                    placeholder={`Enter image ${ind + 1} url`}
                    value={images[ind].url}
                    onChange={(e) => updateImage(e.target.value, ind)}
                    ></Form.Control>
              })}
              <Button type='button' variant='primary' onClick={addMoreImage}>
                +
              </Button>
            </Form.Group>

            <Form.Group controlId='video'>
              <Form.Label>Video</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter video url'
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              ></Form.Control>
            </Form.Group>

            {/* <Form.Group controlId='countInStock'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter countInStock'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group> */}

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
              Save
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default ProductAddScreen
