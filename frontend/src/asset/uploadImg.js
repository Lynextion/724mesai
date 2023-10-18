import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import axios from 'axios'


const axiosInstance = axios.create({
  baseURL:"http://localhost:4000",
  headers: {
      'Content-Type': 'application/json',
      'X-API-Key': "7aad182c-0877-4952-927a-baed5451fd84",
    },
})

const props = {
  name:"file",
  action:"http://localhost:4000/upload-img",
  headers:{   
    'X-API-Key': "7aad182c-0877-4952-927a-baed5451fd84",
  }
}



const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};
const App = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
        
      });
    }
  };

  const sendIMG = async (info) =>{
    console.log(loading)
    if(loading === true){
       
      const body ={
        imageUrl:imageUrl
      }
      await axiosInstance.post("/upload-img",{body}).then((result) =>{console.log(result.data)})
    }
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        crossOrigin="use-credentials"
        file={imageUrl}
        {...props}

      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="avatar"
            style={{
              width: '100%',
            }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
     
    </>
  );
};
export default App;