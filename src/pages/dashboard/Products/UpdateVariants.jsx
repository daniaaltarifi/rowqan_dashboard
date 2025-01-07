import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Button, Input, Typography } from '@material-tailwind/react';
import { API_URL } from '@/App';
import Cookies from 'js-cookie';
const UpdateVariant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const lang = Cookies.get('lang') || 'en';

  const [formData, setFormData] = useState({
    size: '',
    available: 'No',
    before_price: '',
    after_price: '',
    weight: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVariantData = async () => {
      try {
        const response = await fetch(`${API_URL}/product/getvariantsbyid/${id}`);
        const data = await response.json();

        console.log(data); 

        if (data && data[0]) {
          console.log("Fetched weight:", data[0].weight); 
          setFormData({
            size: data[0].size || '',
            available: data[0].available || 'No',
            before_price: data[0].before_price || '',
            after_price: data[0].after_price || '',
            weight: data[0].weight || '', 
          });
        } else {
          throw new Error('Data not found');
        }
      } catch (error) {
        console.error("Error fetching bag variant data:", error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load data.',
          icon: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVariantData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/product/updatevariants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await Swal.fire({
          title: 'Success!',
          text: 'variant updated successfully.',
          icon: 'success',
        });
        navigate('/dashboard/products');
      } else {
        const errorData = await response.json();
        await Swal.fire({
          title: 'Error!',
          text: errorData.error || 'Failed to update variant.',
          icon: 'error',
        });
      }
    } catch (error) {
      console.error("Error updating bag variant:", error);
      await Swal.fire({
        title: 'Error!',
        text: 'An error occurred while updating.',
        icon: 'error',
      });
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full">Loading...</div>;

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-4">  {lang ==='ar'? "تعديل مواصفات المنتج" : " Update  Variant  "}
      </Typography>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            label=         {lang ==='ar'? "الحجم" : "size"  }
            name="size"
            value={formData.size}
            onChange={handleChange}
            
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">     {lang ==='ar'? "متاح" : " available  "}
          </label>
          <select
            name="available"
            value={formData.available}
            onChange={handleChange}
            className="border rounded px-2 py-1"
            aria-label="available"
            required
          >
            <option value="Yes"> {lang ==='ar'? "نعم" : "Yes "}</option>
            <option value="No">{lang ==='ar'? "لا" : "No "}</option>
          </select>
        </div>
        <div className="mb-4">
          <Input
            type="number"
            label={lang ==='ar'? "السعر قبل" : "Before Price"}
            name="before_price"
            value={formData.before_price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <Input
            type="number"
            label={lang ==='ar'? "السعر بعد" :"After Price"}
            name="after_price"
            value={formData.after_price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <Input
            label={lang ==='ar'? "الوزن" :"weight"}
            name="weight" 
            value={formData.weight} 
            onChange={handleChange}
            
          />
        </div>
        <Button type="submit" weight="black">{lang ==='ar'? "تعديل مواصفات المنتج" : " Update  Variant  "}</Button>
      </form>
    </div>
  );
};

export default UpdateVariant;