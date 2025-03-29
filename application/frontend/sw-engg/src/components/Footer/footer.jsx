import React from 'react';
import { Box, Typography, Grid, Link, Button } from '@mui/material';
import { Email, Phone, LocationOn, Facebook, Twitter, Instagram } from '@mui/icons-material';
import './footer.css';  // Import the styles

const Footer = () => {
  return (
    <Box className="footerContainer">
      <div className="footerHeadingBox">
        <Typography variant="h6" className="footerHeading">
          Our Mission
        </Typography>
      </div>
      <Typography variant="body2" className="footerParagraph">
        At eduBridge, we aim to redefine the learning experience. Our passion lies in creating a platform that inspires curiosity, fosters creativity, and fuels lifelong learning. We believe that education should be accessible to all, regardless of background or circumstance. With a diverse range of courses curated by experts, personalized learning experiences, and a vibrant community, we're here to empower individuals to pursue their dreams and unlock their full potential. Join us on this journey of discovery and transformation.
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Typography variant="body2" className="footerText">
            <Button href="mailto:eduBridge@gmail.com" variant="outlined" target="_blank" className="footerButton"><Email /> Contact Us</Button>
          </Typography>
          <Typography variant="body2" className="footerText">
            <Button href="tel:xxx-xxx-xxxx" variant="outlined" target="_blank" className="footerButton"><Phone /> Call Us</Button>
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="body2" className="footerText">
            <Button href="https://www.google.com/maps?q=Thornton+Hall,+1600+Holloway+Ave,+San+Francisco,+CA+94132" variant="outlined" target="_blank" className="footerButton"><LocationOn /> Visit Us</Button>
          </Typography>
          <Typography variant="body2" className="footerText">
            Thornton Hall, 1600 Holloway Ave<br />
            San Francisco, CA 94132
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="body2" className="footerText">
            <Button variant="outlined" className="footerButton"> Connect With Us </Button>
          </Typography>
          <div className="footerSocialIcons">
            <Link href="https://www.facebook.com/" target="_blank" className="footerSocialIcon"><Facebook /></Link>
            <Link href="https://twitter.com/?lang=en" target="_blank" className="footerSocialIcon"><Twitter /></Link>
            <Link href="https://www.instagram.com/?hl=en" target="_blank" className="footerSocialIcon"><Instagram /></Link>
          </div>
        </Grid>
      </Grid>
      <Typography variant="caption" className="footerCopyright">
        © 2024 eduBridge. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;

