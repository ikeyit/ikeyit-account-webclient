We keep the auth center web frontend lightweight with as less dependencies as possible.  
In production environment, the minified js and css should be deployed to CDN and configure the related properties of the backend to use these files. 
## Used Libraries
- [React](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Pure CSS](https://purecss.io/)
## Build
[vite](https://vitejs.dev/)

Start development server
```sh
npm run dev
```
Build and pack
```sh
npm run build
