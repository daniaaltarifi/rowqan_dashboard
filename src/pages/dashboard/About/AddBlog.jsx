import React, { useState, useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Input,
  Button,
  Typography,
  Select,
  Option
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '@/App';

function AddBlog() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState(null);
  const [imgName, setImgName] = useState("");
    const lang = Cookies.get('lang') || 'en';
  const quillRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file);
      setImgName(file.name);
    } else {
      setImg(null);
      setImgName("");
    }
  };

  const navigate = useNavigate();

  const imageHandler = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const reader = new FileReader();
     
      reader.onloadend = () => {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', reader.result);
      };

      if (file) {
        reader.readAsDataURL(file);  
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'header': 1 }, { 'header': 2 }, 'blockquote', 'code-block'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }, { 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'script', 'code-block',
    'align', 'direction'
  ];

  const handleAddBlog = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", img);
    formData.append("lang", lang);  

    try {
      const response = await axios.post(
        `${API_URL}/Blogs/createBlog`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Swal.fire({
        title: "Success!",
        text: "Blog added successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/dashboard/setting");
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to add. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            {lang === 'ar' ? "اضافة مدونة" : "Add Blog"}
          </Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleAddBlog}>
          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                {lang === 'ar' ? "العنوان" : "Title"}
              </Typography>
              <Input
                required
                size="lg"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => setTitle(e.target.value)}
              />
             
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium mt-4">
                {lang === 'ar' ? "الوصف" : "Description"}
              </Typography>
              <div className="bg-white rounded-lg">
                <ReactQuill
                  theme="snow"
                  value={description}
                  onChange={setDescription}
                  modules={modules}
                  formats={formats}
                  className="h-96 mb-12"
                  placeholder={lang === 'ar' ? "ابدأ الكتابة هنا..." : "Start writing here..."}
                  ref={quillRef}
                />
              </div>

              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                {lang === 'ar' ? "الصورة الرئيسية" : "Featured Image:"}
              </Typography>
              <div className="relative">
                <input
                  required
                  type="file"
                  id="file_input"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300 w-full text-left">
                  {lang === 'ar' ? "اختر الصورة" : "Choose an image"}
                </Button>
                {imgName && (
                  <Typography variant="small" color="blue-gray" className="mt-2">
                    {lang === 'ar' ? "الملف المحدد:" : "Selected File:"} {imgName}
                  </Typography>
                )}
              </div>

           
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium mt-4">
                {lang === 'ar' ? "اختر اللغة" : "Select Language"}
              </Typography>
              {/* <Select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                label={lang === 'ar' ? "اختر اللغة" : "Select Language"}
                required
              >
                <Option value="en">{lang === 'ar' ? "الإنجليزية" : "English"}</Option>
                <Option value="ar">{lang === 'ar' ? "العربية" : "Arabic"}</Option>
              </Select> */}
            </div>
          </div>

          <Button type="submit" className="mt-6" fullWidth>
            {lang === 'ar' ? "اضافة مدونة" : "Add Blog"}
          </Button>
        </form>
      </div>
    </section>
  );
}

export default AddBlog;