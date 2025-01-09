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
.bolt/
    config.json
.gitignore
api/
    save.js
index.html
package.json
postcss.config.js
src/
    data/
        authors.json
        books.json
        borrowers.json
        categories.json
        loans.json
    js/
        app.js
        auth.js
        components/
            Chart.js
            forms/
                BorrowerForm.js
                CategoryForm.js
                BookForm.js
                AuthorForm.js
            Modal.js
            StatCard.js
            Table.js
        modules/
            adminDashboard/
                dashboard.js
                books.js
                authors.js
                categories.js
                borrowers.js
            borrowerDashboard/
                index.js
                availableBooks.js
                borrowedBooks.js
        updateBookCovers.js
        utils/
            api.js
            Data.js
            dateUtils.js
            dialog.js
            export.js
            storage.js
    main.js
styles/
    main.css
tailwind.config.js
vite.config.js
