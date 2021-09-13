import React, { useEffect, useState } from 'react'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import {
    listCategories,
    deleteCategory,
    createCategory,
    updateCategory
} from '../actions/categoryActions'
import { CATEGORY_CREATE_RESET, CATEGORY_UPDATE_RESET } from '../constants/categoryConstants'

const CategoryListScreen = ({ history, match }) => {
    const [name, changeName] = useState("");
    const [openModal, toggleModal] = useState(false);
    const [selectedCategory, selectCategory] = useState("");

    const dispatch = useDispatch()

    const categoryList = useSelector((state) => state.categoryList)
    const { loading, error, categories, page, pages } = categoryList

    const categoryDelete = useSelector((state) => state.categoryDelete)
    const {
        loading: loadingDelete,
        error: errorDelete,
        success: successDelete,
    } = categoryDelete

    const categoryCreate = useSelector((state) => state.categoryCreate)
    const {
        loading: loadingCreate,
        error: errorCreate,
        success: successCreate,
    } = categoryCreate

    const categoryUpdate = useSelector((state) => state.categoryUpdate)
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = categoryUpdate

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        dispatch({ type: CATEGORY_CREATE_RESET })

        if (!userInfo || !userInfo.isAdmin) {
            history.push('/login')
        }

        dispatch(listCategories('', 1))
    }, [
        dispatch,
        history,
        userInfo,
        successDelete
    ])

    useEffect(() => {
        if (successCreate) {
            dispatch({ type: CATEGORY_CREATE_RESET })
            dispatch(listCategories('', 1))
            toggleModal(false);
            changeName("");
        }
    }, [dispatch, history, successCreate])

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: CATEGORY_UPDATE_RESET })
            dispatch(listCategories('', 1))
            toggleModal(false);
            changeName("");
        }
    }, [dispatch, history, successUpdate])

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure')) {
            dispatch(deleteCategory(id))
        }
    }

    const createProductHandler = () => {
        // dispatch(createProduct())
        toggleModal(true);
    }

    const save = () => {
        if (!selectedCategory) {
            dispatch(
                createCategory({
                    name
                })
            )
        } else {
            dispatch(
                updateCategory({
                    _id: selectedCategory,
                    name
                })
            )
        }
    }

    const chooseCategory = (cat) => {
        selectCategory(cat._id);
        changeName(cat.name);
        toggleModal(true);
    }

    return (
        <>
            <Row>
                <div className={`modal fade ${openModal ? 'show modal-display-class' : ''}`} id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Add/ Edit Category</h5>
                                <button type="button" onClick={() => { toggleModal(false); changeName(""); selectCategory(""); }} className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="recipient-name" className="col-form-label">Category Name:</label>
                                        <input type="text" className="form-control" id="recipient-name" value={name} onChange={e => changeName(e.target.value)} />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { toggleModal(false); changeName(""); selectCategory(""); }}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={save}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Row>
            <Row className='align-items-center'>
                <Col>
                    <h1>Categories</h1>
                </Col>
                <Col className='text-right'>
                    <Button className='my-3' onClick={createProductHandler}>
                        <i className='fas fa-plus'></i> Create Category
                    </Button>
                </Col>
            </Row>
            {loadingDelete && <Loader />}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
            {loadingCreate && <Loader />}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
            {loadingUpdate && <Loader />}
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <>
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>
                                        <Button variant='light' className='btn-sm' onClick={() => chooseCategory(product)}>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                        <Button
                                            variant='danger'
                                            className='btn-sm'
                                            onClick={() => deleteHandler(product._id)}
                                        >
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Paginate pages={pages} page={page} isAdmin={true} />
                </>
            )}
        </>
    )
}

export default CategoryListScreen
