import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

const See_Trainer = () => {
  const [exhibitorData, setExhibitorData] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const id = user.id;
  
  // Assuming 'id' is fetched from local storage or another source
  // const id = localStorage.getItem('id');
  const url = `http://localhost:8000/api/Trainer/${id}`;

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
        setExhibitorData(data);
      })
      .catch((error) => console.error("Error fetching trainer details:", error));
  }, [url, id]);

  if (!exhibitorData) {
    return <div>Loading trainer details...</div>;
  }

  return (
    <div className='content-body'>
    <Container  component="main" maxWidth="md" style={{ paddingTop: '20px',}}>
    <Paper elevation={6} style={{ padding: '20px', borderRadius: '12px' }}>
      {/* Displaying Trainer Details */}
      {exhibitorData.User_id_Fk && (
        <div>
          <Card style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '20px' }}>
            {exhibitorData.User_id_Fk.User_Image && (
              <CardMedia
                component="img"
                image={`http://localhost:8000/${exhibitorData.User_id_Fk.User_Image}`}
                alt="User"
                style={{ width: '150px', height: '150px', borderRadius: '75px', objectFit: 'cover', marginRight: '20px' }}
              />
            )}
            <CardContent>
              <Typography variant="h5" gutterBottom>{exhibitorData.User_id_Fk.User_Name}</Typography>
              <Typography variant="body1"><strong>Email:</strong> {exhibitorData.User_id_Fk.User_Email}</Typography>
              <Typography variant="body1"><strong>Phone:</strong> {exhibitorData.User_id_Fk.User_Phone}</Typography>
              <Typography variant="body1"><strong>Role:</strong> {exhibitorData.User_id_Fk.User_Role}</Typography>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Displaying Time Slots */}
      {exhibitorData.TrainerTimes && exhibitorData.TrainerTimes.length > 0 ? (
        <div>
          {exhibitorData.TrainerTimes.map((timeSlot, index) => (
            <Paper key={timeSlot._id || index} style={{ padding: '15px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <Typography variant="body1"><strong>Trainer Arrival Time {index + 1}:</strong> {timeSlot.arrival}</Typography>
              <Typography variant="body1"><strong>Trainer Departure Time {index + 1}:</strong> {timeSlot.departure}</Typography>
            </Paper>
          ))}
        </div>
      ) : (
        <Typography variant="body1">No trainer time slots available.</Typography>
      )}
    </Paper>
  </Container>
  </div>
);
};
export default See_Trainer;
