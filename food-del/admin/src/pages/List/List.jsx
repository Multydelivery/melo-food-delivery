import { useEffect, useState } from 'react';
import './List.css';
import { currency } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const List = () => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Error");
    }
  };

  const removeFood = async (foodId) => {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/food/remove`, {
      id: foodId
    });
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className='list-table'>
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className='list-table-format'>
              <img src={item.image} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <div className='actions'>
                <p className='cursor' onClick={() => removeFood(item._id)}>x</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
