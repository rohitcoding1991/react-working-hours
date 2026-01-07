# React Working Hours

This project, [react-working-hours](https://github.com/rohitcoding1991/react-working-hours), is a React.js application that showcases complex form validations, specifically designed for scheduling weekly working hours for a barber. The app allows users to input various time-related fields such as Shop Open/Close Times, Working Start/End Times, and Break Start/End Times.

## Project Overview

The main purpose of this project is to demonstrate how to handle complex form validations using popular libraries like [Yup](https://www.npmjs.com/package/yup) and [React Hook Form](https://react-hook-form.com/). You can prepare the schedule on a day-by-day basis and view the generated data in the browser's console. Any errors during the process are effectively handled and displayed using Yup.

## Features

- **Day-by-Day Scheduling:** Input shop open/close times, working start/end times, and break start/end times for each day of the week.
- **Validation with Yup:** Ensures all time fields are correctly filled, with custom error messages for invalid inputs.
- **Real-Time Data Handling:** View the processed schedule data in the browser console.
- **User-Friendly Interface:** Built using [Material UI v5](https://mui.com/) for a smooth and intuitive user experience.

## Technologies Used

- **[React.js](https://react.dev/):** The foundation of the application, providing a component-based architecture.
- **[Material UI v5](https://mui.com/):** Used for building responsive and accessible UI components.
- **[Yup](https://www.npmjs.com/package/yup):** A JavaScript schema builder for value parsing and validation.
- **[React Hook Form](https://react-hook-form.com/):** Simplifies form handling in React by reducing boilerplate code.
- **[Tailwind CSS](https://tailwindcss.com/):** Utility-first CSS framework for styling the application efficiently.
- **[google-libphonenumber](https://www.npmjs.com/package/google-libphonenumber):** Provides a library for parsing, formatting, and validating international phone numbers.
- **[react-international-phone](https://www.npmjs.com/package/react-international-phone):** A React component for inputting and validating international phone numbers, integrated with `google-libphonenumber`.

## Node.js Version

This project requires Node.js version **20.9.0+**.

## Getting Started

Follow these steps to clone and run the project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/rohitcoding1991/react-working-hours.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd react-working-hours
   ```

3. **Install the dependencies:**

   ```bash
   npm install
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. **Open your browser and go to:**

   ```
   http://localhost:3000
   ```

   This will open the application where you can interact with the scheduling interface.

## Conclusion

This project is an excellent example of how to manage complex form validations in a React application, utilizing the power of libraries like Yup, React Hook Form, and Material UI. It provides a practical use case with scheduling weekly working hours for a barber, offering valuable insights into handling and validating user inputs.