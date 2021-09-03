import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { listCategories } from '../actions/categoryActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [images, setImages] = useState([''])
  const [category, setCategory] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [description, setDescription] = useState('')

  const dispatch = useDispatch()

  const categoryList = useSelector((state) => state.categoryList)
  const { categories } = categoryList

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate

  useEffect(() => {
    if (categories && categories.length) {
      if (successUpdate) {
        dispatch({ type: PRODUCT_UPDATE_RESET })
        history.push('/admin/productlist')
      } else {
        if (!product.name || product._id !== productId) {
          dispatch(listProductDetails(productId))
        } else {
          setName(product.name)
          setVideoUrl(product.videoUrl)
          setPrice(product.price)
          setImages(product.images)
          // setCategory(product.category)
          setDescription(product.description)
          if (categories && categories.length) {
            categories.forEach(cat => {
              if (cat._id === product.category) {
                setCategory(cat._id);
              }
            })
          }
        }
      }
    }
  }, [dispatch, history, productId, product, successUpdate, categories])

  useEffect(() => {
    dispatch(listCategories('', 1));
  }, [dispatch])

  const submitHandler = (e) => {
    e.preventDefault()

    if (!images.length) {
      alert('Please add atleast one image');
      return;
    }
    dispatch(
      updateProduct({
        _id: productId,
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

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
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
                required
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
                required
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

            <Form.Group controlId='category'>
              <Form.Label>Category</Form.Label>
              {categories && categories.length ?
              <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                {categories.map(cat => {
                  return <option key={cat._id} value={cat._id}>{cat.name}</option>
                })}
              </select> : null}
              {/* <Form.Control
                type='text'
                placeholder='Enter category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control> */}
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                required
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
    </>
  )
}

export default ProductEditScreen
