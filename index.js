const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer'); 
require('dotenv').config();
const Event = require('./models/Event');
const app = express();
const EventRegistration = require('./models/eventRegistration'); 
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: 'alphiyapaul003@gmail.com', 
    pass: 'cpnk qtmb kllq tjoy' 
  }
});
// Schema for user_details collection
const userDetailSchema = new mongoose.Schema({
  userID: String,
  firstName: String,
  lastName: String,
  dob: String,
  mailID: String,
  gender: String,
  skills: String,
  experience: String,
  designation: String,
  role: String
});
// Model for user_details collection
const UserDetails = mongoose.model('user_details', userDetailSchema);
// Schema for login_details collection
const loginDetailSchema = new mongoose.Schema({
  userID: String,
  password: String,
  otp: Number 
});
const LoginDetail = mongoose.model('login_details', loginDetailSchema);
// Route to add a user to the user_details collection
app.post('/user', async (req, res) => {
  try {
    const { userID, firstName, lastName, dob, mailID, gender, skills,experience, designation, role } = req.body;
    // Check if the user already exists
    const existingUser = await UserDetails.findOne({ userID });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    let defaultPassword = '0000'; 
    const otp = Math.floor(100000 + Math.random() * 900000);
    const newUser = new UserDetails({ userID, firstName, lastName, dob, mailID, gender, skills, experience, designation, role });
    await newUser.save();
    const newLoginDetail = new LoginDetail({ userID, password: defaultPassword, otp });
    await newLoginDetail.save();
    const mailOptions = {
      from: 'alphiyapaul003@gmail.com', 
      to: mailID,
      subject: 'Change your password',
      text: `Your OTP is: ${newLoginDetail.otp}. Click on the following link to reset your password: http://localhost:3000/ResetPassword/${userID}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    res.status(200).json({ message: 'User added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/', async (req, res) => {
  try {
    const { userID, password } = req.body;
    const user = await LoginDetail.findOne({ userID, password });
    if (user) {
      const userDetails = await UserDetails.findOne({ userID });
      if (userDetails) {
        const { role } = userDetails;
        res.status(200).json({ message: 'Login successful', role });
        
      } else {
        res.status(401).json({ error: 'User details not found' });
      }
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put(`/EditEventForm/:eventId`,async (req,res)=>{
  const { eventId } = req.params;
  const dataToUpdate = req.body;
 
  try {
    const response = await Event.findByIdAndUpdate(eventId, dataToUpdate, {
      new: true,
    });
    return res.send(response);
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
})

app.post('/ForgetPassword', async (req, res) => {
  const { userID } = req.body;
    console.log("forgot password",req.body, userID);
  try {    
    const newOTP = Math.floor(100000 + Math.random() * 900000);
    await LoginDetail.updateOne({ userID }, { otp: newOTP });
    const userDetails = await UserDetails.findOne({ userID });
    if (!userDetails) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Send email with new OTP
    const mailOptions = {
      from: 'alphiyapaul003@gmail.com',
      to: userDetails.mailID,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${newOTP}. Click on the following link to reset your password: http://localhost:3000/ResetPassword/${userID}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Failed to send OTP email' });
      }
      console.log('Email sent:', info.response);
      return res.status(200).json({ message: 'OTP sent successfully' });
    });
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Backend Route for resetting password
app.post('/ResetPassword', async (req, res) => {

  console.log("reset password", req.body)
  try {
    const { userID, otp, newPassword } = req.body;
    const user = await LoginDetail.findOne({userID: userID });
    if (!user) {
      console.log(user)
      return res.status(404).json({ error: 'User not found' });
    }
    // Check if the provided OTP matches the stored OTP
    const otp2=parseInt(otp,10)
    if (user.otp !== otp2) {
      console.log(user.otp,otp2)
      return res.status(400).json({ error: 'Incorrect OTP' });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/CreateEventForm', async (req, res) => {
  try {
    console.log("new event to be saved",req.body)
    const newEvent = new Event(req.body);
    console.log(newEvent);
    // Save the event to the database
    await newEvent.save();
    res.status(201).send('Event created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating event');
  }
});
app.get('/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching events');
  }
});

app.get('/event/:eventId', async (req, res) => {
  const {eventId}=req.params;
  console.log("eventidvvvvvvv", eventId)
  try {
    const event = await Event.findById(eventId);
console.log("eventtttttttttt",event)
    return res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching events');
  }
});
// Route to get user details by user ID
app.get('/user/:userID', async (req, res) => {
  try {
    const userID = req.params.userID;
    const userDetails = await UserDetails.findOne({ userID });
    if (!userDetails) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(userDetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Error fetching events');
  }
});
const sendEmail = async (recipientEmail, subject, text) => {
  try {
    await transporter.sendMail({
      from: 'alphiyapaul003@gmail.com', 
      to: recipientEmail,
      subject: subject,
      text: text
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
// Endpoint to register an event
app.post("/register-events/:eventID/:userID", async (req, res) => {
  const { eventID, userID } = req.params;
  try {
    // Check if the user is already registered for the event
    const existingRegistration = await EventRegistration.findOne({ eventID, userID });
    if (existingRegistration) {
      return res.status(400).send('User already registered for this event');
    }
    // Create a new event registration instance
    const newEventRegistration = new EventRegistration({
      eventID,
      userID
    });
    const user = await UserDetails.findOne({ userID }); 
    const recipientEmail = user.mailID;
    await sendEmail(recipientEmail, 'Event Registration Confirmation', 'You have successfully registered for the event.');
    // Save the event registration to the database
    await newEventRegistration.save();
    res.status(200).send('Event registered successfully');    
  } catch (error) {
    console.error('Error registering event:', error);
    res.status(500).send('Error registering event');
  }});
// Endpoint to unregister an event
app.delete("/unregister-event/:eventID/:userID", async (req, res) => {
  const { eventID, userID } = req.params;
  try {
    const deletedRegistration = await EventRegistration.findOneAndDelete({ eventID, userID });
    if (!deletedRegistration) {
      return res.status(404).send('No registration found for the user and event');
    }
    const user = await UserDetails.findOne({ userID }); 
    const recipientEmail = user.mailID;
    await sendEmail(recipientEmail, 'Event Unregistration Confirmation', 'You have successfully unregistered from the event.');

    res.status(200).send('Event unregistered successfully');
    res.status(200).send('Event unregistered successfully');
  } catch (error) {
    console.error('Error unregistering event:', error);
    res.status(500).send('Error unregistering event');
  }
});



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
