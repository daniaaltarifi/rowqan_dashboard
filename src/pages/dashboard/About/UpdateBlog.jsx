import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Input, Button, Typography, Select, Option } from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import Swal from "sweetalert2";
import axios from 'axios';
import Cookies from 'js-cookie';

function UpdateBlog() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState(null);
  const [existingImg, setExistingImg] = useState("");
    const lang = Cookies.get('lang') || 'en';
  const quillRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await axios.get(`${API_URL}/Blogs/getBlogById/${id}/${lang}`);
        setTitle(response.data[0].title);
        setDescription(response.data[0].description);
        setExistingImg(response.data[0].image);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBlogPost();
  }, [id, lang]);

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
        [{ 'header': 1 }, { 'header': 2 }, { 'header': 3 }, 'blockquote', 'code-block'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean'],
        ['table'],  
      ],
      handlers: {
        image: imageHandler,
        table: function() {
          const quill = this.quill;
          const range = quill.getSelection();
          const table = '<table><tr><td>Table Cell</td><td>Table Cell</td></tr></table>';
          quill.clipboard.dangerouslyPasteHTML(range.index, table);
        }
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
    'align', 'direction',
    'table'
  ];

  const handleUpdateBlogs = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("lang", lang);
    if (img) {
      formData.append("image", img);
    }

    try {
      await axios.put(`${API_URL}/Blogs/updateBlog/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire({
        title: "Success!",
        text: "Blog updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/dashboard/setting");
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update. Please try again.",
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
            {lang === 'ar' ? "تعديل مدونة" : "Update Blog"}
          </Typography>
        </div>
        <form
          className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
          onSubmit={handleUpdateBlogs}
        >
          <div className="grid grid-cols-1 gap-6">
            {/* <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                {lang === 'ar' ? "اختر اللغة" : "Select Language"}
              </Typography>
              <Select
                value={lang}
                onChange={(value) => setLang(value)}
                label={lang === 'ar' ? "اختر اللغة" : "Select Language"}
              >
                <Option value="en">{lang === 'ar' ? "الإنجليزية" : "English"}</Option>
                <Option value="ar">{lang === 'ar' ? "العربية" : "Arabic"}</Option>
              </Select>
            </div> */}

            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                {lang === 'ar' ? "العنوان" : "Title:"}
              </Typography>
              <Input
                size="lg"
                placeholder="Enter title"
                name="title"
                value={title}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
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
            </div>

            <div className="flex flex-col">
              {existingImg && (
                <img
                  src={`https://res.cloudinary.com/dqimsdiht/${existingImg}`}
                  alt="Existing blog"
                  className="mb-2 w-32 h-32 object-cover"
                />
              )}
              <Typography variant="small" color="blue-gray" className="font-medium">
                {lang === 'ar' ? "الصورة الرئيسية" : "Featured Image"}
              </Typography>
              <Typography variant="small" color="blue-gray" className="mb-2">
                {lang === 'ar'
                  ? "من المستحسن استخدام تنسيق WebP للصور."
                  : "It is recommended to use the WebP format for images."}
              </Typography>
              <div className="relative">
                <input
                  type="file"
                  id="file_input"
                  onChange={(e) => setImg(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300 w-full text-left">
                  {lang === 'ar' ? "اختر الصورة" : "Choose an image"}
                </Button>
                <Typography variant="small" color="blue-gray" className="mt-2">
                  {img ? img.name : lang === 'ar' ? "لا يوجد صور مختارة" : "No image selected"}
                </Typography>
              </div>
            </div>
          </div>
          <Button type="submit" className="mt-6" fullWidth>
            {lang === 'ar' ? "تحديث" : "Update"}
          </Button>
        </form>
      </div>
    </section>
  );
}

export default UpdateBlog;