import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Input, Button, Typography } from "@material-tailwind/react";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';  
import { API_URL } from '@/App';
import Cookies from 'js-cookie';
export function AddProduct() {
  const navigate = useNavigate(); 
  const lang = Cookies.get('lang') || 'en';

  const [productData, setProductData] = useState({
    name: '',
    ingredients: '',
    sale: '', 
    main_product_type_id: '',
    certificateID:'',
    sourcing: '',
    season: '', 
    instock: '',
    variants: [{ size: '', weight: '', available: '', before_price: '', after_price: '' }],
    img: [], 
  });

  const [main_product, setmain_product] = useState([]);
  const [certificate, setcertificate] = useState([]);

  const fetchmain_product = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/mainproduct/getmainproduct`);
      if (!response.ok) throw new Error('Failed to fetch main_product');
      const data = await response.json();
      setmain_product(data);
    } catch (error) {
      console.error('Error fetching main_product:', error);
    }
  }, []);

  const fetchcertificate = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/certificate/get/certificates`);
      if (!response.ok) throw new Error('Failed to fetch bag types');
      const data = await response.json();
      setcertificate(data);
    } catch (error) {
      console.error('Error fetching bag types:', error);
    }
  }, []);

  useEffect(() => {
    fetchmain_product();
    fetchcertificate();
  }, [fetchmain_product, fetchcertificate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const MAX_IMG = 5
    if(files.length + productData.img.length > MAX_IMG){
      Swal.fire({
        title: 'Error!',
        text: `You can only upload a maximum of ${MAX_IMG} images.`,
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      e.target.value = null
      return;
    }
    setProductData(prevData => ({ ...prevData, img: [...prevData.img, ...files] }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = [...productData.variants];
    updatedVariants[index] = { ...updatedVariants[index], [name]: value };
    setProductData(prevData => ({ ...prevData, variants: updatedVariants }));
  };

  const addVariant = () => {
    setProductData(prevData => ({
      ...prevData,
      variants: [...prevData.variants, { size: '', weight: '', available: '', before_price: '', after_price: '' }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const [key, value] of Object.entries(productData)) {
      if (key !== 'variants' && key !== 'ingredients' && key !== 'certificateID' && !value && key !== 'weight') {
        Swal.fire({
          title: 'Error!',
          text: `${key.replace(/_/g, ' ').capitalize()} is required.`,
          icon: 'error',
          confirmButtonText: 'Ok',
        });
        return;
      }
    }

    for (const variant of productData.variants) {
      if (!variant.available || !variant.before_price || !variant.after_price) {
        Swal.fire({
          title: 'Error!',
          text: 'All variant fields except size and weight are required.',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
        return;
      }
    }
  
    const formDataToSend = new FormData();
  
    Object.entries(productData).forEach(([key, value]) => {
      if (key !== 'variants') {
        if (Array.isArray(value)) {
          value.forEach(item => formDataToSend.append(key, item));
        } else {
          formDataToSend.append(key, value);
        }
      }
    });
  
    productData.variants.forEach((variant, index) => {
      formDataToSend.append(`variants[${index}][size]`, variant.size);
      formDataToSend.append(`variants[${index}][weight]`, variant.weight); 
      formDataToSend.append(`variants[${index}][available]`, variant.available);
      formDataToSend.append(`variants[${index}][before_price]`, variant.before_price);
      formDataToSend.append(`variants[${index}][after_price]`, variant.after_price);
    });
  
    try {
      const response = await fetch(`${API_URL}/product/add`, {
        method: 'POST',
        body: formDataToSend,
      });
  
      Swal.fire({
        title: 'Successfully Added!',
        text: 'The product has been added successfully',
        icon: 'success',
        confirmButtonText: 'Ok',
      }).then(() => {
        navigate('/dashboard/products');  
      });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'There was a problem adding the product. Please try again.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  };

  const main_productOptions = useMemo(() => main_product.map(catg => (
    <option key={catg.id} value={catg.id}>{catg.name}</option>
  )), [main_product]);

  const certificateOptions = useMemo(() => certificate.map(type => (
    <option key={type.id} value={type.id}>{type.certificate_name}</option>
  )), [certificate]);

  return (
    <section className="m-8 flex justify-center">
      <div className="w-full lg:w-3/5 mt-16">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "اضافة منتج" : "Add Product "}</Typography>
          <Typography variant="paragraph" weight="blue-gray" className="text-lg font-normal">
           {lang ==='ar'? "قم بتعبئة تفاصيل المنتج الجديد" : " Fill in the details below to add a new product.  "}
          </Typography>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-full max-w-screen-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {Object.entries(productData).map(([key, value]) => key === 'name' ? (
    <div key={key}>
      <Typography variant="small" className="block mb-1">
        {lang === 'ar' ? "اسم المنتج" : "Product Name"}
      </Typography>
      <Input
        name={key}
        value={value}
        onChange={handleChange}
        placeholder={lang === 'ar' ? "أدخل اسم المنتج" : "Enter product name"}
      />
    </div>
  ) : key === 'ingredients' ? (
    <div key={key}>
      <Typography variant="small" className="block mb-1">
        {lang === 'ar' ? "المكونات" : "Ingredients"}
      </Typography>
      <Input
        name={key}
        value={value}
        onChange={handleChange}
        placeholder={lang === 'ar' ? "أدخل المكونات" : "Enter ingredients"}
      />
    </div>
  ) :(
  key === 'sale' ? (
    <div key={key}>
      <Typography variant="small" className="block mb-1"> {lang ==='ar'? "تخفيض" : "Sale "}</Typography>
      <select 
        name={key} 
        value={value} 
        onChange={handleChange} 
        className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value=""> {lang ==='ar'? "اختر " : "Select option  "}</option>
        <option value="no"> {lang ==='ar'? "لا" : "No "}</option>
        <option value="yes"> {lang ==='ar'? "نعم" : "Yes "}</option>
      </select>
    </div>
  ) : key === 'main_product_type_id' ? (
    <div key={key}>
      <Typography variant="small" className="block mb-1"> {lang ==='ar'? "الصنف" : "Category "}</Typography>
      <select 
        name={key} 
        value={value} 
        onChange={handleChange} 
        className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value=""> {lang ==='ar'? "اختر صنف" : "Select a category "}</option>
        {main_productOptions}
      </select>
    </div>
  ) : key === 'certificateID' ? (
    <div key={key}>
      <Typography variant="small" className="block mb-1"> {lang ==='ar'? "الشهادة" : "Certificate "}</Typography>
      <select 
        name={key} 
        value={value} 
        onChange={handleChange} 
        className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value=""> {lang ==='ar'? "اختر شهادة" : "Select a Certificate "}</option>
        {certificateOptions}
      </select>
    </div>
  ) : key === 'sourcing' ? (
    <div key={key}>
      <Typography variant="small" className="block mb-1"> {lang ==='ar'? "المصدر" : "Sourcing "}</Typography>
      <select 
        name={key} 
        value={value} 
        onChange={handleChange} 
        className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value=""> {lang ==='ar'? "اختر المصدر" : "Choose Sourcing  "}</option>
        <option value="local"> {lang ==='ar'? "محلي" : "Local "}</option>
        <option value="imported"> {lang ==='ar'? "مستورد" : "Imported "}</option>
      </select>
    </div>
  ) : key === 'season' ? (
    <div key={key}>
      <Typography variant="small" className="block mb-1"> {lang ==='ar'? "الموسم" : "Season "}</Typography>
      <select 
        name={key} 
        value={value} 
        onChange={handleChange} 
        className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value=""> {lang ==='ar'? "اخنر الموسم" : "Choose Season "}</option>
        <option value="ALL SEASONS"> {lang ==='ar'? "كل المواسم" : "ALL SEASONS "}</option>
        <option value="FALL & WINTER">{lang ==='ar'? "خريف و شتاء" : "FALL & WINTER  "}</option>
        <option value="SPRING & SUMMER">{lang ==='ar'? "ربيع و صيف" : "SPRING & SUMMER  "}</option>
      </select>
    </div>
  )  : key === 'instock' ? (
    <div key={key}>
      <Typography variant="small" className="block mb-1">  {lang ==='ar'? "اختر الحالة" : "Choose Status "}</Typography>
      <select 
        name={key} 
        value={value} 
        onChange={handleChange} 
        className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value=""> {lang ==='ar'? "اختر الحالة" : "Choose Status "}</option>
        <option value="yes">{lang ==='ar'? "في المخزن" : "In Stock  "}</option>
        <option value="no">{lang ==='ar'? "غير متاح في المخزن" : "Out of Stock "}</option>
      </select>
    </div>
  ): key === 'variants' ? (
    <div key={key} className="md:col-span-2">
      <Typography variant="small" className="block mb-1"> {lang ==='ar'? "المواصفات" : "variants"}</Typography>
      {productData.variants.map((variant, index) => (
        <div key={index} className="flex flex-col mb-4 border p-4 rounded-lg">
          <Input 
            name="size" 
            value={variant.size} 
            placeholder= {lang ==='ar'? "الحجم" : "Size"}
            onChange={(e) => handleVariantChange(index, e)} 
          />
           <Input 
            name="weight" 
            value={variant.weight} 
            placeholder= {lang ==='ar'? "الوزن" :"weight"} 
            onChange={(e) => handleVariantChange(index, e)} 
          />
           <select 
            name="available" 
            value={variant.available}
            onChange={(e) => handleVariantChange(index, e)}                    
            className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value=""> {lang ==='ar'? "هل متاح" : "Choose Availability"}</option>
            <option value="yes">{lang ==='ar'? "نعم" : "yes "}</option>
            <option value="no">{lang ==='ar'? "لا" : "no "}</option>
          </select>
          <Input 
            name="before_price" 
            value={variant.before_price} 
            placeholder= {lang ==='ar'? "السعر قبل" : "Before Price"}
            type="number" 
            onChange={(e) => handleVariantChange(index, e)} 
          />
          <Input 
            name="after_price" 
            value={variant.after_price} 
            placeholder= {lang ==='ar'? "السعر بعد" :"After Price"}
            type="number" 
            onChange={(e) => handleVariantChange(index, e)} 
          />
        </div>
      ))}
      <Button type="button" onClick={addVariant} className="mt-2">
       {lang ==='ar'? "اضافة مواصفات" : " Add Variants "}
      </Button>
    </div>
  ) : key !== 'img' ? (
    <div key={key}>
      <Typography variant="small" className="block mb-1">
        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Typography>
      <Input name={key} value={value} onChange={handleChange} />
    </div>
  ) : (
    <div key={key} className="md:col-span-2">
      <Typography variant="small" className="block mb-1">{lang ==='ar'? "الصور" : "Images "}</Typography>
      <Input type="file" name={key} onChange={handleFileChange} accept="image/*" multiple />
      <div className="mt-4">
        <Typography variant="small" className="mb-2">{lang ==='ar'? "معاينة الصور" : "Image Previews "}</Typography>
        <div className="flex flex-wrap gap-4">
          {productData.img.length > 0 && Array.from(productData.img).map((file, idx) => (
            <img 
              key={idx}
              src={URL.createObjectURL(file)} 
              alt={`preview-${idx}`} 
              className="w-24 h-24 object-cover rounded-md"
            />
          ))}
        </div>
      </div>
    </div>
  )
))}

          </div>
          <Button type="submit" className="mt-4" fullWidth>
             {lang ==='ar'? "اضافة المنتج" : "Add Product "}
          </Button>
        </form>
      </div>
    </section>
  );
}


String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

export default AddProduct;
