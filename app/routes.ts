import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('/login', 'routes/login.tsx'),
    route('/dashboard', 'routes/dashboard.tsx'),
    route('/upload', 'routes/upload.tsx'),
    route('/resume/:id', 'routes/resume.tsx'),
    route('/profile', 'routes/profile.tsx'),
    route('/wipe', 'routes/wipe.tsx'),
] satisfies RouteConfig;
