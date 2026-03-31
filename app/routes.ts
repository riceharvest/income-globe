import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("country/:code", "routes/country.tsx"),
  route("compare", "routes/compare.tsx"),
  route("calculator", "routes/calculator.tsx"),
] satisfies RouteConfig;
