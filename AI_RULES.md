# AI Rules for Monynha Portfolio Project

This document outlines the core technologies and specific library usage guidelines for maintaining consistency and efficiency in the Monynha Portfolio project.

## Tech Stack Overview

*   **React & TypeScript:** The application is built using React for the UI, with TypeScript for type safety and improved developer experience.
*   **Vite:** Vite is used as the build tool, providing a fast development server and optimized builds.
*   **Tailwind CSS:** All styling is handled with Tailwind CSS, promoting a utility-first approach and responsive design.
*   **shadcn/ui:** A collection of re-usable components built with Radix UI and Tailwind CSS, used for consistent and accessible UI elements.
*   **React Router:** Client-side routing is managed by React Router, defining navigation paths and component rendering.
*   **Framer Motion:** Declarative animations and transitions are implemented using Framer Motion to enhance user experience.
*   **Supabase:** Backend services, including database interactions and serverless functions (e.g., for contact forms), are powered by Supabase.
*   **React Three Fiber:** For advanced 3D graphics and interactive experiences, `@react-three/fiber` and its ecosystem (`@react-three/drei`, `@react-three/postprocessing`) are utilized.
*   **Lucide React:** A comprehensive icon library providing a wide range of vector icons.
*   **Tanstack Query:** Used for managing server state, data fetching, caching, and synchronization.
*   **Sonner:** A modern toast library for displaying user notifications.
*   **Google Translate Widget:** Integrated for internationalization, with custom helper functions to manage its behavior.

## Library Usage Guidelines

To maintain a consistent and efficient codebase, please adhere to the following guidelines when implementing new features or modifying existing ones:

*   **UI Components:** Always prioritize `shadcn/ui` components for standard UI elements (buttons, inputs, dialogs, etc.). If a specific component is not available or requires significant customization, create a new component in `src/components/` and style it with Tailwind CSS.
*   **Styling:** Use `Tailwind CSS` exclusively for all styling. Avoid inline styles or custom CSS files unless absolutely necessary for very specific, isolated cases (e.g., global resets in `index.css`).
*   **Routing:** Use `react-router-dom` for all navigation within the application. Define routes in `src/App.tsx`.
*   **Animations:** For any UI animations, leverage `framer-motion`. This ensures smooth, performant, and declarative animations.
*   **Icons:** Use icons from `lucide-react`. Import them directly into your components.
*   **3D Graphics:** For any 3D rendering, use `@react-three/fiber` and its related libraries (`@react-three/drei`, `@react-three/postprocessing`).
*   **Data Fetching & Server State:** For fetching and managing data from APIs or Supabase, use `Tanstack Query`. This helps with caching, loading states, and error handling.
*   **Notifications:** Use `sonner` for all user feedback notifications (success messages, error alerts, loading indicators).
*   **Markdown Rendering:** When displaying markdown content, use `react-markdown`.
*   **Backend Interactions:** All interactions with the backend (database, authentication, serverless functions) should go through the `supabase` client as configured in `src/lib/supabaseClient.ts`.
*   **Internationalization:** The Google Translate widget is already integrated. Use the `setLanguage` and `useCurrentLanguage` helpers from `src/lib/googleTranslate.ts` and `src/hooks/useCurrentLanguage.ts` respectively to manage language changes. Do not attempt to re-implement translation logic.