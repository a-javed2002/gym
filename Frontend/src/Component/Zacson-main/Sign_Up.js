<div>
  <meta charSet="utf-8" />
  <meta httpEquiv="x-ua-compatible" content="ie=edge" />
  <title>Gym trainer | Template </title>
  <meta name="description" content />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="shortcut icon" type="image/x-icon" href="assets/img/favicon.ico" />
  <link rel="stylesheet" href="assets/css/bootstrap.min.css" />
  <link rel="stylesheet" href="assets/css/owl.carousel.min.css" />
  <link rel="stylesheet" href="assets/css/slicknav.css" />
  <link rel="stylesheet" href="assets/css/animate.min.css" />
  <link rel="stylesheet" href="assets/css/magnific-popup.css" />
  <link rel="stylesheet" href="assets/css/fontawesome-all.min.css" />
  <link rel="stylesheet" href="assets/css/themify-icons.css" />
  <link rel="stylesheet" href="assets/css/themify-icons.css" />
  <link rel="stylesheet" href="assets/css/slick.css" />
  <link rel="stylesheet" href="assets/css/nice-select.css" />
  <link rel="stylesheet" href="assets/css/style.css" />
  <div id="preloader-active">
    <div className="preloader d-flex align-items-center justify-content-center">
      <div className="preloader-inner position-relative">
        <div className="preloader-circle" />
        <div className="preloader-img pere-text">
          <img src="assets/img/logo/loder.png" alt />
        </div>
      </div>
    </div>
  </div>
  <header>
    <div className="header-area header-transparent">
      <div className="main-header header-sticky">
        <div className="container-fluid">
          <div className="menu-wrapper d-flex align-items-center justify-content-between">
            <div className="logo">
              <a href="index-2.html"><img src="assets/img/logo/logo.png" alt /></a>
            </div>
            <div className="main-menu f-right d-none d-lg-block">
              <nav>
                <ul id="navigation">
                  <li><a href="index-2.html">Home</a></li>
                  <li><a href="about.html">About</a></li>
                  <li><a href="courses.html">Courses</a></li>
                  <li><a href="pricing.html">Pricing</a></li>
                  <li><a href="gallery.html">Gallery</a></li>
                  <li><a href="blog.html">Blog</a>
                    <ul className="submenu">
                      <li><a href="blog.html">Blog</a></li>
                      <li><a href="blog_details.html">Blog Details</a></li>
                      <li><a href="elements.html">Elements</a></li>
                    </ul>
                  </li>
                  <li><a href="contact.html">Contact</a></li>
                </ul>
              </nav>
            </div>
            <div className="header-btns d-none d-lg-block f-right">
              <a href="contact.html" className="btn">Contact me</a>
            </div>
            <div className="col-12">
              <div className="mobile_menu d-block d-lg-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
  <main>
    <div className="slider-area2">
      <div className="slider-height2 d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="hero-cap hero-cap2 pt-70">
                <h2>Contact me</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <section className="contact-section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="contact-title">Get in Touch</h2>
          </div>
          <div className="col-lg-12 row d-flex justify-content-center">
            <div className="signup-form col-lg-6">
              <h2>Sign Up</h2>
              <form id="signupForm" className="form-contact contact_form" action="#" method="post">
                <div className="form-group">
                  <input type="text" className="form-control" name="name" id="name" placeholder="Enter your name" required />
                </div>
                <div className="form-group">
                  <input type="text" className="form-control" name="father_name" id="father_name" placeholder="Enter your father's name" required />
                </div>
                <div className="form-group">
                  <input type="text" className="form-control" name="phone" id="phone" placeholder="Enter your phone number" required />
                </div>
                <div className="form-group">
                  <input type="email" className="form-control" name="email" id="email" placeholder="Enter your email" required />
                </div>
                <div className="form-group">
                  <input type="password" className="form-control" name="password" id="password" placeholder="Enter your password" required />
                </div>
                <div className="form-group">
                  <label htmlFor="user_image">Upload your image:</label>
                  <input type="file" className="form-control" name="user_image" id="user_image" required />
                </div>
                <div className="form-group">
                  <select name="gender" id="gender" className="form-control" required>
                    <option value disabled selected>Select your gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <input type="number" className="form-control" name="age" id="age" placeholder="Enter your age" required />
                </div>
                <div className="form-group">
                  <input type="number" className="form-control" name="height" id="height" placeholder="Enter your height (cm)" required />
                </div>
                <div className="form-group">
                  <input type="number" className="form-control" name="weight" id="weight" placeholder="Enter your weight (kg)" required />
                </div>
                <div className="form-group mt-3">
                  <button type="submit" className="button button-contactForm boxed-btn">Send</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="services-area">
      <div className="container">
        <div className="row justify-content-between">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-8">
            <div className="single-services mb-40">
              <div className="features-icon">
                <img src="assets/img/icon/icon1.svg" alt />
              </div>
              <div className="features-caption">
                <h3>Location</h3>
                <p>You’ll look at graphs and charts in Task One, how to approach </p>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-8">
            <div className="single-services mb-40">
              <div className="features-icon">
                <img src="assets/img/icon/icon2.svg" alt />
              </div>
              <div className="features-caption">
                <h3>Phone</h3>
                <p>(90) 277 278 2566</p>
                <p> (78) 267 256 2578</p>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-8">
            <div className="single-services mb-40">
              <div className="features-icon">
                <img src="assets/img/icon/icon3.svg" alt />
              </div>
              <div className="features-caption">
                <h3>Email</h3>
                <p><a href="https://preview.colorlib.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="f3999290809c9dc4c5c4b3949e929a9fdd909c9e">[email&nbsp;protected]</a></p>
                <p><a href="https://preview.colorlib.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="37545859435654430201774d5654445e58591954585a">[email&nbsp;protected]</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  <footer>
    <div className="footer-area black-bg">
      <div className="container">
        <div className="footer-top footer-padding">
          <div className="row">
            <div className="col-xl-12">
              <div className="single-footer-caption mb-50 text-center">
                <div className="footer-logo wow fadeInUp" data-wow-duration="1s" data-wow-delay=".2s">
                  <a href="index-2.html"><img src="assets/img/logo/logo2_footer.png" alt /></a>
                </div>
                <div className="header-area main-header2 wow fadeInUp" data-wow-duration="2s" data-wow-delay=".4s">
                  <div className="main-header main-header2">
                    <div className="menu-wrapper menu-wrapper2">
                      <div className="main-menu main-menu2 text-center">
                        <nav>
                          <ul>
                            <li><a href="index-2.html">Home</a></li>
                            <li><a href="about.html">About</a></li>
                            <li><a href="courses.html">Courses</a></li>
                            <li><a href="pricing.html">Pricing</a></li>
                            <li><a href="gallery.html">Gallery</a></li>
                            <li><a href="contact.html">Contact</a></li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="footer-social mt-30 wow fadeInUp" data-wow-duration="3s" data-wow-delay=".8s">
                  <a href="#"><i className="fab fa-twitter" /></a>
                  <a href="https://bit.ly/sai4ull"><i className="fab fa-facebook-f" /></a>
                  <a href="#"><i className="fab fa-pinterest-p" /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="row d-flex align-items-center">
            <div className="col-lg-12">
              <div className="footer-copy-right text-center">
                <p>
                  Copyright © All rights reserved | This template is made with <i className="fa fa-heart" aria-hidden="true" /> by <a href="https://colorlib.com/" target="_blank">Colorlib</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
  <div id="back-top">
    <a title="Go to Top" href="#"> <i className="fas fa-level-up-alt" /></a>
  </div>
  {/* Mirrored from preview.colorlib.com/theme/zacson/contact.html by HTTrack Website Copier/3.x [XR&CO'2014], Thu, 22 Aug 2024 20:47:51 GMT */}
</div>
