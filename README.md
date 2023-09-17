# MEDICHAT - Your Interactive Medical Companion

Welcome to MEDICHAT, where we've transformed the healthcare experience into an interactive journey. In a society grappling with increasingly intricate healthcare challenges, MEDICHAT emerges as your guiding light, specializing in skincare and personalized medicine recommendations.

## 💻 Working Model (Prototype link)

[Click to view the prototype](https://medichat.redsoc.in)

## 🌟 Why MEDICHAT Matters

Picture the healthcare landscape today: the demand for skincare expertise and tailored medicine recommendations is skyrocketing. Efficient healthcare solutions are paramount, yet abrupt changes in skincare requirements and medical expectations have left gaps in the system. Traditional healthcare systems struggle during peak skincare and medication needs, leaving individuals seeking specialized advice from distant sources.

This is where MEDICHAT steps in with a vision that meets the world's need for efficient skincare and medicine recommendations. We're more than just a web application; we're a fully integrated healthcare ecosystem specializing in skincare and medication. Our platform anticipates and adapts to the ever-changing skincare and medical climate.

In today's fast-paced world, healthcare accessibility is crucial. MEDICHAT aims to bridge the gap between you and medical services, offering a multifaceted solution for your healthcare needs.

## 🚀 MEDICHAT Features

### Skin Disease Recognition Module

Experience the power of artificial intelligence and machine learning as our module analyzes images of your skin. It delves deep into pixels to detect even subtle indicators of potential medical conditions. Its keen digital eye doesn't just offer insights; it unveils the probability of underlying dermatological issues with precision and expertise.

### 🩺 Skin disease prediction model: 
----- [Click to view model implementation](https://github.com/midhunvnadh/sc_chat/blob/master/backend/train.ipynb) -----

### Doctor Appointment System

Say goodbye to the complexities of booking medical appointments. We've streamlined the process to make it effortless for both patients and healthcare providers. Booking appointments has never been this hassle-free.

### Medicine Recommendation System

Experience personalized healthcare with tailored medicine recommendations meticulously crafted to align with your unique medical profile and needs. Your health is our priority.

### Medical Report Generation

Easily generate medical reports that can be shared with your doctors. This ensures effortless communication between patients and healthcare professionals, fostering a more informed and collaborative approach to your well-being.

### Mental Health Support System

Your mental well-being is paramount. MEDICHAT opens the door to a wealth of resources and unwavering support designed to nurture your emotional health and personal growth. Your journey to a healthier mind starts here.

## 💡 Usage

Hop onto a linux environment with docker.

```bash
cd <project folder>
```

Run this command to start the app:

```bash
docker-compose up -d --remove-orphans
```

Wait for build to finish, then visit this link to view the app:

```bash
http://localhost:3000
```

To stop the app:

```bash
docker-compose down --rmi all
```

## 🛠️ Technologies Used

MEDICHAT leverages cutting-edge technologies to provide you with the best healthcare experience:

- **Flask** for web application development.
- **Python** for data processing and machine learning.
- **Tensorflow** for advanced machine learning models.
- **Docker** for a virtualized environment.
- **Node JS** for seamless interactions.
- **React JS** for a responsive user interface.
- **Next JS** for optimal performance.
- **NGINX** (Web server) connecting Flask and Next JS for API calls
- Database used: **Postgres**

Your health, your well-being, and your peace of mind are at the heart of everything we do. Let's embark on this interactive healthcare journey together!
