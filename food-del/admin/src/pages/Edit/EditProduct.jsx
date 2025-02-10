import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './EditProduct.css';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/food/${id}`);
      if (response.data.success) {
        setProduct(response.data.data);
      } else {
        toast.error("Error fetching product");
      }
    };

    fetchProduct();
  }, [id]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };

  const onFileChangeHandler = (event) => {
    setImageFile(event.target.files[0]);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('category', product.category);
    if (imageFile) {
      formData.append('image', imageFile);
    } else {
      formData.append('image', product.image);
    }

    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/food/update`, formData);
    if (response.data.success) {
      toast.success(response.data.message);
      navigate('/list'); // Navigate back to the list page
    } else {
      toast.error("Error updating product");
    }
  };

  return (
    <div className='edit-product'>
      <h2>Edit Product</h2>
      <form onSubmit={onSubmitHandler}>
        <div className='form-group'>
          <label>Name</label>
          <input type='text' name='name' value={product.name} onChange={onChangeHandler} required />
        </div>
        <div className='form-group'>
          <label>Description</label>
          <textarea name='description' value={product.description} onChange={onChangeHandler} required />
        </div>
        <div className='form-group'>
          <label>Price</label>
          <input type='number' name='price' value={product.price} onChange={onChangeHandler} required />
        </div>
        <div className='form-group'>
          <label>Category</label>
          <select name='category' value={product.category} onChange={onChangeHandler} required>
            <option value="Salad">Salad</option>
            <option value="Rolls">Rolls</option>
            <option value="Deserts">Deserts</option>
            <option value="Sandwich">Sandwich</option>
            <option value="Cake">Cake</option>
            <option value="Pizza">Pizza</option>
            <option value="Pasta">Pasta</option>
            <option value="Noodles">Noodles</option>
          </select>
        </div>
        <div className='form-group'>
          <label>Image</label>
          <input type='file' name='image' onChange={onFileChangeHandler} />
          {product.image && <img src={product.image} alt={product.name} width="100" />}
        </div>
        <button type='submit'>Update</button>
      </form>
    </div>
  );
};

export default EditProduct;