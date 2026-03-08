# Resource-booking-app
This project proposes a web-based campus resource booking system that allows students and staff to view availability and reserve resources easily, reducing conflicts and improving resource management.

##Team members and their assigned task
1.Lordson Fafa Borngreat: admin homepage,resource booking, resource creation,SignUp and SignIn
2.Sackey Abraham: intropage, Booking Approvals
3.Gyawu-Aboagye Obiri: Settings, Logout-confirmation page,Change Password- Change-Password Confirmation
4.Addo Yaw Fosu-Adjei: Admin Notification

##Technologies used
-React
-Javascript
-CSS
-Git

Project Structure
src/
  components/   
        header
        footer
        Resources
        Bookbutton-> reusable UI components
  pages/ 
      Intro Page
      SinIn
      admin Homepage
      resource booking
      Booking approvals
      Settings
      Logout-confirmation page
      Change Password
      Admin Notificationd
      Booked resources-> application screens
  assets/       -> images and icons
  App.jsx       -> main app component

  ##Installation guide
  1.Clone the repository using- git clone https://github.com/SACKEY-AB09/Resource-booking-app.git

  2. Go to the project directory using- cd Resource-booking-app
  3. Install dependencies using: npm install
  4. Start the development server using- npm run dev

##Team workflow
EACH TEAM MEMBER SHOULD WORK ON THEIR OWN BRANCH
After Installation:
Move to your branch using: git checkout YourName
Comfirm your branch name using: git branch
ALWAYS PUSH TO YOUR BRANCH USING: git push origin YourBranchName






# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
