import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Input, Button, Typography } from '@material-tailwind/react';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '@/App';
import Cookies from 'js-cookie';
export function UpdateProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const lang = Cookies.get('lang') || 'en';

  const [productData, setProductData] = useState({
    name: '',
    ingredients: '',
    sale: '',
    main_product_type_id: '',
    certificateID: '',
    sourcing: '',
    season: '',
    instock: '',
    img: [],
  });

  const [main_product, setMainProduct] = useState([]);
  const [certificate, setCertificate] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const fetchMainProduct = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/mainproduct/getmainproduct`);
      if (!response.ok) throw new Error('Failed to fetch main_product');
      const data = await response.json();
      setMainProduct(data);
    } catch (error) {
      console.error('Error fetching main_product:', error);
    }
  }, []);

  const fetchCertificate = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/certificate/get/certificates`);
      if (!response.ok) throw new Error('Failed to fetch certificates');
      const data = await response.json();
      setCertificate(data);
    } catch (error)      {
      console.error('Error fetching certificates:', error);
    }
  }, []);

  const fetchProductData = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/product/getbyidcms/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const data = await response.json();
      const { product, images } = data;
      setProductData({
        name: product.name,
        ingredients: product.ingredients,
        sale: product.sale,
        main_product_type_id: product.main_product_type_id,
        certificateID: product.certificateID,
        sourcing: product.sourcing,
        season: product.season,
        instock: product.instock,
        img: images || [],
      });

      setExistingImages(images || []);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchMainProduct();
    fetchCertificate();
    fetchProductData();
  }, [fetchMainProduct, fetchCertificate, fetchProductData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const MAX_IMG = 5;
    if (files.length + productData.img.length > MAX_IMG) {
      Swal.fire({
        title: 'Error!',
        text: `You can only upload a maximum of ${MAX_IMG} images.`,
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      e.target.value = null;
      return;
    }
    setNewImages((prevImages) => [...prevImages, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for required fields, excluding 'ingredients' and 'certificateID'
    for (const [key, value] of Object.entries(productData)) {
      if (key !== 'ingredients' && key !== 'certificateID' && !value) {
        Swal.fire({
          title: 'Error!',
          text: `${key.replace(/_/g, ' ')} is required.`,
          icon: 'error',
          confirmButtonText: 'Ok',
        });
        return;
      }
    }

    const formDataToSend = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => formDataToSend.append(key, item));
      } else {
        formDataToSend.append(key, value);
      }
    });

    newImages.forEach((file) => formDataToSend.append('img', file));

    try {
      const response = await fetch(`${API_URL}/product/update/${id}`, {
        method: 'PUT',
        body: formDataToSend,
      });
      Swal.fire({
        title: 'Updated!',
        text: 'The product has been updated successfully.',
        icon: 'success',
        confirmButtonText: 'Ok',
      }).then(() => {
        navigate('/dashboard/products');
      });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'There was an error updating the product. Please try again.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to delete this product?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      icon: 'warning',
      background: '#000',
      color: '#fff',
      customClass: {
        confirmButton: 'bg-blue-600 text-white',
        cancelButton: 'bg-red-600 text-white',
      },
    });

    if (result.isConfirmed) {
      try {
        await fetch(`${API_URL}/product/deleteimage/${id}`, { method: 'DELETE' });
        setExistingImages(existingImages.filter((product) => product.id !== id));
        await Swal.fire({
          title: 'Deleted!',
          text: 'Your product has been deleted.',
          icon: 'success',
          background: '#000',
          color: '#fff',
          customClass: {
            confirmButton: 'bg-blue-600 text-white',
          },
        });
      } catch (error) {
        console.error('Error deleting product:', error);
        Swal.fire({
          title: 'Error!',
          text: 'There was an error deleting the product.',
          icon: 'error',
          background: '#000',
          color: '#fff',
        });
      }
    }
  };

  const mainProductOptions = useMemo(() => main_product.map((catg) => (
    <option key={catg.id} value={catg.id}>{catg.name}</option>
  )), [main_product]);

  const certificateOptions = useMemo(() => certificate.map((type) => (
    <option key={type.id} value={type.id}>{type.certificate_name}</option>
  )), [certificate]);

  return (
    <section className="m-8 flex justify-center">
      <div className="w-full lg:w-3/5 mt-16">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "تعديل المنتج" : "Update Product "}</Typography>
          <Typography variant="paragraph" weight="blue-gray" className="text-lg font-normal">
          {lang ==='ar'? " قم بتعديل التفاصيل  لتحديث المنتج" : "  Edit the details below to update the product. "}
          </Typography>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-full max-w-screen-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">        {lang === 'ar' ? "اسم المنتج" : "Product Name"}
              </label>
              <input type="text" id="name" name="name" value={productData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-md mt-1" />
            </div>
            <div>
              <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">        {lang === 'ar' ? "المكونات" : "Ingredients"}
              </label>
              <input type="text" id="ingredients" name="ingredients" value={productData.ingredients} onChange={handleChange} className="w-full px-4 py-2 border rounded-md mt-1" />
            </div>
            <div>
              <label htmlFor="sale" className="block text-sm font-medium text-gray-700"> {lang ==='ar'? "تخفيض" : "Sale "}</label>
              <input type="text" id="sale" name="sale" value={productData.sale} onChange={handleChange} className="w-full px-4 py-2 border rounded-md mt-1" />
            </div>
            <div>
              <label htmlFor="main_product_type_id" className="block text-sm font-medium text-gray-700">{lang ==='ar'? "الصنف" : "Category "}</label>
              <select id="main_product_type_id" name="main_product_type_id" value={productData.main_product_type_id} onChange={handleChange} className="w-full px-4 py-2 border rounded-md mt-1">
                <option value="">Select Type</option>
                {mainProductOptions}
              </select>
            </div>
            <div>
              <label htmlFor="certificateID" className="block text-sm font-medium text-gray-700">{lang ==='ar'? "الشهادة" : "Certificate "}</label>
              <select id="certificateID" name="certificateID" value={productData.certificateID} onChange={handleChange} className="w-full px-4 py-2 border rounded-md mt-1">
                <option value="">Select Certificate</option>
                {certificateOptions}
              </select>
            </div>
            <div>
              <label htmlFor="sourcing" className="block text-sm font-medium text-gray-700">{lang ==='ar'? "المصدر" : "Sourcing "}</label>
              <input type="text" id="sourcing" name="sourcing" value={productData.sourcing} onChange={handleChange} className="w-full px-4 py-2 border rounded-md mt-1" />
            </div>
            
            {/* Season Dropdown */}
            <div>
              <label htmlFor="season" className="block text-sm font-medium text-gray-700">{lang ==='ar'? "الموسم" : "Season "}</label>
              <select 
                id="season" 
                name="season" 
                value={productData.season} 
                onChange={handleChange} 
                className="w-full px-4 py-2 border rounded-md mt-1"
              >
                <option value="">{lang ==='ar'? "اخنر الموسم" : "Choose Season "}</option>
                <option value="ALL SEASONS">{lang ==='ar'? "كل المواسم" : "ALL SEASONS "}</option>
                <option value="FALL & WINTER">{lang ==='ar'? "خريف و شتاء" : "FALL & WINTER  "}</option>
                <option value="SPRING & SUMMER">{lang ==='ar'? "ربيع و صيف" : "SPRING & SUMMER  "}</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="instock" className="block text-sm font-medium text-gray-700">{lang ==='ar'? "اختر الحالة" : "Choose Status "}</label>
              <input type="text" id="instock" name="instock" value={productData.instock} onChange={handleChange} className="w-full px-4 py-2 border rounded-md mt-1" />
            </div>
          </div>

          {/* Product Images */}
          <div className="mb-6">
            <label htmlFor="img" className="block text-sm font-medium text-gray-700">{lang ==='ar'? "الصور" : "Images "}</label>
            <input type="file" id="img" name="img" multiple onChange={handleFileChange} className="w-full px-4 py-2 border rounded-md mt-1" />
            {existingImages.length > 0 && (
              <div className="mt-4">
                <Typography variant="h6">{lang ==='ar'? "الصور المتاحة" : "Existing Images "}</Typography>
                <div className="flex flex-wrap mt-2">
                  {existingImages.map((image) => (
                    <div key={image.id} className="relative mr-4 mb-4">
                      <img src={`${API_URL}/${image.img}`} alt="Product" className="w-32 h-32 object-cover rounded-md" />
                      <Button variant="outlined" color="red" size="sm" className="absolute top-0 right-0" onClick={() => handleDelete(image.id)}>Delete</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button type="submit" color="green" className="w-full">{lang ==='ar'? "تعديل المنتج" : "Update Product "}</Button>
        </form>
      </div>
    </section>
  );
}

export default UpdateProduct;
