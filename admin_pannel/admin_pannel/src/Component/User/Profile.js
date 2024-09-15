import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, TextField, Button, Grid, Typography, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
const validationSchema = Yup.object({
  User_Name: Yup.string().required('Name is required'),
  User_FatherName: Yup.string().required('Father\'s name is required'),
  User_Image: Yup.mixed().required('Image file is required'),
  User_Phone: Yup.string().required('Phone number is required'),
  gender: Yup.string().required('Gender is required'),
  age: Yup.number().required('Age is required').positive('Age must be positive').integer('Age must be an integer'),
  height: Yup.number().required('Height is required').positive('Height must be positive'),
  weight: Yup.number().required('Weight is required').positive('Weight must be positive'),
});

const ProfileForm = () => {
  const [userData, setUserData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const id = user.id;
  // Get userId from local storage
  // const id = localStorage.getItem('id');
  const url = `http://localhost:8000/api/User/${id}`;

  useEffect(() => {
    if (!id) {
      console.error("No user ID found in local storage");
      return;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        // Set the initial preview image if it exists
        if (data.User_Image) {
          setPreviewImage(`http://localhost:8000/${data.User_Image}`);
        }
      })
      .catch((error) => console.error("Error fetching user details:", error));
  }, [url, id]);

  const formik = useFormik({
    initialValues: userData || {
      User_Name: '',
      User_FatherName: '',
      User_Image: null,
      User_Phone: '',
      gender: '',
      age: '',
      height: '',
      weight: '',
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: values => {
      const formData = new FormData();
      formData.append('User_Name', values.User_Name);
      formData.append('User_FatherName', values.User_FatherName);
      formData.append('User_Phone', values.User_Phone);
      formData.append('gender', values.gender);
      formData.append('age', values.age);
      formData.append('height', values.height);
      formData.append('weight', values.weight);
      if (values.User_Image) {
        formData.append('User_Image', values.User_Image);
      }

      fetch(url, {
        method: 'PUT',
        body: formData,
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then((updatedData) => {
          console.log(updatedData);
          alert("Data updated successfully");
          navigate("/");
        })
        .catch((error) => {
          console.error('Error updating user data:', error);
          alert('Error updating user data. Please try again.');
        });
    },
  });

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue('User_Image', file);

    // Create a preview URL for the selected image
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content-body">
      <div className="col-lg-12">
        <Container
          component="main"
          style={{ width: '100%' }}
          maxWidth="sm"
        >
          <Paper elevation={3} style={{ padding: '20px', borderRadius: '10px' }}>
            <Typography variant="h5" align="center" gutterBottom>
              Profile Form
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              {previewImage && (
                <div className="image-preview text-center mb-2">
                  <img
                    src={previewImage}
                    alt="Uploaded Preview"
                    style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                </div>
              )}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="User_Name"
                    name="User_Name"
                    label="Name"
                    value={formik.values.User_Name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.User_Name && Boolean(formik.errors.User_Name)}
                    helperText={formik.touched.User_Name && formik.errors.User_Name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="User_FatherName"
                    name="User_FatherName"
                    label="Father's Name"
                    value={formik.values.User_FatherName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.User_FatherName && Boolean(formik.errors.User_FatherName)}
                    helperText={formik.touched.User_FatherName && formik.errors.User_FatherName}
                  />
                </Grid>
              
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="User_Phone"
                    name="User_Phone"
                    label="Phone Number"
                    value={formik.values.User_Phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.User_Phone && Boolean(formik.errors.User_Phone)}
                    helperText={formik.touched.User_Phone && formik.errors.User_Phone}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="gender"
                    name="gender"
                    label="Gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.gender && Boolean(formik.errors.gender)}
                    helperText={formik.touched.gender && formik.errors.gender}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="age"
                    name="age"
                    label="Age"
                    type="number"
                    value={formik.values.age}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.age && Boolean(formik.errors.age)}
                    helperText={formik.touched.age && formik.errors.age}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="height"
                    name="height"
                    label="Height (cm)"
                    type="number"
                    value={formik.values.height}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.height && Boolean(formik.errors.height)}
                    helperText={formik.touched.height && formik.errors.height}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="weight"
                    name="weight"
                    label="Weight (kg)"
                    type="number"
                    value={formik.values.weight}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.weight && Boolean(formik.errors.weight)}
                    helperText={formik.touched.weight && formik.errors.weight}
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    type="file"
                    id="User_Image"
                    name="User_Image"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ width: '100%' }}
                  />
                  {formik.errors.User_Image && formik.touched.User_Image && (
                    <Typography color="error">{formik.errors.User_Image}</Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Button className='btn btn-primary' variant="contained" fullWidth type="submit">
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </div>
    </div>
  );
};

export default ProfileForm;
