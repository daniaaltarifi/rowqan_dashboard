// import React from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css'; // Import CSS for styling
// const RichTextEditor = ({description,setDescription}) => {
//     return (
//         <ReactQuill
//         style={{height:"100vh"}}
//             value={description}
//             onChange={setDescription} // Directly use the setter function
//           />
        
//       );
//     };

// export default RichTextEditor;
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import default styles for the Snow theme

const RichTextEditor = () => {
  const [description, setDescription] = useState("");

  // Define the image handler
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click(); // Open file dialog

    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const img = reader.result; // Base64 encoded image
        const range = quillRef.current.getEditor().getSelection();
        quillRef.current.getEditor().insertEmbed(range.index, "image", img);
      };
      
      if (file) {
        reader.readAsDataURL(file); // Convert the file to base64
      }
    };
  };

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'align': [] }],
      ['link', 'image'], // Add image button to toolbar
      ['blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean'],
    ],
  };

  const quillRef = React.useRef();

  return (
    <div>
      <ReactQuill
        ref={quillRef}
        value={description}
        onChange={setDescription}
        modules={modules}
        formats={[
          'header', 'font', 'list', 'bold', 'italic', 'underline', 'strike', 'align',
          'link', 'image', 'blockquote', 'code-block', 'color', 'background'
        ]}
      />

      {/* Optionally add a button for image upload */}
      <button onClick={imageHandler}>Upload Image</button>
    </div>
  );
};

export default RichTextEditor;
