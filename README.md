# Library Management System

A modern and efficient Library Management System built with Vite, TailwindCSS, and JavaScript. This project allows you to manage books, authors, borrowers, and loans seamlessly.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Book Management**: Add, update, delete, and view books.
- **Author Management**: Add, update, delete, and view authors.
- **Borrower Management**: Add, update, delete, and view borrowers.
- **Loan Management**: Track borrowed books and their due dates.
- **Dashboard**: Visualize data with charts and statistics.
- **Authentication**: Secure login for admin and borrowers.
- **Export Data**: Export data to PDF and Excel formats.

## Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/your-username/library-management-system.git
    cd library-management-system
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Run the development server**:
    ```sh
    npm run dev
    ```

## Usage

- **Admin Login**: Use the default admin credentials to log in.
    - Username: `admin`
    - Password: `admin`

- **Borrower Login**: Use the email and password of a registered borrower to log in.

- **Dashboard**: Access the dashboard to view statistics and manage the library.

## Project Structure

```plaintext
.
├─ api/
├─ src/
│  ├─ data/
│  │  ├─ authors.json
│  │  ├─ books.json
│  │  ├─ borrowers.json
│  │  ├─ categories.json
│  │  └─ loans.json
│  ├─ js/
│  │  ├─ auth.js
│  │  ├─ modules/
│  │  │  ├─ adminDashboard/
│  │  │  └─ borrowerDashboard/
│  │  └─ utils/
│  │     └─ storage.js
│  ├─ styles/
│  │  └─ main.css
│  └─ main.js
├─ package.json
├─ tailwind.config.js
└─ vite.config.js
